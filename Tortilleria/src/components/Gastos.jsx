import { FaFileInvoiceDollar, FaChartPie } from "react-icons/fa";
import { DynamicCRUD } from "./DynamicCRUD";
import useUserPermissions from "../hooks/useUserPermissions";

const Gastos = () => {
  const { permisos } = useUserPermissions();

  if (!permisos) {
    return <div>Cargando...</div>;
  }

  const columns = [
    { key: "concepto", label: "Concepto" },
    { key: "monto", label: "Monto", customRender: (value) => (
      <span className="text-danger">
        <FaFileInvoiceDollar /> {value}
      </span>
    )},
  ];

  const initialData = [
    { id: 1, concepto: "Luz", monto: "$1,200" },
  ];

  const permisosModulo = permisos?.find((permiso) => permiso.modulo.nombreModulo.toLowerCase() === "gastos") || {};

  if (!permisosModulo) {
    return <div>No tienes permisos para gestionar gastos.</div>;
  }

  return (
    <div className="card border-dark shadow">
      <div className="card-header bg-dark text-white">
        <h4 className="m-0"><FaChartPie className="me-2" /> Gastos</h4>
      </div>
      <div className="card-body">
        <div className="mb-3 p-3 bg-light rounded">
          <h5>Total Octubre: <span className="text-danger">$8,500</span></h5>
        </div>
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

export default Gastos;
