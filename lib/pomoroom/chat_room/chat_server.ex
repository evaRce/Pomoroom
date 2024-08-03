defmodule Pomoroom.ChatRoom.ChatServer do
  use GenServer
  # alias Phoenix.PubSub

  def start_link(chat) do
    IO.inspect("PASO4:    start_link/0 ChatServer ->  #{chat}")
    GenServer.start_link(__MODULE__, [], name: via_tuple(chat))
  end

  def send_message(pid, user, message) do
    GenServer.cast(pid, {:send_message, user, message})
  end

  def get_messages(pid) do
    GenServer.call(pid, :get_messages)
  end

  # Server Callbacks
  def init(state) do
    IO.inspect("PASO5:    init/1 ChatServer -> #{state}")
    {:ok, state}
  end

  def handle_cast({:send_message, user, message}, state) do
    new_state = [{user, message}| state]
    {:noreply, new_state}
  end

  def handle_call(:get_messages, _from, state) do
    {:reply, state, state}
  end

  def handle_call(:created_chat_process, _from, state) do
    {:reply, state, state}
  end

  def via_tuple(name) do
    {:via, Registry, {Registry.Chat, name}}
  end

  # defp chat_topic(name), do: "chat:#{name}"
end
