import { Gamepad2, Users, Trophy, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function About({ onNavigate }) {
    const { user } = useAuth();

    return (
        <div className="about-page">
            <div className="about-header">
                <div className="about-header-content">
                    <h1>About EpicGameHub</h1>
                    <p>Your ultimate destination for epic gaming adventures</p>
                </div>
            </div>

            <div className="about-content">
                <div className="about-section story-section">
                    <h2>Our Story</h2>
                    <div className="story-text">
                        <p>
                            Founded in 2025, EpicGameHub started with a simple mission: to create the ultimate platform
                            where gamers can discover, purchase, and enjoy the best games from around the world.
                        </p>
                        <p>
                            We believe that gaming is more than just entertainment—it's a way to connect with others,
                            challenge ourselves, and experience incredible stories. That's why we've built a community-driven
                            platform that puts players first.
                        </p>
                        <p>
                            Today, we're proud to serve millions of gamers worldwide, offering a curated selection of
                            titles across all genres, backed by our commitment to quality, security, and exceptional
                            customer service.
                        </p>
                    </div>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Gamepad2 size={24} />
                        </div>
                        <h3>10,000+ Games</h3>
                        <p>Access a massive library of titles across all genres and platforms</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Users size={24} />
                        </div>
                        <h3>5M+ Gamers</h3>
                        <p>Join a thriving community of passionate gamers from around the world</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Trophy size={24} />
                        </div>
                        <h3>Award Winning</h3>
                        <p>Recognized for excellence in gaming platform innovation</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Heart size={24} />
                        </div>
                        <h3>Player First</h3>
                        <p>Every decision we make is guided by what's best for our community</p>
                    </div>
                </div>

                <div className="about-section values-section">
                    <h2>Our Values</h2>
                    <div className="values-list">
                        <div className="value-item">
                            <h4>Innovation</h4>
                            <p>
                                We're constantly pushing boundaries to deliver the best gaming experience possible,
                                leveraging cutting-edge technology and listening to our community.
                            </p>
                        </div>
                        <div className="value-item">
                            <h4>Community</h4>
                            <p>
                                Gaming is better together. We foster a welcoming, inclusive environment where
                                players can connect, share, and grow.
                            </p>
                        </div>
                        <div className="value-item">
                            <h4>Quality</h4>
                            <p>
                                We curate only the best games and ensure every aspect of our platform meets
                                the highest standards of excellence.
                            </p>
                        </div>
                        <div className="value-item">
                            <h4>Trust</h4>
                            <p>
                                Your security and privacy are paramount. We're committed to providing a safe,
                                secure platform you can trust.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="cta-section">

                    <h2>Join Our Community</h2>
                    <p>
                        Ready to start your gaming journey? Create an account today and discover your next favorite game.
                    </p>

                    {user ? (
                        <button onClick={() => onNavigate('store')}>
                            Go to Store
                        </button>
                    ) : (
                        <button onClick={() => onNavigate('signup')}>
                            Sign Up Now
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}

export default About;