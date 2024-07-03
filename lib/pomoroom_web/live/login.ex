defmodule PomoroomWeb.HomeLive.Login do
	use PomoroomWeb, :live_view
	alias Pomoroom.User

	def mount(_params, session, socket) do
    socket =
      socket
      |> PhoenixLiveSession.maybe_subscribe(session)

		{:ok, socket, layout: false}
	end

	def handle_event("action.log_user", %{"email" => email, "password"=> password}, socket) do
    user = User.get_by_email(email)

    case user do
      {:error, :not_found} ->
        {:noreply, push_event(socket, "react.error_login_user", %{errors: %{email: "El email o la contraseña no son válidos"}})}
      {:ok, user_changes} ->
        if Bcrypt.verify_pass(password, user_changes.password) do
          user_info = %{
            email: user_changes.email,
            nickname: user_changes.nickname
          }

          socket = PhoenixLiveSession.put_session(socket, "user_info", user_info)
          {:noreply, redirect(socket, to: "/pomoroom/chat")}
        else
          {:noreply, push_event(socket, "react.error_login_user", %{errors: %{password: "El email o la contraseña no son válidos"}})}
        end
      {:error, error} ->
        {:noreply, assign(socket, error: error)}
    end
	end

end
