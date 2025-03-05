import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

function EliminarPedido({ pedidoId, onPedidoEliminado }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleDelete = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`https://btortilleria.onrender.com/api/pedidos/eliminar/${pedidoId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el pedido");
            }

            onPedidoEliminado(pedidoId);
        } catch (error) {
            setError(error.message);
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                className="btn btn-danger btn-sm"
                onClick={() => setShowConfirmModal(true)}
                disabled={loading}
            >
                {loading ? "Eliminando..." : "Eliminar"}
            </button>

            {/* Modal de Confirmación */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar este pedido?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>
                        {loading ? "Eliminando..." : "Eliminar"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Error */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{error}</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowErrorModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

EliminarPedido.propTypes = {
    pedidoId: PropTypes.string.isRequired,
    onPedidoEliminado: PropTypes.func.isRequired,
};

export default EliminarPedido;
