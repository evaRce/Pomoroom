defmodule Pomoroom.Repo do
  use Ecto.Repo,
    otp_app: :pomoroom,
    adapter: Mongo.Ecto
end
