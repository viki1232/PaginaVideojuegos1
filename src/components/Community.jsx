import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Send } from 'lucide-react';


function Community({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();

    const subscription = supabase
      .channel('community_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_messages' }, () => {
        loadMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*, users(username, avatar_url), games(title)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      onNavigate('login');
      return;
    }

    if (!newMessage.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('community_messages').insert([
        {
          user_id: user.id,
          message: newMessage,
        },
      ]);

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare size={32} className="text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Community</h1>
          </div>
          <p className="text-gray-300">Join the conversation about your favorite games</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {user && (
          <form onSubmit={handleSubmitMessage} className="mb-8 bg-slate-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-purple-900/30 rounded-lg text-white focus:outline-none focus:border-purple-600 transition-colors resize-none"
                  rows={3}
                  placeholder="Share your thoughts with the community..."
                  required
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={submitting || !newMessage.trim()}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Send size={18} />
                    {submitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {!user && (
          <div className="mb-8 bg-purple-600/20 border border-purple-600 rounded-xl p-6 text-center">
            <p className="text-white mb-4">Sign in to join the conversation</p>
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
            >
              Sign In
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {message.users?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-semibold">
                        {message.users?.username || 'User'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(message.created_at)}
                      </span>
                      {message.games && (
                        <span className="text-purple-400 text-sm">
                          about {message.games.title}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 break-words">{message.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;