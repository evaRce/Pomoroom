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

    Mongo.create_indexes(:mongo, "users", user_indexes)
    Mongo.create_indexes(:mongo, "messages", message_indexes)
    Mongo.create_indexes(:mongo, "contacts", contacts_indexes)
  end
end
