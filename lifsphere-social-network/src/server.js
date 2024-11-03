const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const configureSocket = require('./socket'); // Import the socket configuration
const userRoutes = require('./routes/userRoutes'); // Import user routes

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = configureSocket(server); // Initialize Socket.IO

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use User Routes
app.use('/api/users', userRoutes); // Prefix the user routes

// Optional: Health check route
app.get('/health', (req, res) => {
    res.status(200).send('Server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.stack); // Log error stack
    res.status(err.status || 500).json({ error: err.message || 'Something broke!' }); // Send error response
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Optional: Socket.IO error handling
io.on('error', (err) => {
    console.error('Socket.IO error:', err);
});
