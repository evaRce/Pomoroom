defmodule Pomoroom.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Pomoroom.ChatRoom.Chat

  schema "users" do
    field :email, :string
    field :password, :string
    field :nickname, :string
    field :image_profile, :string
    field :inserted_at, :utc_datetime
    field :updated_at, :utc_datetime
  end

  def changeset_without_passw(args) do
    %Pomoroom.User{}
    |> cast(args, [:email, :nickname, :image_profile, :inserted_at, :updated_at])
    |> validate_required([:email, :nickname, :image_profile, :inserted_at, :updated_at])
  end

  def changeset(args) do
    %Pomoroom.User{}
    |> cast(args, [:email, :password, :nickname])
    |> validate_required([:email, :password, :nickname])
  end

  def set_hash_password(changeset) do
    hashed_password =
      changeset
      |> fetch_field(:password)
      |> elem(1)
      |> Bcrypt.hash_pwd_salt()

    changeset
    |> change(%{password: hashed_password})
  end

  def register_user(args) do
    user_changeset =
      args
      |> changeset()
      |> set_hash_password()
      |> timestamps()
      |> set_default_image()

    case user_changeset.valid? do
      true ->
        insert_user = Mongo.insert_one(:mongo, "users", user_changeset.changes)

        case insert_user do
          {:ok, result} ->
            {:ok, result}

          {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => errmsg}]}} ->
            {:error, parse_duplicate_key_error(errmsg)}
        end

      false ->
        {:error, %{error: "Falta un campo"}}
    end
  end

  defp parse_duplicate_key_error(errmsg) do
    cond do
      String.contains?(errmsg, "email") ->
        %{email: "Este email ya está siendo usado"}

      String.contains?(errmsg, "nickname") ->
        %{nickname: "Este nickname ya está asociado a otra cuenta"}
    end
  end

  def get_with_passw(field, value) do
    query = %{field => value}

    case Mongo.find_one(:mongo, "users", query) do
      nil ->
        {:error, :not_found}

      user_data when is_map(user_data) ->
        {:ok, get_changes_from_changeset(user_data)}
    end
  end

  def get_by(field, value) do
    query = %{field => value}

    case Mongo.find_one(:mongo, "users", query) do
      nil ->
        {:error, :not_found}

      user_data when is_map(user_data) ->
        user =
          user_data
          |> Map.drop(["_id", "password"])
          |> changeset_without_passw()

        {:ok, user.changes}
    end
  end

  def get_contacts(user) do
    query = %{"members" => user}

    case Mongo.find(:mongo, "private_chats", query) |> Enum.to_list() do
      [] ->
        {:ok, []}

      chat_list ->
        contacts =
          Enum.flat_map(chat_list, fn chat ->
            chat["members"]
            |> Enum.filter(fn contact ->
              contact != user and not Enum.member?(chat["deleted_by"], user)
            end)
            |> Enum.map(fn contact ->
              case get_by("nickname", contact) do
                {:ok, user_info} -> user_info
                {:error, _} -> nil
              end
            end)
          end)
          |> Enum.reject(&is_nil/1)

        {:ok, contacts}
    end
  end

  def get_contacts_name(user) do
    query = %{"members" => user}

    case Mongo.find(:mongo, "private_chats", query) |> Enum.to_list() do
      [] ->
        {:ok, []}

      chat_list ->
        contacts_name =
          chat_list
          |> Enum.flat_map(fn chat ->
            chat["members"]
            |> Enum.filter(fn contact ->
              contact != user and not Enum.member?(chat["deleted_by"], user)
            end)
          end)

        {:ok, contacts_name}
    end
  end

  def get_all_contacts(user) do
    {:ok, group_chat_data} = Chat.get_all_group_chats_data(user)
    {:ok, private_contacts_data} = get_contacts(user)

    case group_chat_data ++ private_contacts_data do
      [] ->
        {:ok, []}

      list ->
        {:ok, list}
    end
  end

  def get_all_my_chats_id(user) do
    Chat.get_all_chats_id(user)
  end

  def exists?(nickname) do
    contact_query = %{"nickname" => nickname}

    case Mongo.find_one(:mongo, "users", contact_query) do
      nil ->
        false

      _ ->
        true
    end
  end

  defp get_changes_from_changeset(args) do
    changeset(args).changes
  end

  defp timestamps(changeset) do
    change(changeset, %{inserted_at: NaiveDateTime.utc_now(), updated_at: NaiveDateTime.utc_now()})
  end

  defp set_default_image(changeset) do
    random_number = :rand.uniform(10)
    image = "/images/default_user/default_user-#{random_number}.svg"
    change(changeset, %{image_profile: image})
  end
end
