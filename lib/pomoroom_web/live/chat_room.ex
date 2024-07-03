defmodule PomoroomWeb.ChatLive.ChatRoom do
 alias Expo.Message
	use PomoroomWeb, :live_view
  alias Pomoroom.Message

  def mount(_params, session, socket) do
    socket =
      socket
      |> PhoenixLiveSession.maybe_subscribe(session)
      |> put_session_assigns(session)

    # IO.inspect(socket, structs: false, limit: :infinity)
    {:ok, socket, layout: false}
  end

  def handle_event("action.initialize_user_info", _params, socket) do
    {:noreply, push_event(socket, "react.initialize_user_info", %{user_info: socket.assigns.user_info})}
  end
  
  def put_session_assigns(socket, session) do
    socket
    |> assign(:user_info, Map.get(session, "user_info", %{}))
  end
end
