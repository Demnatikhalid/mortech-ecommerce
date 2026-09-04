import React, { useEffect, useState, useRef } from 'react';
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Shield,
  User,
  Users,
  Wrench,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Send,
  Bot
} from 'lucide-react';
import { Link } from '../components/Link';
import { formatPrice } from '../helpers';
import {
  getSectionsForRole,
  isStaffRole,
  ROLE_LABELS,
  ROLES,
} from '../constants/roles';

const sectionIcons = {
  stats: BarChart3,
  assistant: Sparkles,
  profile: User,
  inventory: Boxes,
  products: PackagePlus,
  quotes: FileText,
  orders: ClipboardList,
  users: Users,
  claims: Wrench,
};

const claimStatusLabels = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptée',
  RESOLVED: 'Résolue',
};

const orderStatusLabels = {
  PENDING: 'En attente',
  DEVIS: 'Devis',
  CONFIRMED: 'Confirmée',
  PROCESSING: 'En traitement',
  DELIVERED: 'Livrée',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

function AdminAIAssistantSection({ stats, products, orders, claims, onActionExecuted }) {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      parts: [
        {
          text: "Bonjour M. l'Administrateur ! Je suis votre Agent IA Autonome de gestion Mortech Solution.\n\nJe suis habilité à exécuter des actions directes sur votre boutique :\n- 📦 **Produits & Stocks :** Ajouter, modifier, ajuster les stocks, changer les prix, supprimer des produits.\n- 📄 **Devis & Commandes :** Consulter, valider des devis et changer les statuts de livraison des commandes.\n- 🛠️ **SAV :** Traiter et résoudre les réclamations clients.\n- 👥 **Clients :** Créer, mettre à jour ou supprimer des comptes utilisateurs.\n\nDonnez-moi simplement vos instructions !"
        }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(textToSend) {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) setInput('');
    setError(null);
    const newMessages = [...messages, { role: 'user', parts: [{ text }] }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, isAdmin: true })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Une erreur est survenue lors de la communication.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: data.reply }],
        toolExecuted: data.toolExecuted
      }]);

      if (data.toolExecuted && typeof onActionExecuted === 'function') {
        onActionExecuted();
      }
    } catch (err) {
      setError(err.message || 'Impossible de contacter l’Assistant IA.');
    } finally {
      setLoading(false);
    }
  }

  function formatMessage(text) {
    if (!text) return null;
    const blocks = text.split('\n\n');
    return blocks.map((block, bIdx) => {
      const lines = block.split('\n');
      const isBulletList = lines.length > 0 && lines.every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
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
      const paragraphHtml = lines.map(line => parseInlineStyles(line)).join('<br/>');
      return <p key={bIdx} dangerouslySetInnerHTML={{ __html: paragraphHtml }} />;
    });
  }

  function parseInlineStyles(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background: rgba(0,0,0,0.06); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>');
  }

  const quickPrompts = [
    "📊 Fais-moi une synthèse globale du chiffre d'affaires et des commandes",
    "⚠️ Quels sont les produits en rupture totale ou stock critique ?",
    "📦 Analyse l'état des commandes et des devis en attente",
    "🛠️ Résume les réclamations clients et donne des priorités",
    "💡 Propose des packs promotionnels pour booster les ventes"
  ];

  return (
    <div className="admin-ai-workspace">
      <div className="admin-ai-telemetry-grid">
        <div className="admin-ai-telemetry-card">
          <TrendingUp size={24} />
          <div>
            <span>Chiffre d'affaires</span>
            <strong>{formatPrice(stats?.revenue ?? 0)}</strong>
          </div>
        </div>
        <div className="admin-ai-telemetry-card">
          <ClipboardList size={24} />
          <div>
            <span>Commandes totales</span>
            <strong>{orders.length}</strong>
          </div>
        </div>
        <div className="admin-ai-telemetry-card">
          <AlertTriangle size={24} style={{ color: '#e53935' }} />
          <div>
            <span>Alertes stock</span>
            <strong>{stats?.lowStockCount ?? 0} produit(s)</strong>
          </div>
        </div>
        <div className="admin-ai-telemetry-card">
          <Wrench size={24} style={{ color: '#7c3aed' }} />
          <div>
            <span>Réclamations en attente</span>
            <strong>{claims.filter(c => c.status === 'PENDING').length}</strong>
          </div>
        </div>
      </div>

      <div className="admin-ai-chat-box">
        <div className="admin-ai-chat-header">
          <div className="admin-ai-chat-header-info">
            <Sparkles size={22} style={{ color: 'var(--brand)' }} />
            <div>
              <h3>Console Assistant IA Super-Admin</h3>
              <p>Analyse prédictive, requêtes directes et aide à la décision</p>
            </div>
          </div>
          <button className="secondary-button" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setMessages([messages[0]])}>
            Effacer conversation
          </button>
        </div>

        <div className="admin-ai-quick-bar">
          <span>Actions recommandées :</span>
          {quickPrompts.map((prompt, pIdx) => (
            <button key={pIdx} className="admin-ai-quick-btn" onClick={() => handleSend(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <div className="chatbot-messages" style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-msg-row ${msg.role}`}>
              <div className="chatbot-msg-bubble">
                {msg.toolExecuted && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#059669',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    marginBottom: '8px'
                  }}>
                    ⚡ Action exécutée (Base de données actualisée)
                  </div>
                )}
                {formatMessage(msg.parts[0]?.text)}
              </div>
            </div>
          ))}

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

          {error && (
            <div className="chatbot-error-alert">
              <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px' }} />
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="chatbot-input-area">
          <input
            type="text"
            className="chatbot-input-field"
            placeholder="Posez une question sur vos ventes, stocks, clients ou le catalogue..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
          />
          <button className="chatbot-send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="admin-stat-card">
      <span className="admin-stat-label">{label}</span>
      <strong className="admin-stat-value" style={accent ? { color: accent } : undefined}>
        {value}
      </strong>
    </div>
  );
}

export function AdminPage({ currentUser, onLogout, onUpdateCurrentUser, initialSection }) {
  const sections = getSectionsForRole(currentUser?.role);
  const [activeSection, setActiveSection] = useState(initialSection || sections[0]?.id || 'stats');
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    company: currentUser?.company || '',
  });
  const [profileStatus, setProfileStatus] = useState({ loading: false, error: '', success: '' });
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!currentUser || !isStaffRole(currentUser.role)) return;
    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    setProfileForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      company: currentUser.company || '',
    });
  }, [currentUser]);

  useEffect(() => {
    if (initialSection && initialSection !== activeSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection, activeSection]);

  async function handleProfileSave(event) {
    event.preventDefault();
    setProfileStatus({ loading: true, error: '', success: '' });

    try {
      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/users/${currentUser.id}`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      company: profileForm.company,
    }),
  }
);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Impossible de mettre à jour le profil');
      }

      setProfileStatus({ loading: false, error: '', success: 'Profil mis à jour avec succès.' });
      onUpdateCurrentUser?.(data);
    } catch (err) {
      setProfileStatus({ loading: false, error: err.message || 'Erreur lors de la mise à jour', success: '' });
    }
  }

  async function loadData() {
    setLoading(true);
    setError('');
    try {
     const API_URL = import.meta.env.VITE_API_URL;

const requests = [
  fetch(`${API_URL}/api/products`),
  fetch(`${API_URL}/api/orders`),
  fetch(`${API_URL}/api/users`),
  fetch(`${API_URL}/api/claims`),
];

      if (currentUser.role === ROLES.ADMIN) {
       requests.push(fetch(`${API_URL}/api/admin/stats`));
      }

      const responses = await Promise.all(requests);
      const [productsRes, ordersRes, usersRes, claimsRes, statsRes] = responses;

      if (!productsRes.ok || !ordersRes.ok || !usersRes.ok || !claimsRes.ok) {
        throw new Error('Impossible de charger les données admin');
      }

      setProducts(await productsRes.json());
      setOrders(await ordersRes.json());
      setUsers(await usersRes.json());
      setClaims(await claimsRes.json());

      if (statsRes?.ok) {
        setStats(await statsRes.json());
      }
    } catch (err) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status) {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Mise à jour impossible');
    const updated = await response.json();
    setOrders((current) => current.map((order) => (order.id === updated.id ? updated : order)));
  }

  async function updateClaimStatus(claimId, status) {
    const response = await fetch(`${API_URL}/api/claims/${claimId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Mise à jour impossible');
    const updated = await response.json();
    setClaims((current) => current.map((claim) => (claim.id === updated.id ? updated : claim)));
  }

  async function handleAddProduct(event) {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock || '0', 10),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de l\'ajout');

      setProducts((current) => [...current, data]);
      setProductForm({
        name: '',
        description: '',
        brand: '',
        category: '',
        subcategory: '',
        price: '',
        stock: '',
        imageUrl: '',
      });
      setActiveSection('inventory');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
      const response = await fetch(`${API_URL}/api/users/${userId}`, { method: 'DELETE' });
    if (!response.ok) {
      setError('Suppression impossible');
      return;
    }
    setUsers((current) => current.filter((user) => user.id !== userId));
  }

  if (!currentUser) {
    return (
      <section className="admin-shell">
        <div className="admin-guard">
          <h1>Accès réservé</h1>
          <p>Connectez-vous avec un compte administrateur.</p>
          <Link className="primary-button" to="/login?redirect=/admin">Se connecter</Link>
        </div>
      </section>
    );
  }

  if (!isStaffRole(currentUser.role)) {
    return (
      <section className="admin-shell">
        <div className="admin-guard">
          <h1>Accès refusé</h1>
          <p>Cette page est réservée aux administrateurs.</p>
          <Link className="primary-button" to="/">Retour à la boutique</Link>
        </div>
      </section>
    );
  }

  const quotes = orders.filter((order) => order.status === 'DEVIS');
  const clientOrders = orders.filter((order) => order.status !== 'DEVIS');

  function renderOrdersTable(items, statusOptions) {
    if (!items.length) {
      return <p className="admin-empty">Aucun élément pour le moment.</p>;
    }

    return (
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  <strong>{order.user?.name || 'Client'}</strong>
                  <span>{order.user?.email}</span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  <span className={`admin-badge status-${order.status.toLowerCase()}`}>
                    {orderStatusLabels[order.status] || order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {orderStatusLabels[status] || status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderContent() {
    if (loading) return <p className="admin-empty">Chargement...</p>;
    if (error) return <p className="admin-error">{error}</p>;

    switch (activeSection) {
      case 'stats':
        return (
          <div className="admin-stats-grid">
            <StatCard label="Utilisateurs" value={stats?.usersCount ?? 0} />
            <StatCard label="Produits" value={stats?.productsCount ?? 0} />
            <StatCard label="Commandes" value={stats?.ordersCount ?? 0} accent="#075cb8" />
            <StatCard label="Devis en attente" value={stats?.quotesCount ?? 0} accent="#f2b705" />
            <StatCard label="Réclamations" value={stats?.claimsCount ?? 0} accent="#7c3aed" />
            <StatCard label="Stock faible" value={stats?.lowStockCount ?? 0} accent="#e53935" />
            <StatCard label="Chiffre d'affaires" value={formatPrice(stats?.revenue ?? 0)} accent="#0d8b67" />
          </div>
        );

      case 'assistant':
        return (
          <AdminAIAssistantSection
            stats={stats}
            products={products}
            orders={orders}
            claims={claims}
            onActionExecuted={loadData}
          />
        );

      case 'profile':
        return (
          <section className="admin-profile-section">
            <form className="admin-profile-card" onSubmit={handleProfileSave}>
              <h2>Profil Administrateur</h2>
              <label>
                Nom
                <input
                  value={profileForm.name}
                  onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                  required
                />
              </label>
              <label>
                Téléphone
                <input
                  value={profileForm.phone}
                  onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })}
                />
              </label>
              <label>
                Entreprise
                <input
                  value={profileForm.company}
                  onChange={(event) => setProfileForm({ ...profileForm, company: event.target.value })}
                />
              </label>
              {profileStatus.error && <p className="admin-error">{profileStatus.error}</p>}
              {profileStatus.success && <p className="admin-success">{profileStatus.success}</p>}
              <button className="primary-button" type="submit" disabled={profileStatus.loading}>
                {profileStatus.loading ? 'Enregistrement...' : 'Enregistrer les changements'}
              </button>
            </form>
          </section>
        );

      case 'inventory':
        return (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <span>{product.brand}</span>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`admin-badge ${product.stock <= 5 ? 'status-pending' : 'status-confirmed'}`}>
                        {product.stock <= 5 ? 'Stock faible' : 'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'products':
        return (
          <form className="admin-form" onSubmit={handleAddProduct}>
            <div className="admin-form-grid">
              <label>
                Nom du produit
                <input required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              </label>
              <label>
                Marque
                <input value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
              </label>
              <label>
                Catégorie
                <input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
              </label>
              <label>
                Sous-catégorie
                <input value={productForm.subcategory} onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })} />
              </label>
              <label>
                Prix (MAD)
                <input type="number" step="0.01" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              </label>
              <label>
                Stock
                <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
              </label>
              <label className="full">
                Description
                <textarea rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              </label>
              <label className="full">
                URL image
                <input value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} />
              </label>
            </div>
            <button className="primary-button" type="submit">Ajouter le produit</button>
          </form>
        );

      case 'quotes':
        return renderOrdersTable(quotes, ['DEVIS', 'CONFIRMED', 'CANCELLED']);

      case 'orders':
        return renderOrdersTable(clientOrders, ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'COMPLETED', 'CANCELLED']);

      case 'users':
        return (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Commandes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name || '-'}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`admin-badge role-${user.role}`}>
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td>{user.orders?.length ?? 0}</td>
                    <td>
                      {user.role === ROLES.USER && (
                        <button className="admin-danger-btn" type="button" onClick={() => handleDeleteUser(user.id)}>
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'claims':
        return (
          <div className="admin-claims-list">
            {claims.length === 0 && <p className="admin-empty">Aucune réclamation.</p>}
            {claims.map((claim) => (
              <article key={claim.id} className="admin-claim-card">
                <div className="admin-claim-head">
                  <div>
                    <h3>{claim.subject}</h3>
                    <p>{claim.description}</p>
                  </div>
                  <span className={`admin-badge status-${claim.status.toLowerCase()}`}>
                    {claimStatusLabels[claim.status] || claim.status}
                  </span>
                </div>
                <div className="admin-claim-meta">
                  <span>{claim.user?.name || claim.user?.email}</span>
                  <span>{new Date(claim.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="admin-claim-actions">
                  {claim.status === 'PENDING' && (
                    <button className="secondary-button" type="button" onClick={() => updateClaimStatus(claim.id, 'ACCEPTED')}>
                      Accepter réclamation
                    </button>
                  )}
                  {claim.status !== 'RESOLVED' && (
                    <button className="primary-button" type="button" onClick={() => updateClaimStatus(claim.id, 'RESOLVED')}>
                      Résoudre réclamation
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Shield size={22} />
          <div>
            <strong>Mortech Admin</strong>
            <span>{ROLE_LABELS[currentUser.role]}</span>
          </div>
        </div>

        <nav className="admin-nav">
          {sections.map((section) => {
            const Icon = sectionIcons[section.id] || LayoutDashboard;
            return (
              <button
                key={section.id}
                type="button"
                className={activeSection === section.id ? 'active' : ''}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon size={18} />
                {section.label}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <p>{currentUser.name || currentUser.email}</p>
          <Link to="/admin/profil">Profil admin</Link>
          <button type="button" onClick={onLogout}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="eyebrow">Espace administration</span>
            <h1>{sections.find((section) => section.id === activeSection)?.label}</h1>
          </div>
          <button className="secondary-button" type="button" onClick={loadData}>
            Actualiser
          </button>
        </header>
        <section className="admin-content">{renderContent()}</section>
      </main>
    </div>
  );
}
