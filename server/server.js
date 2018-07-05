//Server logic.
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} =require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

//Setup
const app = express();
const port = 3000;
const server = http.createServer(app);
var io = socketIO(server); //IO server is gooooo.
let users = new Users();

//Middleware
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));


//Routes...

//Event Listeners.
io.on('connection', (socket) => {
    console.log('User connected.');

    

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room are required.');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatroom.'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        let user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback('OK by Me -- Server');
    });

    socket.on('createLocationMessage', (coords) =>{
        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left.`));
        }
        console.log('Client disconnected.');
    });
});

server.listen(port, () => {
    console.log('====================================');
    console.log(`Application running on port: ${port}`);
    console.log('====================================');

});