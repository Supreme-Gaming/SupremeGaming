## Supreme Gaming Host Agent

This agent is to be installed on hosts that run supported game servers. The role of this agent is to be a bi-directional communication channel between the host server and the Supreme Gaming control plane.

## Purpose

The agent will be responsible for:

- Registering the host server with the control plane
- Sending regular heartbeats to the control plane to indicate that the host server is alive and well
- Registering individual game server instances with the control plane and function as a data producer for supported game server types
- Receiving commands from the control plane to configure, start, stop, or restart game servers
- Reporting the status of game servers back to the control plane

### Agent Registration Mechanism

This agent will be published as either a docker container image or a binary executable hosted on GitHub as a release.

Regardless of installation method, the UI will provide a installation script that will either pull the container image and run with defaults + generated auth token, or download the binary and run with defaults + generated auth token.

On registration, the agent will send a request to the control plane with the following information:

- System information (CPU, RAM, Disk, Network)
- Hostname
- IP address

After successful registration, the agent will listen for incoming messages (probably a queue or websocket) from the control plane for commands to manage game servers.

### Game Server Management

The control plane will send configurations for game servers to the agent, using bi-directional communication channels to support directory browsing from the Web UI. In this way, the web UI can configure game servers and information such as:

- Game server type (ark-se, ark-sa, conan, atlas, etc.)
- Public IP (inherited from host or custom)
- Port configuration (game, query, rcon, etc.)
- Server name (Optionally auto-discover from game ini)
- RCON password (Optionally auto-discover from game ini)
- Game server installation directory (Optionally auto-discover from common install paths)
- Whether game data should be parsed and uploaded to the control plane for display in the Web UI (player/tribe parsing, using ark-files library)
