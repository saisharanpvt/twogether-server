const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/",       (req, res) => res.json({ app: "TwoGether Signaling Server", status: "running" }));

io.on("connection", socket => {
  let currentRoom = null;
  let isHost = false;

  socket.on("join-room", ({ room, name }) => {
    const roomSockets = io.sockets.adapter.rooms.get(room);
    const roomSize    = roomSockets ? roomSockets.size : 0;

    if (roomSize >= 2) { socket.emit("room-full"); return; }

    isHost = roomSize === 0;
    currentRoom = room;
    socket.join(room);

    socket.emit("role-assigned", { isHost });
    socket.to(room).emit("user-joined", { name: name || "Partner" });

    // WebRTC signaling
    socket.on("offer",         d => socket.to(room).emit("offer",  d));
    socket.on("answer",        d => socket.to(room).emit("answer", d));
    socket.on("ice-candidate", d => socket.to(room).emit("ice-candidate", d));

    // Name
    socket.on("set-name",      d => socket.to(room).emit("partner-name", d));

    // Partner status
    socket.on("camera-off",    () => socket.to(room).emit("partner-camera-off"));
    socket.on("camera-on",     () => socket.to(room).emit("partner-camera-on"));
    socket.on("muted",         () => socket.to(room).emit("partner-muted"));
    socket.on("unmuted",       () => socket.to(room).emit("partner-unmuted"));

    // Game signaling (server just relays)
    socket.on("game:request",    d  => socket.to(room).emit("game:request",  d));
    socket.on("game:accept",     d  => socket.to(room).emit("game:accept",   d));
    socket.on("game:decline",    () => socket.to(room).emit("game:decline"));
    socket.on("game:choice",     d  => socket.to(room).emit("game:choice",   d));
    socket.on("game:next-turn",  () => socket.to(room).emit("game:next-turn"));
    socket.on("game:end",        () => socket.to(room).emit("game:end"));
    socket.on("game:score",      d  => socket.to(room).emit("game:score",    d));
    socket.on("game:wyr-start",  d  => socket.to(room).emit("game:wyr-start",  d));
    socket.on("game:wyr-choice", d  => socket.to(room).emit("game:wyr-choice", d));
    socket.on("game:wyr-next",   d  => socket.to(room).emit("game:wyr-next",   d));
  });

  socket.on("disconnect", () => {
    if (currentRoom) socket.to(currentRoom).emit("partner-disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`TwoGether server on port ${PORT}`));
