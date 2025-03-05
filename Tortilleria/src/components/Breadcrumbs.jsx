import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

function Breadcrumbs() {
  const location = useLocation(); // Obtiene la ruta actual

  const breadcrumbMap = {
    "/": "Inicio de Sesión",
    "/register": "Registro",
    "/app": "Inicio",
    "/pedidos": "Pedidos",
    "/crearPedido": "Crear Pedido",
    "/errorPage": "Error",
    "/errorPageRegister": "Error de Registro",
  };

  return (
    <Breadcrumb className="mt-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        Inicio
      </Breadcrumb.Item>
      {location.pathname !== "/" && (
        <Breadcrumb.Item active>
          {breadcrumbMap[location.pathname] || "Página"}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}

export default Breadcrumbs;