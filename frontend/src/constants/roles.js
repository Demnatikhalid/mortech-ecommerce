export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin Gestionnaire',
  [ROLES.USER]: 'Client Authentifié',
};

export const ADMIN_SECTIONS = [
  { id: 'stats', label: 'Voir statistiques' },
  { id: 'inventory', label: 'Gérer inventaire' },
  { id: 'products', label: 'Ajouter produits' },
  { id: 'quotes', label: 'Traiter devis client' },
  { id: 'orders', label: 'Traiter commandes client' },
  { id: 'users', label: 'Gérer utilisateurs' },
  { id: 'claims', label: 'Voir réclamations' },
];

export function isStaffRole(role) {
  return role === ROLES.ADMIN;
}

export function getSectionsForRole(role) {
  if (role === ROLES.ADMIN) return ADMIN_SECTIONS;
  return [];
}
