defmodule Pomoroom.User do
	use Ecto.Schema
	import Ecto.Changeset

	schema "users" do
		field :email, :string
		field :password, :string
		field :nickname, :string

		timestamps(type: :utc_datetime)
	end

	def changeset(args) do
		%Pomoroom.User{}
		|> cast(args, [:email, :password, :nickname])
	end

	def validation(args) do
		args
		|> changeset()
		|> validate_required([:email, :password, :nickname])
		|> unique_constraint(:email, message: "Este email ya esta siendo usado", name: :users_email_index)
		|> unique_constraint(:nickname, message: "Este nickname ya esta asociado a otra cuenta")
	end

	def set_hash_password(changeset) do
		hashed_password =
			changeset
			|> fetch_field(:password)
			|> elem(1)
			|> Bcrypt.hash_pwd_salt()
		changeset
		|> change(%{password: hashed_password})
	end

	def register_user(changeset) do
		hash_passw_changeset =
			changeset
			|> set_hash_password()
		Mongo.insert_one(:mongo, "users", hash_passw_changeset.changes)
	end

	def get_by(args) do
		changeset =
			args
			|> Map.new()
			|> changeset()
		(Mongo.find_one(:mongo, "users", changeset.changes)
		|> changeset()).changes
	end
end
