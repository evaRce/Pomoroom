defmodule PomoroomWeb.HomeLive.SignUp do
	use PomoroomWeb, :live_view
	alias Pomoroom.User

	def mount(_params, _session, socket) do
		{:ok, socket}
	end

	def handle_event("action.save_user", params, socket) do
		changeset = User.validation(params)
		case (changeset.valid?) do
			true ->
				case (User.register_user(changeset)) do
					{:ok, _schema} ->
						{:noreply, socket}
					{:error, changeset} ->
						errors_as_map =
							changeset.errors
							|> simplify_errors()
							|> Map.new()
						{:noreply, push_event(socket, "react.error_save_user", %{errors: errors_as_map})}
				end
			_ ->
				{:noreply, socket}
		end
	end

	defp simplify_errors(changeset_errors) do
		Enum.map(changeset_errors, fn {atom, {message, _constraints}} -> {atom, message} end)
	end
end
