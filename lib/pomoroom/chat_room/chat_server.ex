defmodule Pomoroom.ChatRoom.ChatServer do
  use GenServer
  alias Phoenix.PubSub
  alias Pomoroom.ChatRoom.Message

  def start_link(chat_name) do
    GenServer.start_link(__MODULE__, %{chat_name: chat_name, messages: [], first_load: true},
      name: via_tuple(chat_name)
    )
  end

  def send_message(chat_name, user, message) do
    GenServer.call(via_tuple(chat_name), {:send_message, user, message})
  end

  def get_messages(chat_name, limit \\ :all) do
    GenServer.call(via_tuple(chat_name), {:get_messages, limit})
  end

  def join_chat(chat_name) do
    GenServer.call(via_tuple(chat_name), :join_chat)
  end

  # Server Callbacks
  def init(state) do
    PubSub.subscribe(Pomoroom.PubSub, chat_topic(state.chat_name))
    {:ok, state}
  end

  def handle_call({:send_message, user, message}, _from, state) do
    case Message.new_message(message, user, state.chat_name) do
      {:ok, msg} ->
        PubSub.broadcast(Pomoroom.PubSub, chat_topic(state.chat_name), {:new_message, msg})
        new_messages =  state.messages ++ [msg]
        {:reply, {:ok, msg}, %{state | messages: new_messages}}

      {:error, reason} ->
        {:reply, {:error, reason}, state}
    end
  end

  def handle_call({:get_messages, :all}, _from, state) do
    if state.first_load do
      {:ok, messages_from_db} = Message.get_chat_messages(state.chat_name)
      new_state = %{state | messages: messages_from_db, first_load: false}
      {:reply, messages_from_db, new_state}
    else
      reversed_messages = Enum.reverse(state.messages)
      {:reply, reversed_messages, state}
    end
  end

  def handle_call({:get_messages, limit}, _from, state) when is_integer(limit) do
    if state.first_load do
      {:ok, messages_from_db} = Message.get_chat_messages(state.chat_name)
      limited_messages = messages_from_db |> Enum.reverse() |> Enum.take(limit) |> Enum.reverse()
      new_state = %{state | messages: limited_messages, first_load: false}
      {:reply, limited_messages, new_state}
    else
      reversed_messages = state.messages
      {:reply, reversed_messages, state}
    end
  end

  def handle_call(:join_chat, _from, state) do
    PubSub.subscribe(Pomoroom.PubSub, chat_topic(state.chat_name))
    {:reply, :ok, state}
  end

  def handle_info({:new_message, _msg}, state) do
    {:noreply, state}
  end

  def via_tuple(chat_name) do
    {:via, Registry, {Registry.Chat, chat_name}}
  end

  defp chat_topic(chat_name), do: "chat:#{chat_name}"
end
