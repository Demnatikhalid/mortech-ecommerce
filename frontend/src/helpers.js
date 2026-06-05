export function formatPrice(value) {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value);
}

export function buildWhatsAppOrder(cart, total, name) {
  const lines = cart.length
    ? cart.map((item) => `- ${item.name} x${item.qty} = ${formatPrice(item.price * item.qty)}`)
    : ['Panier vide'];

  const userNameLine = name ? `Mon nom: ${name}\n` : '';
  return `Bonjour Mortech Solutions, je souhaite commander:\n${userNameLine}${lines.join('\n')}\nTotal: ${formatPrice(total)}`;
}

export function getRoute() {
  return window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
}

export function getLocationKey() {
  return `${getRoute()}${window.location.search}`;
}

export function getCategoryUrl(category, subcategory) {
  if (!category || category === 'Tous') return '/produits';
  const params = new URLSearchParams({ categorie: category });
  if (subcategory) params.set('type', subcategory);
  return `/produits?${params.toString()}`;
}

export function normalizeProductCategory(category) {
  return category;
}

export function shouldFilterSubcategory(groupName) {
  return [
    'Videosurveillance',
    'Securite',
    'Materiel Informatique',
    'Equipement Reseaux',
    'Domotique',
    'Controle Dacces et Pointeuse',
  ].includes(groupName);
}
