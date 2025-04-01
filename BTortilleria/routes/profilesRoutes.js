const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Perfil = require('../models/Perfil'); // Asegúrate de que esta ruta sea correcta


// Ruta para crear un perfil
router.post('/crear', async (req, res) => {
  try {
      // Validar que los módulos estén presentes y sean válidos
      const permisos = req.body.permisos;
      for (const permiso of permisos) {
          if (!mongoose.Types.ObjectId.isValid(permiso.modulo)) {
              return res.status(400).json({ message: `Modulo no válido: ${permiso.modulo}` });
          }
      }

      const nuevoPerfil = new Perfil(req.body);
      await nuevoPerfil.save();
      res.status(201).json(nuevoPerfil);
  } catch (error) {
      console.error("🔥 ERROR en la API:", error);
      res.status(500).json({
          message: "Error al crear el perfil",
          error: error.message
      });
  }
});


// Obtener todos los perfiles (solo los nombres de perfil)
router.get('/', async (req, res) => {
  try {
    const perfiles = await Perfil.find({}, 'nombrePerfil'); // Solo traer el nombre del perfil
    res.json(perfiles);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los perfiles.' });
  }
});


module.exports = router;
