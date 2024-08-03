defmodule Pomoroom.ChatRoom.ChatSupervisor do
  use DynamicSupervisor
  alias Pomoroom.ChatRoom.ChatServer

  def start_link() do
    IO.inspect("PASO1:    start_link/0 ChatSupervisor")
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  @impl DynamicSupervisor
  def init(_arg) do
    IO.inspect("PASO2:    init/1 ChatSupervisor")
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def add_child(chat_name) do
    IO.inspect("PASO3:    start_supervisor/1 ChatSupervisor -> #{chat_name}")
    DynamicSupervisor.start_child(__MODULE__, {ChatServer, chat_name})
  end

  def remove_child(chat_pid) do
    DynamicSupervisor.terminate_child(__MODULE__, chat_pid)
  end

  def which_children() do
    DynamicSupervisor.which_children(__MODULE__)
  end

  def count_children do
    DynamicSupervisor.count_children(__MODULE__)
  end
end
