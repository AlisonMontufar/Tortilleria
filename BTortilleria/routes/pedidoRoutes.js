const express = require('express');
const Pedido = require('../models/Pedido');
const router = express.Router();

router.post('/crear', async (req, res) => {
    console.log("📩 Datos recibidos en la solicitud:", JSON.stringify(req.body, null, 2)); // <-- Depuración

    const { subPedidos } = req.body;

    if (!Array.isArray(subPedidos) || subPedidos.length === 0) {
        console.log("❌ Error: No hay pedidos en la solicitud.");
        return res.status(400).json({ message: 'Se requiere al menos un pedido válido' });
    }

    for (const pedido of subPedidos) {
        console.log("🔍 Pedido recibido:", pedido); // <-- Verificar cada pedido individual

        if (!pedido.sucursal || !pedido.fechaHora || pedido.cantidad == null || !pedido.usuarioId) {
            console.log("⚠️ Pedido inválido detectado:", pedido);
            return res.status(400).json({ 
                message: 'Todos los campos son obligatorios', 
                pedidoRecibido: pedido 
            });
        }
    }

    try {
        const pedidosCreados = await Pedido.insertMany(subPedidos);
        console.log("✅ Pedidos creados correctamente:", pedidosCreados);
        res.status(201).json({ message: 'Pedidos creados exitosamente', pedidos: pedidosCreados });
    } catch (error) {
        console.error("❌ Error al insertar en la base de datos:", error);
        res.status(500).json({ message: 'Error al crear los pedidos', error });
    }
});


// 📌 Ruta para obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('usuarioId', 'username email'); // Ajuste en el populate
        res.status(200).json(pedidos);
    } catch (error) {
        console.error("❌ Error al obtener los pedidos:", error);
        res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
    }
});

module.exports = router;

router.put('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { sucursal, cantidad, fechaHora } = req.body; // ⬅ Asegurarnos de extraer fechaHora

    console.log("📩 Datos recibidos en la actualización:", req.body); // 🔍 Verifica qué datos llegan

    if (!sucursal || cantidad == null || !fechaHora) { // ⬅ Asegurarnos de que fechaHora no esté vacío
        return res.status(400).json({ message: 'Sucursal, cantidad y fechaHora son obligatorios' });
    }

    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            id,
            { sucursal, cantidad, fechaHora }, // ⬅ Incluir fechaHora en la actualización
            { new: true }
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Pedido actualizado', pedido: pedidoActualizado });
    } catch (error) {
        console.error("❌ Error al actualizar el pedido:", error);
        res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message });
    }
});



// 📌 Ruta para eliminar un pedido
router.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pedidoEliminado = await Pedido.findByIdAndDelete(id);

        if (!pedidoEliminado) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Pedido eliminado', pedido: pedidoEliminado });
    } catch (error) {
        console.error("❌ Error al eliminar el pedido:", error);
        res.status(500).json({ message: 'Error al eliminar el pedido', error: error.message });
    }
});

