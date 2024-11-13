defmodule Pomoroom.ChatRoom.GroupChatTest do
  use ExUnit.Case
  doctest Pomoroom.ChatRoom.GroupChat
  alias Pomoroom.ChatRoom.GroupChat
  alias Pomoroom.User

  setup [:cleanup_db]

  defp cleanup_db(_context) do
    User.delete_all_users()
    GroupChat.delete_all_group_chats()
    :ok
  end

  test "create a group chat and a verifies fields" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")
    {:error, group_chat1_message} = GroupChat.create_group_chat(user1.nickname, "grupo1")

    assert group_chat1.name == "grupo1"
    assert String.match?(group_chat1.image, ~r/^\/images\/default_group\/default_group-.*\.svg$/)
    assert group_chat1.admin == ["from_user1"]
    assert group_chat1.members == ["from_user1"]
    assert group_chat1_message == %{error: "El grupo `grupo1` ya está creado"}
  end

  test "prevents duplicate private chat creation between the same users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})
    {:ok, _user3} =
      User.register_user(%{email: "email_3@h.es", nickname: "to_user3", password: "password_3"})

    {:ok, _group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")

    {:ok, group_chat1_message1} = GroupChat.add_member("grupo1", user1.nickname, "to_user2")
    {:error, group_chat1_message2} = GroupChat.add_member("grupo1", user1.nickname, "to_user2")
    {:error, group_chat1_message3} = GroupChat.add_member("grupo1", user2.nickname, "to_user3")

    assert group_chat1_message1 == "Usuario to_user2 añadido al grupo"
    assert group_chat1_message2 == "El usuario to_user2 ya es miembro del grupo"
    assert group_chat1_message3 == "El usuario to_user2 no tiene permiso para añadir miembros al grupo"
  end

  test "deletes a chat group" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})
    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")
    {:ok, _group_chat1_message1} = GroupChat.add_member("grupo1", user1.nickname, "to_user2")
    {:ok, group_chat1_message3} = GroupChat.delete("grupo1", user2.nickname)
    {:ok, group_chat1_message4} = GroupChat.delete("grupo1", user1.nickname)

    assert group_chat1_message3 == "Contacto eliminado del grupo grupo1"
    assert group_chat1_message4 == "Grupo eliminado, ya que el último usuario fue eliminado"
  end

  test "deletes a member of a chat group" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})
    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})
    {:ok, user3} =
      User.register_user(%{email: "email_3@h.es", nickname: "to_user3", password: "password_3"})

    {:ok, _group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")
    {:ok, _group_chat1_message1} = GroupChat.add_member("grupo1", user1.nickname, user2.nickname)
    {:ok, group_chat1_message3} = GroupChat.delete_member("grupo1", user1.nickname, user2.nickname)
    {:ok, group_chat1_message4} = GroupChat.delete_member("grupo1", user1.nickname, user1.nickname)

    {:ok, _group_chat2} = GroupChat.create_group_chat(user3.nickname, "grupo2")
    {:ok, _group_chat2_message5} = GroupChat.add_member("grupo2", user3.nickname, user1.nickname)
    {:error, group_chat2_message6} = GroupChat.delete_member("grupo2", user1.nickname, user3.nickname)

    assert group_chat1_message3 == "Usuario to_user2 eliminado del grupo"
    assert group_chat1_message4 == "Grupo eliminado, ya que el último usuario fue eliminado"
    assert group_chat2_message6 == "El usuario from_user1 no tiene permiso para eliminar miembros del grupo"
  end

  test "gets chat group by chat id field" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, _group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")
    {:error, group_chat1_message} = GroupChat.get_by("chat_id", "chat_id_value")

    assert group_chat1_message == "Chat no encontrado"
  end

  test "gets members of a chat group" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})
    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})
    {:ok, user3} =
      User.register_user(%{email: "email_3@h.es", nickname: "to_user3", password: "password_3"})

    {:ok, _group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")
    {:ok, _group_chat1_message1} = GroupChat.add_member("grupo1", user1.nickname, user2.nickname)
    {:ok, _group_chat1_message2} = GroupChat.add_member("grupo1", user1.nickname, user3.nickname)
    {:ok, [member1, member2, member3]} = GroupChat.get_members("grupo1")

    assert member1.nickname == user1.nickname
    assert member2.nickname == user2.nickname
    assert member3.nickname == user3.nickname
  end

  test "checks if a user is admin of a chat group" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})
    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})
    {:ok, user3} =
      User.register_user(%{email: "email_3@h.es", nickname: "to_user3", password: "password_3"})

    {:ok, _group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")

    assert GroupChat.is_admin?("grupo1", user1.nickname)
    refute GroupChat.is_admin?("grupo1", user2.nickname)
    refute GroupChat.is_admin?("grupo1", user3.nickname)
  end

  test "checks admin" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})
    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})
    {:ok, user3} =
      User.register_user(%{email: "email_3@h.es", nickname: "to_user3", password: "password_3"})
    {:ok, user4} =
      User.register_user(%{email: "email_4@h.es", nickname: "to_user4", password: "password_4"})

    {:ok, _group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")
    {:ok, _group_chat1_message1} = GroupChat.add_member("grupo1", user1.nickname, user2.nickname)

    {:ok, group_chat1_message1} = GroupChat.add_admin("grupo1", user1.nickname, user2.nickname)
    {:error, group_chat1_message2} = GroupChat.add_admin("grupo1", user1.nickname, user3.nickname)
    assert group_chat1_message1 == "Usuario to_user2 añadido como admin al grupo"
    assert group_chat1_message2 == "El usuario to_user3 no es miembro del grupo"

    {:ok, _group_chat1_message3} = GroupChat.add_member("grupo1", user1.nickname, user3.nickname)
    {:error, group_chat1_message4} = GroupChat.add_admin("grupo1", user3.nickname, user4.nickname)
    assert group_chat1_message4 == "El usuario to_user3 no tiene permiso para añadir admins al grupo"
  end

  test "checks delete admin" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})
    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})
    {:ok, user3} =
      User.register_user(%{email: "email_3@h.es", nickname: "to_user3", password: "password_3"})

    {:ok, _group_chat1} = GroupChat.create_group_chat(user1.nickname, "grupo1")

    {:ok, _group_chat1} = GroupChat.add_member("grupo1", user1.nickname, user2.nickname)
    {:ok, _group_chat1_message} = GroupChat.add_admin("grupo1", user1.nickname, user2.nickname)

    {:ok, group_chat1_message1} = GroupChat.delete_admin("grupo1", user2.nickname, user1.nickname)
    assert group_chat1_message1 == "Usuario from_user1 eliminado como admin del grupo"

    {:error, group_chat1_message2} = GroupChat.delete_admin("grupo1", user1.nickname, user2.nickname)
    assert group_chat1_message2 == "El usuario from_user1 no tiene permiso para eliminar admins del grupo"

    {:error, group_chat1_message3} = GroupChat.delete_admin("grupo1", user2.nickname, user3.nickname)
    assert group_chat1_message3 == "El usuario to_user3 no es miembro del grupo"

    {:ok, group_chat1_message4} = GroupChat.delete_admin("grupo1", user2.nickname, user2.nickname)
    assert group_chat1_message4 == "Usuario to_user2 eliminado como admin del grupo y from_user1 asignado como nuevo admin."
  end


end
