defmodule Pomoroom.Startup do
  def create_indexes do
    IO.puts "Using database #{Application.get_env(:pomoroom, :db)[:database]}"
    indexes = [
      %{
        key: %{ email: 1 },
        name: "email_index",
        unique: true
      },
      %{
        key: %{ nickname: 1 },
        name: "nickname_index",
        unique: true
      }
    ]
    Mongo.create_indexes(:mongo, "users", indexes)
  end
end
