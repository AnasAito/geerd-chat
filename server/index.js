const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
// to do
// object in db : room
// save message  to room
// admin should see just roomS where message list is not empty

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,

  addMsgToRoom,
  addRoom,
  getAllRooms
} = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connect", socket => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);
    addRoom(user.room);
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  socket.on("sendMessage", (message, to, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
      to: to
    });
    // save message to room object
    // addMsgToRoom(message, user.room);
    callback();
  });
  socket.on("getRooms", (message, callback) => {
    callback(getAllRooms());
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () => console.log(process.env.PORT));
