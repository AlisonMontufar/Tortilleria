import PropTypes from 'prop-types';
import ModulosTable from './ModulosTable';
import CrearUsuario from './CrearUsuario';

function WelcomePage({ user, onLogout }) {
    return (
        <div className="container mt-5">
            
            {/* Tarjeta de bienvenida */}
            <div className="card shadow-lg p-5 text-center">
                <h1 className="text-primary">Bienvenido, {user || 'Invitado'}!</h1>
                <p className="text-muted">Has iniciado sesión correctamente.</p>
                <button onClick={onLogout} className="btn btn-danger">
                    Cerrar sesión
                </button>
            </div>

            {/* Mostrar solo si el usuario es Pablo */}
            {user === 'Pablo' && (
                <div className="row mt-5">
                    <div className="col-lg-6">
                        <div className="card shadow-sm p-4 mb-4">
                            <h4 className="text-center text-secondary">Módulos</h4>
                            <ModulosTable />
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow-sm p-4 mb-4">
                            <h4 className="text-center text-secondary">Crear Usuario</h4>
                            <CrearUsuario />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

WelcomePage.propTypes = {
    user: PropTypes.string,
    onLogout: PropTypes.func.isRequired
};

export default WelcomePage;
