defmodule PomoroomWeb.HomeLive.Login do
  use PomoroomWeb, :live_view

  # Asignamos el estado inicial del proceso
  def mount(_params, _session, socket) do
    socket = assign(socket, :count, 0)
    {:ok, socket}
  end

  # def handle_event("log", %{"user_log" => user_log, "passw_log"=> passw_log}, socket) do
  #   socket = assign(socket, :flag_log, 0)
  #   {:noreply, push_event(socket, "react.login", %{user_log: user_log, passw_log: passw_log})}
  # end
end
