import { Mail, MessageCircle, HelpCircle, Book } from 'lucide-react';

function Support({ onNavigate }) {
    return (
        <div className="support-page">
            <div className="support-header">
                <div className="support-header-content">
                    <h1>Support Center</h1>
                    <p>We're here to help you with any questions or issues</p>
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
                            Get in touch with our support team via email for detailed assistance.
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
                            Chat with our support team in real-time for quick answers.
                        </p>
                        <button>Start Chat</button>
                    </div>
                </div>

                <div className="faq-section">
                    <h2>
                        <HelpCircle size={32} />
                        Frequently Asked Questions
                    </h2>

                    <div className="faq-list">
                        <details className="faq-item">
                            <summary>
                                How do I purchase a game?
                            </summary>
                            <p>
                                Browse our game store, click on any game you're interested in, and click the "Purchase" button.
                                You'll be guided through a secure checkout process. Once purchased, the game will be added to your library.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                Can I get a refund?
                            </summary>
                            <p>
                                Yes, we offer refunds within 14 days of purchase if you've played less than 2 hours.
                                Contact our support team to request a refund.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                How do I access my purchased games?
                            </summary>
                            <p>
                                All your purchased games are available in your library. Click on your profile and select "Library"
                                to view and download your games.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                What payment methods do you accept?
                            </summary>
                            <p>
                                We accept all major credit cards, PayPal, and various digital payment methods.
                                All transactions are secured with industry-standard encryption.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                How do I report a bug or issue?
                            </summary>
                            <p>
                                You can report bugs through our support email or live chat. Please provide as much detail as possible,
                                including screenshots if available, to help us resolve the issue quickly.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary>
                                Is my account secure?
                            </summary>
                            <p>
                                Yes, we take security seriously. All accounts are protected with secure authentication,
                                and we use industry-standard encryption for all data transmission and storage.
                            </p>
                        </details>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>
                        <Book size={32} />
                        Still need help?
                    </h2>
                    <p>
                        Our support team is available 24/7 to assist you with any questions or concerns.
                    </p>
                    <button onClick={() => onNavigate('community')}>
                        Visit Community Forums
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Support;