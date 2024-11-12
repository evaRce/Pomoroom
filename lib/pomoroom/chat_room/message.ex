defmodule Pomoroom.ChatRoom.Message do
  use Ecto.Schema
  import Ecto.Changeset
  @max_num 1000

  schema "messages" do
    field :msg_id, :string
    field :text, :string
    field :from_user, :string
    field :chat_id, :string
    field :inserted_at, :utc_datetime
    field :updated_at, :utc_datetime
  end

  def changeset(args) do
    %Pomoroom.ChatRoom.Message{}
    |> cast(args, [
      :msg_id,
      :text,
      :from_user,
      :chat_id,
      :inserted_at,
      :updated_at
    ])
  end

  def message_changeset(args) do
    changeset(args)
    |> validate_required([
      :msg_id,
      :text,
      :from_user,
      :chat_id,
      :inserted_at,
      :updated_at
    ])
  end

  def message_changeset(msg_id, message, from_user, chat_id) do
    msg = %{msg_id: msg_id, text: message, from_user: from_user, chat_id: chat_id}

    changeset(msg)
    |> validate_required([:msg_id, :text, :from_user, :chat_id])
  end

  def get_msg_id() do
    :rand.uniform(@max_num)
    |> Integer.to_string()
  end

  def new_message(message, from_user, chat_id) do
    msg_changeset =
      get_msg_id()
      |> message_changeset(message, from_user, chat_id)
      |> timestamps()

    if msg_changeset.valid? do
      case Mongo.insert_one(:mongo, "messages", msg_changeset.changes) do
        {:ok, _result} ->
          {:ok, msg_changeset.changes}

        {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => errmsg}]}} ->
          {:error, parse_duplicate_key_error(errmsg)}
      end
    else
      {:error, msg_changeset.errors}
    end
  end

  def delete_message(msg_id) do
    msg_query = %{"msg_id" => msg_id}

    Mongo.delete_one(:mongo, "messages", msg_query)
    :ok
  end

  def delete_all_belongs_to_chat(chat_id) do
    msg_query = %{"chat_id" => chat_id}

    Mongo.delete_many(:mongo, "messages", msg_query)
    :ok
  end

  def delete_all_messages() do
    Mongo.delete_many(:mongo, "messages", %{})
  end

  def get_by_id(""), do: {:error, :not_found}

  def get_by_id(msg_id) do
    msg_query = %{"msg_id" => msg_id}

    find_user = Mongo.find_one(:mongo, "messages", msg_query)

    case find_user do
      nil ->
        {:error, :not_found}

      user_data when is_map(user_data) ->
        {:ok, get_changes_from_changeset(user_data)}
    end
  end

  def get_chat_messages(chat_id, limit \\ :all) do
    msg_query = %{"chat_id" => chat_id}

    sort_order = %{"inserted_at" => -1}

    find_messages =
      case limit do
        :all ->
          Mongo.find(:mongo, "messages", msg_query, sort: sort_order)

        limit when is_integer(limit) ->
          Mongo.find(:mongo, "messages", msg_query, sort: sort_order, limit: limit)
      end

    case find_messages do
      cursor ->
        messages =
          Enum.map(cursor, fn message ->
            Map.delete(message, "_id")
            |> get_changes_from_changeset()
          end)

        {:ok, Enum.reverse(messages)}
    end
  end

  defp parse_duplicate_key_error(errmsg) do
    cond do
      String.contains?(errmsg, "msg_id") ->
        %{msg_id: "Este public id ya está siendo usado"}
    end
  end

  defp get_changes_from_changeset(args) do
    message_changeset(args).changes
  end

  defp timestamps(changeset) do
    change(changeset, %{inserted_at: NaiveDateTime.utc_now(), updated_at: NaiveDateTime.utc_now()})
  end
end
