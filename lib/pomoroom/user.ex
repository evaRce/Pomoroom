defmodule Pomoroom.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :password, :string
    field :nickname, :string
    timestamps(type: :utc_datetime)
  end

  def changeset(args) do
    %Pomoroom.User{}
    |> cast(args, [:email, :password, :nickname])
  end

  def validation(args) do
    args
    |> changeset()
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

  def register_user(changeset) do
    user_changeset =
      changeset
      |> set_hash_password()

    insert_user = Mongo.insert_one(:mongo, "users", user_changeset.changes)

    case insert_user do
      {:ok, result} ->
        {:ok, result}

      {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => errmsg}]}} ->
        {:error, parse_duplicate_key_error(errmsg)}
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
    find_user = Mongo.find_one(:mongo, "users", get_changes_from_changeset(email: email))

    case find_user do
      nil ->
        {:error, :not_found}

      user_data when is_map(user_data) ->
        {:ok, get_changes_from_changeset(user_data)}

      error ->
        {:error, error}
    end
  end

  def get_changes_from_changeset(args) do
    args =
      args
      |> Map.new()
      |> changeset()

    args.changes
  end

  def get_contacts(belongs_to_user) do
    contacts_query = %{
      "$or" => [
        %{"belongs_to_user" => belongs_to_user},
        %{"name" => belongs_to_user}
      ]
    }

    search_contacts = Mongo.find(:mongo, "contacts", contacts_query)

    case search_contacts do
      cursor ->
        contacts = Enum.map(cursor, fn contact -> Map.delete(contact, "_id") end)
        {:ok, contacts}
    end
  end

  def get_contacts_names(belongs_to_user) do
    contacts_query = %{
      "$or" => [
        %{"belongs_to_user" => belongs_to_user},
        %{"name" => belongs_to_user}
      ]
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
end
