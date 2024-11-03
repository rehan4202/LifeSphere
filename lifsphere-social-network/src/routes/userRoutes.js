// src/routes/userRoutes.js

const express = require('express');
const User = require('../models/User'); // Import your User model

const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Create a new user
        const newUser = new User({ username, email, password });
        await newUser.save(); // This will create the collection if it doesn't exist
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
