defmodule PomoroomWeb.HomeLive.Login do
	use PomoroomWeb, :live_view
	alias Pomoroom.User

	def mount(_params, _session, socket) do
		socket = assign(socket, :count, 0)
		{:ok, socket, layout: false}
	end

	def handle_event("action.log_user", %{"email" => email, "password"=> password}, socket) do
    user = User.get_by(email: email)

    case user do
      {:error, :not_found} ->
        {:noreply, push_event(socket, "react.error_login_user", %{errors: %{email: "El email o la contraseña no son válidos"}})}
      {:ok, user_changes} ->
        if Bcrypt.verify_pass(password, user_changes.password) do
          {:noreply, redirect(socket, to: "/pomoroom/home")}
        else
          {:noreply, push_event(socket, "react.error_login_user", %{errors: %{password: "El email o la contraseña no son válidos"}})}
        end
      {:error, error} ->
        {:noreply, assign(socket, error: error)}
    end
	end
end
