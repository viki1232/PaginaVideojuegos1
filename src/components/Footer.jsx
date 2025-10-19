function Footer({ onNavigate }) {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>EpicGameHub</h3>
                        <p>
                            Explore the latest games and immerse yourself in epic adventures!
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul className="footer-list">
                            <li>
                                <button
                                    onClick={() => onNavigate('about')}
                                    className="footer-link"
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate('home')}
                                    className="footer-link"
                                >
                                    Careers
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Community</h4>
                        <ul className="footer-list">
                            <li>
                                <button
                                    onClick={() => onNavigate('community')}
                                    className="footer-link"
                                >
                                    For Developers
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate('community')}
                                    className="footer-link"
                                >
                                    Advertising Community
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Help</h4>
                        <ul className="footer-list">
                            <li>
                                <button
                                    onClick={() => onNavigate('support')}
                                    className="footer-link"
                                >
                                    Support
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate('support')}
                                    className="footer-link"
                                >
                                    Mobile App
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2025 EpicGameHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;