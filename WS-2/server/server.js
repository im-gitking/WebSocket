//
const { instrument } = require('@socket.io/admin-ui');

// importing socket.io 
// then listening on 3000 port for any incomming WebSocket messages
const io = require('socket.io')(3000, {
    cors: {
        // origin: ["https://admin.socket.io"],
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
});

// create a namespace
// we can do everything like normal io here but for a route '/user'
const userIo = io.of('/user');
userIo.on('connection', socket => {
    console.log('connected to user namespace with username: ' + socket.username);
});

// create middleware --> middlewares get executed first before eventListners (or userIo.on)
// use for authentication
userIo.use((socket, next) => {
    if (socket.handshake.auth.token) {
        socket.username = getUsernameFromToken(socket.handshake.auth.token);
        next();
    } else {
        // if error occors it will throw this response to Client
        // example: if token not sent, it will throw error
        next(new Error('Please send token'));
    }
});

function getUsernameFromToken(token) {
    return token
}

// 'connection' -> event
// when any 'connection' gets established, callback is 'socket'
// 'socket' contains all data about each established connection
io.on('connection', (socket) => {
    // connection id
    console.log(socket.id);

    // Read all data from incomming requests by events
    // custon-event is a event, that is part of connection
    socket.on('send-message', (message, room) => {
        console.log(message);
        // io.emit('recieved-message', message);
        // if don't have room id
        if (room === '') {
            socket.broadcast.emit('recieved-message', message);
        }
        // if have room id
        else {
            socket.to(room).emit('recieved-message', message)
        }
    });

    socket.on("connect_error", (err) => { // the reason of the error, for example "xhr poll error" 
        console.log(err.message)
    });

    // joining room
    socket.on('join-room', (room, cb) => {
        socket.join(room);
        cb(`Joined ${room}`);
    });

    socket.on('ping', n => console.log(n));
});

instrument(io, { auth: false });