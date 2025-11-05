import { Mail, MessageCircle, HelpCircle, Book } from 'lucide-react';

function Support({ onNavigate }) {
    return (
        <div className="support-page">
            <div className="support-header">
                <div className="support-header-content">
                    <h1>Support Center</h1>
                    <p>Estamos aquí para ayudarte con cualquier pregunta o problema</p>
                </div>
            </div>

            <div className="support-content">
                <div className="support-options">
                    <div className="support-card">
                        <div className="support-icon">
                            <Mail size={24} />
                        </div>
                        <h3>Email Support</h3>
                        <p>
                            Ponte en contacto con nuestro equipo de soporte por correo electrónico para obtener asistencia detallada.
                        </p>
                        <a href="mailto:support@epicgamehub.com">
                            support@epicgamehub.com
                        </a>
                    </div>

                    <div className="support-card">
                        <div className="support-icon">
                            <MessageCircle size={24} />
                        </div>
                        <h3>Live Chat</h3>
                        <p>
                            Chatea con nuestro equipo de soporte en tiempo real para obtener respuestas rápidas.
                        </p>
                        <button>Iniciar Chat</button>
                    </div>
                </div>

                <div className="faq-section">
                    <h2>
                        <HelpCircle size={32} />
                        Preguntas Frecuentes
                    </h2>

                    <div className="faq-list">
                        <details className="faq-item">
                            <summary>
                                ¿Cómo compro un juego?
                            </summary>
                            <p>
                                Navega por nuestra tienda de juegos, haz clic en cualquier juego que te interese y haz clic en el botón "Comprar".
                                Serás guiado a través de un proceso de pago seguro. Una vez comprado, el juego se agregará a tu biblioteca.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                ¿Puedo obtener un reembolso?
                            </summary>
                            <p>
                                Sí, ofrecemos reembolsos dentro de los 14 días posteriores a la compra si has jugado menos de 2 horas.
                                Contacta a nuestro equipo de soporte para solicitar un reembolso.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                ¿Cómo accedo a mis juegos comprados?
                            </summary>
                            <p>
                                Todos tus juegos comprados están disponibles en tu biblioteca. Haz clic en tu perfil y selecciona "Biblioteca"
                                para ver y descargar tus juegos.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                ¿Qué métodos de pago aceptan?
                            </summary>
                            <p>
                                Aceptamos todas las principales tarjetas de crédito, PayPal y varios métodos de pago digital.
                                Todas las transacciones están aseguradas con encriptación estándar de la industria.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                ¿Cómo reporto un error o problema?
                            </summary>
                            <p>
                                Puedes reportar errores a través de nuestro correo de soporte o chat en vivo. Por favor proporciona tantos detalles como sea posible,
                                incluyendo capturas de pantalla si están disponibles, para ayudarnos a resolver el problema rápidamente.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                ¿Mi cuenta está segura?
                            </summary>
                            <p>
                                Sí, nos tomamos la seguridad en serio. Todas las cuentas están protegidas con autenticación segura,
                                y utilizamos encriptación estándar de la industria para toda la transmisión y almacenamiento de datos.
                            </p>
                        </details>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>
                        <Book size={32} />
                        ¿Todavía necesitas ayuda?
                    </h2>
                    <p>
                        Nuestro equipo de soporte está disponible 24/7 para asistirte con cualquier pregunta o inquietud.
                    </p>
                    <button onClick={() => onNavigate('community')}>
                        Visitar Foros de la Comunidad
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Support;