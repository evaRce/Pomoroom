defmodule Pomoroom.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    IO.inspect("Esta upppppppppp")
    create table(:users)
    create unique_index(:users, [:email], name: :users_email_index)
    create unique_index(:users, [:nickname])
    execute touch: "users", data: true, index: true
  end
end
