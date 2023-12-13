const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Chat = require('./models/chat');
const { validToken } = require("./middleware/auth");

const connectDatabase = require("./config/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use("/public", express.static("public"));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

connectDatabase();

const user = require("./routes/user");
const product = require("./routes/products");

app.use("/api/v1", user);
app.use("/api/v1", product);

app.post('/api/v1/chat', validToken, async (req, res) => {
  const { msg } = req.body;
  try {
    
      const chatMessage = new Chat({
        userId: req.user.id,
        message: msg,
        timestamp: new Date(),
      });
      await chatMessage.save();
      const token = req.header('Authorization');
      io.emit(token, chatMessage);
      res.status(200).json({ success: true, flag: country });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/v1/chatHistory', validToken, async (req, res) => {
  try {
    const chatHistory = await Chat.find({userId: req.user.id})
                        .populate({
                          path: 'userId',
                          select: 'username',
                        })
                        .sort({ timestamp: 1 });

    res.json(chatHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch chat history' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});