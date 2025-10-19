import { Gamepad2, Users, Trophy, Heart } from 'lucide-react';



function About({ onNavigate }) {
    return (

        <div className="min-h-screen bg-slate-900">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-900/30">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-white mb-4">About EpicGameHub</h1>
                    <p className="text-gray-300 text-lg">
                        Your ultimate destination for epic gaming adventures
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-slate-800 rounded-xl p-8 mb-8 border border-purple-900/30">
                    <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                    <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-800 rounded-xl p-8 border border-purple-900/30">
                        <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Gamepad2 size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">10,000+ Games</h3>
                        <p className="text-gray-400">
                            Access a massive library of titles across all genres and platforms
                        </p>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-8 border border-purple-900/30">
                        <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Users size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">5M+ Gamers</h3>
                        <p className="text-gray-400">
                            Join a thriving community of passionate gamers from around the world
                        </p>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-8 border border-purple-900/30">
                        <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Trophy size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Award Winning</h3>
                        <p className="text-gray-400">
                            Recognized for excellence in gaming platform innovation
                        </p>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-8 border border-purple-900/30">
                        <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Heart size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Player First</h3>
                        <p className="text-gray-400">
                            Every decision we make is guided by what's best for our community
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-8 mb-8 border border-purple-900/30">
                    <h2 className="text-3xl font-bold text-white mb-6">Our Values</h2>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xl font-semibold text-purple-400 mb-2">Innovation</h4>
                            <p className="text-gray-300">
                                We're constantly pushing boundaries to deliver the best gaming experience possible,
                                leveraging cutting-edge technology and listening to our community.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-purple-400 mb-2">Community</h4>
                            <p className="text-gray-300">
                                Gaming is better together. We foster a welcoming, inclusive environment where
                                players can connect, share, and grow.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-purple-400 mb-2">Quality</h4>
                            <p className="text-gray-300">
                                We curate only the best games and ensure every aspect of our platform meets
                                the highest standards of excellence.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-purple-400 mb-2">Trust</h4>
                            <p className="text-gray-300">
                                Your security and privacy are paramount. We're committed to providing a safe,
                                secure platform you can trust.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-8 border border-purple-600 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
                    <p className="text-gray-300 mb-6 text-lg">
                        Ready to start your gaming journey? Create an account today and discover your next favorite game.
                    </p>
                    <button
                        onClick={() => onNavigate('signup')}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}

export default About;