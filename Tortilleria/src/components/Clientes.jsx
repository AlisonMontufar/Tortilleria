import { FaUsers, FaCrown } from "react-icons/fa";
import { DynamicCRUD } from "./DynamicCRUD";
import useUserPermissions from "../hooks/useUserPermissions";

const Clientes = () => {
  const { permisos } = useUserPermissions();

  if (!permisos) {
    return <div>Cargando...</div>;
  }

  const columns = [
    { key: "nombre", label: "Cliente" },
    { key: "tipo", label: "Tipo", customRender: (value) => (
      value === "Corporativo" ? (
        <span className="badge bg-purple">
          <FaCrown /> {value}
        </span>
      ) : (
        <span className="badge bg-info">
          {value}
        </span>
      )
    )},
  ];

  const initialData = [
    { id: 1, nombre: "Taquería El Güero", tipo: "Corporativo" },
  ];

  const permisosModulo = permisos?.find((permiso) => permiso.modulo.nombreModulo.toLowerCase() === "clientes") || {};

  if (!permisosModulo) {
    return <div>No tienes permisos para gestionar clientes.</div>;
  }

  return (
    <div className="card border-purple shadow">
      <div className="card-header bg-purple text-white">
        <h4 className="m-0"><FaUsers className="me-2" /> Clientes</h4>
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

export default Clientes;
