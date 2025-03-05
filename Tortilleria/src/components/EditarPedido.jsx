import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal } from "bootstrap";

function EditarPedido({ pedido, onPedidoActualizado }) {
    const [cantidad, setCantidad] = useState(pedido.cantidad);
    const [sucursal, setSucursal] = useState(pedido.sucursal);
    const [fechaHora, setFechaHora] = useState(formatFechaHora(pedido.fechaHora));
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

    let modalInstance = null;

    useEffect(() => {
        const modalElement = document.getElementById(`modal-${pedido._id}`);
        if (modalElement) {
            modalInstance = new Modal(modalElement);
        }
    }, [pedido._id]);

    const abrirModal = () => {
        const modalElement = document.getElementById(`modal-${pedido._id}`);
        if (modalElement) {
            modalInstance = new Modal(modalElement);
            modalInstance.show();
        }
    };

    const cerrarModal = () => {
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    function formatFechaHora(fechaHora) {
        if (!fechaHora) return "";
        const date = new Date(fechaHora);
        return date.toISOString().slice(0, 16);
    }

    const handleCantidadChange = (e) => {
        setCantidad(e.target.value);
    };

    const handleFechaHoraChange = (e) => {
        setFechaHora(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: "", texto: "" });

        if (!sucursal || !fechaHora || !cantidad) {
            setMensaje({ tipo: "error", texto: "Todos los campos son obligatorios." });
            setLoading(false);
            return;
        }

        if (isNaN(cantidad) || Number(cantidad) <= 0) {
            setMensaje({ tipo: "error", texto: "La cantidad debe ser un número mayor a 0." });
            setLoading(false);
            return;
        }

        const fechaSeleccionada = new Date(fechaHora);
        const fechaActual = new Date();

        if (fechaSeleccionada <= fechaActual) {
            setMensaje({ tipo: "error", texto: "La fecha y hora deben ser posteriores a la actual." });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://btortilleria.onrender.com/api/pedidos/editar/${pedido._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cantidad: Number(cantidad), sucursal, fechaHora }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar el pedido.");
            }

            const data = await response.json();
            onPedidoActualizado(data);
            setMensaje({ tipo: "exito", texto: "Pedido actualizado correctamente." });

            setTimeout(() => {
                cerrarModal();
                setMensaje({ tipo: "", texto: "" });
            }, 1500);
        } catch (error) {
            setMensaje({ tipo: "error", texto: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button className="btn btn-warning btn-sm" onClick={abrirModal}>
                Editar
            </button>

            <div className="modal fade" id={`modal-${pedido._id}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Editar Pedido</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {mensaje.texto && (
                                <div className={`alert ${mensaje.tipo === "exito" ? "alert-success" : "alert-danger"}`}>
                                    {mensaje.texto}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Sucursal:</label>
                                    <input type="text" className="form-control" value={sucursal} onChange={(e) => setSucursal(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Cantidad (Kg):</label>
                                    <input type="number" className="form-control" value={cantidad} onChange={handleCantidadChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha y Hora:</label>
                                    <input type="datetime-local" className="form-control" value={fechaHora} onChange={handleFechaHoraChange} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

EditarPedido.propTypes = {
    pedido: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        cantidad: PropTypes.number.isRequired,
        sucursal: PropTypes.string.isRequired,
        fechaHora: PropTypes.string.isRequired,
    }).isRequired,
    onPedidoActualizado: PropTypes.func.isRequired,
};

export default EditarPedido;