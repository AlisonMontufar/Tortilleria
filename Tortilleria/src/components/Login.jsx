import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    // Validación de los campos del formulario
    const validateForm = () => {
        let isValid = true;

        // Validar usuario o correo o teléfono
        if (!username.trim()) {
            setErrorUsername('El nombre de usuario, correo o teléfono es obligatorio.');
            isValid = false;
        } else {
            setErrorUsername('');
        }

        // Validar contraseña
        if (!password.trim()) {
            setErrorPassword('La contraseña es obligatoria.');
            isValid = false;
        } else if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setErrorPassword(
                'La contraseña debe tener al menos 8 caracteres, incluir un número y un carácter especial.'
            );
            isValid = false;
        } else {
            setErrorPassword('');
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage('Por favor, corrige los errores antes de continuar.');
            return;
        }

        try {
            // Enviar username (que puede ser usuario, correo o teléfono) y contraseña al backend
            const response = await axios.post('http://localhost:5000/api/users/login', {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token); // Guardar el token en localStorage
            setMessage('Inicio de sesión exitoso!');

            onLogin(username);  // Llamamos a la función para actualizar el estado en App.jsx
        } catch (error) {
            console.error('Error en la solicitud:', error);
            const errorMsg =
                error.response?.data?.message || 'Hubo un error al intentar iniciar sesión.';
            setMessage(errorMsg);
            navigate('/errorPage');
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mt-4">Inicio de Sesión</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group">
                    <label htmlFor="username">Usuario, Correo Electrónico o Teléfono</label>
                    <input
                        type="text"
                        id="username"
                        className={`form-control ${errorUsername ? 'is-invalid' : ''}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errorUsername && <div className="invalid-feedback">{errorUsername}</div>}
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        className={`form-control ${errorPassword ? 'is-invalid' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorPassword && <div className="invalid-feedback">{errorPassword}</div>}
                </div>

                <button type="submit" className="btn btn-primary mt-4 w-100">
                    Iniciar sesión
                </button>
            </form>

            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
}

export default Login;
