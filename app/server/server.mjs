import { Server } from "socket.io";

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000",
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
    // Check if the sender is not the recipient
    if (data.from_email !== data.to_email) {
      socket.to(data.roomId).emit("recieve_message", data);
    }
    // Log all members in the room
    const roomMembers = io.sockets.adapter.rooms.get(data.roomId);
    console.log(`Members in room ${data.roomId}:`, roomMembers);
  });
});
