import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ErrorPage from './components/ErrorPage';
import ErrorPageRegister from './components/ErrorPageRegister';
import Breadcrumbs from './components/Breadcrumbs';
import WelcomePage from './components/WelcomePage';

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Para redirigir tras registro

    const handleLogin = (username) => {
        setUser(username);
    };

    const handleRegisterSuccess = (username) => {
        setUser(username);
        navigate("/");  // Redirige a la pantalla principal tras registro
    };

    return (
        <div className="container">
            <Breadcrumbs />  {/* Mostramos los Breadcrumbs arriba */}

            {!user ? (
                <Routes>
                    <Route path="/" element={
                        <div className="row justify-content-center mt-5">
                            <div className="col-md-6">
                                <Login onLogin={handleLogin} />
                                <div className="text-center mt-3">
                                    <p>No tienes cuenta?</p>
                                    <Link to="/register" className="btn btn-primary">Registrarse</Link>
                                </div>
                            </div>
                        </div>
                    } />
                    <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
                </Routes>
            ) : (
                <WelcomePage user={user} onLogout={() => setUser(null)} />
            )}

            <Routes>
                <Route path="/errorPage" element={<ErrorPage />} />
                <Route path="/errorPageRegister" element={<ErrorPageRegister />} />
            </Routes>
        </div>
    );
}

export default App;
