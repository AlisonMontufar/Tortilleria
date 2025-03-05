import PropTypes from 'prop-types';


function WelcomePage({ user, onLogout }) {
    return (
        <div>
            <div className="text-center mt-5">
                <h1>Bienvenido, {user}!</h1>
                <p>Has iniciado sesión correctamente.</p>
                <button onClick={onLogout} className="btn btn-danger">
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}

WelcomePage.propTypes = {
    user: PropTypes.string,
    onLogout: PropTypes.func.isRequired
};

export default WelcomePage;
