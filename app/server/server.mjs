import { Server } from "socket.io";
import { insertMessageNormal } from "../firebase/functions/insert.mjs";
import express from "express";
import http from "http";
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected: ", socket.id);

  socket.on("init", (roomId) => {
    console.log("init: ", roomId);
    socket.join(roomId);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    insertMessageNormal(data);
    if (data.from_email !== data.to_email) {
      socket.to(data.roomId).emit("recieve_message", data);
    }
    const roomMembers = io.sockets.adapter.rooms.get(data.roomId);
    console.log(`Members in room ${data.roomId}:`, roomMembers);
  });
});
httpServer.listen(5000, "0.0.0.0", () => {
  console.log("listening on *:5000");
});
