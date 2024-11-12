defmodule Pomoroom.ChatRoom.FriendRequestTest do
  use ExUnit.Case
  doctest Pomoroom.ChatRoom.FriendRequest
  alias Pomoroom.ChatRoom.FriendRequest
  alias Pomoroom.User

  setup [:cleanup_db]

  defp cleanup_db(_context) do
    User.delete_all_users()
    FriendRequest.delete_all_request()
    :ok
  end

  test "sends friend request to another user and is succesful" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)

    assert friend_request1.status == "pending"
    assert friend_request1.from_user == "from_user1"
    assert friend_request1.to_user == "to_user2"
  end

  test "fails if the receiver and sender are the same user in the friend request" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:error, friend_request1} = FriendRequest.send_friend_request(user1.nickname, user1.nickname)

    assert friend_request1 == %{error: "No puedes añadirte a ti mismo como un contacto"}
  end

  test "fails if in a friend request don't exists the user who receives the request" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:error, friend_request1} = FriendRequest.send_friend_request("to_user2", user1.nickname)

    assert friend_request1 == %{error: "El usuario to_user2 no existe"}
  end

  test "fails if a friend request have the same users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)
    {:error, friend_request2} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)

    assert friend_request2 == %{
             error: "Ya hay una petición de amistad entre to_user2 y from_user1"
           }
  end

  test "sends and accepts a friend request between two registered users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)
    {:ok, message_request} = FriendRequest.accept_friend_request(user2.nickname, user1.nickname)
    assert message_request == "Petición de amistad aceptada"
  end

  test "retrieves pending friend request data between two users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)
    {:ok, friend_request_data} = FriendRequest.get(user2.nickname, user1.nickname)

    assert friend_request_data.status == "pending"
    assert friend_request_data.from_user == "from_user1"
    assert friend_request_data.to_user == "to_user2"
  end

  test "returns not found when friend request does not exist" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:error, friend_request_data} = FriendRequest.get(user2.nickname, user1.nickname)

    assert friend_request_data == :not_found
  end

  test "checks ownership of friend request between two users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)
    assert FriendRequest.is_owner_request?(user2.nickname, user1.nickname)
    refute FriendRequest.is_owner_request?(user1.nickname, user2.nickname)
  end

  test "rejects friend request and returns error if request is already rejected" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)
    {:ok, message_request1} = FriendRequest.reject_friend_request(user2.nickname, user1.nickname)

    {:error, message_request2} =
      FriendRequest.reject_friend_request(user2.nickname, user1.nickname)

    assert message_request1 == "Petición de amistad rechazada"
    assert message_request2 == %{error: "Petición de amistad ya rechazada"}
  end

  test "deletes friend request and confirms it no longer exists" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)

    assert FriendRequest.delete_request(user2.nickname, user1.nickname) == :ok

    {:error, friend_request_data} = FriendRequest.get(user2.nickname, user1.nickname)

    assert friend_request_data == :not_found
  end

  test "checks if friend request is pending or not" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)

    assert FriendRequest.request_is_pending?(user2.nickname, user1.nickname)

    {:ok, _message_request1} = FriendRequest.reject_friend_request(user2.nickname, user1.nickname)

    refute FriendRequest.request_is_pending?(user2.nickname, user1.nickname)
  end

  test "checks friend request status and handles non-existent request" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)

    assert FriendRequest.get_status(user2.nickname, user1.nickname) == "pending"
    assert FriendRequest.get_status(user1.nickname, user2.nickname) == "pending"
    assert FriendRequest.get_status("to_user3", user2.nickname) == :not_found
  end

  test "checks if friend request exists between users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)

    assert FriendRequest.exists?(user2.nickname, user1.nickname)
    refute FriendRequest.exists?("to_user3", user2.nickname)
  end

  test "determines the correct order of friend request users" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "from_user1", password: "password_1"})

    {:ok, user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "to_user2", password: "password_2"})

    {:ok, _friend_request1} = FriendRequest.send_friend_request(user2.nickname, user1.nickname)

    assert FriendRequest.determine_friend_request_users(user2.nickname, user1.nickname) ==
             {"to_user2", "from_user1"}

    assert FriendRequest.determine_friend_request_users(user1.nickname, user2.nickname) ==
             {"to_user2", "from_user1"}
  end
end
