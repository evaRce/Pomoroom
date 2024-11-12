defmodule Pomoroom.ChatRoom.MessageTest do
  use ExUnit.Case
  doctest Pomoroom.ChatRoom.Message
  alias Pomoroom.ChatRoom.{Message, PrivateChat}
  alias Pomoroom.User

  setup [:cleanup_db]

  defp cleanup_db(_context) do
    User.delete_all_users()
    PrivateChat.delete_all_private_chats()
    Message.delete_all_messages()
    :ok
  end

  test "creates a message" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, private_chat1} = PrivateChat.create_private_chat(user2.nickname, user1.nickname)
    {:ok, message1} = Message.new_message("message1", user1.nickname, private_chat1.chat_id)
    {:ok, message2} = Message.new_message("message2", user1.nickname, private_chat1.chat_id)

    assert message1.text == "message1"
    refute message1.text == message2.text
    assert message1.from_user == user1.nickname
    refute message1.from_user == user2.nickname
    assert message1.chat_id == private_chat1.chat_id
  end

  test "deletes a specific message and all messages from a chat" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, private_chat1} = PrivateChat.create_private_chat(user2.nickname, user1.nickname)
    {:ok, message1} = Message.new_message("message1", user1.nickname, private_chat1.chat_id)
    {:ok, _message2} = Message.new_message("message2", user1.nickname, private_chat1.chat_id)

    assert Message.delete_message(message1.msg_id) == :ok
    assert Message.delete_all_belongs_to_chat(private_chat1.chat_id) == :ok
  end

  test "returns error when attempting to retrieve a non-existent message" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, private_chat1} = PrivateChat.create_private_chat(user2.nickname, user1.nickname)
    {:ok, message1} = Message.new_message("message1", user1.nickname, private_chat1.chat_id)
    :ok = Message.delete_message(message1.msg_id)
    {:error, message_error1} = Message.get_by_id("")
    {:error, message_error2} = Message.get_by_id(message1.msg_id)

    assert message_error1 == :not_found
    assert message_error2 == :not_found
  end

  test "retrieves all messages from a specific chat" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, private_chat1} = PrivateChat.create_private_chat(user2.nickname, user1.nickname)
    {:ok, message1} = Message.new_message("message1", user1.nickname, private_chat1.chat_id)
    {:ok, message2} = Message.new_message("message2", user1.nickname, private_chat1.chat_id)
    {:ok, [msg1, msg2]} = Message.get_chat_messages(private_chat1.chat_id)

    assert msg1.msg_id == message1.msg_id
    assert msg2.msg_id == message2.msg_id
  end
end
