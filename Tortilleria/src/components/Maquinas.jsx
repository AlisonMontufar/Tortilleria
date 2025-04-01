import { FaTools, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { DynamicCRUD } from "./DynamicCRUD";
import useUserPermissions from "../hooks/useUserPermissions";  // Importación del hook

const Maquinas = () => {
  // Usar el hook para obtener los permisos
  const { permisos } = useUserPermissions();

  // Si los permisos no están cargados aún, no mostramos el contenido
  if (!permisos) {
    return <div>Cargando...</div>;
  }

  // Definir las columnas para la tabla de máquinas
  const columns = [
    { key: "nombre", label: "Máquina" },
    { key: "estado", label: "Estado", customRender: (value) => (
      value === "Activa" ? (
        <span className="text-success">
          <FaCheckCircle /> {value}
        </span>
      ) : (
        <span className="text-danger">
          <FaExclamationCircle /> {value}
        </span>
      )
    )},
  ];

  // Datos iniciales de ejemplo
  const initialData = [
    { id: 1, nombre: "Máquina Tortilladora MX-200", estado: "Activa" },
  ];

  // Obtener permisos del módulo 'maquinas' desde el array de permisos
  const modulo = "máquinas"; // Nombre del módulo que coincide con el backend
  const permisosModulo = permisos?.find((permiso) => permiso.modulo.nombreModulo.toLowerCase() === modulo) || {};

  // Si no se encuentran permisos para el módulo, mostrar un mensaje o bloquear acciones
  if (!permisosModulo) {
    return <div>No tienes permisos para gestionar máquinas.</div>;
  }

  return (
    <div className="card border-secondary shadow">
      <div className="card-header bg-secondary text-white">
        <h4 className="m-0"><FaTools className="me-2" /> Máquinas</h4>
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

export default Maquinas;
