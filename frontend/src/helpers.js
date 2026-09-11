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

export const PRODUCTS_WITH_360 = [
  'Alarme autonome avec sirene integree et detecteur',
  'Armoire informatique etanche murale 12U IP65',
  'Armoire informatique reseau 19 pouces 9U',
  'Box domotique Somfy TaHoma Switch',
  'Cable alarme 6 conducteurs pour systeme intrusion',
  'Cable incendie CR1 rouge 2 conducteurs',
];

export function hasProduct360View(product) {
  if (!product || !product.name) return false;
  const pName = product.name.trim().toLowerCase();
  return PRODUCTS_WITH_360.some((name) => name.toLowerCase() === pName);
}

export function getProduct360Images(product) {
  if (!product || !product.name) return null;
  const pName = product.name.trim().toLowerCase();
  const match = PRODUCTS_WITH_360.find((name) => name.toLowerCase() === pName);
  if (!match) return null;

  return Array.from({ length: 12 }, (_, i) => 
    `/360view/${encodeURIComponent(match)}/angle-${i + 1}.png`
  );
}

export function getProductImageUrl(product) {
  if (!product) return 'https://via.placeholder.com/420x280?text=Image+indisponible';

  // If product has 360 view, angle-1 is always available and high-res
  if (hasProduct360View(product)) {
    const pName = product.name.trim().toLowerCase();
    const match = PRODUCTS_WITH_360.find((name) => name.toLowerCase() === pName);
    if (match) {
      return `/360view/${encodeURIComponent(match)}/angle-1.png`;
    }
  }

  const raw = product.imageUrl || product.image;
  if (!raw) return 'https://via.placeholder.com/420x280?text=Image+indisponible';

  try {
    return encodeURI(decodeURI(raw));
  } catch (e) {
    return encodeURI(raw);
  }
}


