const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Ruta para registro
router.post('/register', async (req, res) => {
    const { firstName, lastName, username, email, phone, password } = req.body;

    // Verificar si el usuario, email o teléfono ya existen
    const userExists = await User.findOne({
        $or: [{ username }, { email }, { phone }]
    });
    if (userExists) {
        return res.status(400).json({ message: 'El usuario, email o teléfono ya están registrados' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({ firstName, lastName, username, email, phone, password: hashedPassword });

    try {
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro', error });
    }
});



// Ruta para inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Buscar al usuario por username, email o phone
    const user = await User.findOne({
        $or: [{ username }, { email: username }, { phone: username }]
    });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Comparar la contraseña ingresada con la encriptada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
});

module.exports = router;
