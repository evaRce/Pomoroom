defmodule PomoroomWeb.HomeLive.SignUp do
  use PomoroomWeb, :live_view
  alias Pomoroom.{User, Repo}

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_event("action.save_user", params, socket) do
    changeset = User.validation(params)
    case (changeset.valid?) do
      true ->
        IO.inspect("************TRUE")
        new_data =
          changeset
          |> User.set_hash_password()
          |> Repo.insert()
        case (new_data) do
          {:ok, _schema} ->
            IO.inspect("+++++++Se ha insertado")
            {:noreply, socket}
          {:error, changeset} ->
            IO.inspect("+++++++No se puede insertar")
            errors_as_map =
              changeset.errors
              |> simplify_errors()
              |> Map.new()
            IO.inspect(errors_as_map)
            {:noreply, push_event(socket, "react.error_save_user", %{errors: errors_as_map})}
        end
      _ ->
        IO.inspect("************FALSE")
        {:noreply, socket}
    end
  end

  defp simplify_errors(changeset_errors) do
    Enum.map(changeset_errors, fn {atom, {message, _constraints}} -> {atom, message} end)
  end
end
