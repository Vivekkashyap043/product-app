const express = require('express');
const {hashSync, compareSync} = require('bcryptjs')
const router = express.Router();
const { connectToDatabase } = require('../config/db');


router.post('/register', async(req, res) => {

    const user = req.body;
    const db = await connectToDatabase(); // Reuse the existing database instance
    const userCollection = db.collection('users');
    console.log("user data ", user)

    const userExist = await userCollection.findOne({username: user.username});

    if(userExist){
        return res.status(101).json({ message: 'User Already exist' });
    }

    const newPassword = hashSync(user.password, 4);
    user.password = newPassword;

    const insertRes = await userCollection.insertOne(user);
    if(!insertRes){
        return res.status(505).json({error: "error in inserting record"});
    }
    return res.status(202).json({message:"Registeration successful"})

})

router.post('/login', async(req, res) => {

    const user = req.body;
    const db = await connectToDatabase(); // Reuse the existing database instance
    const userCollection = db.collection('users');
    console.log("user data ", user)
    
    const userExist = await userCollection.findOne({username: user.username});

    if(!userExist){
        return res.status(101).json({ message: 'User not exist' });
    }
    


    const passwordMatch = compareSync(user.password, userExist.password);

    if(!passwordMatch){
        return res.status(606).json({error: "Username or Password is incorrect"});
    }
    return res.status(202).json({message:"Login successful"})

})

module.exports = router;