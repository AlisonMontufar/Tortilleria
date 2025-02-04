import { useNavigate } from 'react-router-dom';

function ErrorPage() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <div className="container">
      <div className="alert alert-danger mt-3">
        <h2>Error de inicio de sesión</h2>
        <p>Hubo un problema al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.</p>
        <button className="btn btn-primary" onClick={goHome}>Volver al inicio</button>
      </div>
    </div>
  );
}

export default ErrorPage;
