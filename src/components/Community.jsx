import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Send } from 'lucide-react';

function Community({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  // Mensajes de ejemplo
  const mockMessages = [
    {
      id: 1,
      user_id: 1,
      message: "Just finished Cyber Warriors 2077! The graphics are absolutely mind-blowing. Anyone else playing this masterpiece?",
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      users: {
        username: "CyberGamer",
        avatar_url: null
      },
      games: {
        title: "Cyber Warriors 2077"
      }
    },
    {
      id: 2,
      user_id: 2,
      message: "Looking for co-op partners for Dragon's Legacy! I'm level 45, mainly playing evenings EST. Hit me up!",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      users: {
        username: "DragonSlayer",
        avatar_url: null
      },
      games: {
        title: "Dragon's Legacy"
      }
    },
    {
      id: 3,
      user_id: 3,
      message: "The new update for Speed Legends added so many great tracks! The Tokyo night circuit is my favorite so far.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      users: {
        username: "RacerPro",
        avatar_url: null
      },
      games: {
        title: "Speed Legends"
      }
    },
    {
      id: 4,
      user_id: 4,
      message: "Does anyone have tips for the final boss in Dark Souls Reborn? I've been stuck for days! 😅",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      users: {
        username: "SoulsVeteran",
        avatar_url: null
      },
      games: {
        title: "Dark Souls Reborn"
      }
    },
    {
      id: 5,
      user_id: 5,
      message: "Fantasy Quest is on sale! If you haven't played it yet, now's the perfect time. It's one of the best RPGs I've ever experienced.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      users: {
        username: "RPGMaster",
        avatar_url: null
      },
      games: {
        title: "Fantasy Quest"
      }
    },
    {
      id: 6,
      user_id: 6,
      message: "Just beat all 500 levels in Mind Bender! My brain hurts but it feels so good. The last puzzle was insane! 🧠",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      users: {
        username: "PuzzleGenius",
        avatar_url: null
      },
      games: {
        title: "Mind Bender"
      }
    },
    {
      id: 7,
      user_id: 7,
      message: "Empire Builder is consuming all my free time. One more turn... said 3 hours ago. Send help! 😂",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      users: {
        username: "StrategyKing",
        avatar_url: null
      },
      games: {
        title: "Empire Builder"
      }
    }
  ];

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);

    try {
      // Intentar cargar desde API/MongoDB
      const response = await fetch('/api/community/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        // Usar datos mock si falla
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Usar datos mock en caso de error
      setMessages(mockMessages);
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
      // Intentar enviar a API/MongoDB
      const response = await fetch('/api/community/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          message: newMessage,
        }),
      });

      if (response.ok) {
        // Recargar mensajes si se guardó exitosamente
        await loadMessages();
      } else {
        // Agregar mensaje localmente si falla la API
        const newMsg = {
          id: messages.length + 1,
          user_id: user.id,
          message: newMessage,
          created_at: new Date().toISOString(),
          users: {
            username: user.username || user.email?.split('@')[0] || 'You',
            avatar_url: null
          },
          games: null
        };
        setMessages([newMsg, ...messages]);
      }

      setNewMessage('');
      alert('✅ Message posted successfully!');
    } catch (error) {
      console.error('Error submitting message:', error);

      // Agregar mensaje localmente en caso de error
      const newMsg = {
        id: messages.length + 1,
        user_id: user.id,
        message: newMessage,
        created_at: new Date().toISOString(),
        users: {
          username: user.username || user.email?.split('@')[0] || 'You',
          avatar_url: null
        },
        games: null
      };
      setMessages([newMsg, ...messages]);
      setNewMessage('');
      alert('✅ Message posted successfully!');
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
    <div className="community-container">
      <div className="community-header">
        <div className="community-header-content">
          <div className="community-header-title">
            <MessageSquare size={32} className="community-icon" />
            <h1 className="community-title">Community</h1>
          </div>
          <p className="community-subtitle">Join the conversation about your favorite games</p>
        </div>
      </div>

      <div className="community-content">
        {user && (
          <form onSubmit={handleSubmitMessage} className="message-form">
            <div className="message-form-container">
              <div className="user-avatar-large">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="message-form-input-container">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="message-textarea"
                  rows={3}
                  placeholder="Share your thoughts with the community..."
                  required
                />
                <div className="message-form-actions">
                  <button
                    type="submit"
                    disabled={submitting || !newMessage.trim()}
                    className="post-button"
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
          <div className="signin-prompt">
            <p className="signin-prompt-text">Sign in to join the conversation</p>
            <button
              onClick={() => onNavigate('login')}
              className="signin-button"
            >
              Sign In
            </button>
          </div>
        )}

        {loading ? (
          <div className="messages-loading">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="message-skeleton" />
            ))}
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className="message-card">
                <div className="message-content">
                  <div className="message-avatar">
                    {message.users?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="message-body">
                    <div className="message-header">
                      <span className="message-username">
                        {message.users?.username || 'User'}
                      </span>
                      <span className="message-time">
                        {formatDate(message.created_at)}
                      </span>
                      {message.games && (
                        <span className="message-game">
                          about {message.games.title}
                        </span>
                      )}
                    </div>
                    <p className="message-text">{message.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="empty-community">
                <MessageSquare size={48} className="empty-icon" />
                <p className="empty-text">No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;