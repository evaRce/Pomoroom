defmodule Pomoroom.Message do
	use Ecto.Schema
  alias Phoenix.PubSub
	import Ecto.Changeset
  @max_num 1000

  schema "messages" do
    field :public_id_msg, :string
    field :text, :string
    field :user, :string
    timestamps(type: :utc_datetime)
    # has_one :users, Pomoroom.User
    # has_one :chat_rooms, Pomoroom.ChatRoom
  end

  def changeset(args) do
    %Pomoroom.Message{}
    |> cast(args, [:public_id_msg, :text, :user])
    |> validate_required([:text, :user])
    |> validate_length(:text, min: 1)
  end

  def set_public_id_msg(changeset) do
    random_public_id =
      :rand.uniform(@max_num)
      |> Integer.to_string()
    changeset
      |> change(%{public_id_msg: random_public_id})
  end

  def new_message(changeset) do
    msg_changeset =
      changeset
      |> set_public_id_msg()
    insert_message = Mongo.insert_one(:mongo, "messages", msg_changeset.changes)

    case insert_message do
      {:ok, result} ->
        # notify(result.changes, :message_created)
				{:ok, result}
      {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => errmsg}]}} ->
        {:error, parse_duplicate_key_error(errmsg)}
    end
  end

  defp parse_duplicate_key_error(errmsg) do
    cond do
      String.contains?(errmsg, "public_id_msg") ->
				%{public_id_msg: "Este public id ya está siendo usado"}
    end
  end

  def get_by_public_id(""), do: {:error, :not_found}
  def get_by_public_id(public_id) do
		find_user = Mongo.find_one(:mongo, "messages", get_changes_from_changeset(public_id_msg: public_id))
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
		args =
			args
			|> Map.new()
			|> changeset()
		args.changes
	end

  def subscribe() do
    PubSub.subscribe(Pomoroom.PubSub, "liveview_chat")
  end

  def notify(message, event) do
    PubSub.broadcast(Pomoroom.PubSub, "liveview_chat", {event, message})
  end
end
