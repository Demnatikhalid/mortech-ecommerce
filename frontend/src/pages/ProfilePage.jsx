import React, { useState, useEffect } from 'react';
import { Link } from '../components/Link';
import { 
  User, Edit2, Check, X, RefreshCw, ChevronDown, ChevronUp, 
  Clock, Package, Truck, CheckCircle2, AlertTriangle, AlertCircle, ShoppingBag 
} from 'lucide-react';
import { formatPrice } from '../helpers';

const orderStatusLabels = {
  PENDING: 'En attente',
  DEVIS: 'Devis',
  CONFIRMED: 'Confirmée',
  PROCESSING: 'En cours de traitement',
  DELIVERED: 'En cours de livraison',
  COMPLETED: 'Livrée',
  CANCELLED: 'Annulée',
};

const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED':
      return { bg: 'rgba(13, 139, 103, 0.08)', text: 'var(--ok)' };
    case 'DELIVERED':
    case 'PROCESSING':
    case 'CONFIRMED':
      return { bg: 'rgba(7, 92, 184, 0.08)', text: 'var(--brand)' };
    case 'PENDING':
      return { bg: 'rgba(242, 183, 5, 0.1)', text: 'var(--accent)' };
    case 'CANCELLED':
      return { bg: 'rgba(229, 57, 53, 0.08)', text: 'var(--category-red)' };
    case 'DEVIS':
      return { bg: '#f4f7fb', text: 'var(--muted)' };
    default:
      return { bg: '#f4f7fb', text: 'var(--ink)' };
  }
};

const formatDate = (dateString) => {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

function OrderTracking({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div style={{
        background: 'rgba(229, 57, 53, 0.05)',
        border: '1px solid rgba(229, 57, 53, 0.2)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--category-red)',
        fontSize: '0.9rem',
        margin: '1rem 0'
      }}>
        <AlertTriangle size={18} />
        <span>Cette commande a été annulée.</span>
      </div>
    );
  }

  if (status === 'DEVIS') {
    return (
      <div style={{
        background: 'rgba(7, 92, 184, 0.05)',
        border: '1px solid rgba(7, 92, 184, 0.2)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--brand)',
        fontSize: '0.9rem',
        margin: '1rem 0'
      }}>
        <Clock size={18} />
        <span>Votre demande de devis est en cours de traitement par notre équipe commerciale.</span>
      </div>
    );
  }

  const steps = [
    { label: 'Reçue', icon: Clock, statuses: ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'COMPLETED'] },
    { label: 'Confirmée', icon: Package, statuses: ['CONFIRMED', 'PROCESSING', 'DELIVERED', 'COMPLETED'] },
    { label: 'Expédiée', icon: Truck, statuses: ['DELIVERED', 'COMPLETED'] },
    { label: 'Livrée', icon: CheckCircle2, statuses: ['COMPLETED'] }
  ];

  let activeIndex = -1;
  if (status === 'PENDING') activeIndex = 0;
  else if (status === 'CONFIRMED' || status === 'PROCESSING') activeIndex = 1;
  else if (status === 'DELIVERED') activeIndex = 2;
  else if (status === 'COMPLETED') activeIndex = 3;

  const progressPercentage = activeIndex === 0 ? 0 : activeIndex === 1 ? 33 : activeIndex === 2 ? 66 : 100;

  return (
    <div style={{ margin: '1.5rem 0 2rem 0', padding: '0 0.5rem' }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        {/* Background track line */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '20px',
          right: '20px',
          height: '4px',
          background: 'var(--soft)',
          zIndex: 1,
          borderRadius: '2px'
        }} />

        {/* Active progress line */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '20px',
          width: `calc((100% - 40px) * ${activeIndex / 3})`,
          height: '4px',
          background: 'var(--brand)',
          zIndex: 2,
          borderRadius: '2px',
          transition: 'width 0.4s ease'
        }} />

        {steps.map((step, idx) => {
          const isCompleted = step.statuses.includes(status);
          const isActive = idx === activeIndex;
          const StepIcon = step.icon;

          return (
            <div key={idx} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '20%',
              textAlign: 'center',
              zIndex: 3
            }}>
              {/* Step Circle */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isCompleted ? 'var(--brand)' : '#fff',
                border: `2px solid ${isCompleted ? 'var(--brand)' : 'var(--line)'}`,
                color: isCompleted ? '#fff' : 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCompleted ? '0 4px 10px rgba(7, 92, 184, 0.25)' : 'none',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: isActive ? 'scale(1.15)' : 'none'
              }}>
                <StepIcon size={18} />
              </div>
              
              {/* Step Label */}
              <span style={{
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                fontWeight: isCompleted ? '600' : '500',
                color: isCompleted ? 'var(--ink)' : 'var(--muted)',
                transition: 'color 0.3s ease'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProfilePage({ currentUser, onLogout, onUpdateCurrentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  async function fetchOrders() {
    if (!currentUser) return;
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const response = await fetch(`/api/orders?userId=${currentUser.id}`);
      if (!response.ok) throw new Error('Impossible de charger vos commandes');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setOrdersError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (!currentUser) {
    return (
      <section className="page-shell">
        <div className="section-heading">
          <h1>Mon profil</h1>
        </div>
        <p>Vous n'êtes pas connecté. <Link to="/login">Connectez-vous</Link> pour voir votre profil.</p>
      </section>
    );
  }

  async function handleSaveName(e) {
    if (e) e.preventDefault();
    const trimmed = editedName.trim();
    if (!trimmed) {
      setError('Le nom ne peut pas être vide');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Impossible de mettre à jour le profil');
      }
      onUpdateCurrentUser?.(data);
      setIsEditing(false);
      setSuccess('Nom mis à jour avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Compte</span>
          <h1>Mon profil</h1>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          color: '#111', 
          border: '1px solid var(--line)', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {/* Card Header */}
          <div style={{ 
            background: 'var(--soft)', 
            padding: '2.5rem 2rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            borderBottom: '1px solid var(--line)'
          }}>
            <div style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: 'var(--brand)', 
              color: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(7, 92, 184, 0.2)'
            }}>
              <User size={36} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--ink)' }}>
                {currentUser.name || 'Utilisateur'}
              </h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                {currentUser.email}
              </span>
            </div>
          </div>

          {/* Card Content Details */}
          <div style={{ padding: '0.5rem 0' }}>
            {/* Nom Detail Row */}
            <div style={{ 
              padding: '1.25rem 2rem', 
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <span style={{ fontWeight: '600', color: 'var(--muted)', minWidth: '120px' }}>Nom</span>
                
                {!isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '500', color: 'var(--ink)', fontSize: '1.05rem' }}>
                      {currentUser.name || '-'}
                    </span>
                    <button 
                      onClick={() => {
                        setIsEditing(true);
                        setEditedName(currentUser.name || '');
                        setError('');
                        setSuccess('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand)',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                      }}
                      className="edit-profile-btn"
                      title="Modifier le nom"
                    >
                      <Edit2 size={14} />
                      Modifier
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveName} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: '350px' }}>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      disabled={loading}
                      placeholder="Votre nom"
                      required
                      autoFocus
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.95rem',
                        borderRadius: '8px',
                        border: '1px solid var(--line)',
                        flex: 1,
                        outlineColor: 'var(--brand)',
                        background: '#fbfdff'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        background: 'var(--brand)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                        opacity: loading ? 0.7 : 1
                      }}
                      title="Enregistrer"
                    >
                      {loading ? <span className="btn-spinner" /> : <Check size={18} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setError(''); }}
                      disabled={loading}
                      style={{
                        background: 'var(--soft)',
                        color: 'var(--ink)',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Annuler"
                    >
                      <X size={18} />
                    </button>
                  </form>
                )}
              </div>

              {error && (
                <p style={{ color: 'var(--category-red)', fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>
                  {error}
                </p>
              )}
              {success && (
                <p style={{ color: 'var(--ok)', fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>
                  {success}
                </p>
              )}
            </div>

            {/* Email Detail Row */}
            <div style={{ 
              padding: '1.25rem 2rem', 
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '600', color: 'var(--muted)', minWidth: '120px' }}>Email</span>
              <span style={{ fontWeight: '500', color: 'var(--ink)', fontSize: '1.05rem' }}>
                {currentUser.email}
              </span>
            </div>

            {/* Téléphone Detail Row */}
            <div style={{ 
              padding: '1.25rem 2rem', 
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '600', color: 'var(--muted)', minWidth: '120px' }}>Téléphone</span>
              <span style={{ fontWeight: '500', color: 'var(--ink)', fontSize: '1.05rem' }}>
                {currentUser.phone || '-'}
              </span>
            </div>

            {/* Entreprise Detail Row */}
            <div style={{ 
              padding: '1.25rem 2rem', 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '600', color: 'var(--muted)', minWidth: '120px' }}>Entreprise</span>
              <span style={{ fontWeight: '500', color: 'var(--ink)', fontSize: '1.05rem' }}>
                {currentUser.company || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: 'var(--ink)' }}>Mes commandes</h2>
          <button 
            onClick={fetchOrders}
            disabled={ordersLoading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            <RefreshCw size={16} style={ordersLoading ? { animation: 'btn-spin 1s linear infinite' } : undefined} />
            Actualiser
          </button>
        </div>

        {ordersLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--line)' }}>
            <div className="btn-spinner" style={{ borderTopColor: 'var(--brand)', width: '32px', height: '32px', border: '3px solid rgba(7, 92, 184, 0.1)', borderRadius: '50%' }} />
            <p style={{ marginTop: '1rem', color: 'var(--muted)', fontWeight: '500' }}>Chargement de vos commandes...</p>
          </div>
        ) : ordersError ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--line)', color: 'var(--category-red)' }}>
            <AlertCircle size={32} style={{ marginBottom: '0.5rem' }} />
            <p style={{ margin: 0, fontWeight: '600' }}>{ordersError}</p>
            <button className="secondary-button" onClick={fetchOrders} style={{ marginTop: '1rem' }}>Réessayer</button>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--line)' }}>
            <ShoppingBag size={48} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
            <p style={{ margin: 0, color: 'var(--ink)', fontWeight: '600', fontSize: '1.1rem' }}>Aucune commande trouvée</p>
            <p style={{ margin: '0.5rem 0 1.5rem 0', color: 'var(--muted)' }}>Vous n'avez pas encore passé de commande ou de demande de devis.</p>
            <Link to="/produits" className="primary-button" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => {
              const isExpanded = !!expandedOrders[order.id];
              const statusDetails = getStatusColor(order.status);

              return (
                <div 
                  key={order.id}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid var(--line)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Order Card Header */}
                  <div 
                    onClick={() => toggleOrder(order.id)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: '#fafbfc',
                      borderBottom: isExpanded ? '1px solid var(--line)' : 'none',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600', display: 'block', textTransform: 'uppercase' }}>Référence</span>
                        <span style={{ fontWeight: '700', color: 'var(--ink)', fontSize: '0.95rem' }}>#{order.id}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600', display: 'block', textTransform: 'uppercase' }}>Date</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600', display: 'block', textTransform: 'uppercase' }}>Total</span>
                        <span style={{ fontWeight: '700', color: 'var(--brand)', fontSize: '0.95rem' }}>{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: statusDetails.bg,
                        color: statusDetails.text
                      }}>
                        {orderStatusLabels[order.status] || order.status}
                      </span>
                      {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--muted)' }} />}
                    </div>
                  </div>

                  {/* Order Card Content (Tracking + Products) */}
                  <div style={{
                    maxHeight: isExpanded ? '2000px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--line)' }}>
                      {/* Tracking section */}
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)' }}>
                        Suivi de la commande
                      </h3>
                      <OrderTracking status={order.status} />

                      {/* Items section */}
                      <h3 style={{ margin: '1.5rem 0 1rem 0', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)' }}>
                        Articles commandés
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {order.orderItems && order.orderItems.map((item, idx) => (
                          <div 
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.75rem 1rem',
                              background: 'var(--soft)',
                              borderRadius: '8px',
                              border: '1px solid var(--line)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              {item.product && item.product.imageUrl && (
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name} 
                                  style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: '#fff', border: '1px solid var(--line)' }}
                                />
                              )}
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--ink)' }}>
                                  {item.product ? item.product.name : 'Produit inconnu'}
                                </div>
                                {item.product && item.product.brand && (
                                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{item.product.brand}</span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                                Qté : <strong>{item.quantity}</strong>
                              </span>
                              <span style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '0.9rem' }}>
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            className="secondary-button" 
            onClick={() => onLogout()}
            style={{ padding: '0.75rem 2rem', borderRadius: '8px' }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
