import { useEffect, useState } from "react";
import EditarPedido from "./EditarPedido";
import EliminarPedido from "./EliminarPedido";

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [habilitarEditar, setHabilitarEditar] = useState(false);
    const [habilitarEliminar, setHabilitarEliminar] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const response = await fetch("https://btortilleria.onrender.com/api/pedidos/");
            if (!response.ok) {
                throw new Error("No se pudieron obtener los pedidos. Intenta nuevamente.");
            }
            const data = await response.json();
            setPedidos(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // 🔹 ACTUALIZA LA LISTA DESPUÉS DE EDITAR
    const handlePedidoActualizado = () => {
        fetchPedidos(); // Recargar la lista después de una actualización
    };

    // 🔹 ELIMINA EL PEDIDO Y RECARGA LA LISTA
    const handlePedidoEliminado = () => {
        fetchPedidos();
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Pedidos</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-check form-switch mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="habilitarEditar"
                    checked={habilitarEditar}
                    onChange={() => setHabilitarEditar(!habilitarEditar)}
                />
                <label className="form-check-label" htmlFor="habilitarEditar">
                    Habilitar Editar
                </label>
            </div>

            <div className="form-check form-switch mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="habilitarEliminar"
                    checked={habilitarEliminar}
                    onChange={() => setHabilitarEliminar(!habilitarEliminar)}
                />
                <label className="form-check-label" htmlFor="habilitarEliminar">
                    Habilitar Eliminar
                </label>
            </div>

            <div className="row">
                {pedidos.map((pedido) => (
                    <div key={pedido._id} className="col-md-4 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">PEDIDO {pedido._id.slice(-3)}</h5>
                                <p className="card-text">
                                    <strong>Sucursal:</strong> {pedido.sucursal} <br />
                                    <strong>Fecha y Hora:</strong>{" "}
                                    {new Date(pedido.fechaHora).toLocaleString("es-MX", {
                                        year: "numeric",
                                        month: "long",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                        timeZone: "America/Mexico_City",
                                    })} <br />
                                    <strong>Cantidad:</strong> {pedido.cantidad} Kg <br />
                                    <strong>Usuario:</strong> {pedido.usuarioId?.username || "Desconocido"}
                                </p>

                                <div className="d-flex justify-content-between">
                                    {habilitarEditar && (
                                        <EditarPedido pedido={pedido} onPedidoActualizado={handlePedidoActualizado} />
                                    )}
                                    {habilitarEliminar && (
                                        <EliminarPedido pedidoId={pedido._id} onPedidoEliminado={handlePedidoEliminado} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pedidos;
