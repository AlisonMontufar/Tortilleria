const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Ruta para registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Usuario ya existe' });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({ username, password: hashedPassword });

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

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
});

module.exports = router;
