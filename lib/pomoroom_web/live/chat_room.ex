defmodule PomoroomWeb.ChatLive.ChatRoom do
  alias Expo.Message
	use PomoroomWeb, :live_view
  alias Pomoroom.Contact

  def mount(_params, session, socket) do
    socket =
      socket
      |> PhoenixLiveSession.maybe_subscribe(session)
      |> put_session_assigns(session)

    # IO.inspect(socket, structs: false, limit: :infinity)
    send(self(), :init_info_user)
    {:ok, socket, layout: false}
  end

  def handle_info(:init_info_user, socket) do
    payload = %{event_name: "show_user_info", event_data: socket.assigns.user_info}

    {:noreply, push_event(socket, "react", payload)}
  end

  def handle_event("action.add_contact", %{"is_group" => is_group, "name" => contact_name}, socket) do
    belongs_to_user = socket.assigns.user_info.nickname
    add_contact = Contact.add_contact(contact_name, belongs_to_user, is_group)

    case add_contact do
      {:ok, result} ->
        payload = %{event_name: "add_contact_to_list", event_data: result}
        {:noreply, push_event(socket, "react", payload)}

      {:error, reason} ->
        payload = %{event_name: "error_adding_contact", event_data: reason}
        {:noreply, push_event(socket, "react", payload)}
    end
  end

  def put_session_assigns(socket, session) do
    socket
    |> assign(:user_info, Map.get(session, "user_info", %{}))
  end
end
