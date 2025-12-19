const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const pollRoutes=require('./routes/polls.js');

const http=require('http');
const {Server} = require ('socket.io');
const { Socket } = require('dgram');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

const server =http.createServer(app);

const io=new Server (server , {
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"]
  }
});

io.on('connection',(socket) =>{
  console.log('A user connected:',socket.id);

  socket.on('disconnect',() =>{
    console.log('User disconnected:',socket.id);
  });
}) ;

//make io acessible in the routes so we can emit events from polls.js
app.set('socketio',io);

//routes 
app.use('/api/polls',pollRoutes);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Live Poll API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});