const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes'); // Importa las rutas de pedidos
const profilesRoutes = require('./routes/profilesRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Rutas de pedidos
app.use('/api/pedidos', pedidoRoutes);

app.use("/api/perfiles", profilesRoutes);

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => {
        console.error('Error de conexión a MongoDB:', err);
        process.exit(1); // Terminar la aplicación si la conexión falla
    });

// Verificación de disponibilidad
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
