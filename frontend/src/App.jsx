import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { products, categoryGroups } from './products';
import {
  getRoute,
  getLocationKey,
  getCategoryUrl,
} from './helpers';

export function App() {
  const [locationKey, setLocationKey] = useState(getLocationKey);
  const route = useMemo(() => getRoute(), [locationKey]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [loginSent, setLoginSent] = useState(false);

  useEffect(() => {
    const syncRoute = () => setLocationKey(getLocationKey());
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const categories = useMemo(
    () => ['Tous', ...new Set(products.map((product) => product.category))],
    []
  );
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

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
    if (activeSubcategory) {
      for (const group of categoryGroups) {
        const sec = group.sections.find(
          (s) => s.name.toLowerCase() === activeSubcategory.toLowerCase()
        );
        if (sec) {
          sectionLinks = sec.links.map((l) => l.toLowerCase());
          break;
        }
      }
    }

    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Tous' || product.category === activeCategory;
      const matchesSubcategory =
        !activeSubcategory ||
        product.subcategory === activeSubcategory ||
        (product.subcategory &&
          sectionLinks &&
          sectionLinks.includes(product.subcategory.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase() === activeSubcategory.toLowerCase());
      const matchesQuery = `${product.name} ${product.brand} ${product.category} ${
        product.subcategory || ''
      }`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCategory && matchesSubcategory && matchesQuery;
    });
  }, [activeCategory, activeSubcategory, query]);

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
    setIsCartOpen(true);
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

  function submitContact(event) {
    event.preventDefault();
    setMessageSent(true);
  }

  function submitLogin(event) {
    event.preventDefault();
    setLoginSent(true);
  }

  function renderPage() {
    const productProps = {
      categories,
      activeCategory,
      activeSubcategory,
      setActiveCategory: selectCategory,
      filteredProducts,
      addToCart,
    };
    if (route === '/produits') {
      return <ProductsPage {...productProps} />;
    }
    if (route === '/panier') {
      return <CartPage cart={cart} total={cartTotal} updateQty={updateQty} />;
    }
    if (route === '/services') {
      return <ServicesPage />;
    }
    if (route === '/contact') {
      return <ContactPage onSubmit={submitContact} messageSent={messageSent} />;
    }
    if (route === '/login') {
      return <LoginPage onSubmit={submitLogin} loginSent={loginSent} />;
    }
    if (route === '/inscription') {
      return <RegisterPage />;
    }
    if (route === '/apropos') {
      return <AboutPage />;
    }
    return (
      <HomePage
        productProps={productProps}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    );
  }

  return (
    <>
      <Header
        query={query}
        setQuery={setQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        route={route}
        onCart={() => setIsCartOpen(true)}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <main>{renderPage()}</main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        total={cartTotal}
        updateQty={updateQty}
      />
    </>
  );
}
