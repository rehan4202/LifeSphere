const socketIO = require('socket.io');

const configureSocket = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('New client connected');

        // Optional: Storing user information (if applicable)
        socket.on('register', (userData) => {
            console.log('User registered:', userData);
            // Store user data or handle user session here
        });

        // WebRTC Signaling
        socket.on('offer', (data) => {
            socket.broadcast.emit('offer', data); // Send offer to other peer
        });

        socket.on('answer', (data) => {
            socket.broadcast.emit('answer', data); // Send answer to other peer
        });

        socket.on('ice-candidate', (data) => {
            socket.broadcast.emit('ice-candidate', data); // Send ICE candidates to other peer
        });

        // Example of handling a custom event
        socket.on('sendMessage', (message) => {
            console.log('Message received:', message);
            // Emit the message to all connected clients (or to a specific namespace)
            io.emit('message', message); // You can also send to specific rooms
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        // Error handling
        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    });

    return io;
};

module.exports = configureSocket;
