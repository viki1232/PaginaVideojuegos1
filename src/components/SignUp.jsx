import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2, CheckCircle, Check, X } from 'lucide-react';


function SignUp({ onNavigate }) {
    requisitos
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    // Estado para requisitos de contraseña
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    // Validar contraseña en tiempo real
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        setPasswordRequirements({
            minLength: newPassword.length >= 8,
            hasUpperCase: /[A-Z]/.test(newPassword),
            hasLowerCase: /[a-z]/.test(newPassword),
            hasNumber: /\d/.test(newPassword),
            hasSpecialChar: /[@$!%*?&]/.test(newPassword)
        });
    };

    // Verificar si la contraseña cumple todos los requisitos
    const isPasswordValid = () => {
        return Object.values(passwordRequirements).every(req => req === true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validar contraseña antes de enviar
        if (!isPasswordValid()) {
            setError('La contraseña no cumple con todos los requisitos');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, username);
            setSuccess(true);
            setEmail('');
            setPassword('');
            setUsername('');
        } catch (err) {
            setError(err.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-content">
                    <div className="auth-card">
                        <div className="success-icon-container">
                            <CheckCircle size={64} className="success-icon" />
                        </div>

                        <h2 className="auth-title">¡Registro Exitoso!</h2>
                        <p className="auth-subtitle">
                            Te hemos enviado un email de verificación a tu correo.
                        </p>

                        <div className="success-message">
                            <p>Por favor revisa tu bandeja de entrada y haz clic en el link de verificación.</p>
                            <p className="text-small">El link expira en 15 minutos.</p>
                        </div>

                        <button
                            onClick={() => onNavigate('login')}
                            className="auth-button"
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-icon-container">
                        <div className="auth-icon-wrapper">
                            <Gamepad2 size={32} className="auth-icon" />
                        </div>
                    </div>

                    <h2 className="auth-title">Join EpicGameHub</h2>
                    <p className="auth-subtitle">Create an account to start your gaming adventure</p>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input"
                                placeholder="Choose a username"
                                required
                                minLength={3}
                                maxLength={20}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="form-input"
                                placeholder="Create a password"
                                required
                            />

                            {/* Requisitos de contraseña */}
                            <div className="password-requirements">
                                <PasswordRequirement
                                    met={passwordRequirements.minLength}
                                    text="Mínimo 8 caracteres"
                                />
                                <PasswordRequirement
                                    met={passwordRequirements.hasUpperCase}
                                    text="Una mayúscula (A-Z)"
                                />
                                <PasswordRequirement
                                    met={passwordRequirements.hasLowerCase}
                                    text="Una minúscula (a-z)"
                                />
                                <PasswordRequirement
                                    met={passwordRequirements.hasNumber}
                                    text="Un número (0-9)"
                                />
                                <PasswordRequirement
                                    met={passwordRequirements.hasSpecialChar}
                                    text="Un carácter especial (@$!%*?&)"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isPasswordValid()}
                            className="auth-button"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <button
                                onClick={() => onNavigate('login')}
                                className="auth-link"
                            >
                                Log In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente auxiliar para mostrar requisitos
function PasswordRequirement({ met, text }) {
    return (
        <div className={`password-requirement ${met ? 'met' : 'unmet'}`}>
            {met ? <Check size={16} /> : <X size={16} />}
            <span>{text}</span>
        </div>
    );
}

export default SignUp;