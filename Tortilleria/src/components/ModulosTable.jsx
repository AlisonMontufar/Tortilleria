import { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";

const ModulosTable = () => {
  const modulos = [
    { id: "67aaa1093e134c35b57aa600", nombre: "Empleados" },
    { id: "67aaa1093e134c35b57aa601", nombre: "Gastos" },
    { id: "67aaa1093e134c35b57aa602", nombre: "Ventas" },
    { id: "67aaa1093e134c35b57aa603", nombre: "Producción" },
    { id: "67aaa1093e134c35b57aa604", nombre: "Máquinas" },
    { id: "67aaa1093e134c35b57aa605", nombre: "Inventario" },
    { id: "67aaa1093e134c35b57aa606", nombre: "Proveedores" },
    { id: "67aaa1093e134c35b57aa607", nombre: "Clientes" },
    { id: "67aaa1093e134c35b57aa608", nombre: "Pedidos" },
  ];

  const [perfilNombre, setPerfilNombre] = useState("");
  const [permissions, setPermissions] = useState(
    modulos.reduce((acc, modulo) => {
      acc[modulo.id] = { agregar: false, editar: false, eliminar: false, consultar: false };
      return acc;
    }, {})
  );

  const handleCheckboxChange = (moduloId, action) => {
    setPermissions((prev) => ({
      ...prev,
      [moduloId]: { ...prev[moduloId], [action]: !prev[moduloId][action] },
    }));
  };

  const handleSubmit = async () => {
    if (!perfilNombre.trim()) {
      alert("El nombre del perfil es obligatorio.");
      return;
    }

    const perfil = {
      nombrePerfil: perfilNombre,
      permisos: modulos.map((modulo) => ({
        modulo: modulo.id, // Aquí se pasa solo el ID como cadena
        acciones: permissions[modulo.id],
      })),
    };

    try {
      const response = await fetch("https://btortilleria.onrender.com/api/perfiles/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfil),
      });

      if (response.ok) {
        alert("Perfil guardado correctamente.");
        setPerfilNombre("");
        setPermissions(
          modulos.reduce((acc, modulo) => {
            acc[modulo.id] = { agregar: false, editar: false, eliminar: false, consultar: false };
            return acc;
          }, {})
        );
      } else {
        const errorData = await response.json();
        alert("Error al guardar el perfil: " + errorData.message);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Ocurrió un error al intentar guardar el perfil.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Módulos</h2>
      
      <Form.Group className="mb-3">
        <Form.Label>Nombre del Perfil</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ejemplo: Administrador"
          value={perfilNombre}
          onChange={(e) => setPerfilNombre(e.target.value)}
        />
      </Form.Group>

      <Table striped bordered hover responsive>
        <thead className="thead-dark">
          <tr>
            <th>Módulo</th>
            <th>Agregar</th>
            <th>Editar</th>
            <th>Eliminar</th>
            <th>Consultar</th>
          </tr>
        </thead>
        <tbody>
          {modulos.map((modulo) => (
            <tr key={modulo.id}>
              <td>{modulo.nombre}</td>
              {["agregar", "editar", "eliminar", "consultar"].map((accion) => (
                <td key={accion}>
                  <input
                    type="checkbox"
                    checked={permissions[modulo.id][accion]}
                    onChange={() => handleCheckboxChange(modulo.id, accion)}
                    className="form-check-input"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={handleSubmit}>
        Guardar Perfil
      </Button>
    </div>
  );
};

export default ModulosTable;
