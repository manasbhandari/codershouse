const dotenv = require("dotenv");
const express = require("express");
const app = express();
const router = require("./routes");
const DbConnect = require("./database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ACTIONS = require("./actions");
const path = require("path");

const server = require("http").createServer(app);
dotenv.config();

const io = require("socket.io")(server , {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cookieParser());

const corsOption = {
  credentials: true,
  origin: ["http://localhost:3000"],
};

app.use(cors(corsOption));
app.use(express.json({ limit: "50mb" }));
app.use('/storage' , express.static('storage'));

const PORT = process.env.PORT || 8000;
app.use(router);

DbConnect();

// app.get("/", (req, res) => {
//   res.send("Hello from express js");
// });

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

//socket connection
const socketUserMap = {};

io.on('connection', (socket) => {
  console.log('New connection', socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
      socketUserMap[socket.id] = user;
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
          io.to(clientId).emit(ACTIONS.ADD_PEER, {
              peerId: socket.id,
              createOffer: false,
              user,
          });
          socket.emit(ACTIONS.ADD_PEER, {
              peerId: clientId,
              createOffer: true,
              user: socketUserMap[clientId],
          });
      });
      socket.join(roomId);
  });

  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
      io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
          peerId: socket.id,
          icecandidate,
      });
  });

  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
      io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
          peerId: socket.id,
          sessionDescription,
      });
  });

  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
          io.to(clientId).emit(ACTIONS.MUTE, {
              peerId: socket.id,
              userId,
          });
      });
  });

  socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
          io.to(clientId).emit(ACTIONS.UNMUTE, {
              peerId: socket.id,
              userId,
          });
      });
  });

  socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
          if (clientId !== socket.id) {
              console.log('mute info');
              io.to(clientId).emit(ACTIONS.MUTE_INFO, {
                  userId,
                  isMute,
              });
          }
      });
  });

  const leaveRoom = () => {
    const { rooms } = socket;
    Array.from(rooms).forEach((roomId) => {
        const clients = Array.from(
            io.sockets.adapter.rooms.get(roomId) || []
        );
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                peerId: socket.id,
                userId: socketUserMap[socket.id]?.id,
            });

            socket.emit(ACTIONS.REMOVE_PEER, {
                peerId: clientId,
                userId: socketUserMap[clientId]?.id,
            });
        });
        socket.leave(roomId);
    });
    delete socketUserMap[socket.id];
};
console.log('leave room');
socket.on(ACTIONS.LEAVE, leaveRoom);

socket.on('disconnecting', leaveRoom);
 });

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

