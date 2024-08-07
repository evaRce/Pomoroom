defmodule Pomoroom.ChatRoom.Contact do
  use Ecto.Schema
  import Ecto.Changeset
  alias Pomoroom.ChatRoom.Chat

  schema "contacts" do
    field :name, :string
    field :belongs_to_user, :string
    field :is_group, :boolean
    field :status_request, :string, default: "por_defecto"
    field :inserted_at, :utc_datetime
    field :updated_at, :utc_datetime
  end

  def changeset(args) do
    %Pomoroom.ChatRoom.Contact{}
    |> cast(args, [
      :name,
      :belongs_to_user,
      :is_group,
      :status_request,
      :inserted_at,
      :updated_at
    ])
  end

  def contact_changeset(contact_name, belongs_to_user, is_group) do
    contact = %{name: contact_name, belongs_to_user: belongs_to_user, is_group: is_group, status_request: "pending"}

    changeset(contact)
    |> validate_required([:name, :belongs_to_user, :is_group])
  end

  # Barajar la posibilidad de quitarlo
  # def add_contact(contact_name, belongs_to_user) when contact_name == belongs_to_user,
  #   do: {:error, %{error: "No puedes añadirte a ti mismo"}}

  def add_contact(contact_name, belongs_to_user, is_group \\ false) do
    contact_changst =
      contact_name
      |> contact_changeset(belongs_to_user, is_group)
      |> timestamps()

    case contact_changst.valid? do
      true ->
        insert_contact = Mongo.insert_one(:mongo, "contacts", contact_changst.changes)

        case insert_contact do
          {:ok, _result} ->
            {:ok, %{name: contact_name}}

          {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => _errmsg}]}} ->
            {:error, %{error: "El contacto #{contact_name} ya está añadido"}}
        end

      false ->
        {:error, %{error: "Falta un campo"}}
    end
  end

  def update_status(contact_name, belongs_to_user, status) do
    Mongo.update_one(
      :mongo,
      "contacts",
      %{contact_name: contact_name, belongs_to_user: belongs_to_user, status: "pending"},
      %{"$set": %{status: status, updated_at: NaiveDateTime.utc_now()}}
    )
  end

  def delete_contact(contact_name, belongs_to_user) do
    delete_query = %{
      "name" => contact_name,
      "belongs_to_user" => belongs_to_user
    }

    Mongo.delete_one(:mongo, "contacts", delete_query)
    Chat.delete_chat(contact_name, belongs_to_user)
  end

  def contact_exists?(contact_name, belongs_to_user) do
    contact_query = %{
      "name" => contact_name,
      "belongs_to_user" => belongs_to_user
    }

    find_contact = Mongo.find_one(:mongo, "contacts", contact_query)

    case find_contact do
      nil ->
        false

      _ ->
        true
    end
  end

  def is_group?(contact_name, belongs_to_user) do
    query = %{
      name: contact_name,
      belongs_to_user: belongs_to_user
    }

    case Mongo.find_one(:mongo, "contacts", query) do
      nil ->
        {:error, "Contacto no encontrado"}

      contact ->
        if Map.get(contact, "is_group") do
          true
        else
          false
        end
    end
  end

  defp timestamps(changeset) do
    change(changeset, %{inserted_at: NaiveDateTime.utc_now(), updated_at: NaiveDateTime.utc_now()})
  end
end