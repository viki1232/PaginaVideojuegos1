import { Mail, MessageCircle, HelpCircle, Book } from 'lucide-react';


function Support({ onNavigate }) {
    return (
        <div className="min-h-screen bg-slate-900">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-900/30">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Support Center</h1>
                    <p className="text-gray-300">We're here to help you with any questions or issues</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700/50 transition-all border border-purple-900/30">
                        <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Mail size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                        <p className="text-gray-400 mb-4">
                            Get in touch with our support team via email for detailed assistance.
                        </p>
                        <a
                            href="mailto:support@epicgamehub.com"
                            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                        >
                            support@epicgamehub.com
                        </a>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700/50 transition-all border border-purple-900/30">
                        <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
                        <p className="text-gray-400 mb-4">
                            Chat with our support team in real-time for quick answers.
                        </p>
                        <button className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                            Start Chat
                        </button>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-8 mb-12 border border-purple-900/30">
                    <div className="flex items-center gap-3 mb-6">
                        <HelpCircle size={32} className="text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        <details className="bg-slate-900 rounded-lg p-6 cursor-pointer group">
                            <summary className="text-white font-semibold flex items-center justify-between">
                                How do I purchase a game?
                                <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-gray-400 mt-4">
                                Browse our game store, click on any game you're interested in, and click the "Purchase" button.
                                You'll be guided through a secure checkout process. Once purchased, the game will be added to your library.
                            </p>
                        </details>

                        <details className="bg-slate-900 rounded-lg p-6 cursor-pointer group">
                            <summary className="text-white font-semibold flex items-center justify-between">
                                Can I get a refund?
                                <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-gray-400 mt-4">
                                Yes, we offer refunds within 14 days of purchase if you've played less than 2 hours.
                                Contact our support team to request a refund.
                            </p>
                        </details>

                        <details className="bg-slate-900 rounded-lg p-6 cursor-pointer group">
                            <summary className="text-white font-semibold flex items-center justify-between">
                                How do I access my purchased games?
                                <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-gray-400 mt-4">
                                All your purchased games are available in your library. Click on your profile and select "Library"
                                to view and download your games.
                            </p>
                        </details>

                        <details className="bg-slate-900 rounded-lg p-6 cursor-pointer group">
                            <summary className="text-white font-semibold flex items-center justify-between">
                                What payment methods do you accept?
                                <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-gray-400 mt-4">
                                We accept all major credit cards, PayPal, and various digital payment methods.
                                All transactions are secured with industry-standard encryption.
                            </p>
                        </details>

                        <details className="bg-slate-900 rounded-lg p-6 cursor-pointer group">
                            <summary className="text-white font-semibold flex items-center justify-between">
                                How do I report a bug or issue?
                                <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-gray-400 mt-4">
                                You can report bugs through our support email or live chat. Please provide as much detail as possible,
                                including screenshots if available, to help us resolve the issue quickly.
                            </p>
                        </details>

                        <details className="bg-slate-900 rounded-lg p-6 cursor-pointer group">
                            <summary className="text-white font-semibold flex items-center justify-between">
                                Is my account secure?
                                <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-gray-400 mt-4">
                                Yes, we take security seriously. All accounts are protected with secure authentication,
                                and we use industry-standard encryption for all data transmission and storage.
                            </p>
                        </details>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-8 border border-purple-600">
                    <div className="flex items-center gap-3 mb-4">
                        <Book size={32} className="text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Still need help?</h2>
                    </div>
                    <p className="text-gray-300 mb-6">
                        Our support team is available 24/7 to assist you with any questions or concerns.
                    </p>
                    <button
                        onClick={() => onNavigate('community')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
                    >
                        Visit Community Forums
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Support;