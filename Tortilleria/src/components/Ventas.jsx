import { FaMoneyBillWave, FaDollarSign } from "react-icons/fa";
import { DynamicCRUD } from "./DynamicCRUD";
import useUserPermissions from "../hooks/useUserPermissions";  // Importación del hook

const Ventas = () => {
  // Usar el hook para obtener los permisos
  const { permisos } = useUserPermissions();

  // Si los permisos no están cargados aún, no mostramos el contenido
  if (!permisos) {
    return <div>Cargando...</div>;
  }

  // Definir las columnas para la tabla de ventas
  const columns = [
    { key: "folio", label: "Folio" },
    { key: "cliente", label: "Cliente" },
    { key: "total", label: "Total", customRender: (value) => (
      <span className="text-success">
        <FaDollarSign /> {value}
      </span>
    )},
  ];

  // Datos iniciales de ejemplo
  const initialData = [
    { id: 1, folio: "V-001", cliente: "Restaurante Mex", total: 1250 },
  ];

  // Obtener permisos del módulo 'ventas' desde el array de permisos
  const modulo = "ventas"; // Nombre del módulo que coincide con el backend
  const permisosModulo = permisos?.find((permiso) => permiso.modulo.nombreModulo.toLowerCase() === modulo) || {};

  // Si no se encuentran permisos para el módulo, mostrar un mensaje o bloquear acciones
  if (!permisosModulo) {
    return <div>No tienes permisos para gestionar ventas.</div>;
  }

  return (
    <div className="card border-info shadow">
      <div className="card-header bg-info text-white">
        <h4 className="m-0"><FaMoneyBillWave className="me-2" /> Ventas</h4>
      </div>
      <div className="card-body">
        <div className="mb-3 p-3 bg-light rounded">
          <h5>Total Hoy: <span className="text-success">$5,320</span></h5>
        </div>
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

export default Ventas;
