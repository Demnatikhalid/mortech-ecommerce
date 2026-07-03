import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, AlertTriangle } from 'lucide-react';

const SUGGESTIONS = [
  "Quels produits de vidéosurveillance proposez-vous ?",
  "Comment configurer ou installer une caméra IP ?",
  "Quelle est la qualité des produits Dahua et Hikvision ?",
  "Avez-vous des points d'accès Ruijie en stock ?"
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      parts: [
        {
          text: "Bonjour ! Je suis l'assistant virtuel de Mortech Solution. \n\nComment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur les détails et prix de nos produits, ou vous donner des conseils d'installation pour nos caméras et équipements réseaux !"
        }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

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

  async function handleSend(textToSend) {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) {
      setInput('');
    }

    setError(null);
    const newMessages = [...messages, { role: 'user', parts: [{ text }] }];
    setMessages(newMessages);
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
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.reply }] }]);
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
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
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
      )}
    </>
  );
}
