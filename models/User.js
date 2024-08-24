const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {type: String, required: [true, 'Username is required'], unique: true},
    password: {type: String, required: [true, 'Password is required']},
    role: { type: String, enum: ['reader', 'author', 'admin'], default: 'reader'}
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);


module.exports = User;