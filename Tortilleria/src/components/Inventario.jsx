import { FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";
import { DynamicCRUD } from "./DynamicCRUD";
import useUserPermissions from "../hooks/useUserPermissions";

const Inventario = () => {
  const { permisos } = useUserPermissions();

  if (!permisos) {
    return <div>Cargando...</div>;
  }

  const columns = [
    { key: "materia", label: "Materia Prima" },
    { key: "stock", label: "Stock (kg)", customRender: (value) => (
      value < 50 ? (
        <span className="text-danger">
          <FaExclamationTriangle /> {value} (Bajo)
        </span>
      ) : value
    )},
    { key: "proveedor", label: "Proveedor" },
  ];

  const initialData = [
    { id: 1, materia: "Harina de Maíz", stock: 25, proveedor: "Maíz Plus" },
  ];

  const permisosModulo = permisos?.find((permiso) => permiso.modulo.nombreModulo.toLowerCase() === "inventario") || {};

  if (!permisosModulo) {
    return <div>No tienes permisos para gestionar inventario.</div>;
  }

  return (
    <div className="card border-danger shadow">
      <div className="card-header bg-danger text-white">
        <h4 className="m-0"><FaBoxOpen className="me-2" /> Inventario</h4>
      </div>
      <div className="card-body">
        <DynamicCRUD 
          columns={columns} 
          initialData={initialData} 
          permisos={{
            crear: permisosModulo.acciones?.agregar || false,
            consultar: permisosModulo.acciones?.consultar || false,
            editar: permisosModulo.acciones?.editar || false,
            eliminar: permisosModulo.acciones?.eliminar || false
          }}
        />
      </div>
    </div>
  );
};

export default Inventario;
