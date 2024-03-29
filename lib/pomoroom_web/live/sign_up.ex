defmodule PomoroomWeb.HomeLive.SignUp do
  use PomoroomWeb, :live_view
  alias Pomoroom.{User, Repo}

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_event("action.save", params, socket) do
    changeset = User.validation(params)
    constraints = changeset |> Ecto.Changeset.constraints
    IO.inspect(constraints)
    case (changeset.valid?) do
      true ->
        changeset
        |> User.set_hash_password()
        |> Repo.insert()
        IO.inspect(Repo.all(User))
        {:noreply, socket}
      _ ->
        {:noreply, socket}

    end

  end

end
