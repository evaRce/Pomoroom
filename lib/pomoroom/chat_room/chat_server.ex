defmodule Pomoroom.ChatRoom.ChatServer do
  use GenServer
  # alias Phoenix.PubSub
  alias Pomoroom.ChatRoom.Message

  def start_link(chat) do
    GenServer.start_link(__MODULE__, [], name: via_tuple(chat))
  end

  def send_message(contact_name, user, message) do
    GenServer.call(via_tuple(contact_name), {:send_message, user, message, contact_name})
  end

  def get_messages(contact_name, limit \\ :all) do
    GenServer.call(via_tuple(contact_name), {:get_messages, limit})
  end

  # Server Callbacks
  def init(state) do
    {:ok, state}
  end

  def handle_call({:send_message, user, message, contact_name}, _from, messages) do
    case Message.new_message(message, user, contact_name) do
      {:ok, msg} ->
        new_messages = [msg | messages]
        {:reply, {:ok, msg}, new_messages}

      {:error, reason} ->
        {:reply, {:error, reason}, messages}
    end
  end

  def handle_call({:get_messages, :all}, _from, messages) do
    {:reply, messages, messages}
  end

  def handle_call({:get_messages, limit}, _from, messages) when is_integer(limit) do
    msg = Enum.take(messages, limit)
    {:reply, msg, messages}
  end

  def via_tuple(name) do
    {:via, Registry, {Registry.Chat, name}}
  end

  # defp chat_topic(name), do: "chat:#{name}"
end
