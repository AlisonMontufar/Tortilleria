import Menu from './Menu'; // Importa tu componente Menu
import Breadcrumbs from './Breadcrumbs'; // Importa tu componente Breadcrumbs

const Layout = ({ user, children }) => {
  return (
    <div className="container">
      {user && <Menu />} {/* El Navbar solo se muestra si el usuario está logueado */}
      <Breadcrumbs /> {/* Los Breadcrumbs siempre se muestran */}
      <main>{children}</main> {/* Aquí se renderiza el contenido de cada ruta */}
    </div>
  );
};

export default Layout;