defmodule PomoroomWeb.ChatLive.ChatRoom do
  alias Pomoroom.ChatRoom.ChatServer
  use PomoroomWeb, :live_view
  alias Pomoroom.User
  alias Pomoroom.ChatRoom.{Contact, Chat, ChatServer}

  def mount(_params, session, socket) do
    socket =
      socket
      |> PhoenixLiveSession.maybe_subscribe(session)
      |> put_session_assigns(session)

    # IO.inspect(socket, structs: false, limit: :infinity)

    send(self(), :init_info_user)
    send(self(), :init_list_contact)
    {:ok, socket, layout: false}
  end

  def handle_info(:init_info_user, socket) do
    payload = %{event_name: "show_user_info", event_data: socket.assigns.user_info}

    {:noreply, push_event(socket, "react", payload)}
  end

  def handle_info(:init_list_contact, socket) do
    user = socket.assigns.user_info.nickname
    contact_list = User.get_contacts_by_user(user)

    case contact_list do
      {:ok, result} ->
        payload = %{event_name: "show_list_contact", event_data: result}
        {:noreply, push_event(socket, "react", payload)}

      {:not_found, []} ->
        {:noreply, socket}
    end
  end

  def handle_event(
        "action.add_contact",
        %{"is_group" => is_group, "name" => contact_name},
        socket
      ) do
    user = socket.assigns.user_info.nickname
    add_contact = Contact.add_contact(contact_name, user, is_group)

    case add_contact do
      {:ok, result} ->
        payload = %{event_name: "add_contact_to_list", event_data: result}
        {:noreply, push_event(socket, "react", payload)}

      {:error, reason} ->
        payload = %{event_name: "error_adding_contact", event_data: reason}
        {:noreply, push_event(socket, "react", payload)}
    end
  end

  def handle_event("action.delete_contact", contact_name, socket) do
    user = socket.assigns.user_info.nickname

    Contact.delete_contact(contact_name, user)
    Chat.delete_chat(contact_name, user)
    {:noreply, socket}
  end

  def handle_event("action.selected_chat", %{"contact_name" => contact_name}, socket) do
    current_user = socket.assigns.user_info.nickname

    case Chat.find_or_create_chat(contact_name, current_user) do
      {:ok, public_id_chat} ->
        chat_users = Chat.get_list_user(public_id_chat)

        case chat_users do
          {:ok, users} ->
            payload = %{
              event_name: "open_chat",
              event_data: %{chat_users: users, contact_name: contact_name}
            }

            ensure_chat_server_exists(contact_name)
            {:noreply, push_event(socket, "react", payload)}

          {:error, reason} ->
            {:error, reason}
        end

      {:error, _reason} ->
        {:noreply, socket}
    end
  end

  def put_session_assigns(socket, session) do
    socket
    |> assign(:user_info, Map.get(session, "user_info", %{}))
  end

  # def handle_event("action.send_message", %{"message" => message}, socket) do
  #   user = socket.assigns.user_info.nickname
  #   chat_id = socket.assigns.chat_id
  #   ChatServer.send_message(via_tuple(chat_id), user, message)
  #   {:noreply, socket}
  # end

  # def handle_info({:new_message, message}, socket) do
  #   payload = %{event_name: "new_message", event_data: message}
  #   {:noreply, push_event(socket, "react", payload)}
  # end

  # Funciones para manejar Registry, ...

  def ensure_chat_server_exists(name) do
    case Registry.lookup(Registry.Chat, name) do
      [] ->
        DynamicSupervisor.start_child(Pomoroom.ChatRoom.ChatSupervisor, {ChatServer, name})
        :ok
      [_process] ->
        :ok
    end
  end

  def via_tuple(name) do
    {:via, Registry, {Registry.Chat, name}}
  end
end
