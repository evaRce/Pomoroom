defmodule Pomoroom.Startup do
  def create_indexes do
    IO.puts("Using database #{Application.get_env(:pomoroom, :db)[:database]}")

    user_indexes = [
      %{key: %{email: 1}, name: "email_index", unique: true},
      %{key: %{nickname: 1}, name: "nickname_index", unique: true}
    ]

    message_indexes = [
      %{key: %{public_id_msg: 1}, name: "public_id_msg_index", unique: true}
    ]

    contacts_indexes = [
      %{key: %{name: 1, belongs_to_user: 1}, name: "contact_index", unique: true}
    ]

    chats_indexes = [
      %{key: %{public_id_chat: 1}, name: "chat_index", unique: true}
    ]

    friend_requests_indexes = [
      %{key: %{from_user: 1}, name: "from_user_index", unique: true},
      %{key: %{send_to_contact: 1}, name: "send_to_contact_index", unique: true}
    ]

    Mongo.create_indexes(:mongo, "users", user_indexes)
    Mongo.create_indexes(:mongo, "messages", message_indexes)
    Mongo.create_indexes(:mongo, "contacts", contacts_indexes)
    Mongo.create_indexes(:mongo, "chats", chats_indexes)
    Mongo.create_indexes(:mongo, "friend_requests", friend_requests_indexes)
  end
end
