import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';


function EmailVerification({ token, onNavigate }) {
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token de verificación no encontrado');
                return;
            }

            try {
                console.log('🔍 Verificando token:', token);

                const response = await fetch(`http://localhost:2000/api/auth/verify/${token}`);
                const data = await response.json();

                console.log('📧 Respuesta del servidor:', data);

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Error al verificar el email');
                }
            } catch (error) {
                console.error('❌ Error:', error);
                setStatus('error');
                setMessage('Error de conexión. Intenta nuevamente.');
            }
        };

        verifyEmail();
    }, [token]);

    if (status === 'loading') {
        return (
            <div className="auth-container">
                <div className="auth-content">
                    <div className="auth-card">
                        <div className="loading-container">
                            <Loader size={64} className="loading-spinner" />
                        </div>
                        <h2 className="auth-title">Verificando tu email...</h2>
                        <p className="auth-subtitle">Por favor espera un momento</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="auth-container">
                <div className="auth-content">
                    <div className="auth-card">
                        <div className="success-icon-container">
                            <CheckCircle size={64} className="success-icon" />
                        </div>

                        <h2 className="auth-title">¡Email Verificado! 🎉</h2>
                        <p className="auth-subtitle">{message}</p>

                        <div className="success-message">
                            <p>Tu cuenta ha sido verificada exitosamente.</p>
                            <p>Ya puedes iniciar sesión y disfrutar de todos los juegos.</p>
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

    if (status === 'error') {
        return (
            <div className="auth-container">
                <div className="auth-content">
                    <div className="auth-card">
                        <div className="error-icon-container">
                            <XCircle size={64} className="error-icon" />
                        </div>

                        <h2 className="auth-title">Error de Verificación</h2>
                        <p className="auth-subtitle">{message}</p>

                        <div className="auth-error">
                            <p>El enlace puede haber expirado (expira en 15 minutos).</p>
                            <p>Por favor, intenta registrarte nuevamente.</p>
                        </div>

                        <button
                            onClick={() => onNavigate('signup')}
                            className="auth-button"
                        >
                            Volver al Registro
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmailVerification;