//Server logic.
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
//Setup
const app = express();
const port = 3000;
const server = http.createServer(app);
var io = socketIO(server); //IO server is gooooo.

//Middleware
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
// console.log('====================================');
// console.log(__dirname + '../public');
// console.log('====================================');
// console.log(publicPath);

//Routes...

//Event Listeners.
io.on('connection', (socket) => {
    console.log('User connected.');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected.');
    })
})

server.listen(port, () => {
    console.log('====================================');
    console.log(`Application running on port: ${port}`);
    console.log('====================================');
});