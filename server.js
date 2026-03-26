'use strict';

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware for parsing JSON requests
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// User management (mocked for demo purposes)
let users = [];

app.post('/register', (req, res) => {
    const { username } = req.body;
    if (!username || users.includes(username)) {
        return res.status(400).send('Invalid or duplicate username.');
    }
    users.push(username);
    res.status(201).send('User registered successfully.');
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (users.includes(username)) {
        res.status(200).send('User logged in successfully.');
    } else {
        res.status(404).send('User not found.');
    }
});

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Admin panel endpoint — simply for demo purposes
app.get('/admin', (req, res) => {
    res.send('Admin panel');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
