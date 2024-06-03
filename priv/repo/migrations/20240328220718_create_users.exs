defmodule Hello.Repo.Migrations.CreateUsers do
	use Ecto.Migration

  def change do
    create table(:users)
    create unique_index(:users, [:email], name: :users_email_index)
    create unique_index(:users, [:nickname])
    execute touch: "my_table", data: true, index: true
  end
end
