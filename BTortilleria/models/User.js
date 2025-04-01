const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    perfil: { type: mongoose.Schema.Types.ObjectId, ref: 'Perfil', required: true } // Referencia al perfil
});

module.exports = mongoose.model('User', UserSchema);
