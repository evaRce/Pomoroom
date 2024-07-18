defmodule Pomoroom.ChatRoom.Contact do
  use Ecto.Schema
  import Ecto.Changeset

  schema "contacts" do
    field :name, :string
    field :belongs_to_user, :string
    field :is_group, :boolean
    timestamps(type: :utc_datetime)
  end

  def contact_changeset(contact_name, belongs_to_user, is_group) do
    contact = %{name: contact_name, belongs_to_user: belongs_to_user, is_group: is_group}

    %Pomoroom.ChatRoom.Contact{}
    |> cast(contact, [:name, :belongs_to_user, :is_group])
    |> validate_required([:name, :belongs_to_user, :is_group])
  end

  def add_contact(contact_name, belongs_to_user, _is_group) when contact_name == belongs_to_user,
    do: {:error, %{error: "No puedes añadirte a ti mismo"}}

  def add_contact(contact_name, belongs_to_user, is_group) do
    contact_changst = contact_changeset(contact_name, belongs_to_user, is_group)

    case contact_changst.valid? do
      true ->
        insert_contact = Mongo.insert_one(:mongo, "contacts", contact_changst.changes)

        case insert_contact do
          {:ok, _result} ->
            {:ok, %{name: contact_name}}

          {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => errmsg}]}} ->
            {:error, %{error: "El contacto #{contact_name} ya esta añadido"}}
        end

      false ->
        {:error, %{error: "Falta un campo"}}
    end
  end

  def delete_contact(contact_name, belongs_to_user) do
    delete_query = %{
      "name" => contact_name,
      "belongs_to_user" => belongs_to_user
    }

    Mongo.delete_one(:mongo, "contacts", delete_query)
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
end
