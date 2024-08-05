defmodule Pomoroom.ChatRoom.Message do
  use Ecto.Schema
  import Ecto.Changeset
  @max_num 1000

  schema "messages" do
    field :public_id_msg, :string
    field :text, :string
    field :belongs_to_user, :string
    field :belongs_to_chat, :string
    field :inserted_at, :utc_datetime
    field :updated_at, :utc_datetime
  end

  def message_changeset(args) do
    %Pomoroom.ChatRoom.Message{}
    |> cast(args, [
      :public_id_msg,
      :text,
      :belongs_to_user,
      :belongs_to_chat,
      :inserted_at,
      :updated_at
    ])
    |> validate_required([:text, :belongs_to_user, :belongs_to_chat])
    |> validate_length(:text, min: 1)
  end

  def message_changeset(message, belongs_to_user) do
    message = %{text: message, belongs_to_user: belongs_to_user}

    %Pomoroom.ChatRoom.Message{}
    |> cast(message, [:public_id_msg, :text, :belongs_to_user, :inserted_at, :updated_at])
    |> validate_required([:text, :belongs_to_user])
    |> validate_length(:text, min: 1)
  end

  def set_public_id_msg(changeset) do
    random_public_id =
      :rand.uniform(@max_num)
      |> Integer.to_string()

    changeset
    |> change(%{public_id_msg: random_public_id})
  end

  def new_message(message, belongs_to_user, belongs_to_chat) do
    msg_changeset =
      message
      |> message_changeset(belongs_to_user)
      |> set_public_id_msg()
      |> change(%{belongs_to_chat: belongs_to_chat})
      |> timestamps()

    if msg_changeset.valid? do
      insert_message = Mongo.insert_one(:mongo, "messages", msg_changeset.changes)

      case insert_message do
        {:ok, _result} ->
          {:ok, msg_changeset.changes}

        {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => errmsg}]}} ->
          {:error, parse_duplicate_key_error(errmsg)}
      end

    else
      {:error, msg_changeset.errors}
    end
  end

  def delete_message(public_id) do
    msg_query = %{
      "public_id_msg" => public_id
    }

    Mongo.delete_one(:mongo, "messages", msg_query)
  end

  defp parse_duplicate_key_error(errmsg) do
    cond do
      String.contains?(errmsg, "public_id_msg") ->
        %{public_id_msg: "Este public id ya está siendo usado"}
    end
  end

  def get_by_public_id(""), do: {:error, :not_found}

  def get_by_public_id(public_id) do
    msg_query = %{
      "public_id_msg" => public_id
    }

    find_user = Mongo.find_one(:mongo, "messages", msg_query)

    case find_user do
      nil ->
        {:error, :not_found}

      user_data when is_map(user_data) ->
        {:ok, get_changes_from_changeset(user_data)}

      error ->
        {:error, error}
    end
  end

  defp get_changes_from_changeset(args) do
    message_changeset(args).changes
  end

  defp timestamps(changeset) do
    change(changeset, %{inserted_at: NaiveDateTime.utc_now(), updated_at: NaiveDateTime.utc_now()})
  end
end
