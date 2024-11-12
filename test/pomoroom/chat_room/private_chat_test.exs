defmodule Pomoroom.ChatRoom.PrivateChatTest do
  use ExUnit.Case
  doctest Pomoroom.ChatRoom.PrivateChat
  alias Pomoroom.ChatRoom.PrivateChat
  alias Pomoroom.User

  setup [:cleanup_db]

  defp cleanup_db(_context) do
    User.delete_all_users()
    PrivateChat.delete_all_private_chats()
    :ok
  end

  test "create a private chat and a verifies fields" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, private_chat1} = PrivateChat.create_private_chat(user2.nickname, user1.nickname)

    assert private_chat1.members == ["to_user2", "from_user1"]
    assert private_chat1.sorted_members == ["from_user1", "to_user2"]
    assert private_chat1.deleted_by == []
  end

  test "prevents duplicate private chat creation between the same users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _private_chat1} = PrivateChat.create_private_chat(user2.nickname, user1.nickname)

    {:error, private_chat_message} =
      PrivateChat.create_private_chat(user2.nickname, user1.nickname)

    assert private_chat_message == %{error: "El contacto ya está añadido"}
  end

  test "deletes contact in a private chat and handles error for non-existent chat" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, private_chat1} = PrivateChat.create_private_chat(user2.nickname, user1.nickname)

    {:ok, private_chat_success_message} =
      PrivateChat.delete_contact(private_chat1.chat_id, user1.nickname)

    {:error, private_chat_error_message} = PrivateChat.delete_contact("chat_id", user1.nickname)

    assert private_chat_success_message == "Contacto eliminado"
    assert private_chat_error_message == "Chat no encontrado"
  end

  test "returns error when private chat is not found by chat ID or users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:error, private_chat_message1} = PrivateChat.get("chat_id")
    {:error, private_chat_message2} = PrivateChat.get(user2.nickname, user1.nickname)

    assert private_chat_message1 == "Chat no encontrado"
    assert private_chat_message2 == "Chat no encontrado"
  end
end
