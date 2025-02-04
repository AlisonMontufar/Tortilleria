const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); // Importa las rutas

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Usar las rutas
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión', err));

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
