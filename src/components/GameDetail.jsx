import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';



function GameDetail({ gameId, onNavigate }) {
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        loadGame();
        loadReviews();
    }, [gameId]);

    const loadGame = async () => {
        try {
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .eq('id', gameId)
                .maybeSingle();

            if (error) throw error;
            setGame(data);
        } catch (error) {
            console.error('Error loading game:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, users(username, avatar_url)')
                .eq('game_id', gameId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            onNavigate('login');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.from('reviews').insert([
                {
                    game_id: gameId,
                    user_id: user.id,
                    rating: newRating,
                    comment: newComment,
                },
            ]);

            if (error) throw error;

            setNewComment('');
            setNewRating(5);
            loadReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Game not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <button
                    onClick={() => onNavigate('store')}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Store
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800 rounded-xl overflow-hidden mb-6">
                            <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                                <img
                                    src={game.image_url}
                                    alt={game.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-8 mb-6">
                            <h1 className="text-4xl font-bold text-white mb-4">{game.title}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Star size={24} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xl text-white font-semibold">{game.rating}/5</span>
                                </div>
                                <span className="px-4 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                                    {game.category}
                                </span>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed">{game.description}</p>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Community Reviews</h2>

                            {user && (
                                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-slate-900 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() => setNewRating(rating)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        size={32}
                                                        className={`transition-colors ${rating <= newRating
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-600'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-800 border border-purple-900/30 rounded-lg text-white focus:outline-none focus:border-purple-600 transition-colors"
                                            rows={4}
                                            placeholder="Share your thoughts about this game..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-all"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            )}

                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="p-6 bg-slate-900 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {review.users?.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{review.users?.username || 'User'}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={`${i < review.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-600'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-300">{review.comment}</p>
                                    </div>
                                ))}

                                {reviews.length === 0 && (
                                    <p className="text-center text-gray-400 py-8">
                                        No reviews yet. Be the first to review this game!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-xl p-8 sticky top-24">
                            <div className="text-4xl font-bold text-white mb-6">${game.price}</div>
                            <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 mb-4">
                                <ShoppingCart size={20} />
                                Purchase
                            </button>
                            <button className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default GameDetail;