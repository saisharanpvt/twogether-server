const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// Health check endpoint for Render
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => res.json({ app: "TwoGether Signaling Server", status: "running" }));

io.on("connection", socket => {
  let currentRoom = null;
  let isHost = false;

  socket.on("join-room", room => {
    const roomSockets = io.sockets.adapter.rooms.get(room);
    const roomSize = roomSockets ? roomSockets.size : 0;

    if (roomSize >= 2) {
      socket.emit("room-full");
      return;
    }

    isHost = roomSize === 0;
    currentRoom = room;
    socket.join(room);

    // Tell the new joiner whether they are host
    socket.emit("role-assigned", { isHost });

    // Notify existing user that someone joined
    socket.to(room).emit("user-joined");

    // WebRTC signaling
    socket.on("offer",          data => socket.to(room).emit("offer", data));
    socket.on("answer",         data => socket.to(room).emit("answer", data));
    socket.on("ice-candidate",  data => socket.to(room).emit("ice-candidate", data));

    // Game signaling – server just relays, clients own the logic
    socket.on("game:request",   data => socket.to(room).emit("game:request", data));
    socket.on("game:accept",    data => socket.to(room).emit("game:accept", data));
    socket.on("game:decline",    ()   => socket.to(room).emit("game:decline"));
    socket.on("game:choice",    data => socket.to(room).emit("game:choice", data));
    socket.on("game:next-turn", ()   => socket.to(room).emit("game:next-turn"));
    socket.on("game:end",       ()   => socket.to(room).emit("game:end"));

    // Partner status events
    socket.on("camera-off",     () => socket.to(room).emit("partner-camera-off"));
    socket.on("camera-on",      () => socket.to(room).emit("partner-camera-on"));
    socket.on("muted",          () => socket.to(room).emit("partner-muted"));
    socket.on("unmuted",        () => socket.to(room).emit("partner-unmuted"));
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      socket.to(currentRoom).emit("partner-disconnected");
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`TwoGether server on port ${PORT}`));
