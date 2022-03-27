const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log(socket.id);
})

server.listen(4000, () => console.log('Listing on 4000'));

