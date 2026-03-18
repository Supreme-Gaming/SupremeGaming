## Supreme Gaming Host Agent

This agent is to be installed on hosts that run supported game servers. The role of this agent is to be a bi-directional communication channel between the host server and the Supreme Gaming control plane.

## Purpose

The agent will be responsible for:

- Registering the host server with the control plane
- Sending regular heartbeats to the control plane to indicate that the host server is alive and well
- Registering individual game server instances with the control plane and function as a data producer for supported game server types
- Receiving commands from the control plane to configure, start, stop, or restart game servers
- Reporting the status of game servers back to the control plane
