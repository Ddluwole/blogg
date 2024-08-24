const express = require('express')
const mongoose = require('mongoose')
const app = express()

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });



app.use(express.json());
const secretKey = process.env.JWT_SECRET;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const blogRoutes = require('./routes/blogs')
app.use('/api/', blogRoutes);

app.get('/', (req, res) => {
    res.send(`Hello, Welcome to Omotola's Blog`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


