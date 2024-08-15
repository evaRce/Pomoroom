defmodule Pomoroom.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Pomoroom.ChatRoom.Contact

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

  def get_by_email(""), do: {:error, :not_found}

  def get_by_email(email) do
    query = %{
      email: email
    }

    find_user = Mongo.find_one(:mongo, "users", query)

    case find_user do
      nil ->
        {:error, :not_found}

      user_data when is_map(user_data) ->
        {:ok, get_changes_from_changeset(user_data)}

      error ->
        {:error, error}
    end
  end

  def get_by_nickname(nickname) do
    query = %{
      nickname: nickname
    }

    find_user = Mongo.find_one(:mongo, "users", query)

    case find_user do
      nil ->
        {:error, :not_found}

      user_data when is_map(user_data) ->
        user =
          user_data
          |> Map.drop(["_id", "password"])
          |> changeset_without_passw()

        {:ok, user.changes}

      error ->
        {:error, error}
    end
  end

  def get_changes_from_changeset(args) do
    changeset(args).changes
  end

  def get_contacts(belongs_to_user) do
    contacts_query = %{
      belongs_to_user: belongs_to_user
    }

    search_contacts = Mongo.find(:mongo, "contacts", contacts_query)

    case search_contacts do
      cursor ->
        contacts =
          Enum.map(cursor, fn contact ->
            contact
            |> Map.delete("_id")
            |> Contact.get_changes_from_changeset()
          end)

        {:ok, contacts}
    end
  end

  def get_contacts_names(belongs_to_user) do
    contacts_query = %{
      belongs_to_user: belongs_to_user
    }

    search_contacts = Mongo.find(:mongo, "contacts", contacts_query)

    case search_contacts do
      cursor ->
        contacts = Enum.to_list(cursor)

        case contacts do
          [] ->
            {:not_found, []}

          contact_list ->
            names = Enum.map(contact_list, fn contact -> contact["name"] end)

            {:ok, %{contacts: names}}
        end
    end
  end

  def exists?(user_name) do
    contact_query = %{
      nickname: user_name
    }

    find_contact = Mongo.find_one(:mongo, "users", contact_query)

    case find_contact do
      nil ->
        false

      _ ->
        true
    end
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
