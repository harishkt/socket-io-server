const express = require('express');
const http = require('http');
const axios = require('axios');
const socketIO = require('socket.io');
const socketHandler = require('./socket');
const app = express();
const server = http.createServer(app);

const io = socketIO(server);


server.listen(4001, () => console.log('Listening to port: 4001'));

app.get('/', (req,res) => {
	res.send({ response: 'I am fine'}).status(200);
});

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://radiant-tor-38672.herokuapp.com");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

io.on('connection',socket => socketHandler(io, socket));
