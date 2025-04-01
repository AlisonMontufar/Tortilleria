import { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

export const DynamicCRUD = ({ title, columns, initialData, permisos }) => {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isViewOnly, setIsViewOnly] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este elemento?")) {
      setData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  const handleShowModal = (item = null, viewOnly = false) => {
    setCurrentItem(item);
    setFormData(item || {});
    setIsViewOnly(viewOnly);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (currentItem) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentItem.id ? { ...formData, id: currentItem.id } : item
        )
      );
    } else {
      setData((prevData) => [...prevData, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="mt-4">
      <h2 className="text-center mb-4">{title}</h2>

      <div className="d-flex justify-content-between mb-3">
        {permisos.crear && (
          <Button variant="success" onClick={() => handleShowModal()}>
            + Nuevo
          </Button>
        )}
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.customRender ? col.customRender(item[col.key]) : item[col.key]}
                </td>
              ))}
              <td>
                {permisos.consultar && (
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(item, true)}
                  >
                    Consultar
                  </Button>
                )}
                {permisos.editar && (
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(item)}
                  >
                    Editar
                  </Button>
                )}
                {permisos.eliminar && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isViewOnly ? "Consultar" : currentItem ? "Editar" : "Nuevo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {columns.map((col) => (
              <Form.Group key={col.key} className="mb-3">
                <Form.Label>{col.label}</Form.Label>
                <Form.Control
                  type="text"
                  name={col.key}
                  value={formData[col.key] || ""}
                  onChange={handleChange}
                  readOnly={isViewOnly}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          {!isViewOnly && (
            <Button variant="primary" onClick={handleSave}>
              Guardar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DynamicCRUD;
