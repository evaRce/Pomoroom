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
		# |> validate_required([:email, :password, :nickname])
		|> validate_email()
    |> validate_password()
    |> validate_nickname()
	end

	defp validate_email(changeset) do
		changeset
		|> validate_required([:email])
		|> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "Debe tener el signo @ y sin espacios")
		|> validate_length(:email, max: 64, message: "No debe exceder los 64 caracteres")
	end

	defp validate_password(changeset) do
		changeset
		|> validate_required([:password])
		|> validate_length(:password, min: 8, max: 64, message: "La contraseña debe tener entre 8 y 64 caracteres")
	end

	defp validate_nickname(changeset) do
		changeset
		|> validate_required([:nickname])
    |> validate_format(:nickname, ~r/^[a-zA-Z0-9_]+$/, message: "El nickname solo puede contener letras, números y guiones bajos, sin espacios")
		|> validate_length(:password, min: 2, max: 64)
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
		insert_one = Mongo.insert_one(:mongo, "users", hash_passw_changeset.changes)
		
		case insert_one do
      {:ok, result} ->
				{:ok, result}
      {:error, %Mongo.WriteError{write_errors: [%{"code" => 11000, "errmsg" => errmsg}]}} ->
        {:error, parse_duplicate_key_error(errmsg)}
    end
  end

  defp parse_duplicate_key_error(errmsg) do
    cond do
      String.contains?(errmsg, "email") ->
				%{email: "Este email ya está siendo usado"}
      String.contains?(errmsg, "nickname") ->
				%{nickname: "Este nickname ya está asociado a otra cuenta"}
    end
  end

	def get_by(args) do
		find_one = Mongo.find_one(:mongo, "users", get_changes_from_changeset(args))
		case find_one do
			nil ->
				{:error, :not_found}
			user_data when is_map(user_data) ->
				{:ok, get_changes_from_changeset(user_data)}
			error ->
				{:error, error}
		end
	end

	defp to_changeset(args) do
		args
		|> Map.new()
		|> changeset()
	end

	def get_changes_from_changeset(args) do
		to_changeset(args).changes
	end

	# def get_errors_from_changeset(changeset) do
	# 	changeset.errors
	# 	|> Enum.map(fn {atom, {message, _constraints}} -> {atom, message} end)
	# 	|> Map.new()
	# end
end
