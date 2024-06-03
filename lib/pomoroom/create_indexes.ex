defmodule Pomoroom.CreateIndexes do

  def create_indexes() do
    indexes = [
      %{
        key: %{
            email: 1,
            nickname: 1
        },
        name: "user_index",
        unique: true
      }
    ]

    # Falta obtener el identificador de la topologia
    # El primer argumento es incorrecto
    Mongo.create_indexes(Mongo.Supervisor, "users", indexes)
    IO.inspect("CREACIONNNN INDICES")
  end
end
