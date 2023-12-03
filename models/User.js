// const mongoose = require('mongoose')

// const User = mongoose.model('User', {
//     name: String,
//     email: String,
//     senha: String,
//     telefone: [{numero: String, ddd: String,}],
// })

// module.exports = User

/* global require, module */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    senha: String,
    telefone: [{numero: String, ddd: String,}],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
