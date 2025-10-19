import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';  // ✅ Importar JWT
import nodemailer from 'nodemailer';

// ✅ Función auxiliar FUERA de las otras funciones
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Función para registrar usuario
export const signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (!@#$%^&*)'
            });
        }
        if (!email || !username || !password) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        const emailExists = await User.findOne({ email });
        const usernameExists = await User.findOne({ username });

        if (emailExists) {
            return res.status(400).json({
                error: 'El email ya está registrado'
            });
        }

        if (usernameExists) {
            return res.status(400).json({
                error: 'El username ya está en uso'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + (15 * 60 * 1000)
        });

        await newUser.save();

        // TODO: Enviar email de verificación aquí

        res.status(201).json({
            message: 'Usuario registrado. Revisa tu email para verificar tu cuenta.',
            // Solo para desarrollo (eliminar en producción):
            debug: { token: verificationToken }
        });

    } catch (error) {
        console.error('Error en signup:', error);
        res.status(500).json({
            error: 'Error al registrar usuario',
            details: error.message
        });
    }
};

// Función para login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!user.verified) {
            return res.status(403).json({
                error: 'Debes verificar tu email primero. Revisa tu bandeja de entrada.'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = generateToken(user._id);

        res.json({
            message: 'Login exitoso',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                verified: user.verified
            },
            token
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// Función para verificar email
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                error: 'Token inválido o expirado. Solicita un nuevo email de verificación.'
            });
        }

        user.verified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        res.status(200).json({
            message: '¡Email verificado exitosamente! Ya puedes iniciar sesión.'
        });

    } catch (error) {
        console.error('Error en verifyEmail:', error);
        res.status(500).json({
            error: 'Error al verificar email'
        });
    }
};

// Función para logout
export const logout = async (req, res) => {
    try {
        res.json({ message: 'Logout exitoso' });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
};

// Función para reenviar verificación
export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.verified) {
            return res.status(400).json({ error: 'El email ya está verificado' });
        }

        // Generar nuevo token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = Date.now() + (15 * 60 * 1000);

        await user.save();

        // TODO: Enviar email de verificación aquí
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // tu correo
                pass: process.env.EMAIL_PASS  // tu contraseña o app password
            }
        });

        const verificationLink = `https://tu-dominio.com/verify?token=${verificationToken}`;

        await transporter.sendMail({
            from: `"Soporte SmartLink" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Verifica tu cuenta',
            html: `
    <h2>Hola ${user.username}</h2>
    <p>Por favor verifica tu cuenta haciendo clic en el siguiente enlace:</p>
    <a href="${verificationLink}">${verificationLink}</a>
    <p>Este enlace expirará en 15 minutos.</p>
  `
        });

        res.json({
            message: 'Email de verificación reenviado. Revisa tu bandeja de entrada.',
            debug: { token: verificationToken }
        });

    } catch (error) {
        console.error('Error en resendVerification:', error);
        res.status(500).json({ error: 'Error al reenviar verificación' });
    }
};