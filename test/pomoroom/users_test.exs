defmodule Pomoroom.UsersTest do
  use ExUnit.Case
  doctest Pomoroom.User
  alias Pomoroom.User

  setup [:cleanup_db]

  defp cleanup_db(_context) do
    User.delete_all_users()
    :ok
  end

  test "registers a user" do
    {:ok, user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "nickname_1", password: "password_1"})

    %{
      email: email,
      nickname: nickname,
      password: password,
      image_profile: image_profile,
      inserted_at: inserted_at,
      updated_at: updated_at
    } = user1

    assert email == user1.email
    assert nickname == user1.nickname
    assert image_profile != nil
    assert String.match?(image_profile, ~r/^\/images\/default_user\/default_user-.*\.svg$/)
  end

  test "fails if two users register with same email" do
    {:ok, _user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "nickname_1", password: "password_1"})
    {:error, error_user2} =
      User.register_user(%{email: "email_1@h.es", nickname: "nickname_2", password: "password_2"})

    assert error_user2 == %{email: "Este email ya está siendo usado"}
  end

  test "fails if two users register with same nickname" do
    {:ok, _user1} =
      User.register_user(%{email: "email_1@h.es", nickname: "nickname_1", password: "password_1"})
    {:error, error_user2} =
      User.register_user(%{email: "email_2@h.es", nickname: "nickname_1", password: "password_2"})

    assert error_user2 == %{nickname: "Este nickname ya está asociado a otra cuenta"}
  end

  test "can retrieve user by exact match on any field" do
    {:ok, user1} = User.register_user(%{email: "email_1@h.es", nickname: "nickname_1", password: "password_1"})
    {:ok, user1_by_email} = User.get_by("email", "email_1@h.es")
    {:ok, user1_by_nickname} = User.get_by("nickname", "nickname_1")

    assert user1.email == user1_by_email.email
    assert user1.email == user1_by_nickname.email
    assert user1.nickname == user1_by_email.nickname
    assert user1.nickname == user1_by_nickname.nickname
  end

  test "checks if a user exists by nickname" do
    {:ok, user1} = User.register_user(%{email: "email_1@h.es", nickname: "nickname_1", password: "password_1"})
    assert User.exists?(user1.nickname)
  end
end
