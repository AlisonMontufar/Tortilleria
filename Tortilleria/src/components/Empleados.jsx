import { DynamicCRUD } from "../components/DynamicCRUD";
import { FaUserTie, FaBusinessTime } from "react-icons/fa";
import useUserPermissions from "../hooks/useUserPermissions";  // Correcta importación

const Empleados = () => {
  // Usar el hook para obtener los permisos
  const { permisos } = useUserPermissions();

  // Si los permisos no están cargados aún, no mostramos el contenido
  if (!permisos) {
    return <div>Cargando...</div>; // O cualquier otro mensaje/loader
  }

  // Definir las columnas para la tabla de empleados
  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "puesto", label: "Puesto" },
    {
      key: "turno",
      label: "Turno",
      customRender: (value) => (
        <span className={`badge ${value === "Matutino" ? "bg-warning" : "bg-info"}`}>
          <FaBusinessTime /> {value}
        </span>
      ),
    },
  ];

  // Datos iniciales de ejemplo
  const initialData = [
    { id: 1, nombre: "Ana Torres", puesto: "Molendera", turno: "Matutino" },
    { id: 2, nombre: "Carlos Pérez", puesto: "Repartidor", turno: "Vespertino" },
  ];

  // Obtener permisos del módulo 'empleados' desde el array de permisos
  const modulo = "empleados"; // Nombre del módulo que coincide con el backend
  const permisosModulo = permisos?.find((permiso) => permiso.modulo.nombreModulo.toLowerCase() === modulo) || {};

  // Si no se encuentran permisos para el módulo, mostrar un mensaje o bloquear acciones
  if (!permisosModulo) {
    return <div>No tienes permisos para gestionar empleados.</div>;
  }

  return (
    <div className="card border-primary shadow">
      <div className="card-header bg-primary text-white">
        <h4 className="m-0">
          <FaUserTie className="me-2" /> Gestión de Empleados
        </h4>
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

export default Empleados;
