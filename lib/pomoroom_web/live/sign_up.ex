defmodule PomoroomWeb.HomeLive.SignUp do
  use PomoroomWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_event("action.save", _, socket) do
    IO.inspect(socket.assigns)
    {:noreply, socket}
  end

end
