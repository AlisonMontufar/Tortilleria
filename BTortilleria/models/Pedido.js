// models/Pedido.js
const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    sucursal: { type: String, required: true },
    fechaHora: { type: Date, required: true },
    cantidad: { type: Number, required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Relación con la colección de usuarios
});

module.exports = mongoose.model('Pedido', PedidoSchema);
