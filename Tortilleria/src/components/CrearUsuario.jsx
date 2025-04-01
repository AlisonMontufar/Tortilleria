import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Register from './Register'; // Asegúrate de tener el componente Register importado

const CrearUsuario = () => {
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal


  const handleRegisterSuccess = (username) => {
    console.log(`¡Registro exitoso! Bienvenido, ${username}.`);
    // Realiza otras acciones si es necesario, como redirigir al usuario o actualizar el estado
  };
  
  // Función para abrir el modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
  

  return (
    <div>
      {/* Botón para abrir el modal */}
      <Button variant="success" onClick={handleOpenModal}>
        Crear Usuario
      </Button>

      {/* Modal con el formulario de registro */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Register onRegisterSuccess={handleRegisterSuccess} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CrearUsuario;
