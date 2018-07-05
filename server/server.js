//Server logic.
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} =require('./utils/message');
const {isRealString} = require('./utils/validation');

//Setup
const app = express();
const port = 3000;
const server = http.createServer(app);
var io = socketIO(server); //IO server is gooooo.

//Middleware
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));


//Routes...

//Event Listeners.
io.on('connection', (socket) => {
    console.log('User connected.');

    

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room are required.');
        }
        
        socket.join(params.room);

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatroom.'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('OK by Me -- Server');
    });

    socket.on('createLocationMessage', (coords) =>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected.');
    });
});

server.listen(port, () => {
    console.log('====================================');
    console.log(`Application running on port: ${port}`);
    console.log('====================================');

});