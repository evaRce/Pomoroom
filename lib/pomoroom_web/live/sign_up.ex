defmodule PomoroomWeb.HomeLive.SignUp do
	use PomoroomWeb, :live_view
	alias Pomoroom.User

	def mount(_params, _session, socket) do
		{:ok, socket, layout: false}
	end

	def handle_event("action.save_user", params, socket) do
		changeset = User.validation(params)
		case (changeset.valid?) do
			true ->
				register_user = User.register_user(changeset)
				case register_user do
					{:ok, _result} ->
						{:noreply, redirect(socket, to: "/pomoroom/home")}
					{:error, reason} ->
						{:noreply, push_event(socket, "react.error_save_user", %{errors: reason})}
				end
			_ ->
				{:noreply, socket}
		end
	end
end
