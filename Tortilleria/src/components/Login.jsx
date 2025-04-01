import { useState } from 'react';
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
            const response = await fetch('https://btortilleria.onrender.com/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la autenticación');
            }

            const data = await response.json();

            // Guardar token, usuario y permisos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));  
            localStorage.setItem('permisos', JSON.stringify(data.user.permisos));

            console.log("User localstore:",data);

            setMessage('Inicio de sesión exitoso!');
            onLogin(username);

            // Redireccionar según los permisos del usuario
            const permisos = data.user.permisos || [];
            
            if (permisos.some(p => p.modulo === 'Admin')) {
                navigate('/admin/dashboard');
            } else if (permisos.some(p => p.modulo === 'Ventas')) {
                navigate('/ventas');
            } else if (permisos.some(p => p.modulo === 'Producción')) {
                navigate('/produccion');
            } else {
                navigate('/'); // Página predeterminada para usuarios sin permisos específicos
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);

            // Limpiar localStorage en caso de error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('permisos');

            setMessage(`Error: ${error.message}`);
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

            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} mt-3`}>
                {message}
            </div>}
        </div>
    );
}

export default Login;
