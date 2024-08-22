defmodule Pomoroom.ChatRoom.Chat do
  use Ecto.Schema
  import Ecto.Changeset
  @max_num 1000

  def get_public_id_chat() do
    :rand.uniform(@max_num)
    |> Integer.to_string()
  end

  def get_members(collection, chat_id) do
    query = %{"chat_id" => chat_id}

    case Mongo.find_one(:mongo, collection, query) do
      nil ->
        {:error, "Chat no encontrado"}

      %{"members" => members} ->
        {:ok, members}
    end
  end

  def delete_chat(collection, chat_id) do
    Mongo.delete_one(:mongo, collection, %{chat_id: chat_id})
  end

  def is_group?(chat_id) do
    query = %{"chat_id" => chat_id}

    case Mongo.find_one(:mongo, "group_chats", query) do
      nil ->
        false

      _chat ->
        true
    end
  end

  def exists?(chat_id) do
    query = %{"chat_id" => chat_id}

    case Mongo.find_one(:mongo, "private_chats", query) do
      nil ->
        case Mongo.find_one(:mongo, "group_chats", query) do
          nil ->
            false

          _chat ->
            true
        end

      _chat ->
        true
    end
  end

  def timestamps(changeset) do
    change(changeset, %{inserted_at: NaiveDateTime.utc_now(), updated_at: NaiveDateTime.utc_now()})
  end
end
