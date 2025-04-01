import { FaTruck, FaTag } from "react-icons/fa";
import { DynamicCRUD } from "./DynamicCRUD";
import useUserPermissions from "../hooks/useUserPermissions";  // Importación del hook

const Proveedores = () => {
  // Usar el hook para obtener los permisos
  const { permisos } = useUserPermissions();

  // Si los permisos no están cargados aún, no mostramos el contenido
  if (!permisos) {
    return <div>Cargando...</div>;
  }

  // Definir las columnas para la tabla de proveedores
  const columns = [
    { key: "nombre", label: "Proveedor" },
    { key: "tipo", label: "Tipo", customRender: (value) => (
      <span className="badge bg-secondary">
        <FaTag /> {value}
      </span>
    )},
    { key: "contacto", label: "Teléfono" },
  ];

  // Datos iniciales de ejemplo
  const initialData = [
    { id: 1, nombre: "Maíz Plus", tipo: "Materia Prima", contacto: "555-1234" },
  ];

  // Obtener permisos del módulo 'proveedores' desde el array de permisos
  const modulo = "proveedores"; // Nombre del módulo que coincide con el backend
  const permisosModulo = permisos?.find((permiso) => permiso.modulo.nombreModulo.toLowerCase() === modulo) || {};

  // Si no se encuentran permisos para el módulo, mostrar un mensaje o bloquear acciones
  if (!permisosModulo) {
    return <div>No tienes permisos para gestionar proveedores.</div>;
  }

  return (
    <div className="card border-success shadow">
      <div className="card-header bg-success text-white">
        <h4 className="m-0"><FaTruck className="me-2" /> Proveedores</h4>
      </div>
      <div className="card-body">
        <DynamicCRUD 
          columns={columns} 
          initialData={initialData} 
          permisos={{
            crear: permisosModulo.acciones?.agregar || false,
            consultar: permisosModulo.acciones?.consultar || false,
            editar: permisosModulo.acciones?.editar || false,
            eliminar: permisosModulo.acciones?.eliminar || false,
          }}
        />
      </div>
    </div>
  );
};

export default Proveedores;
