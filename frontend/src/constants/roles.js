export const ROLES = {
  ADMIN: 'admin',
  TECHNICIEN: 'technicien',
  USER: 'user',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin Gestionnaire',
  [ROLES.TECHNICIEN]: 'Technicien Support SAV',
  [ROLES.USER]: 'Client Authentifié',
};

export const ADMIN_SECTIONS = [
  { id: 'stats', label: 'Voir statistiques' },
  { id: 'inventory', label: 'Gérer inventaire' },
  { id: 'products', label: 'Ajouter produits' },
  { id: 'quotes', label: 'Traiter devis client' },
  { id: 'orders', label: 'Traiter commandes client' },
  { id: 'users', label: 'Gérer utilisateurs' },
];

export const TECHNICIEN_SECTIONS = [
  { id: 'claims', label: 'Voir réclamations' },
];

export function isStaffRole(role) {
  return role === ROLES.ADMIN || role === ROLES.TECHNICIEN;
}

export function getSectionsForRole(role) {
  if (role === ROLES.ADMIN) return ADMIN_SECTIONS;
  if (role === ROLES.TECHNICIEN) return TECHNICIEN_SECTIONS;
  return [];
}
