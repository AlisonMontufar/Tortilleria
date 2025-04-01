const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const perfilSchema = new Schema({
    nombrePerfil: String,
    permisos: [{
        modulo: { type: Schema.Types.ObjectId, ref: 'Modulo' },
        acciones: {
            agregar: Boolean,
            editar: Boolean,
            eliminar: Boolean,
            consultar: Boolean
        }
    }]
});

const Perfil = mongoose.model('Perfil', perfilSchema, 'perfiles');

module.exports = Perfil; // Asegúrate de que el modelo esté exportado de esta manera
