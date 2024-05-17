defmodule PomoroomWeb.ChatLive.ChatRoot do
	use PomoroomWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket, layout: false}
  end

end
