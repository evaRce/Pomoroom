defmodule PomoroomWeb.HomeLive.Login do
	use PomoroomWeb, :live_view
	alias Pomoroom.User

	# Asignamos el estado inicial del proceso
	def mount(_params, _session, socket) do
		socket = assign(socket, :count, 0)
		{:ok, socket, layout: false}
	end

	def handle_event("action.log_user", %{"email" => email, "password"=> password}, socket) do
    user = User.get_by(email: email)

    case user do
      {:error, :not_found} ->
        IO.inspect("User no encontrado")
        {:noreply, push_event(socket, "react.error_login_user", %{errors: %{email: "Usuario no encontrado"}})}
      {:ok, user_changes} ->
        if Bcrypt.verify_pass(password, user_changes.password) do
          {:noreply, redirect(socket, to: "/pomoroom/home")}
        else
          IO.inspect("Mala contraseña")
          {:noreply, push_event(socket, "react.error_login_user", %{errors: %{password: "Contraseña incorrecta"}})}
        end
      {:error, error} ->
        IO.inspect("Otro error")
        {:noreply, assign(socket, error: error)}
    end
	end
end
