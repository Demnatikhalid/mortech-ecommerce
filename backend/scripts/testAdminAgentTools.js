import '../src/loadEnv.js';
import prisma from '../src/db.js';
import { adminToolHandlers } from '../src/agentTools.js';

async function runTests() {
  console.log('=== TEST DES OUTILS AGENT ADMIN (agentTools.js) ===\n');
  const ctx = { prisma, transporter: null, baseUrl: 'http://localhost:5000', logoUrl: '' };

  let testProductId = null;
  let testUserId = null;

  try {
    // 1. Test admin_get_sales_analytics
    console.log('1. Test admin_get_sales_analytics...');
    const analyticsRes = await adminToolHandlers.admin_get_sales_analytics({ period: 'month' }, ctx);
    console.log('   ✓ Analytics:', analyticsRes.analytics?.totalRevenue, ', Commandes:', analyticsRes.analytics?.orderCount);

    // 2. Test admin_create_product
    console.log('\n2. Test admin_create_product...');
    const prodRes = await adminToolHandlers.admin_create_product({
      name: 'Caméra Test IA Agent 8MP',
      description: 'Caméra de test haute définition',
      brand: 'Dahua',
      category: 'Videosurveillance',
      subcategory: 'Cameras IP',
      price: 1200,
      stock: 15
    }, ctx);
    if (!prodRes.success || !prodRes.product?.id) throw new Error('Échec création produit: ' + JSON.stringify(prodRes));
    testProductId = prodRes.product.id;
    console.log('   ✓ Produit créé avec succès, ID:', testProductId);

    // 3. Test admin_update_product_stock
    console.log('\n3. Test admin_update_product_stock...');
    const stockRes = await adminToolHandlers.admin_update_product_stock({
      productId: testProductId,
      newStock: 25
    }, ctx);
    if (!stockRes.success || stockRes.product.stock !== 25) throw new Error('Échec màj stock: ' + JSON.stringify(stockRes));
    console.log('   ✓ Stock mis à jour à:', stockRes.product.stock);

    // 4. Test admin_update_product_price
    console.log('\n4. Test admin_update_product_price...');
    const priceRes = await adminToolHandlers.admin_update_product_price({
      productId: testProductId,
      newPrice: 1150
    }, ctx);
    if (!priceRes.success || priceRes.product.price !== 1150) throw new Error('Échec màj prix: ' + JSON.stringify(priceRes));
    console.log('   ✓ Prix mis à jour à:', priceRes.product.price);

    // 5. Test admin_update_product
    console.log('\n5. Test admin_update_product...');
    const updateProdRes = await adminToolHandlers.admin_update_product({
      productId: testProductId,
      badge: 'Nouveau'
    }, ctx);
    if (!updateProdRes.success || updateProdRes.product.badge !== 'Nouveau') throw new Error('Échec màj produit: ' + JSON.stringify(updateProdRes));
    console.log('   ✓ Badge mis à jour à:', updateProdRes.product.badge);

    // 6. Test admin_delete_product
    console.log('\n6. Test admin_delete_product...');
    const delProdRes = await adminToolHandlers.admin_delete_product({
      productId: testProductId
    }, ctx);
    if (!delProdRes.success) throw new Error('Échec suppression produit: ' + JSON.stringify(delProdRes));
    console.log('   ✓ Produit supprimé avec succès.');
    testProductId = null;

    // 7. Test admin_create_user
    console.log('\n7. Test admin_create_user...');
    const testEmail = `test_agent_${Date.now()}@example.com`;
    const userRes = await adminToolHandlers.admin_create_user({
      name: 'Youssef Test Agent',
      email: testEmail,
      role: 'user',
      phone: '0611223344',
      company: 'Société Test'
    }, ctx);
    if (!userRes.success || !userRes.user?.id) throw new Error('Échec création utilisateur: ' + JSON.stringify(userRes));
    testUserId = userRes.user.id;
    console.log('   ✓ Utilisateur créé avec ID:', testUserId, 'Email:', userRes.user.email);

    // 8. Test admin_list_users
    console.log('\n8. Test admin_list_users...');
    const listUsersRes = await adminToolHandlers.admin_list_users({ query: 'Youssef Test' }, ctx);
    if (!listUsersRes.users || listUsersRes.users.length === 0) throw new Error('Utilisateur non trouvé dans la liste');
    console.log('   ✓ Utilisateur trouvé dans la recherche (total trouvés:', listUsersRes.usersCount, ')');

    // 9. Test admin_update_user
    console.log('\n9. Test admin_update_user...');
    const updateUsrRes = await adminToolHandlers.admin_update_user({
      userId: testUserId,
      phone: '0699887766'
    }, ctx);
    if (!updateUsrRes.success || updateUsrRes.user.phone !== '0699887766') throw new Error('Échec màj utilisateur: ' + JSON.stringify(updateUsrRes));
    console.log('   ✓ Téléphone utilisateur mis à jour à:', updateUsrRes.user.phone);

    // 10. Test admin_delete_user
    console.log('\n10. Test admin_delete_user...');
    const delUsrRes = await adminToolHandlers.admin_delete_user({
      userId: testUserId
    }, ctx);
    if (!delUsrRes.success) throw new Error('Échec suppression utilisateur: ' + JSON.stringify(delUsrRes));
    console.log('   ✓ Utilisateur supprimé avec succès.');
    testUserId = null;

    // 11. Test admin_list_orders, admin_list_quotes, admin_list_claims
    console.log('\n11. Test admin_list_orders, admin_list_quotes, admin_list_claims...');
    const ordersRes = await adminToolHandlers.admin_list_orders({}, ctx);
    console.log('   ✓ Commandes récupérées:', ordersRes.ordersCount);

    const quotesRes = await adminToolHandlers.admin_list_quotes({}, ctx);
    console.log('   ✓ Devis récupérés:', quotesRes.quotesCount);

    const claimsRes = await adminToolHandlers.admin_list_claims({}, ctx);
    console.log('   ✓ Réclamations récupérées:', claimsRes.claimsCount);

    console.log('\n🎉 TOUS LES TESTS UNITAIRES DES OUTILS ONT RÉUSSI !');
  } catch (error) {
    console.error('\n❌ ERREUR DURANT LES TESTS :', error);
  } finally {
    if (testProductId) {
      try { await prisma.product.delete({ where: { id: testProductId } }); } catch (_) {}
    }
    if (testUserId) {
      try { await prisma.user.delete({ where: { id: testUserId } }); } catch (_) {}
    }
    await prisma.$disconnect();
  }
}

runTests();
