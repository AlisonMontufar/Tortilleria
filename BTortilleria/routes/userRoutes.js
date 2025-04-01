const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Perfil = require('../models/Perfil');  // Ajusta la ruta según la ubicación de tu modelo Perfil


const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, username, email, phone, password, perfil } = req.body;

    // Verificar si el usuario, email o teléfono ya existen
    const userExists = await User.findOne({
        $or: [{ username }, { email }, { phone }]
    });
    if (userExists) {
        return res.status(400).json({ message: 'El usuario, email o teléfono ya están registrados' });
    }

    // Verificar si el perfil existe (si lo estás almacenando en una colección de perfiles)
    const perfilExists = await Perfil.findById(perfil);  // Asegúrate de que "Perfil" es el modelo correcto
    if (!perfilExists) {
        return res.status(400).json({ message: 'El perfil seleccionado no es válido' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario con el perfil asociado
    const newUser = new User({ 
        firstName, 
        lastName, 
        username, 
        email, 
        phone, 
        password: hashedPassword,
        perfil // Guardar el ID del perfil seleccionado
    });

    try {
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro', error });
    }
});




// Ruta para inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar al usuario por username, email o phone
        const user = await User.aggregate([
            {
                $match: {
                    $or: [
                        { username },
                        { email: username },
                        { phone: username }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'perfiles',  // Realiza un lookup en la colección de perfiles
                    localField: 'perfil',  // El campo perfil de la colección de users
                    foreignField: '_id',   // Relaciona con el campo _id de la colección de perfiles
                    as: 'perfil'  // Asigna el resultado al campo perfil en el resultado
                }
            },
            {
                $unwind: '$perfil'  // Descompone el array de perfil para convertirlo en un objeto único
            },
            {
                $lookup: {
                    from: 'modulos',  // Realiza un lookup en la colección de modulos
                    localField: 'perfil.permisos.modulo',  // Relaciona el campo modulo dentro de perfil.permisos
                    foreignField: '_id',   // Relaciona con el campo _id de la colección modulos
                    as: 'modulos'  // Asigna el resultado a un campo modulos
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    username: 1,
                    role: 1,
                    password: 1,  // Asegúrate de incluir el campo password
                    'perfil.nombrePerfil': 1,
                    'perfil.permisos': 1,
                    modulos: 1
                }
            },
            {
                $addFields: {
                    permisosConModulos: {
                        $map: {
                            input: '$perfil.permisos',
                            as: 'permiso',
                            in: {
                                modulo: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$modulos',
                                                as: 'modulo',
                                                cond: { $eq: ['$$modulo._id', '$$permiso.modulo'] }
                                            }
                                        },
                                        0
                                    ]
                                },
                                acciones: '$$permiso.acciones'
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    username: 1,
                    role: 1,
                    'perfil.nombrePerfil': 1,
                    permisosConModulos: 1,
                    password: 1  // Asegúrate de que `password` esté en el último `project`
                }
            }
        ]);

        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Tomamos el primer usuario de la respuesta agregada
        const userData = user[0];

        console.log("Permisos con módulos:", userData.permisosConModulos);

        // Verifica si la contraseña está presente
        if (!userData.password) {
            return res.status(400).json({ message: 'Contraseña no encontrada' });
        }

        // Comparar la contraseña ingresada con la encriptada
        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token de sesión
        const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: userData._id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                role: userData.role,
                permisos: userData.permisosConModulos || []  // Los permisos con los módulos relacionados
            }
        });


        

    } catch (error) {
        console.error('Error en el servidor', error);
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
});





module.exports = router;
