# Pomoroom

Pomoroom is a web application designed to enhance productivity and time management by integrating the Pomodoro technique with collaborative tools. This platform allows users to study or work together through virtual rooms equipped with features such as text chat, one-on-one video calls, and a personal timer.

## Technologies used

- **Frontend**: React, Tailwind CSS, Ant Design, DaisyUI.
- **Backend**: Elixir with Phoenix LiveView.
- **Database**: MongoDB.
- **Real-time connections**: WebRTC for video calls and Phoenix.PubSub for real-time updates.
- **Infrastructure**: Modular design and concurrent processes using GenServer.

## Installation

Follow these steps to set up the project in your local environment:

### Prerequisites

Make sure you have the following installed on your system:

- [Elixir and Erlang](https://elixir-lang.org/install.html#gnulinux)
- [Docker](https://docs.docker.com/desktop/setup/install/linux/)

### Setup Instructions

1. **Clone the repository**:
   ```bash
	git clone https://github.com/your-username/pomoroom.git
	cd pomoroom
   
2. **Install frontend dependencies**:
   ```bash
	cd assets
	npm install

3. **Install backend dependencies**:
   ```bash
	cd ..
	mix deps.get
	
4. **Generate Docker image**:
   ```bash
   docker load

5. **Start the Docker container**:
   ```bash
   docker start <image_id>

6. **Start the Docker container**:
   ```bash
   mix phx.server	# or	 iex -S mix phx.server


Now you can visit [`localhost:4000`](http://localhost:4000/) from your browser.
