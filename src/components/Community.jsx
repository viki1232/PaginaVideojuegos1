import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Send, ThumbsUp, Trash2, MessageCircle } from 'lucide-react';

function Community({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { user } = useAuth();

  const API_URL = 'http://localhost:2000/api/comunity';

  useEffect(() => {
    loadPosts();
  }, []);

  // ✅ Cargar posts desde MongoDB
  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Posts cargados:', data);
        setPosts(data.posts || []);
      } else {
        console.error('❌ Error al cargar posts');
        setPosts([]);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Crear nuevo post
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!user) {
      onNavigate('login');
      return;
    }

    if (!newPost.trim()) return;

    setSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          username: user.username || user.email?.split('@')[0] || 'Anonymous',
          comment: newPost
        })
      });

      if (response.ok) {
        console.log('✅ Post creado');
        setNewPost('');
        await loadPosts();
        alert('✅ Post publicado!');
      } else {
        const error = await response.json();
        alert('❌ Error: ' + error.error);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error al publicar');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Dar/quitar like
  const handleLike = async (postId) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${postId}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      if (response.ok) {
        console.log('✅ Like actualizado');
        await loadPosts();
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  // ✅ Agregar respuesta
  const handleAddReply = async (postId) => {
    if (!replyText.trim()) return;

    try {
      const response = await fetch(`${API_URL}/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          username: user.username || user.email?.split('@')[0] || 'Anonymous',
          comment: replyText
        })
      });

      if (response.ok) {
        console.log('✅ Respuesta agregada');
        setReplyText('');
        setReplyingTo(null);
        await loadPosts();
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  // ✅ Eliminar post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('¿Eliminar este post?')) return;

    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Post eliminado');
        await loadPosts();
        alert('✅ Post eliminado');
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  // ✅ Eliminar respuesta
  const handleDeleteReply = async (postId, replyId) => {
    if (!window.confirm('¿Eliminar esta respuesta?')) return;

    try {
      const response = await fetch(`${API_URL}/${postId}/replies/${replyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Respuesta eliminada');
        await loadPosts();
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
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
        {/* ✅ Formulario para crear post */}
        {user && (
          <form onSubmit={handleSubmitPost} className="message-form">
            <div className="message-form-container">
              <div className="user-avatar-large">
                {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="message-form-input-container">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="message-textarea"
                  rows={3}
                  placeholder="Share your thoughts with the community..."
                  maxLength={500}
                  required
                />
                <div className="message-form-actions">
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {newPost.length}/500
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !newPost.trim()}
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
            <button onClick={() => onNavigate('login')} className="signin-button">
              Sign In
            </button>
          </div>
        )}

        {/* ✅ Lista de posts */}
        {loading ? (
          <div className="messages-loading">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="message-skeleton" />
            ))}
          </div>
        ) : (
          <div className="messages-list">
            {posts.map((post) => (
              <div key={post._id} className="message-card">
                <div className="message-content">
                  <div className="message-avatar">
                    {post.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="message-body">
                    <div className="message-header">
                      <span className="message-username">{post.username || 'User'}</span>
                      <span className="message-time">{formatDate(post.created_at)}</span>
                      {user && user.id === post.user_id && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="delete-btn"
                          style={{ marginLeft: 'auto' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="message-text">{post.comment}</p>

                    {/* ✅ Acciones del post */}
                    <div className="post-actions">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="action-btn"
                        disabled={!user}
                      >
                        <ThumbsUp size={16} />
                        {post.likes || 0}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
                        className="action-btn"
                        disabled={!user}
                      >
                        <MessageCircle size={16} />
                        {post.replies?.length || 0}
                      </button>
                    </div>

                    {/* ✅ Formulario de respuesta */}
                    {replyingTo === post._id && (
                      <div className="reply-form">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          rows={2}
                          maxLength={300}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button onClick={() => handleAddReply(post._id)} className="btn-primary">
                            Reply
                          </button>
                          <button onClick={() => setReplyingTo(null)} className="btn-secondary">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ✅ Lista de respuestas */}
                    {post.replies && post.replies.length > 0 && (
                      <div className="replies-list">
                        {post.replies.map((reply) => (
                          <div key={reply._id} className="reply-item">
                            <div className="reply-avatar">
                              {reply.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="reply-content">
                              <div className="reply-header">
                                <span className="reply-username">{reply.username}</span>
                                <span className="reply-time">{formatDate(reply.created_at)}</span>
                                {user && user.id === reply.user_id && (
                                  <button
                                    onClick={() => handleDeleteReply(post._id, reply._id)}
                                    className="delete-btn-small"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                              <p className="reply-text">{reply.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="empty-community">
                <MessageSquare size={48} className="empty-icon" />
                <p className="empty-text">No posts yet. Start the conversation!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;