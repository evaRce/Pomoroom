defmodule Pomoroom.Startup do
  def ensure_indexes do
    IO.puts "Using database #{Application.get_env(:pomoroom, :db)[:database]}"
    Mongo.command(:mongo, %{createIndexes: "users",
      indexes: [ %{ key: %{ email: 1 },
                    name: "email_idx",
                    unique: true} ] })
  end
end
