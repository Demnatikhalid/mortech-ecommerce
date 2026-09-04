import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { Chatbot } from './components/Chatbot';
import { categoryGroups } from './products';
import { isStaffRole } from './constants/roles';
import {
  getRoute,
  getLocationKey,
  getCategoryUrl,
  stripAccents,
} from './helpers';

export function App() {
  const [locationKey, setLocationKey] = useState(getLocationKey);
  const route = useMemo(() => getRoute(), [locationKey]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mortech_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  function handleUpdateCurrentUser(user) {
    setCurrentUser(user);
    try {
      localStorage.setItem('mortech_user', JSON.stringify(user));
    } catch (e) {
      // ignore storage errors
    }
  }

  const [loadedUserId, setLoadedUserId] = useState(() => {
    return currentUser ? (currentUser.id || currentUser.email) : 'guest';
  });

  const [cart, setCart] = useState(() => {
    try {
      const initialUser = (() => {
        try {
          const saved = localStorage.getItem('mortech_user');
          return saved ? JSON.parse(saved) : null;
        } catch (e) {
          return null;
        }
      })();
      const key = initialUser ? `mortech_cart_${initialUser.id || initialUser.email}` : 'mortech_cart_guest';
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    const syncRoute = () => setLocationKey(getLocationKey());
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const categories = useMemo(
    () => ['Tous', ...new Set(products.filter((p) => p && p.category).map((product) => product.category))],
    [products]
  );

  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(true);
        const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/products`
);
        if (!response.ok) throw new Error(response.statusText || 'Erreur');
        const data = await response.json();
        setProducts(data || []);
        setProductsError(null);
      } catch (err) {
        setProductsError(err.message || 'Impossible de charger les produits');
      } finally {
        setProductsLoading(false);
      }
    }
    loadProducts();
  }, []);
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  useEffect(() => {
    if (!currentUser || !isStaffRole(currentUser.role)) return;
    if (route === '/admin') return;
    window.history.replaceState({}, '', '/admin');
    setLocationKey(getLocationKey());
  }, [currentUser, route, locationKey]);

  useEffect(() => {
    if (route !== '/produits') return;
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('categorie');
    const requestedSubcategory = params.get('type');
    setActiveCategory(requestedCategory || 'Tous');
    setActiveSubcategory(requestedSubcategory || '');
  }, [route, locationKey]);

  const filteredProducts = useMemo(() => {
    let sectionLinks = null;
    const normActiveSub = stripAccents(activeSubcategory);
    const normActiveCat = stripAccents(activeCategory);

    if (normActiveSub) {
      for (const group of categoryGroups) {
        const sec = group.sections.find(
          (s) => stripAccents(s.name) === normActiveSub
        );
        if (sec) {
          sectionLinks = sec.links.map((l) => stripAccents(l));
          break;
        }
      }
    }

    const groupForActive = categoryGroups.find(
      (g) => stripAccents(g.name) === normActiveCat
    );

    return products.filter((product) => {
      const normProdCat = stripAccents(product.category);
      const normProdSub = stripAccents(product.subcategory);
      const normProdBrand = stripAccents(product.brand);

      // Matches category:
      // 1. Tous
      // 2. Exact match (normalized, ignore accents/casing)
      // 3. Or product category belongs to active category group/sections
      const matchesCategory =
        activeCategory === 'Tous' ||
        normProdCat === normActiveCat ||
        (groupForActive && (
          groupForActive.sections.some((s) => stripAccents(s.name) === normProdCat) ||
          groupForActive.sections.some((s) => s.links.some((l) => stripAccents(l) === normProdCat))
        ));

      // Matches subcategory:
      const matchesSubcategory =
        !normActiveSub ||
        normProdSub === normActiveSub ||
        normProdCat === normActiveSub ||
        (normProdSub && sectionLinks && sectionLinks.includes(normProdSub)) ||
        (normProdBrand && normProdBrand === normActiveSub);

      const matchesQuery = `${product.name || ''} ${product.brand || ''} ${product.category || ''} ${
        product.subcategory || ''
      }`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesCategory && matchesSubcategory && matchesQuery;
    });
  }, [products, activeCategory, activeSubcategory, query]);

  function addToCart(product) {
    if (!product.stock) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...product, qty: 1 }];
    });
  }

  function selectCategory(category) {
    setActiveCategory(category);
    setActiveSubcategory('');
    if (route !== '/produits') return;

    const nextUrl = getCategoryUrl(category);
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
      setLocationKey(getLocationKey());
    }
  }

  function updateQty(id, amount) {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + amount) } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  // Synchroniser le panier en fonction du changement d'utilisateur connecté
  useEffect(() => {
    const currentId = currentUser ? (currentUser.id || currentUser.email) : 'guest';
    if (loadedUserId !== currentId) {
      const key = currentUser ? `mortech_cart_${currentUser.id || currentUser.email}` : 'mortech_cart_guest';
      try {
        const saved = localStorage.getItem(key);
        setCart(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setCart([]);
      }
      setLoadedUserId(currentId);
    }
  }, [currentUser, loadedUserId]);

  // Sauvegarder le panier uniquement pour l'utilisateur actuellement chargé
  useEffect(() => {
    const currentId = currentUser ? (currentUser.id || currentUser.email) : 'guest';
    if (loadedUserId === currentId) {
      const key = currentUser ? `mortech_cart_${currentUser.id || currentUser.email}` : 'mortech_cart_guest';
      try {
        localStorage.setItem(key, JSON.stringify(cart));
      } catch (e) {
        // ignore
      }
    }
  }, [cart, currentUser, loadedUserId]);

  function submitContact(event) {
    event.preventDefault();
    setMessageSent(true);
  }

  function handleLoginSuccess(user) {
    setCurrentUser(user);
    localStorage.setItem('mortech_user', JSON.stringify(user));

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    let nextRoute = user.role === 'admin' ? '/admin' : '/profil';

    if (redirect && redirect.startsWith('/') && user.role !== 'admin') {
      nextRoute = redirect;
    }

    window.history.pushState({}, '', nextRoute);
    setLocationKey(getLocationKey());
  }

  function handleLogout() {
    setCurrentUser(null);
    localStorage.removeItem('mortech_user');
    window.history.pushState({}, '', '/');
    setLocationKey(getLocationKey());
  }

  function renderPage() {
    const productProps = {
      categories,
      products,
      activeCategory,
      activeSubcategory,
      setActiveCategory: selectCategory,
      filteredProducts,
      addToCart,
      productsLoading,
      productsError,
    };
    if (route.startsWith('/produit/')) {
      const productId = parseInt(route.split('/')[2], 10);
      const product = products.find((item) => item.id === productId);
      const relatedProducts = products
        .filter((item) =>
          item.id !== productId &&
          (item.category === product?.category || item.subcategory === product?.subcategory || item.brand === product?.brand)
        )
        .slice(0, 4);
      return <ProductDetailPage product={product} relatedProducts={relatedProducts} addToCart={addToCart} />;
    }
    if (route === '/produits') {
      return <ProductsPage {...productProps} />;
    }
    if (route === '/panier') {
      return (
        <CartPage
          cart={cart}
          total={cartTotal}
          updateQty={updateQty}
          currentUser={currentUser}
          clearCart={clearCart}
        />
      );
    }
    if (route === '/services') {
      return <ServicesPage />;
    }
    if (route === '/contact') {
      return <ContactPage onSubmit={submitContact} messageSent={messageSent} />;
    }
    if (route === '/login') {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
    if (route === '/inscription') {
      return <RegisterPage />;
    }
    if (route === '/apropos') {
      return <AboutPage />;
    }
    if (route === '/profil') {
      return <ProfilePage currentUser={currentUser} onLogout={handleLogout} onUpdateCurrentUser={handleUpdateCurrentUser} />;
    }
    if (route === '/admin/profil') {
      return <AdminPage currentUser={currentUser} onLogout={handleLogout} onUpdateCurrentUser={handleUpdateCurrentUser} initialSection="profile" />;
    }
    if (route === '/admin') {
      return <AdminPage currentUser={currentUser} onLogout={handleLogout} onUpdateCurrentUser={handleUpdateCurrentUser} />;
    }
    return (
      <HomePage
        productProps={productProps}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    );
  }

  const isAdminRoute = route === '/admin';

  return (
    <>
      {!isAdminRoute && (
        <Header
          query={query}
          setQuery={setQuery}
          cartCount={cartCount}
          cartTotal={cartTotal}
          route={route}
          onCart={() => setIsCartOpen(true)}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
      <main>{renderPage()}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          total={cartTotal}
          updateQty={updateQty}
        />
      )}
      <Chatbot currentUser={currentUser} />
    </>
  );
}
