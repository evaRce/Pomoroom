defmodule PomoroomWeb.ChatLive.ChatRoom do
  alias Pomoroom.ChatRoom.ChatServer
  use PomoroomWeb, :live_view
  alias Pomoroom.User
  alias Pomoroom.ChatRoom.{PrivateChat, ChatServer, FriendRequest, GroupChat}

  def mount(_params, session, socket) do
    socket =
      socket
      |> PhoenixLiveSession.maybe_subscribe(session)
      |> put_session_assigns(session)

    if connected?(socket) do
      send(self(), :get_list_contact)
    end

    # IO.inspect(socket, structs: false, limit: :infinity)
    {:ok, socket, layout: false}
  end

  def handle_info(:get_list_contact, %{assigns: %{user_info: user}} = socket) do
    case User.get_all_contacts(user.nickname) do
      {:ok, []} ->
        {:noreply, socket}

      {:ok, all_contacts} ->
        all_contact_list =
          Enum.map(all_contacts, fn contact ->
            if Map.has_key?(contact, :admin) do
              %{
                is_group: true,
                group_data: contact,
                status: "accepted"
              }
            else
              {to_user, from_user} =
                FriendRequest.determine_friend_request_users(contact.nickname, user.nickname)

              {:ok, request} = FriendRequest.get(to_user, from_user)

              %{
                is_group: false,
                contact_data: contact,
                request: request
              }
            end
          end)

        payload = %{
          event_name: "show_list_contact",
          event_data: %{all_contact_list: all_contact_list}
        }

        {:noreply, push_event(socket, "react", payload)}
    end
  end

  def handle_event("action.get_user_info", _args, %{assigns: %{user_info: user}} = socket) do
    payload = %{event_name: "show_user_info", event_data: user}
    {:noreply, push_event(socket, "react", payload)}
  end

  def handle_event("action.delete_contact", contact_name, %{assigns: %{user_info: user}} = socket) do
    {to_user, from_user} =
      FriendRequest.determine_friend_request_users(contact_name, user.nickname)

    {:ok, private_chat} = PrivateChat.get(to_user, from_user)

    PrivateChat.delete_contact(private_chat.chat_id, user.nickname)
    {:noreply, socket}
  end

  def handle_event(
        "action.selected_private_chat",
        %{"contact_name" => contact_name},
        %{assigns: %{user_info: user}} = socket
      ) do
    {to_user, from_user} =
      FriendRequest.determine_friend_request_users(contact_name, user.nickname)

    case PrivateChat.ensure_exists(to_user, from_user) do
      {:ok, private_chat} ->
        ensure_chat_server_exists(private_chat.chat_id)
        {:ok, to_user_data} = User.get_by("nickname", contact_name)
        {:ok, from_user_data} = User.get_by("nickname", user.nickname)
        {:ok, request} = FriendRequest.get(to_user, from_user)

        payload =
          case FriendRequest.get_status(contact_name, user.nickname) do
            "accepted" ->
              messages = ChatServer.get_messages(private_chat.chat_id, 3)

              messages_with_images_user =
                Enum.map(messages, fn msg ->
                  image_user =
                    if msg.from_user == user.nickname do
                      from_user_data.image_profile
                    else
                      to_user_data.image_profile
                    end

                  %{
                    data: msg,
                    image_user: image_user
                  }
                end)

              %{
                event_name: "open_private_chat",
                event_data: %{
                  from_user_data: from_user_data,
                  to_user_data: to_user_data,
                  messages: messages_with_images_user
                }
              }

            "pending" ->
              if FriendRequest.is_owner_request?(contact_name, user.nickname) do
                %{
                  event_name: "open_chat_request_send",
                  event_data: %{request: request}
                }
              else
                %{
                  event_name: "open_chat_request_received",
                  event_data: %{request: request}
                }
              end

            "rejected" ->
              if FriendRequest.is_owner_request?(contact_name, user.nickname) do
                %{
                  event_name: "open_rejected_request_received",
                  event_data: %{
                    rejected_request: request
                  }
                }
              else
                %{
                  event_name: "open_rejected_request_send",
                  event_data: %{
                    rejected_request: request
                  }
                }
              end
          end

        {:noreply, push_event(socket, "react", payload)}

      {:error, _reason} ->
        {:noreply, socket}
    end
  end

  def handle_event("action.selected_group_chat", %{"group_name" => group_name}, socket) do
    case GroupChat.get_by("name", group_name) do
      {:error, _reason} ->
        {:noreply, socket}

      {:ok, group_chat} ->
        ensure_chat_server_exists(group_chat.chat_id)
        messages = ChatServer.get_messages(group_chat.chat_id, 3)

        messages_with_images_user =
          Enum.map(messages, fn msg ->
            case User.get_by("nickname", msg.from_user) do
              {:ok, user_data} ->
                %{
                  data: msg,
                  image_user: user_data.image_profile
                }

              {:error, _reason} ->
                %{
                  data: msg,
                  image_user: nil
                }
            end
          end)

        payload = %{
          event_name: "open_group_chat",
          event_data: %{
            group_data: group_chat,
            messages: messages_with_images_user
          }
        }

        {:noreply, push_event(socket, "react", payload)}
    end
  end

  def handle_event(
        "action.update_status_request",
        %{"status" => status, "contact_name" => contact_name, "from_user_name" => from_user_name},
        %{assigns: %{user_info: user}} = socket
      ) do
    {:ok, to_user_data} = User.get_by("nickname", contact_name)
    {:ok, from_user_data} = User.get_by("nickname", from_user_name)
    {:ok, request} = FriendRequest.get(contact_name, from_user_name)

    case status do
      "accepted" ->
        case PrivateChat.get(contact_name, from_user_name) do
          {:ok, private_chat} ->
            ChatServer.join_chat(private_chat.chat_id)
            FriendRequest.accept_friend_request(contact_name, from_user_name)

            payload = %{
              event_name: "open_private_chat",
              event_data: %{
                from_user_data: from_user_data,
                to_user_data: to_user_data,
                messages: []
              }
            }

            {:noreply, push_event(socket, "react", payload)}

          {:error, _reason} ->
            {:noreply, socket}
        end

      "rejected" ->
        FriendRequest.reject_friend_request(contact_name, from_user_name)

        payload =
          if FriendRequest.is_owner_request?(contact_name, user.nickname) do
            %{
              event_name: "open_rejected_request_received",
              event_data: %{
                rejected_request: request
              }
            }
          else
            %{
              event_name: "open_rejected_request_send",
              event_data: %{
                rejected_request: request
              }
            }
          end

        {:noreply, push_event(socket, "react", payload)}

      _ ->
        {:noreply, socket}
    end
  end

  def handle_event(
        "action.send_message",
        %{"message" => message, "to_user" => to_user_arg},
        %{assigns: %{user_info: user}} = socket
      ) do
    {to_user, from_user} =
      FriendRequest.determine_friend_request_users(to_user_arg, user.nickname)

    case PrivateChat.get(to_user, from_user) do
      {:ok, private_chat} ->
        case ChatServer.send_message(private_chat.chat_id, user.nickname, message) do
          {:ok, msg} ->
            {:ok, from_user_data} = User.get_by("nickname", user.nickname)

            payload = %{
              event_name: "show_message_to_send",
              event_data: %{
                message: %{
                  data: msg,
                  image_user: from_user_data.image_profile
                }
              }
            }

            {:noreply, push_event(socket, "react", payload)}

          {:error, reason} ->
            payload = %{event_name: "error_sending_message", event_data: reason}
            {:noreply, push_event(socket, "react", payload)}
        end

      {:error, _reason} ->
        {:noreply, socket}
    end
  end

  def handle_event(
        "action.send_message",
        %{"message" => message, "to_group_name" => to_group_name},
        %{assigns: %{user_info: user}} = socket
      ) do
    case GroupChat.get_by("name", to_group_name) do
      {:error, _reason} ->
        {:noreply, socket}

      {:ok, group_chat} ->
        case ChatServer.send_message(group_chat.chat_id, user.nickname, message) do
          {:ok, msg} ->
            {:ok, from_user_data} = User.get_by("nickname", user.nickname)

            payload = %{
              event_name: "show_message_to_send",
              event_data: %{
                message: %{
                  data: msg,
                  image_user: from_user_data.image_profile
                }
              }
            }

            {:noreply, push_event(socket, "react", payload)}

          {:error, reason} ->
            payload = %{event_name: "error_sending_message", event_data: reason}
            {:noreply, push_event(socket, "react", payload)}
        end
    end
  end

  def handle_event(
        "action.send_friend_request",
        %{"to_user" => to_user_arg},
        %{assigns: %{user_info: user}} = socket
      ) do
    user_nickname = user.nickname

    if to_user_arg == user_nickname do
      {:error, reason} = FriendRequest.send_friend_request(to_user_arg, user_nickname)
      payload = %{event_name: "error_adding_contact", event_data: reason}
      {:noreply, push_event(socket, "react", payload)}
    else
      if User.exists?(to_user_arg) do
        {:ok, contact_data} = User.get_by("nickname", to_user_arg)

        case FriendRequest.get_status(to_user_arg, user_nickname) do
          :not_found ->
            case FriendRequest.send_friend_request(to_user_arg, user_nickname) do
              {:ok, request} ->
                payload = %{
                  event_name: "add_contact_to_list",
                  event_data: %{
                    is_group: false,
                    contact_data: contact_data,
                    request: request
                  }
                }

                {:noreply, push_event(socket, "react", payload)}

              _ ->
                {:noreply, socket}
            end

          _status ->
            {to_user, from_user} =
              FriendRequest.determine_friend_request_users(to_user_arg, user_nickname)

            {:ok, private_chat} = PrivateChat.get(to_user, from_user)

            payload =
              case private_chat.deleted_by do
                [] ->
                  {:error, reason} = FriendRequest.send_friend_request(to_user, from_user)
                  %{event_name: "error_adding_contact", event_data: reason}

                [user_nickname] ->
                  {:ok, request} =
                    FriendRequest.restore_contact_if_request_exists(
                      to_user,
                      from_user,
                      user_nickname
                    )

                  %{
                    event_name: "add_contact_to_list",
                    event_data: %{
                      is_group: false,
                      contact_data: contact_data,
                      request: request
                    }
                  }
              end

            {:noreply, push_event(socket, "react", payload)}
        end
      else
        payload = %{
          event_name: "error_adding_contact",
          event_data: %{error: "El usuario `#{to_user_arg}` no existe"}
        }

        {:noreply, push_event(socket, "react", payload)}
      end
    end
  end

  def handle_event(
        "action.add_group",
        %{"name" => name_group},
        %{assigns: %{user_info: user}} = socket
      ) do
    case GroupChat.create_group_chat(user.nickname, name_group) do
      {:ok, group_chat} ->
        payload = %{
          event_name: "add_group_to_list",
          event_data: %{
            is_group: true,
            group_data: group_chat,
            status: "accepted"
          }
        }

        {:noreply, push_event(socket, "react", payload)}

      {:error, reason} ->
        payload = %{event_name: "error_adding_contact", event_data: reason}
        {:noreply, push_event(socket, "react", payload)}
    end
  end

  def handle_event("action.delete_group", group_name, %{assigns: %{user_info: user}} = socket) do
    GroupChat.delete(group_name, user.nickname)
    {:noreply, socket}
  end

  def handle_event(
        "action.get_my_contacts_in_group",
        _args,
        %{assigns: %{user_info: user}} = socket
      ) do
    case User.get_contacts(user.nickname) do
      {:ok, []} ->
        {:noreply, socket}

      {:ok, contacts} ->
        contact_list =
          Enum.map(contacts, fn contact ->
            {to_user, from_user} =
              FriendRequest.determine_friend_request_users(contact.nickname, user.nickname)

            case FriendRequest.get(to_user, from_user) do
              {:ok, request} ->
                if request.status == "accepted" do
                  %{
                    is_group: false,
                    contact_data: contact,
                    request: request
                  }
                else
                  nil
                end

              _ ->
                nil
            end
          end)
          |> Enum.reject(&is_nil/1)

        payload = %{
          event_name: "show_my_contacts_in_group",
          event_data: %{contact_list: contact_list}
        }

        {:noreply, push_event(socket, "react", payload)}
    end
  end

  def handle_event(
        "action.get_members_group",
        %{"group_name" => group_name, "is_group" => _is_group, "is_visible" => _is_visible},
        socket
      ) do
    case GroupChat.get_members(group_name) do
      {:ok, members} ->
        members_data =
          Enum.map(members, fn member ->
            case User.get_by("nickname", member) do
              {:ok, user} -> user
              {:error, _reason} -> nil
            end
          end)
          |> Enum.reject(&is_nil/1)

        payload = %{
          event_name: "show_members_in_group",
          event_data: %{members_data: members_data}
        }

        {:noreply, push_event(socket, "react", payload)}

      {:error, _reason} ->
        {:noreply, socket}
    end
  end

  def put_session_assigns(socket, session) do
    socket
    |> assign(:user_info, Map.get(session, "user_info", %{}))
  end

  defp ensure_chat_server_exists(chat_id) do
    case Registry.lookup(Registry.Chat, chat_id) do
      [] ->
        DynamicSupervisor.start_child(Pomoroom.ChatRoom.ChatSupervisor, {ChatServer, chat_id})
        :ok

      [_process] ->
        :ok
    end
  end
end
