defmodule Pomoroom.ChatRoom.ChatServer do
  use GenServer
  # alias Phoenix.PubSub
  alias Pomoroom.ChatRoom.Message

  def start_link(chat_name) do
    GenServer.start_link(__MODULE__, %{chat_name: chat_name, messages: []},
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
    # PubSub.subscribe(Pomoroom.PubSub, chat_topic(state.chat_name))
    {:ok, state}
  end

  def handle_call({:send_message, user, message}, _from, state) do
    case Message.new_message(message, user, state.chat_name) do
      {:ok, msg} ->
        # PubSub.broadcast(Pomoroom.PubSub, chat_topic(state.chat_name), {:new_message, msg})
        new_messages = [msg | state.messages]
        {:reply, {:ok, msg}, %{state | messages: new_messages}}

      {:error, reason} ->
        {:reply, {:error, reason}, state}
    end
  end

  def handle_call({:get_messages, :all}, _from, state) do
    # Invertir la lista de mensajes para que los más recientes estén al final
    reversed_messages = Enum.reverse(state.messages)
    {:reply, reversed_messages, state}
  end

  def handle_call({:get_messages, limit}, _from, state) when is_integer(limit) do
    # Obtener los primeros 'limit' mensajes y luego invertir la lista
    reversed_messages = state.messages |> Enum.take(limit) |> Enum.reverse()
    {:reply, reversed_messages, state}
  end

  def handle_call(:join_chat, _from, state) do
    # PubSub.subscribe(Pomoroom.PubSub, chat_topic(state.chat_name))
    {:reply, :ok, state}
  end

  def via_tuple(chat_name) do
    {:via, Registry, {Registry.Chat, chat_name}}
  end

  # defp chat_topic(chat_name), do: "chat:#{chat_name}"
end
