const socketIO = require('socket.io');
const mediasoup = require('mediasoup'); // Import MediaSoup
const mediasoupConfig = require('./config/mediasoupConfig'); // Adjust the path if needed

const configureSocket = (server) => {
    const io = socketIO(server);

    // Create a MediaSoup worker instance
    const createWorker = async () => {
        const worker = await mediasoup.createWorker(mediasoupConfig.worker);

        worker.on('error', (error) => {
            console.error('MediaSoup Worker error:', error);
        });

        return worker;
    };

    // Initialize worker
    createWorker().then(worker => {
        // Optional: Set up routes for handling transport creation, producing, and consuming
        io.on('connection', (socket) => {
            console.log('New client connected');

            // Example of handling a custom event
            socket.on('createWebRTCTransport', async (callback) => {
                try {
                    const transport = await worker.createWebRTCTransport();
                    callback({ dtlsParameters: transport.dtlsParameters });
                } catch (error) {
                    console.error('Error creating transport:', error);
                    callback({ error: 'Failed to create transport' });
                }
            });

            // Handle WebRTC signaling
            socket.on('offer', (data) => {
                socket.broadcast.emit('offer', data);
            });

            socket.on('answer', (data) => {
                socket.broadcast.emit('answer', data);
            });

            socket.on('ice-candidate', (data) => {
                socket.broadcast.emit('ice-candidate', data);
            });

            socket.on('sendMessage', (message) => {
                console.log('Message received:', message);
                io.emit('message', message);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });

            // Error handling
            socket.on('error', (err) => {
                console.error('Socket error:', err);
            });
        });
    }).catch(err => {
        console.error('Failed to create MediaSoup worker:', err);
    });

    return io;
};

module.exports = configureSocket;
