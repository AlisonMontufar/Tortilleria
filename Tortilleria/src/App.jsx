import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ErrorPage from './components/ErrorPage';
import ErrorPageRegister from './components/ErrorPageRegister';
import WelcomePage from './components/WelcomePage';
import Layout from './components/Layout';
import CrearPedido from './components/CrearPedido';
import Pedidos from './components/Pedidos';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cargar usuario almacenado en localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("user", username); // Guarda usuario en localStorage
  };

  const handleRegisterSuccess = (username) => {
    setUser(username);
    localStorage.setItem("user", username);
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Elimina usuario de localStorage
  };

  return (
    <Layout user={user}>
      {!user ? (
        <Routes>
          <Route
            path="/"
            element={
              <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                  <Login onLogin={handleLogin} />
                  <div className="text-center mt-3">
                    <p>No tienes cuenta?</p>
                    <Link to="/register" className="btn btn-primary">
                      Registrarse
                    </Link>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/register"
            element={<Register onRegisterSuccess={handleRegisterSuccess} />}
          />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<WelcomePage user={user} onLogout={handleLogout} />} />
          <Route path="/crearPedido" element={<CrearPedido />} />
          <Route path="/pedidos" element={<Pedidos />} />
        </Routes>
      )}

      <Routes>
        <Route path="/errorPage" element={<ErrorPage />} />
        <Route path="/errorPageRegister" element={<ErrorPageRegister />} />
      </Routes>
    </Layout>
  );
}

export default App;
