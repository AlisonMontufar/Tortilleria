import { Link } from 'react-router-dom';
import { useState } from 'react';

function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Mi Aplicación
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pedidos" onClick={() => setIsOpen(false)}>
                Pedidos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/crearPedido" onClick={() => setIsOpen(false)}>
                Crear Pedido
              </Link>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;