import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ onRegisterSuccess }) {
    const navigate = useNavigate();

    const handleGoToHome = () => {
        navigate("/");
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        perfil: '' // Nuevo campo de perfil
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [perfiles, setPerfiles] = useState([]); // Almacenamos los perfiles disponibles

    // Obtener los perfiles de la API al cargar el componente
    useEffect(() => {
        const fetchPerfiles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/perfiles/'); // Ajusta esta URL a tu ruta real
                if (!response.ok) throw new Error('Error al obtener los perfiles');
                const data = await response.json();
                setPerfiles(data); // Asumimos que la API devuelve una lista de perfiles
            } catch (error) {
                console.error(error);
                setMessage('Error al cargar los perfiles.');
            }
        };

        fetchPerfiles();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validaciones
    const validateForm = () => {
        let newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Los apellidos son obligatorios.';
        if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es obligatorio.';
        if (formData.username.length < 5) newErrors.username = 'El usuario debe tener al menos 5 caracteres.';
        
        if (!formData.email.trim()) {
            newErrors.email = 'El correo es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Formato de correo inválido.';
        }

        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'El teléfono debe tener 10 dígitos.';
        }

        if (!formData.perfil.trim()) {
            newErrors.perfil = 'El perfil es obligatorio.';
        }

        if (formData.password.length < 8 || !/\d/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
            newErrors.password = 'Debe tener al menos 8 caracteres, un número y un símbolo.';
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage('Corrige los errores antes de continuar.');
            return;
        }

        try {
            // Excluir confirmPassword antes de enviar a la API
            const { confirmPassword, ...dataToSend } = formData;

            const response = await fetch('https://btortilleria.onrender.com/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar el usuario. Intenta de nuevo.');
            }

            setMessage('Registro exitoso!');
            onRegisterSuccess(formData.username);
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMessage(error.message || 'Error al registrar el usuario. Intenta de nuevo.');
            navigate('/errorPageRegister');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Registro de Usuario</h2>

            <div className="card p-4 shadow-sm">
                <form onSubmit={handleSubmit}>
                    {['firstName', 'lastName', 'username', 'email', 'phone'].map((field) => (
                        <div key={field} className="form-group mb-3">
                            <label className="form-label">
                                {field === 'firstName' ? 'Nombre' :
                                    field === 'lastName' ? 'Apellidos' :
                                    field === 'username' ? 'Usuario' :
                                    field === 'email' ? 'Correo Electrónico' : 'Teléfono'}
                            </label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                name={field}
                                className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                                value={formData[field]}
                                onChange={handleChange}
                            />
                            {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                        </div>
                    ))}

                    {/* Campo de selección de perfil */}
                    <div className="form-group mb-3">
                        <label className="form-label">Perfil</label>
                        <select
                            name="perfil"
                            className={`form-control ${errors.perfil ? 'is-invalid' : ''}`}
                            value={formData.perfil}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un perfil</option>
                            {perfiles.map((perfil) => (
                                <option key={perfil._id} value={perfil._id}>
                                    {perfil.nombrePerfil}
                                </option>
                            ))}
                        </select>
                        {errors.perfil && <div className="invalid-feedback">{errors.perfil}</div>}
                    </div>

                    {/* Contraseñas */}
                    {['password', 'confirmPassword'].map((field) => (
                        <div key={field} className="form-group mb-3">
                            <label className="form-label">
                                {field === 'password' ? 'Contraseña' : 'Confirmar Contraseña'}
                            </label>
                            <input
                                type="password"
                                name={field}
                                className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                                value={formData[field]}
                                onChange={handleChange}
                            />
                            {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                </form>

                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>

            <div className="text-center mt-3">
                <p>¿Ya tienes una cuenta?</p>
                <button onClick={handleGoToHome} className="btn btn-link">Iniciar sesión</button>
            </div>
        </div>
    );
}

export default Register;
