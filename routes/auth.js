const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;


// router.post('/register', async (req, res) => {
//     const { username, password, role} = req.body;
//     try{
//         const user= new User({username, password, role});
//         await user.save();
//         return res.status(201).send('User registered');
//     } catch(error){
//         res.status(400).send(error.message);
//     }
// });
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Check if the username already exists
        console.log('Received registration request:', req.body);
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Username already taken');
            return res.status(400).send('Username already taken');
        }

        // Create a new user and save it to the database
        const user = new User({ username, password, role });
        await user.save();

        // Send a success response
        console.log('User registered successfully:', user);
        res.status(201).send('User registered');
    } catch (error) {
        console.error('Error during registration:', error); // Log the error for debugging
        res.status(500).send('An error occurred while processing your request.');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).send('Invalid credentials'); // Use return to stop further execution
        }

        // If the credentials are valid, generate a token
        const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
        return res.send({ token });
    } catch (error) {
        console.error('Error during login:', error); // Log the error for debugging
        res.status(500).send('An error occurred while processing your request.');
    }
});

// router.post('/login', async (req, res) => {
//     const {username, password}= req.body;
//     try {
//         const user = await User.findOne({username});
//         if (!user || !await bcrypt.compare(password, user.password)){
//             res.status(201).send('Invalid Credentials');
//         }
//         const token = jwt.sign({ userId: user._id, role:user.role}, 'secretKey');
//         return res.send({token});
//     } catch(error){
//         res.status(400).send(error.message);
//     }
// })

module.exports = router;