import { FaBreadSlice } from "react-icons/fa";
import { DynamicCRUD } from "./DynamicCRUD";
import useUserPermissions from "../hooks/useUserPermissions";  // Importación del hook

const Produccion = () => {
  // Usar el hook para obtener los permisos
  const { permisos } = useUserPermissions();

  // Si los permisos no están cargados aún, no mostramos el contenido
  if (!permisos) {
    return <div>Cargando...</div>;
  }

  // Definir las columnas para la tabla de producción
  const columns = [
    { key: "fecha", label: "Fecha" },
    { key: "lote", label: "Lote" },
    { key: "kg", label: "Producción (kg)", customRender: (value) => (
      <div className="d-flex align-items-center">
        <div 
          className="bg-orange rounded me-2" 
          style={{ width: `${value}px`, height: "20px" }} 
        />
        {value}
      </div>
    )},
  ];

  // Datos iniciales de ejemplo
  const initialData = [
    { id: 1, fecha: "2023-10-01", lote: "T-001", kg: 150 },
  ];

  // Obtener permisos del módulo 'produccion' desde el array de permisos
  const modulo = "producción"; // Nombre del módulo que coincide con el backend
  const permisosModulo = permisos?.find((permiso) => permiso.modulo.nombreModulo.toLowerCase() === modulo) || {};

  // Si no se encuentran permisos para el módulo, mostrar un mensaje o bloquear acciones
  if (!permisosModulo) {
    return <div>No tienes permisos para gestionar producción.</div>;
  }

  return (
    <div className="card border-warning shadow">
      <div className="card-header bg-warning text-dark">
        <h4 className="m-0"><FaBreadSlice className="me-2" /> Producción Diaria</h4>
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

export default Produccion;
