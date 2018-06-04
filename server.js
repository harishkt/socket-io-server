const express = require('express');
const http = require('http');
const axios = require('axios');
const socketIO = require('socket.io');
const socketHandler = require('./socket');
const app = express();
const server = http.createServer(app);

const io = socketIO(server);
const port = process.env.PORT || 3000

server.listen(port, () => console.log(`Listening to port: ${port}`));

app.get('/', (req,res) => {
	res.send({ response: 'I am fine'}).status(200);
});

io.on('connection',socket => socketHandler(io, socket));
