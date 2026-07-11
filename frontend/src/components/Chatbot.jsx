import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, AlertTriangle, Plus, Trash2, Edit2, Check, History } from 'lucide-react';

const SUGGESTIONS = [
  "Quels produits de vidéosurveillance proposez-vous ?",
  "Comment configurer ou installer une caméra IP ?",
  "Quelle est la qualité des produits Dahua et Hikvision ?",
  "Avez-vous des points d'accès Ruijie en stock ?"
];

const createInitialSession = () => {
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: 'Nouvelle discussion',
    messages: [
      {
        role: 'model',
        parts: [
          {
            text: "Bonjour ! Je suis l'assistant virtuel de Mortech Solution. \n\nComment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur les détails et prix de nos produits, ou vous donner des conseils d'installation pour nos caméras et équipements réseaux !"
          }
        ]
      }
    ],
    timestamp: Date.now()
  };
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('mortech_chat_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading sessions', e);
    }
    return [createInitialSession()];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      const saved = localStorage.getItem('mortech_chat_active_session_id');
      if (saved) return saved;
    } catch (e) {}
    return '';
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const messagesEndRef = useRef(null);

  // Ensure we have a valid active session ID
  const resolvedActiveSessionId = activeSessionId && sessions.some(s => s.id === activeSessionId)
    ? activeSessionId
    : (sessions[0]?.id || '');

  useEffect(() => {
    if (resolvedActiveSessionId && resolvedActiveSessionId !== activeSessionId) {
      setActiveSessionId(resolvedActiveSessionId);
      localStorage.setItem('mortech_chat_active_session_id', resolvedActiveSessionId);
    }
  }, [resolvedActiveSessionId, activeSessionId]);

  const activeSession = sessions.find(s => s.id === resolvedActiveSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Prevent background scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const updateActiveSessionMessages = (newMessagesOrFn) => {
    setSessions(prevSessions => {
      const updated = prevSessions.map(s => {
        if (s.id === resolvedActiveSessionId) {
          const nextMessages = typeof newMessagesOrFn === 'function' 
            ? newMessagesOrFn(s.messages) 
            : newMessagesOrFn;

          // Auto-generate title from user's first message if title is default
          let newTitle = s.title;
          if (s.title === 'Nouvelle discussion') {
            const firstUserMessage = nextMessages.find(m => m.role === 'user');
            if (firstUserMessage) {
              const text = firstUserMessage.parts[0]?.text || '';
              newTitle = text.length > 25 ? text.substring(0, 22) + '...' : text;
            }
          }

          return {
            ...s,
            messages: nextMessages,
            title: newTitle,
            timestamp: Date.now()
          };
        }
        return s;
      });
      localStorage.setItem('mortech_chat_sessions', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNewChat = () => {
    const newSess = createInitialSession();
    setSessions(prev => {
      const updated = [newSess, ...prev];
      localStorage.setItem('mortech_chat_sessions', JSON.stringify(updated));
      return updated;
    });
    setActiveSessionId(newSess.id);
    localStorage.setItem('mortech_chat_active_session_id', newSess.id);
    setError(null);
    setInput('');
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    localStorage.setItem('mortech_chat_active_session_id', id);
    setError(null);
    setInput('');
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    setSessions(prev => {
      let updated = prev.filter(s => s.id !== id);
      if (updated.length === 0) {
        updated = [createInitialSession()];
      }
      localStorage.setItem('mortech_chat_sessions', JSON.stringify(updated));
      
      if (resolvedActiveSessionId === id) {
        const nextActiveId = updated[0].id;
        setActiveSessionId(nextActiveId);
        localStorage.setItem('mortech_chat_active_session_id', nextActiveId);
      }
      return updated;
    });
  };

  const startRenameSession = (id, currentTitle, e) => {
    e.stopPropagation();
    setEditingSessionId(id);
    setEditingTitle(currentTitle);
  };

  const handleRenameSession = (id) => {
    if (!editingTitle.trim()) return;
    setSessions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, title: editingTitle.trim() } : s);
      localStorage.setItem('mortech_chat_sessions', JSON.stringify(updated));
      return updated;
    });
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleRenameKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleRenameSession(id);
    } else if (e.key === 'Escape') {
      setEditingSessionId(null);
      setEditingTitle('');
    }
  };

  async function handleSend(textToSend) {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) {
      setInput('');
    }

    setError(null);
    const newMessages = [...messages, { role: 'user', parts: [{ text }] }];
    updateActiveSessionMessages(newMessages);
    setLoading(true);

    try {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ messages: newMessages })
});

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'missing_key') {
          throw new Error('missing_key');
        }
        throw new Error(data.message || 'Une erreur est survenue lors de la communication.');
      }

      const data = await response.json();
      updateActiveSessionMessages(prev => [...prev, { role: 'model', parts: [{ text: data.reply }] }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      if (err.message === 'missing_key') {
        setError("Clé API Gemini manquante. Veuillez configurer la variable d'environnement `GEMINI_API_KEY` dans le fichier `backend/.env` et redémarrer le serveur.");
      } else {
        setError("Impossible de contacter le serveur de discussion. Veuillez réessayer ultérieurement.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatMessage(text) {
    if (!text) return null;
    
    // Split by double newlines to isolate paragraphs and blocks
    const blocks = text.split('\n\n');
    
    return blocks.map((block, bIdx) => {
      const lines = block.split('\n');
      const isBulletList = lines.length > 0 && lines.every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
      const isNumberedList = lines.length > 0 && lines.every(line => /^\d+\.\s/.test(line.trim()));
      
      if (isBulletList) {
        return (
          <ul key={bIdx} style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
            {lines.map((line, lIdx) => {
              const cleanText = line.trim().replace(/^[\-\*]\s+/, '');
              return <li key={lIdx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(cleanText) }} />;
            })}
          </ul>
        );
      }
      
      if (isNumberedList) {
        return (
          <ol key={bIdx} style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'decimal' }}>
            {lines.map((line, lIdx) => {
              const cleanText = line.trim().replace(/^\d+\.\s+/, '');
              return <li key={lIdx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(cleanText) }} />;
            })}
          </ol>
        );
      }
      
      // Paragraph with line breaks
      const paragraphHtml = lines.map(line => parseInlineStyles(line)).join('<br/>');
      return <p key={bIdx} dangerouslySetInnerHTML={{ __html: paragraphHtml }} />;
    });
  }

  function parseInlineStyles(text) {
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Bold syntax **text** -> <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Inline code `text` -> <code>text</code>
    formatted = formatted.replace(/`(.*?)`/g, '<code style="background: rgba(0,0,0,0.06); padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');
    
    return formatted;
  }

  return (
    <>
      {/* Floating Button Trigger */}
      <button 
        className={`chatbot-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Discuter avec l'assistant"
        title="Discuter avec l'assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window container */}
      {isOpen && (
        <div className={`chatbot-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          {/* Left Sidebar (History) */}
          <div className="chatbot-sidebar">
            <div className="chatbot-sidebar-header">
              <button className="chatbot-new-chat-btn" onClick={handleNewChat}>
                <Plus size={16} />
                <span>Nouvelle discussion</span>
              </button>
              {/* Back button on mobile to close history drawer */}
              <button 
                className="chatbot-sidebar-close-btn"
                onClick={() => setIsSidebarOpen(false)}
                title="Retour au chat"
                aria-label="Retour au chat"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="chatbot-sessions-list">
              {sessions.map(s => {
                const isActive = s.id === resolvedActiveSessionId;
                const isEditing = s.id === editingSessionId;
                
                return (
                  <div 
                    key={s.id} 
                    className={`chatbot-session-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectSession(s.id)}
                  >
                    {isEditing ? (
                      <div className="chatbot-session-rename-container" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          className="chatbot-session-rename-input"
                          value={editingTitle}
                          onChange={e => setEditingTitle(e.target.value)}
                          onKeyDown={e => handleRenameKeyDown(e, s.id)}
                          autoFocus
                        />
                        <button className="chatbot-rename-confirm-btn" onClick={() => handleRenameSession(s.id)}>
                          <Check size={14} />
                        </button>
                        <button className="chatbot-rename-cancel-btn" onClick={() => setEditingSessionId(null)}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <MessageSquare size={14} className="chatbot-session-icon" />
                        <span className="chatbot-session-title" title={s.title}>{s.title}</span>
                        <div className="chatbot-session-actions">
                          <button 
                            className="chatbot-session-action-btn"
                            onClick={(e) => startRenameSession(s.id, s.title, e)}
                            title="Renommer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            className="chatbot-session-action-btn"
                            onClick={(e) => handleDeleteSession(s.id, e)}
                            title="Supprimer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right/Main Chat Area */}
          <div className="chatbot-main">
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <button 
                  className={`chatbot-sidebar-toggle ${isSidebarOpen ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  title="Historique des discussions"
                  aria-label="Historique des discussions"
                >
                  <History size={18} />
                </button>
                <Bot size={22} />
                <div>
                  <h3 className="chatbot-header-title">Assistant Mortech</h3>
                  <div className="chatbot-status">
                    <span className="chatbot-status-dot"></span>
                    <span>En ligne</span>
                  </div>
                </div>
              </div>
              <button 
                className="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages list */}
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chatbot-msg-row ${msg.role}`}>
                  <div className="chatbot-msg-bubble">
                    {formatMessage(msg.parts[0]?.text)}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="chatbot-msg-row model">
                  <div className="chatbot-msg-bubble" style={{ padding: '8px 12px' }}>
                    <div className="chatbot-typing-indicator">
                      <span className="chatbot-typing-dot"></span>
                      <span className="chatbot-typing-dot"></span>
                      <span className="chatbot-typing-dot"></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error alerts */}
              {error && (
                <div className="chatbot-error-alert">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Suggestion Chips (only show when not loading and input is empty) */}
              {!loading && !error && messages.length === 1 && (
                <div className="chatbot-chips-container">
                  <p style={{ margin: '8px 0 4px', fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>
                    Questions fréquentes :
                  </p>
                  {SUGGESTIONS.map((sug, sIdx) => (
                    <button 
                      key={sIdx}
                      className="chatbot-chip"
                      onClick={() => handleSend(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Footer input area */}
            <div className="chatbot-input-area">
              <input 
                type="text"
                className="chatbot-input-field"
                placeholder="Écrivez votre message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                maxLength={1000}
              />
              <button 
                className="chatbot-send-btn"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                aria-label="Envoyer"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
