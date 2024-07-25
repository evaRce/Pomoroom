defmodule Pomoroom.ChatRoom.Chat do
  use Ecto.Schema
  import Ecto.Changeset
  @max_num 1000

  schema "chats" do
    field :public_id_chat, :string
    field :users, {:array, :string}
  end

  def chat_changeset(args) do
    %Pomoroom.ChatRoom.Chat{}
    |> cast(args, [:public_id_chat, :users])
    |> validate_required([:users])
  end

  def set_public_id_chat(changeset) do
    random_public_id =
      :rand.uniform(@max_num)
      |> Integer.to_string()

    changeset
    |> change(%{public_id_chat: random_public_id})
  end

  def create_chat(args) do
    chat_changst =
      args
      |> chat_changeset()
      |> set_public_id_chat()

    case chat_changst.valid? do
      true ->
        new_chat = Mongo.insert_one(:mongo, "chats", chat_changst.changes)
        case new_chat do
          {:ok, %{inserted_id: inserted_id}} ->
            case Mongo.find_one(:mongo, "chats", %{_id: inserted_id}) do
              nil ->
                {:error, %{error: "Chat no encontrado después de la inserción"}}

              chat ->
                {:ok, Map.get(chat, "public_id_chat")}
            end

          {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => _errmsg}]}} ->
            {:error, %{error: "El chat ya está añadido"}}
        end

      false ->
        {:error, %{error: "No es válido"}}
    end
  end

  def find_or_create_chat(contact_name, belongs_to_user) do
    query = %{
      users: %{"$all" => [contact_name, belongs_to_user]},
      public_id_chat: %{"$exists" => true, "$ne" => nil}
    }

    case Mongo.find_one(:mongo, "chats", query) do
      nil ->
        create_chat(%{users: [contact_name, belongs_to_user]})

      chat ->
        {:ok, Map.get(chat, "public_id_chat")}
    end
  end

  def delete_chat(contact_name, belongs_to_user) do
    query = %{
      users: [contact_name, belongs_to_user]
    }

    case Mongo.find_one(:mongo, "chats", query) do
      nil ->
        {:error, "Chat no encontrado"}

      chat ->
        Mongo.delete_one(:mongo, "chats", %{"_id" => chat["_id"]})
    end
  end

  def get_list_user(public_id_chat) do
    query = %{
      public_id_chat: public_id_chat
    }

    case Mongo.find_one(:mongo, "chats", query) do
      nil ->
        {:error, "Chat no encontrado"}

      %{"users" => users} ->
        {:ok, users}
    end
  end
end
