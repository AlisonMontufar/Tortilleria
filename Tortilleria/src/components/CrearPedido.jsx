import { useState } from 'react';
import Select from 'react-select';

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

function CrearPedido() {
    const [formData, setFormData] = useState({
        sucursal: null,
        fechaHora: '',
        cantidad: ''
    });

    const [subPedidos, setSubPedidos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const sucursalesOptions = [
        { value: 'Sucursal 105', label: 'Sucursal 105' },
        { value: 'Sucursal 106', label: 'Sucursal 106' },
        { value: 'Sucursal 107', label: 'Sucursal 107' }
    ];

    const getUsuarioId = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeToken(token);
            return decodedToken ? decodedToken.userId : null;
        }
        return null;
    };

    const handleChangeSucursal = (selectedOption) => {
        setFormData({ ...formData, sucursal: selectedOption });
    };

    const handleChangeFechaHora = (e) => {
        setFormData({ ...formData, fechaHora: e.target.value });
    };

    const handleChangeCantidad = (e) => {
        setFormData({ ...formData, cantidad: e.target.value });
    };

    const handleAddSubPedido = () => {
        // 🔴 VALIDACIONES antes de agregar un subpedido
        if (!formData.sucursal || !formData.fechaHora || !formData.cantidad) {
            setMensaje({ tipo: 'error', texto: 'Todos los campos son obligatorios.' });
            return;
        }

        if (isNaN(formData.cantidad) || Number(formData.cantidad) <= 0) {
            setMensaje({ tipo: 'error', texto: 'La cantidad debe ser un número mayor a 0.' });
            return;
        }

        const fechaSeleccionada = new Date(formData.fechaHora);
        const fechaActual = new Date();

        if (fechaSeleccionada <= fechaActual) {
            setMensaje({ tipo: 'error', texto: 'La fecha y hora deben ser posteriores a la actual.' });
            return;
        }

        const newSubPedidos = [...subPedidos];

        if (editIndex !== null) {
            newSubPedidos[editIndex] = formData;
            setEditIndex(null);
        } else {
            newSubPedidos.push(formData);
        }

        setSubPedidos(newSubPedidos);
        setFormData({ sucursal: null, fechaHora: '', cantidad: '' });
        setMensaje({ tipo: 'exito', texto: 'Subpedido agregado correctamente.' });

        // 🔄 Limpiar mensaje después de 3 segundos
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    };

    const handleEditSubPedido = (index) => {
        setFormData(subPedidos[index]);
        setEditIndex(index);
    };

    const handleDeleteSubPedido = (index) => {
        setSubPedidos(subPedidos.filter((_, i) => i !== index));
    };

    const handleCrearPedido = async () => {
        const usuarioId = getUsuarioId();
        
        // 🔴 VALIDACIÓN antes de crear el pedido
        if (!usuarioId) {
            setMensaje({ tipo: 'error', texto: 'No se pudo obtener el usuario. Inicia sesión nuevamente.' });
            return;
        }

        if (subPedidos.length === 0) {
            setMensaje({ tipo: 'error', texto: 'Debe haber al menos un subpedido antes de crear el pedido.' });
            return;
        }

        try {
            const pedidosConUsuario = subPedidos.map(pedido => ({
                sucursal: pedido.sucursal.value,
                fechaHora: pedido.fechaHora,
                cantidad: Number(pedido.cantidad),
                usuarioId
            }));

            console.log('📤 Enviando pedidos:', pedidosConUsuario);

            const response = await fetch('https://btortilleria.onrender.com/api/pedidos/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subPedidos: pedidosConUsuario })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear los pedidos');
            }

            setMensaje({ tipo: 'exito', texto: 'Pedidos creados exitosamente.' });
            setSubPedidos([]);

            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);

        } catch (error) {
            console.error('❌ Error al crear los pedidos:', error);
            setMensaje({ tipo: 'error', texto: error.message });

            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Crear Pedido</h2>
            <div className="card p-4 shadow-sm">
                
                {/* Mostrar mensaje de éxito o error */}
                {mensaje.texto && (
                    <div className={`alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-danger'}`} role="alert">
                        {mensaje.texto}
                    </div>
                )}

                <div className="form-group mb-3">
                    <label>Sucursal</label>
                    <Select value={formData.sucursal} onChange={handleChangeSucursal} options={sucursalesOptions} />
                </div>
                <div className="form-group mb-3">
                    <label>Fecha y Hora</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.fechaHora}
                        onChange={handleChangeFechaHora}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Cantidad (Kg)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={formData.cantidad}
                        onChange={handleChangeCantidad}
                    />
                </div>
                <button className="btn btn-primary w-100 mb-3" onClick={handleAddSubPedido}>
                    {editIndex !== null ? 'Actualizar Subpedido' : 'Agregar Subpedido'}
                </button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sucursal</th>
                            <th>Fecha y Hora</th>
                            <th>Cantidad (Kg)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subPedidos.map((pedido, index) => (
                            <tr key={index}>
                                <td>{pedido.sucursal?.label}</td>
                                <td>{new Date(pedido.fechaHora).toLocaleString()}</td>
                                <td>{pedido.cantidad}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditSubPedido(index)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSubPedido(index)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn btn-success w-100" onClick={handleCrearPedido}>Crear Pedido</button>
            </div>
        </div>
    );
}

export default CrearPedido;
