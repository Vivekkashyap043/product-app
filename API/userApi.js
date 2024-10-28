const express = require('express');
const { hashSync, compareSync } = require('bcryptjs');
const router = express.Router();
const { connectToDatabase } = require('../config/db');

router.post('/register', async (req, res) => {
    try {
        const user = req.body;
        const db = await connectToDatabase(); // Reuse the existing database instance
        const userCollection = db.collection('users');
        console.log("user data ", user);

        const userExist = await userCollection.findOne({ username: user.username });

        if (userExist) {
            return res.status(409).json({ message: 'User Already exists' });
        }

        const newPassword = hashSync(user.password, 10); // Increased cost factor for better security
        user.password = newPassword;

        const insertRes = await userCollection.insertOne(user);
        if (!insertRes.acknowledged) { // Check if insertion was successful
            return res.status(500).json({ error: "Error in inserting record" });
        }
        return res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = req.body;
        const db = await connectToDatabase(); // Reuse the existing database instance
        const userCollection = db.collection('users');
        console.log("user data ", user);
        
        const userExist = await userCollection.findOne({ username: user.username });

        if (!userExist) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const passwordMatch = compareSync(user.password, userExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Username or Password is incorrect" });
        }
        return res.status(200).json({ message: "Login successful", userData: userExist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
