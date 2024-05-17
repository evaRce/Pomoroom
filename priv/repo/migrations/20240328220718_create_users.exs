defmodule Hello.Repo.Migrations.CreateUsers do
	use Ecto.Migration

	def change do
		create table(:users) do
			add :email, :string
			add :password, :string
			add :nickname, :string

			timestamps(type: :utc_datetime)
		end

    create unique_index(:users, [:email], name: :users_email_index)
    create unique_index(:users, [:nickname])
  end
end
