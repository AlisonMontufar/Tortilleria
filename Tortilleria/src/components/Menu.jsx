import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import useUserPermissions from '../hooks/useUserPermissions'; // Importamos el hook

function Menu() {
  const { permisos } = useUserPermissions(); // Obtenemos los permisos del hook

  useEffect(() => {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', function (event) {
        event.stopPropagation();
        this.parentElement.classList.toggle('show');
        this.nextElementSibling.classList.toggle('show');
      });
    });
  }, []);

  const tienePermisos = (acciones) => {
    return (
      acciones.agregar || 
      acciones.editar || 
      acciones.eliminar || 
      acciones.consultar
    );
  };

  const getModuloById = (id) => {
    return permisos.find(modulo => modulo.modulo._id === id);
  };

  // Si no hay permisos, no renderizamos el menú
  if (!permisos) return null;

  const mostrarSubmenu = (submodulos) => {
    // Verificamos si alguno de los submódulos tiene permisos activos
    return submodulos.some(submodulo => tienePermisos(getModuloById(submodulo.id).acciones));
  };

  const mostrarMenuNivelSuperior = (submodulos) => {
    // Verifica si algún submenú tiene permisos para mostrar el menú
    return submodulos.some(submodulo => tienePermisos(getModuloById(submodulo.id).acciones));
  };

  return (
    <div>
      <style>
        {`
          .dropdown-menu-end {
            position: absolute;
            left: 100%;
            top: 0;
            display: none;
          }
          .dropdown:hover > .dropdown-menu,
          .dropend:hover > .dropdown-menu {
            display: block;
          }
          .menu-icon {
            margin-right: 8px;
            width: 20px;
            text-align: center;
          }
        `}
      </style>
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand text-white fw-bold" to="/">
            <i className="fas fa-bread-slice me-2"></i>Tortillería MX
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  <i className="fas fa-home menu-icon"></i>Inicio
                </Link>
              </li>

              {/* Menú Administración */}
              {mostrarMenuNivelSuperior([
                { id: "67aaa1093e134c35b57aa600", name: "Empleados" },
                { id: "67aaa1093e134c35b57aa601", name: "Gastos" },
                { id: "67aaa1093e134c35b57aa602", name: "Ventas" }
              ]) && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle text-white" href="#" id="adminMenu" role="button" data-bs-toggle="dropdown">
                    <i className="fas fa-user-shield menu-icon"></i>Administración
                  </a>
                  <ul className="dropdown-menu bg-light shadow">
                    {/* Gestión de Personal */}
                    {mostrarSubmenu([
                      { id: "67aaa1093e134c35b57aa600", name: "Empleados" }
                    ]) && (
                      <li className="dropdown dropend">
                        <a className="dropdown-item dropdown-toggle" href="#" id="personalSubmenu" role="button" data-bs-toggle="dropdown">
                          Gestión de Personal
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end bg-light shadow">
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa600").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/empleados">Empleados</Link>
                            </li>
                          )}
                        </ul>
                      </li>
                    )}
                    {/* Gestión Financiera */}
                    {mostrarSubmenu([
                      { id: "67aaa1093e134c35b57aa601", name: "Gastos" },
                      { id: "67aaa1093e134c35b57aa602", name: "Ventas" }
                    ]) && (
                      <li className="dropdown dropend">
                        <a className="dropdown-item dropdown-toggle" href="#" id="finanzasSubmenu" role="button" data-bs-toggle="dropdown">
                          Gestión Financiera
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end bg-light shadow">
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa601").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/gastos">Gastos</Link>
                            </li>
                          )}
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa602").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/ventas">Ventas</Link>
                            </li>
                          )}
                        </ul>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {/* Menú Operaciones */}
              {mostrarMenuNivelSuperior([
                { id: "67aaa1093e134c35b57aa603", name: "Producción" },
                { id: "67aaa1093e134c35b57aa604", name: "Máquinas" },
                { id: "67aaa1093e134c35b57aa605", name: "Inventario" },
                { id: "67aaa1093e134c35b57aa606", name: "Proveedores" }
              ]) && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle text-white" href="#" id="operacionesMenu" role="button" data-bs-toggle="dropdown">
                    <i className="fas fa-cogs menu-icon"></i>Operaciones
                  </a>
                  <ul className="dropdown-menu bg-light shadow">
                    {/* Gestión de Producción */}
                    {mostrarSubmenu([
                      { id: "67aaa1093e134c35b57aa603", name: "Producción" },
                      { id: "67aaa1093e134c35b57aa604", name: "Máquinas" }
                    ]) && (
                      <li className="dropdown dropend">
                        <a className="dropdown-item dropdown-toggle" href="#" id="produccionSubmenu" role="button" data-bs-toggle="dropdown">
                          Gestión de Producción
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end bg-light shadow">
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa603").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/produccion">Producción</Link>
                            </li>
                          )}
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa604").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/maquinas">Máquinas</Link>
                            </li>
                          )}
                        </ul>
                      </li>
                    )}
                    {/* Gestión de Abastecimiento */}
                    {mostrarSubmenu([
                      { id: "67aaa1093e134c35b57aa605", name: "Inventario" },
                      { id: "67aaa1093e134c35b57aa606", name: "Proveedores" }
                    ]) && (
                      <li className="dropdown dropend">
                        <a className="dropdown-item dropdown-toggle" href="#" id="abastecimientoSubmenu" role="button" data-bs-toggle="dropdown">
                          Gestión de Abastecimiento
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end bg-light shadow">
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa605").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/inventario">Inventario</Link>
                            </li>
                          )}
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa606").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/proveedores">Proveedores</Link>
                            </li>
                          )}
                        </ul>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {/* Menú Comercialización */}
              {mostrarMenuNivelSuperior([
                { id: "67aaa1093e134c35b57aa607", name: "Clientes" },
                { id: "67aaa1093e134c35b57aa608", name: "Pedidos" }
              ]) && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle text-white" href="#" id="comercializacionMenu" role="button" data-bs-toggle="dropdown">
                    <i className="fas fa-truck menu-icon"></i>Comercialización
                  </a>
                  <ul className="dropdown-menu bg-light shadow">
                    {/* Relaciones con Clientes */}
                    {mostrarSubmenu([
                      { id: "67aaa1093e134c35b57aa607", name: "Clientes" }
                    ]) && (
                      <li className="dropdown dropend">
                        <a className="dropdown-item dropdown-toggle" href="#" id="clientesSubmenu" role="button" data-bs-toggle="dropdown">
                          Relaciones con Clientes
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end bg-light shadow">
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa607").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/clientes">Clientes</Link>
                            </li>
                          )}
                        </ul>
                      </li>
                    )}
                    {/* Logística de Pedidos */}
                    {mostrarSubmenu([
                      { id: "67aaa1093e134c35b57aa608", name: "Pedidos" }
                    ]) && (
                      <li className="dropdown dropend">
                        <a className="dropdown-item dropdown-toggle" href="#" id="pedidosSubmenu" role="button" data-bs-toggle="dropdown">
                          Logística de Pedidos
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end bg-light shadow">
                          {tienePermisos(getModuloById("67aaa1093e134c35b57aa608").acciones) && (
                            <li>
                              <Link className="dropdown-item" to="/pedidos">Pedidos</Link>
                            </li>
                          )}
                        </ul>
                      </li>
                    )}
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Menu;
