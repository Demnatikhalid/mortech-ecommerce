import crypto from 'crypto';
import { sendCartValidatedEmail, sendQuotePdfEmail } from './orderEmails.js';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper formatting function
function formatPrice(amount) {
  return `${Number(amount).toFixed(2)} MAD`;
}

/**
 * 0. Afficher le panier courant
 */
export async function get_cart(args, ctx) {
  const cart = ctx.cart || [];

  if (cart.length === 0) {
    return { cart: [], total: '0.00 MAD', message: 'Le panier est actuellement vide.' };
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    cart: cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: formatPrice(item.price),
      quantity: item.qty,
      lineTotal: formatPrice(item.price * item.qty)
    })),
    itemCount: cart.length,
    total: formatPrice(total)
  };
}

/**
 * 1. Recherche de produits du catalogue
 */
export async function search_products(args, ctx) {
  const { query, category, brand, minPrice, maxPrice } = args;

  const where = {};

  if (category) {
    where.category = { contains: category, mode: 'insensitive' };
  }

  if (brand) {
    where.brand = { contains: brand, mode: 'insensitive' };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
    if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ];
  }

  const products = await ctx.prisma.product.findMany({
    where,
    take: 10
  });

  return { products };
}

/**
 * 2. Récupérer les caractéristiques d'un produit
 */
export async function get_product_details(args, ctx) {
  const { productId } = args;
  if (!productId) return { error: "productId_missing", message: "productId requis" };

  const product = await ctx.prisma.product.findUnique({
    where: { id: parseInt(productId, 10) }
  });

  if (!product) return { error: "product_not_found", message: `Produit avec l'ID ${productId} introuvable` };

  return { product };
}

/**
 * 3. Comparer plusieurs produits
 */
export async function compare_products(args, ctx) {
  const { productIds } = args;
  if (!productIds || !Array.isArray(productIds)) {
    return { error: "invalid_input", message: "productIds doit être un tableau d'identifiants" };
  }

  const ids = productIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

  const products = await ctx.prisma.product.findMany({
    where: { id: { in: ids } }
  });

  return { products };
}

/**
 * 4. Ajouter un produit au panier
 */
export async function add_to_cart(args, ctx) {
  const { productId, quantity = 1 } = args;
  const qty = parseInt(quantity, 10);
  const pId = parseInt(productId, 10);

  if (isNaN(pId) || isNaN(qty) || qty <= 0) {
    return { error: "invalid_params", message: "Paramètres productId ou quantity invalides" };
  }

  const product = await ctx.prisma.product.findUnique({ where: { id: pId } });
  if (!product) {
    return { error: "product_not_found", message: `Produit #${pId} introuvable.` };
  }

  if (product.stock <= 0) {
    return { error: "out_of_stock", message: `Le produit ${product.name} est en rupture de stock.` };
  }

  // Add action to update frontend cart
  ctx.actions.push({
    type: 'ADD_TO_CART',
    payload: {
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: qty
    }
  });

  return {
    success: true,
    message: `J'ai ajouté ${qty}x "${product.name}" au panier.`,
    productAdded: { id: product.id, name: product.name, price: product.price, quantity: qty }
  };
}

/**
 * 5. Retirer un produit du panier
 */
export async function remove_from_cart(args, ctx) {
  const { productId } = args;
  const pId = parseInt(productId, 10);

  if (isNaN(pId)) {
    return { error: "invalid_params", message: "productId invalide" };
  }

  ctx.actions.push({
    type: 'REMOVE_FROM_CART',
    payload: { productId: pId }
  });

  return {
    success: true,
    message: `J'ai retiré le produit #${pId} du panier.`
  };
}

/**
 * 6. Modifier la quantité dans le panier
 */
export async function update_cart_quantity(args, ctx) {
  const { productId, quantity } = args;
  const pId = parseInt(productId, 10);
  const qty = parseInt(quantity, 10);

  if (isNaN(pId) || isNaN(qty) || qty < 0) {
    return { error: "invalid_params", message: "Paramètres invalides" };
  }

  if (qty === 0) {
    ctx.actions.push({
      type: 'REMOVE_FROM_CART',
      payload: { productId: pId }
    });
    return { success: true, message: `J'ai retiré le produit #${pId} du panier.` };
  }

  ctx.actions.push({
    type: 'UPDATE_CART_QTY',
    payload: { productId: pId, qty }
  });

  return {
    success: true,
    message: `Quantité mise à jour à ${qty} pour le produit #${pId}.`
  };
}

/**
 * 7. Vider le panier
 */
export async function clear_cart(args, ctx) {
  ctx.actions.push({ type: 'CLEAR_CART' });
  return { success: true, message: "Le panier a été vidé." };
}

/**
 * 8. Créer une commande
 */
export async function create_order(args, ctx) {
  if (!ctx.user) {
    return { error: "auth_required", message: "Vous devez être connecté pour passer une commande." };
  }

  if (!ctx.cart || ctx.cart.length === 0) {
    return { error: "empty_cart", message: "Votre panier est vide. Veuillez y ajouter des produits avant de passer commande." };
  }

  // Verify stock for all items
  for (const item of ctx.cart) {
    const product = await ctx.prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || product.stock < item.qty) {
      return {
        error: "insufficient_stock",
        message: `Stock insuffisant pour le produit "${product ? product.name : 'Inconnu'}". Stock disponible: ${product ? product.stock : 0}`
      };
    }
  }

  const total = ctx.cart.reduce((t, i) => t + i.price * i.qty, 0);

  // Start Transaction to create order and decrement stocks
  const order = await ctx.prisma.$transaction(async (tx) => {
    // 1. Create the order
    const newOrder = await tx.order.create({
      data: {
        userId: ctx.user.id,
        total,
        status: 'PENDING',
        orderItems: {
          create: ctx.cart.map(item => ({
            productId: item.productId,
            quantity: item.qty,
            price: item.price
          }))
        }
      },
      include: {
        orderItems: {
          include: { product: true }
        },
        user: true
      }
    });

    // 2. Decrement product stocks
    for (const item of ctx.cart) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } }
      });
    }

    return newOrder;
  });

  // Send confirmation email
  try {
    await sendCartValidatedEmail(ctx.transporter, order, ctx.baseUrl, ctx.logoUrl);
  } catch (emailErr) {
    console.error("Erreur lors de l'envoi de l'email de commande:", emailErr);
  }

  // Clear cart and redirect
  ctx.actions.push({ type: 'CLEAR_CART' });
  ctx.actions.push({ type: 'REDIRECT', payload: '/profil' });

  return {
    success: true,
    orderId: order.id,
    total: formatPrice(total),
    message: `Votre commande #${order.id} a été enregistrée avec succès. Un e-mail de confirmation contenant le récapitulatif vous a été envoyé. Le panier a été vidé.`
  };
}

/**
 * 9. Consulter l'historique des commandes
 */
export async function get_orders(args, ctx) {
  if (!ctx.user) {
    return { error: "auth_required", message: "Veuillez vous connecter pour voir vos commandes." };
  }

  const orders = await ctx.prisma.order.findMany({
    where: { userId: ctx.user.id },
    include: {
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return { orders };
}

/**
 * 10. Suivre une commande
 */
export async function track_order(args, ctx) {
  const { orderId } = args;
  const oId = parseInt(orderId, 10);

  if (isNaN(oId)) {
    return { error: "invalid_params", message: "orderId invalide" };
  }

  if (!ctx.user) {
    return { error: "auth_required", message: "Connexion requise pour suivre la livraison." };
  }

  const order = await ctx.prisma.order.findFirst({
    where: {
      id: oId,
      userId: ctx.user.id
    },
    include: {
      orderItems: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    return { error: "order_not_found", message: `La commande #${oId} n'existe pas ou ne vous appartient pas.` };
  }

  // Delivery status mappings
  let deliveryEstimate = "3 à 5 jours ouvrés";
  let carrier = "Aramex Maroc";
  let statusDetail = "En attente de validation";

  if (order.status === 'VALIDATED') {
    statusDetail = "Commande validée, en cours de préparation dans notre entrepôt.";
  } else if (order.status === 'SHIPPED') {
    statusDetail = "Expédiée ! Colis remis au transporteur.";
  } else if (order.status === 'DELIVERED') {
    statusDetail = "Livreur passé. Colis livré.";
  }

  return {
    orderId: order.id,
    status: order.status,
    statusDetail,
    carrier,
    deliveryEstimate,
    total: formatPrice(order.total),
    createdAt: order.createdAt
  };
}

/**
 * 11. Générer un devis
 */
export async function generate_quote(args, ctx) {
  if (!ctx.user) {
    return { error: "auth_required", message: "Veuillez vous connecter afin de générer un devis officiel." };
  }

  if (!ctx.cart || ctx.cart.length === 0) {
    return { error: "empty_cart", message: "Votre panier est vide. Ajoutez des produits avant de générer un devis." };
  }

  const total = ctx.cart.reduce((t, i) => t + i.price * i.qty, 0);

  const quote = await ctx.prisma.quote.create({
    data: {
      userId: ctx.user.id,
      total,
      status: 'PENDING',
      items: ctx.cart
    },
    include: {
      user: true
    }
  });

  // Map database format to layout expected by PDF generator / email sender
  const orderLikeObj = {
    id: quote.id,
    createdAt: quote.createdAt,
    total: quote.total,
    user: quote.user,
    orderItems: ctx.cart.map((item, idx) => ({
      id: idx + 1,
      productId: item.productId,
      quantity: item.qty,
      price: item.price,
      product: { name: item.name }
    }))
  };

  // Send the email with the attached PDF
  try {
    await sendQuotePdfEmail(ctx.transporter, orderLikeObj, ctx.baseUrl, ctx.logoUrl);
  } catch (emailErr) {
    console.error("Erreur lors de l'envoi de l'email de devis:", emailErr);
  }

  // Provide download link action
  const downloadUrl = `${ctx.baseUrl}/api/quotes/${quote.id}/download`;

  ctx.actions.push({ type: 'REDIRECT', payload: '/profil' });

  return {
    success: true,
    quoteId: quote.id,
    total: formatPrice(total),
    downloadUrl,
    message: `Le devis N° DEV-${quote.id} a été généré avec succès ! Le fichier PDF vous a été envoyé par e-mail. Vous pouvez le télécharger sur votre profil.`
  };
}

/**
 * 12. Convertir un devis en commande
 */
export async function convert_quote_to_order(args, ctx) {
  const { quoteId } = args;
  const qId = parseInt(quoteId, 10);

  if (isNaN(qId)) {
    return { error: "invalid_params", message: "quoteId requis et doit être numérique" };
  }

  if (!ctx.user) {
    return { error: "auth_required", message: "Veuillez vous connecter." };
  }

  const quote = await ctx.prisma.quote.findFirst({
    where: { id: qId, userId: ctx.user.id }
  });

  if (!quote) {
    return { error: "quote_not_found", message: `Devis DEV-${qId} introuvable.` };
  }

  if (quote.status === 'ORDERED') {
    return { error: "already_ordered", message: "Ce devis a déjà été converti en commande." };
  }

  const items = quote.items; // JSON array: [{productId, name, price, qty}]
  if (!Array.isArray(items)) {
    return { error: "invalid_quote_items", message: "Les articles du devis sont invalides." };
  }

  // Create the order
  const order = await ctx.prisma.$transaction(async (tx) => {
    // 1. Create order
    const newOrder = await tx.order.create({
      data: {
        userId: ctx.user.id,
        total: quote.total,
        status: 'PENDING',
        orderItems: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.qty,
            price: item.price
          }))
        }
      },
      include: {
        orderItems: { include: { product: true } },
        user: true
      }
    });

    // 2. Update quote status
    await tx.quote.update({
      where: { id: quote.id },
      data: { status: 'ORDERED' }
    });

    // 3. Decrement stocks
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } }
      });
    }

    return newOrder;
  });

  try {
    await sendCartValidatedEmail(ctx.transporter, order, ctx.baseUrl, ctx.logoUrl);
  } catch (emailErr) {
    console.error(emailErr);
  }

  ctx.actions.push({ type: 'REDIRECT', payload: '/profil' });

  return {
    success: true,
    orderId: order.id,
    message: `Le devis DEV-${quote.id} a été converti en commande #${order.id} avec succès.`
  };
}

/**
 * 13. Récupérer et modifier le profil
 */
export async function get_profile(args, ctx) {
  if (!ctx.user) return { error: "auth_required", message: "Connexion requise." };
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.user.id },
    select: { id: true, name: true, email: true, phone: true, company: true, role: true }
  });
  return { profile: user };
}

export async function update_profile(args, ctx) {
  if (!ctx.user) return { error: "auth_required", message: "Connexion requise." };
  const { name, phone, company } = args;

  const updatedUser = await ctx.prisma.user.update({
    where: { id: ctx.user.id },
    data: { name, phone, company },
    select: { id: true, name: true, email: true, phone: true, company: true, role: true }
  });

  ctx.actions.push({
    type: 'UPDATE_USER',
    payload: updatedUser
  });

  return { success: true, profile: updatedUser, message: "Vos informations de profil ont été mises à jour." };
}

/**
 * 14. Gérer les favoris
 */
export async function get_favorites(args, ctx) {
  if (!ctx.user) return { error: "auth_required", message: "Connexion requise." };

  const favorites = await ctx.prisma.favorite.findMany({
    where: { userId: ctx.user.id },
    include: { product: true }
  });

  return { favorites };
}

export async function toggle_favorite(args, ctx) {
  const { productId } = args;
  const pId = parseInt(productId, 10);

  if (isNaN(pId)) return { error: "invalid_params", message: "productId invalide" };
  if (!ctx.user) return { error: "auth_required", message: "Veuillez vous connecter pour gérer vos favoris." };

  const existing = await ctx.prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId: ctx.user.id,
        productId: pId
      }
    }
  });

  if (existing) {
    await ctx.prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: ctx.user.id,
          productId: pId
        }
      }
    });
    return { success: true, isFavorite: false, message: "Produit retiré des favoris." };
  } else {
    try {
      await ctx.prisma.favorite.create({
        data: {
          userId: ctx.user.id,
          productId: pId
        }
      });
      return { success: true, isFavorite: true, message: "Produit ajouté aux favoris." };
    } catch (e) {
      return { error: "product_not_found", message: "Produit introuvable." };
    }
  }
}

/**
 * 15. Administration - Statistiques, Produits, Stocks, Prix, Devis, Commandes, Réclamations, Utilisateurs
 */
export async function admin_get_sales_analytics(args, ctx) {
  const { period = 'month' } = args;

  const orders = await ctx.prisma.order.findMany({
    where: {
      status: { notIn: ['CANCELLED', 'DEVIS'] }
    },
    include: {
      orderItems: true
    }
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;

  const lowStockProducts = await ctx.prisma.product.findMany({
    where: { stock: { lte: 5 } },
    select: { id: true, name: true, stock: true, price: true }
  });

  return {
    analytics: {
      totalRevenue: formatPrice(totalRevenue),
      orderCount: totalOrders,
      lowStockAlertCount: lowStockProducts.length,
      lowStockProducts,
      periodRequested: period
    }
  };
}

export async function admin_create_product(args, ctx) {
  const { name, description, brand, category, subcategory, price, stock = 0, imageUrl, badge } = args;
  const priceVal = parseFloat(price);
  const stockVal = parseInt(stock, 10) || 0;

  if (!name || isNaN(priceVal) || priceVal <= 0) {
    return { error: "invalid_params", message: "Nom du produit et prix valide requis." };
  }

  const product = await ctx.prisma.product.create({
    data: {
      name,
      description: description || null,
      brand: brand || null,
      category: category || null,
      subcategory: subcategory || null,
      badge: badge || null,
      price: priceVal,
      stock: stockVal,
      imageUrl: imageUrl || null
    }
  });

  return { success: true, product, message: `Produit "${name}" créé avec succès (ID: #${product.id}, Prix: ${formatPrice(priceVal)}, Stock: ${stockVal}).` };
}

export async function admin_update_product(args, ctx) {
  const { productId, name, price, stock, brand, category, subcategory, description, badge } = args;
  const pId = parseInt(productId, 10);

  if (isNaN(pId)) {
    return { error: "invalid_params", message: "productId invalide." };
  }

  const data = {};
  if (name !== undefined) data.name = name;
  if (price !== undefined) data.price = parseFloat(price);
  if (stock !== undefined) data.stock = parseInt(stock, 10);
  if (brand !== undefined) data.brand = brand;
  if (category !== undefined) data.category = category;
  if (subcategory !== undefined) data.subcategory = subcategory;
  if (description !== undefined) data.description = description;
  if (badge !== undefined) data.badge = badge;

  const product = await ctx.prisma.product.update({
    where: { id: pId },
    data
  });

  return { success: true, product, message: `Produit #${pId} ("${product.name}") mis à jour avec succès.` };
}

export async function admin_update_product_stock(args, ctx) {
  const { productId, newStock } = args;
  const pId = parseInt(productId, 10);
  const stockVal = parseInt(newStock, 10);

  if (isNaN(pId) || isNaN(stockVal) || stockVal < 0) {
    return { error: "invalid_params", message: "Paramètres invalides." };
  }

  const product = await ctx.prisma.product.update({
    where: { id: pId },
    data: { stock: stockVal }
  });

  return { success: true, product, message: `Stock mis à jour à ${stockVal} unités pour "${product.name}" (ID #${pId}).` };
}

export async function admin_update_product_price(args, ctx) {
  const { productId, newPrice } = args;
  const pId = parseInt(productId, 10);
  const priceVal = parseFloat(newPrice);

  if (isNaN(pId) || isNaN(priceVal) || priceVal <= 0) {
    return { error: "invalid_params", message: "Paramètres invalides." };
  }

  const product = await ctx.prisma.product.update({
    where: { id: pId },
    data: { price: priceVal }
  });

  return { success: true, product, message: `Prix mis à jour à ${formatPrice(priceVal)} pour "${product.name}" (ID #${pId}).` };
}

export async function admin_delete_product(args, ctx) {
  const { productId, productName } = args;
  let pId = parseInt(productId, 10);

  if (isNaN(pId) && productName) {
    const found = await ctx.prisma.product.findFirst({
      where: { name: { contains: productName, mode: 'insensitive' } }
    });
    if (found) pId = found.id;
  }

  if (isNaN(pId)) {
    return { error: "product_not_found", message: "Produit introuvable à supprimer." };
  }

  try {
    const deleted = await ctx.prisma.product.delete({
      where: { id: pId }
    });
    return { success: true, deleted, message: `Le produit "${deleted.name}" (ID #${deleted.id}) a été supprimé définitivement du catalogue.` };
  } catch (err) {
    if (err.code === 'P2003') {
      return {
        error: "product_has_orders",
        message: `Impossible de supprimer le produit #${pId} car il est déjà associé à des commandes existantes dans l'historique.`
      };
    }
    throw err;
  }
}

export async function admin_list_orders(args, ctx) {
  const { status, query } = args;
  const where = {};

  if (status) {
    where.status = status;
  } else {
    where.status = { not: 'DEVIS' };
  }

  if (query) {
    where.user = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    };
  }

  const orders = await ctx.prisma.order.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      orderItems: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return {
    ordersCount: orders.length,
    orders: orders.map(o => ({
      id: o.id,
      client: o.user?.name || o.user?.email || 'Anonyme',
      email: o.user?.email,
      total: formatPrice(o.total),
      status: o.status,
      date: o.createdAt,
      items: o.orderItems.map(item => `${item.quantity}x ${item.product?.name || 'Produit'}`)
    }))
  };
}

export async function admin_update_order_status(args, ctx) {
  const { orderId, status } = args;
  const oId = parseInt(orderId, 10);

  if (isNaN(oId) || !status) {
    return { error: "invalid_params", message: "orderId et status requis." };
  }

  const previousOrder = await ctx.prisma.order.findUnique({
    where: { id: oId }
  });

  if (!previousOrder) {
    return { error: "order_not_found", message: `Commande #${oId} introuvable.` };
  }

  const updatedOrder = await ctx.prisma.order.update({
    where: { id: oId },
    data: { status },
    include: {
      user: true,
      orderItems: { include: { product: true } }
    }
  });

  if (status === 'CONFIRMED' && previousOrder.status !== 'CONFIRMED') {
    try {
      if (ctx.transporter) {
        if (previousOrder.status === 'DEVIS') {
          await sendQuotePdfEmail(ctx.transporter, updatedOrder, ctx.baseUrl, ctx.logoUrl);
        } else {
          await sendCartValidatedEmail(ctx.transporter, updatedOrder, ctx.baseUrl, ctx.logoUrl);
        }
      }
    } catch (mailError) {
      console.warn("Erreur envoi email statut commande:", mailError);
    }
  }

  return {
    success: true,
    order: updatedOrder,
    message: `Le statut de la commande #${oId} (Client: ${updatedOrder.user?.name || updatedOrder.user?.email}) a été modifié vers : "${status}".`
  };
}

export async function admin_list_quotes(args, ctx) {
  const { query } = args;
  const where = { status: 'DEVIS' };

  if (query) {
    where.user = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    };
  }

  const quotes = await ctx.prisma.order.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, company: true } },
      orderItems: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return {
    quotesCount: quotes.length,
    quotes: quotes.map(q => ({
      id: q.id,
      client: q.user?.name || q.user?.email,
      company: q.user?.company,
      total: formatPrice(q.total),
      status: q.status,
      date: q.createdAt,
      itemsCount: q.orderItems.length
    }))
  };
}

export async function admin_update_quote_status(args, ctx) {
  const { orderId, status } = args;
  const oId = parseInt(orderId, 10);

  if (isNaN(oId) || !status) {
    return { error: "invalid_params", message: "orderId et status requis." };
  }

  const quote = await ctx.prisma.order.findUnique({
    where: { id: oId },
    include: {
      user: true,
      orderItems: { include: { product: true } }
    }
  });

  if (!quote) {
    return { error: "quote_not_found", message: `Devis #${oId} introuvable.` };
  }

  if (status === 'CONFIRMED' && quote.status !== 'CONFIRMED') {
    return await admin_convert_quote_to_order({ orderId: oId }, ctx);
  }

  const updated = await ctx.prisma.order.update({
    where: { id: oId },
    data: { status },
    include: { user: true }
  });

  return {
    success: true,
    quote: updated,
    message: `Le statut du devis #${oId} a été mis à jour vers "${status}".`
  };
}

export async function admin_convert_quote_to_order(args, ctx) {
  const { orderId } = args;
  const oId = parseInt(orderId, 10);

  if (isNaN(oId)) {
    return { error: "invalid_params", message: "orderId invalide." };
  }

  const quote = await ctx.prisma.order.findUnique({
    where: { id: oId },
    include: {
      orderItems: { include: { product: true } },
      user: true
    }
  });

  if (!quote) {
    return { error: "quote_not_found", message: `Devis #${oId} introuvable.` };
  }

  if (quote.status === 'CONFIRMED') {
    return {
      success: true,
      order: quote,
      message: `Le devis #${oId} est déjà au statut CONFIRMED.`
    };
  }

  // Stock check
  for (const item of quote.orderItems) {
    if (item.product && item.product.stock < item.quantity) {
      return {
        error: "insufficient_stock",
        message: `Stock insuffisant pour "${item.product.name}" (En stock: ${item.product.stock}, Requis: ${item.quantity}). Impossible de valider le devis.`
      };
    }
  }

  // Transaction: update order status + decrement product stock
  const updated = await ctx.prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.update({
      where: { id: oId },
      data: { status: 'CONFIRMED' },
      include: {
        user: { select: { id: true, name: true, email: true, company: true } },
        orderItems: { include: { product: true } }
      }
    });

    for (const item of quote.orderItems) {
      if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    return newOrder;
  });

  try {
    if (ctx.transporter) {
      await sendQuotePdfEmail(ctx.transporter, updated, ctx.baseUrl, ctx.logoUrl);
    }
  } catch (emailErr) {
    console.warn("Erreur lors de l'envoi de l'email de confirmation de devis:", emailErr);
  }

  return {
    success: true,
    order: updated,
    message: `Le devis #${oId} a été validé et converti en commande confirmée pour ${updated.user?.name || updated.user?.email}. Les stocks ont été automatiquement mis à jour.`
  };
}

export async function admin_list_claims(args, ctx) {
  const { status } = args;
  const where = {};
  if (status) where.status = status;

  const claims = await ctx.prisma.claim.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return {
    claimsCount: claims.length,
    claims: claims.map(c => ({
      id: c.id,
      subject: c.subject,
      description: c.description,
      status: c.status,
      client: c.user?.name || c.user?.email,
      createdAt: c.createdAt
    }))
  };
}

export async function admin_update_claim_status(args, ctx) {
  const { claimId, status } = args;
  const cId = parseInt(claimId, 10);

  if (isNaN(cId) || !status) {
    return { error: "invalid_params", message: "claimId et status requis." };
  }

  const claim = await ctx.prisma.claim.update({
    where: { id: cId },
    data: { status },
    include: { user: true }
  });

  return {
    success: true,
    claim,
    message: `La réclamation #${cId} ("${claim.subject}") a été passée au statut : "${status}".`
  };
}

export async function admin_list_users(args, ctx) {
  const { role, query } = args;
  const where = {};
  if (role) where.role = role;
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { company: { contains: query, mode: 'insensitive' } }
    ];
  }

  const users = await ctx.prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, phone: true, company: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });

  return {
    usersCount: users.length,
    users
  };
}

export async function admin_create_user(args, ctx) {
  const { name, email, password = 'mortech123', phone, company, role = 'user' } = args;

  if (!email || !name) {
    return { error: "invalid_params", message: "Nom et adresse email requis." };
  }

  const existing = await ctx.prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "user_exists", message: `Un utilisateur existe déjà avec l'adresse email ${email}.` };
  }

  const hashedPassword = hashPassword(password);
  const user = await ctx.prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      company: company || null,
      role: role || 'user'
    },
    select: { id: true, name: true, email: true, phone: true, company: true, role: true, createdAt: true }
  });

  return {
    success: true,
    user,
    message: `L'utilisateur "${name}" (${email}) avec le rôle "${user.role}" a été créé avec succès. (Mot de passe temporaire: ${password})`
  };
}

export async function admin_update_user(args, ctx) {
  const { userId, userEmail, name, phone, company, role } = args;
  let uId = parseInt(userId, 10);

  if (isNaN(uId) && userEmail) {
    const found = await ctx.prisma.user.findUnique({ where: { email: userEmail } });
    if (found) uId = found.id;
  }

  if (isNaN(uId)) {
    return { error: "user_not_found", message: "Utilisateur introuvable à modifier." };
  }

  const data = {};
  if (name !== undefined) data.name = name;
  if (phone !== undefined) data.phone = phone;
  if (company !== undefined) data.company = company;
  if (role !== undefined) data.role = role;

  const updated = await ctx.prisma.user.update({
    where: { id: uId },
    data,
    select: { id: true, name: true, email: true, phone: true, company: true, role: true }
  });

  return {
    success: true,
    user: updated,
    message: `Les informations de l'utilisateur #${uId} (${updated.email}) ont été mises à jour.`
  };
}

export async function admin_delete_user(args, ctx) {
  const { userId, email } = args;
  let uId = parseInt(userId, 10);

  if (isNaN(uId) && email) {
    const found = await ctx.prisma.user.findUnique({ where: { email } });
    if (found) uId = found.id;
  }

  if (isNaN(uId)) {
    return { error: "user_not_found", message: "Utilisateur introuvable à supprimer." };
  }

  const deleted = await ctx.prisma.user.delete({
    where: { id: uId }
  });

  return {
    success: true,
    deletedUser: { id: deleted.id, email: deleted.email, name: deleted.name },
    message: `L'utilisateur "${deleted.name}" (${deleted.email}) a été supprimé définitivement de la base.`
  };
}

export const adminToolHandlers = {
  admin_get_sales_analytics,
  admin_create_product,
  admin_update_product,
  admin_update_product_stock,
  admin_update_product_price,
  admin_delete_product,
  admin_list_orders,
  admin_update_order_status,
  admin_list_quotes,
  admin_update_quote_status,
  admin_convert_quote_to_order,
  admin_list_claims,
  admin_update_claim_status,
  admin_list_users,
  admin_create_user,
  admin_update_user,
  admin_delete_user,
};

