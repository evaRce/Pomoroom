defmodule Pomoroom.ChatRoom.GroupChat do
  use Ecto.Schema
  import Ecto.Changeset
  alias Pomoroom.ChatRoom.Chat

  schema "group_chats" do
    field :chat_id, :string
    field :name, :string
    field :image, :string
    field :admin, {:array, :string}
    field :members, {:array, :string}
    field :invite_link, :string
    field :inserted_at, :utc_datetime
    field :updated_at, :utc_datetime
  end

  def changeset(args) do
    %Pomoroom.ChatRoom.GroupChat{}
    |> cast(args, [
      :chat_id,
      :name,
      :image,
      :admin,
      :members,
      :invite_link,
      :inserted_at,
      :updated_at
    ])
  end

  def group_chat_changeset(args) do
    changeset(args)
    |> validate_required([
      :chat_id,
      :name,
      :image,
      :admin,
      :members,
      :invite_link,
      :inserted_at,
      :updated_at
    ])
  end

  def group_chat_changeset(chat_id, name, image, from_user, invite_link) do
    group_chat = %{
      chat_id: chat_id,
      name: name,
      image: image,
      admin: [from_user],
      members: [from_user],
      invite_link: invite_link
    }

    changeset(group_chat)
    |> validate_required([:chat_id, :name, :image, :admin, :members, :invite_link])
  end

  def create_group_chat(from_user, name) do
    chat_id = Chat.get_public_id_chat()

    group_changst =
      chat_id
      |> group_chat_changeset(
        name,
        get_default_group_image(),
        from_user,
        generate_invite_link(chat_id)
      )
      |> Chat.timestamps()

    case group_changst.valid? do
      true ->
        case Mongo.insert_one(:mongo, "group_chats", group_changst.changes) do
          {:ok, _result} ->
            {:ok, group_changst.changes}

          {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => _errmsg}]}} ->
            {:error, %{error: "El grupo `#{name}` ya está creado"}}
        end

      false ->
        {:error, %{error: "Hay un campo invalido"}}
    end
  end

  def add_user_to_group_chat(chat_id, user) do
    query = %{"chat_id" => chat_id}

    case Mongo.find_one(:mongo, "group_chats", query) do
      nil ->
        {:error, "Grupo no encontrado"}

      chat ->
        if user in chat.members do
          {:error, "El usuario ya es miembro del grupo"}
        else
          if user in chat.admin do
            # añade un user sin duplicados
            update(query, user, "$addToSet")
            {:ok, "Usuario añadido al grupo"}
          else
            {:error, "El usuario no tiene permiso para unirse al grupo"}
          end
        end
    end
  end

  def join_group_with_link(invite_link, user) do
    case decode_chat_id_from_invite_link(invite_link) do
      {:ok, chat_id} ->
        add_user_to_group_chat(chat_id, user)

      {:error, reason} ->
        {:error, reason}
    end
  end

  def delete(group_name, user) do
    case get_by("name", group_name) do
      {:error, reason} ->
        {:error, reason}

      {:ok, group_chat} ->
        query = %{"chat_id" => group_chat.chat_id}
        # eliminar el user de members
        update(query, user, "$pull")
        {:ok, updated_chat} = get_by("chat_id", group_chat.chat_id)

        if length(updated_chat.members) == 0 do
          Chat.delete_chat("group_chats", group_chat.chat_id)
          {:ok, "Grupo eliminado, ya que el último usuario fue eliminado"}
        else
          {:ok, "Contacto eliminado"}
        end
    end
  end

  def get_by(field, value) do
    query = %{field => value}

    case Mongo.find_one(:mongo, "group_chats", query) do
      nil ->
        {:error, "Chat no encontrado"}

      chat ->
        {:ok, get_changes_from_changeset(chat)}
    end
  end

  defp generate_invite_link(chat_id) do
    encoded_chat_id = Base.url_encode64(chat_id, padding: false)
    "https://pomoroom/#{encoded_chat_id}"
  end

  defp decode_chat_id_from_invite_link(invite_link) do
    [_base_url, encoded_chat_id] = String.split(invite_link, "/")

    case Base.url_decode64(encoded_chat_id, padding: false) do
      {:ok, chat_id} ->
        case Chat.exists?(chat_id) do
          true ->
            {:ok, chat_id}

          false ->
            {:error, %{error: "El chat del enlace `#{invite_link}` no existe"}}
        end

      :error ->
        {:error, %{error: "Enlace de invitación inválido"}}
    end
  end

  defp update(filter, user, operator) do
    Mongo.update_one(
      :mongo,
      "group_chats",
      filter,
      %{operator => %{members: user}, "$set" => %{updated_at: NaiveDateTime.utc_now()}}
    )
  end

  defp get_default_group_image() do
    random_number = :rand.uniform(10)
    "/images/default_group/default_group-#{random_number}.svg"
  end

  defp get_changes_from_changeset(args) do
    group_chat_changeset(args).changes
  end
end
