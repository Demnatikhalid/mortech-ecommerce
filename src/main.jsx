import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlarmSmoke,
  Building2,
  Camera,
  Check,
  ChevronDown,
  CircleUserRound,
  Cpu,
  CreditCard,
  Headphones,
  Home,
  Mail,
  MapPin,
  Menu,
  Minus,
  Network,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';
import logo from './assets/mortech-logo-cropped.png';
import './styles.css';

const categoryGroups = [
  {
    name: 'Materiel Informatique',
    sections: [
      { name: 'Imprimante', links: ['Bureautique', "Imprimante Jet d'encre", 'Imprimante laser', 'Imprimante thermique', 'Consommable'] },
      { name: 'PC / Serveur', links: ['Hardware Second Hand', 'Ordinateur portable', 'Ordinateur de bureau', 'All-In-One', 'Serveur'] },
      { name: 'Stockage', links: ['HDD', 'Cartes memoire', 'Stockage portable', 'SSDs', 'RAM'] },
    ],
  },
  {
    name: 'Videosurveillance',
    sections: [
      { name: 'Hikvision', links: ['Camera Analog', 'Camera IP', 'DVR', 'NVR', 'Videophone'] },
      { name: 'Dahua', links: ['Camera Analog', 'Camera IP', 'XVR', 'NVR', 'Videophone'] },
      { name: 'Accessoires de camera', links: ['Cable Coaxial', 'Boites de jonction', 'Support de camera', "Bloc d'alimentation"] },
    ],
  },
  {
    name: 'Equipement Reseaux',
    sections: [
      { name: 'Armoire', links: ['Armoire Informatique Etanche', 'Armoire Informatique', "Accessoires d'Armoire"] },
      { name: 'Fibre optique', links: ['Coupleur & pigtail', 'Tiroir fibre optique', 'Cable fibre optique', 'Jarretiere optique'] },
      { name: 'Switch', links: ['Switch TP-Link', 'Switch PoE', 'Switch 8 port', 'Switch 16 port', 'Switch 24 port'] },
    ],
  },
  {
    name: 'Automatisme Et Domotique',
    sections: [
      { name: 'Domotique', links: ['TAHOMA SOMFY', 'AKUVOX', 'Tuya', 'Sonoff', 'Shelly'] },
      { name: 'Automatisme', links: ['BFT', 'Tringles a rideaux motorise', 'NICE', 'Selecteur', 'Porte Vitree'] },
    ],
  },
  {
    name: 'Controle Dacces et Pointeuse',
    sections: [
      { name: "Controle D'acces", links: ["Controle d'acces hikvision", 'Serrure intelligente', "Controle D'acces ZKTeco", "Controle D'acces Dahua"] },
      { name: 'Pointeuse', links: ['Pointeuse hikvision', 'Pointeuse ZKTeco'] },
    ],
  },
  {
    name: 'Securite',
    sections: [
      { name: 'Detection intrusion', links: ['Cable alarm', 'Alarme Ajax', 'ALARME HIKVISION', 'Alarme Autonome', 'Alarme Dahua'] },
      { name: 'Detection incendie', links: ['Cable incendie', 'Incendie Nugelec', 'Incendie Adressable', 'Incendie conventionnelle', 'Alarme incendie'] },
    ],
  },
];

const products = [
  {
    id: 1,
    brand: 'Dahua',
    category: 'Videosurveillance',
    name: 'Dahua Technology Lite SD2A500HB-GN-AW-PV-S2',
    price: 6000,
    badge: 'PTZ Wi-Fi',
    image: 'https://disismaroc.com/storage/products/147/655/disismaroc-dahua-technology-lite-sd2a500hb-gn-aw-pv-s2--1743608413-4607.png',
    stock: true,
  },
  {
    id: 2,
    brand: 'Dahua',
    category: 'Videosurveillance',
    name: 'Camera IP Wi-Fi Ranger 2 IPC-A22EP-G',
    price: 384,
    badge: 'Best seller',
    image: 'https://disismaroc.com/storage/products/151/363/disismaroc-camera-ip-wi-fi-ranger-2-ipc-a22ep-g--1743239212-8700.png',
    stock: true,
  },
  {
    id: 3,
    brand: 'Dahua',
    category: 'Videosurveillance',
    name: 'Camera IP Dahua Bullet 4MP Lite Full-color',
    price: 624,
    badge: '4MP',
    image: 'https://disismaroc.com/storage/products/151/314/disismaroc-camera-ip-dahua-bullet-4mp-lite-full-color--1743235168-7182.png',
    stock: true,
  },
  {
    id: 4,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    name: 'Camera Analogique 5MP IR 40m Bullet DS-2CE10KF0T-LFS',
    price: 420,
    badge: 'IR 40m',
    image: 'https://disismaroc.com/storage/products/139/36/disismaroc-camera-analogique-5mp-ir-40m-bullet-ds-2ce10kf0t-lfs--1742899528-2441.png',
    stock: true,
  },
  {
    id: 5,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    name: 'DVR 2MP 4 channel DS-7204HGHI-M1',
    price: 546,
    badge: 'DVR',
    image: 'https://disismaroc.com/storage/products/139/260/disismaroc-dvr-2mp-4-channel-ds-7204hghi-m1--1742908198-9735.png',
    stock: false,
  },
  {
    id: 6,
    brand: 'Ruijie Reyee',
    category: 'Equipement Reseaux',
    name: 'Point acces exterieur RG-RAP6202(G) Wi-Fi 5 AC1300',
    price: 1625,
    badge: 'Outdoor',
    image: 'https://disismaroc.com/storage/products/16/381/disismaroc-point-dacces-exterieur-omnidirectionnel-rg-rap6202g-wi-fi-5-ac1300--1724167262-6802.png',
    stock: true,
  },
  {
    id: 7,
    brand: 'Ruijie Reyee',
    category: 'Equipement Reseaux',
    name: 'Routeur Mesh Wi-Fi 6 3200M dual band Gigabit',
    price: 1513.2,
    badge: 'Wi-Fi 6',
    image: 'https://disismaroc.com/storage/products/16/385/disismaroc-routeur-mesh-wi-fi-6-3200m-dual-band-gigabit-rg-ew3200gx-pro--1724168243-2597.png',
    stock: true,
  },
  {
    id: 8,
    brand: 'Sonoff',
    category: 'Automatisme & Domotique',
    name: 'Sonoff 4CH Pro R3 module domotique',
    price: 395,
    badge: 'Smart home',
    image: 'https://disismaroc.com/storage/products/145/591/disismaroc-sonoff-4ch-pro-r3-4chr3--1743514131-6708.png',
    stock: true,
  },
];

const quickCategories = [
  ['Uniview Camera', 'Camera IP et NVR professionnels', Camera, 'Videosurveillance'],
  ['Hikvision Camera', 'Surveillance analogique et IP', ShieldCheck, 'Videosurveillance'],
  ['Domotique Sonoff', 'Modules connectes et capteurs', Home, 'Automatisme & Domotique'],
  ['Automatisme Somfy', 'Moteurs et controle portails', Zap, 'Automatisme & Domotique'],
  ['Pointage ZKTeco', 'Pointeuses et controle acces', CircleUserRound, 'Controle Dacces et Pointeuse'],
  ['Ruijie sans fil', 'Wi-Fi entreprise et mesh', Network, 'Equipement Reseaux'],
];

const dynamicHeroWords = ['Videosurveillance', 'Reseaux', 'Domotique', 'Controle acces', 'Informatique'];

function formatPrice(value) {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value);
}

function buildWhatsAppOrder(cart, total) {
  const lines = cart.length
    ? cart.map((item) => `- ${item.name} x${item.qty} = ${formatPrice(item.price * item.qty)}`)
    : ['Panier vide'];
  return `Bonjour Mortech Solutions, je souhaite commander:\n${lines.join('\n')}\nTotal: ${formatPrice(total)}`;
}

function getRoute() {
  return window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
}

function getLocationKey() {
  return `${getRoute()}${window.location.search}`;
}

function getCategoryUrl(category) {
  if (!category || category === 'Tous') return '/produits';
  return `/produits?categorie=${encodeURIComponent(category)}`;
}

function normalizeProductCategory(category) {
  if (category === 'Automatisme Et Domotique') return 'Automatisme & Domotique';
  return category;
}

function Link({ to, children, className, onNavigate, ...props }) {
  function handleClick(event) {
    event.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate?.();
  }

  return <a href={to} className={className} onClick={handleClick} {...props}>{children}</a>;
}

function App() {
  const [locationKey, setLocationKey] = useState(getLocationKey);
  const route = useMemo(() => getRoute(), [locationKey]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
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

  const categories = useMemo(() => ['Tous', ...new Set(products.map((product) => product.category))], []);
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  useEffect(() => {
    if (route !== '/produits') return;
    const requestedCategory = new URLSearchParams(window.location.search).get('categorie');
    setActiveCategory(requestedCategory || 'Tous');
  }, [route, locationKey]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Tous' || product.category === activeCategory;
      const matchesQuery = `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  function addToCart(product) {
    if (!product.stock) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...current, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  }

  function selectCategory(category) {
    setActiveCategory(category);
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
        .filter((item) => item.qty > 0),
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
    const productProps = { categories, activeCategory, setActiveCategory: selectCategory, filteredProducts, addToCart };
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
    return <HomePage productProps={productProps} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />;
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
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} total={cartTotal} updateQty={updateQty} />
    </>
  );
}

function Header({ query, setQuery, cartCount, cartTotal, route, isMenuOpen, setIsMenuOpen }) {
  return (
    <header className="site-header">
      <div className="topbar">
        <span><Phone size={14} /> +(212) 528.24.17.43</span>
        <span><Mail size={14} /> contact@mortech-solutions.ma</span>
        <span><MapPin size={14} /> Agadir, Maroc</span>
        <Link to="/login">Mon compte</Link>
        <Link to="/inscription">Creer un compte</Link>
      </div>
      <div className="nav-shell">
        <button className="icon-button mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu categories">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <Link className="brand" to="/" aria-label="Mortech Solutions">
          <img src={logo} alt="Mortech Solutions" />
        </Link>
        <div className="search-box">
          <select aria-label="Categorie recherche">
            <option>Toutes categories</option>
            <option>Videosurveillance</option>
            <option>Reseaux</option>
            <option>Domotique</option>
          </select>
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher camera, switch, alarme..." />
        </div>
        <nav className="main-nav">
          <Link className={route === '/' ? 'active' : ''} to="/">Accueil</Link>
          <Link className={route === '/produits' ? 'active' : ''} to="/produits">Produits</Link>
          <Link className={route === '/services' ? 'active' : ''} to="/services">Services</Link>
          <Link className={route === '/contact' ? 'active' : ''} to="/contact">Contact</Link>
          <Link className={route === '/apropos' ? 'active' : ''} to="/apropos">A propos</Link>
          <Link className={route === '/login' ? 'active' : ''} to="/login">Login</Link>
        </nav>
        <Link className="cart-button" to="/panier">
          <ShoppingCart size={20} />
          <span>{cartCount}</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </Link>
      </div>
    </header>
  );
}

function HomePage({ productProps, isMenuOpen, setIsMenuOpen }) {
  return (
    <>
      <Hero />
      <CategoryBrowser isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <QuickCategories />
      <ProductsSection {...productProps} limit={4} title="Produits populaires" />
      <Services compact />
      <PolicyPreview />
    </>
  );
}

function ProductsPage(props) {
  return (
    <>
      <CategoryBrowser isMenuOpen setIsMenuOpen={() => {}} />
      <ProductsSection {...props} title="Catalogue produits" />
    </>
  );
}

function CartPage({ cart, total, updateQty }) {
  const whatsappUrl = `https://wa.me/212528241743?text=${encodeURIComponent(buildWhatsAppOrder(cart, total))}`;

  return (
    <section className="page-shell">
      <div className="section-heading">
        <div><span className="eyebrow">Commande</span><h1>Panier</h1></div>
        <Link className="secondary-button compact" to="/produits">Continuer les achats</Link>
      </div>
      <div className="cart-page-grid">
        <div className="cart-page-list">
          {cart.map((item) => (
            <article className="cart-page-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <span>{item.brand}</span>
                <h3>{item.name}</h3>
                <strong>{formatPrice(item.price)}</strong>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
              </div>
            </article>
          ))}
          {!cart.length && <p className="empty-state">Votre panier est vide. Ajoutez des produits depuis le catalogue.</p>}
        </div>
        <aside className="checkout-card">
          <h2>Resume</h2>
          <div><span>Sous-total</span><strong>{formatPrice(total)}</strong></div>
          <div><span>Livraison</span><strong>Sur devis</strong></div>
          <div className="checkout-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <button className="primary-button full" type="button">Valider mon panier</button>
          <a className="whatsapp-button full" href={whatsappUrl} target="_blank" rel="noreferrer">Commander par WhatsApp</a>
          <Link className="primary-button full" to="/contact">Demander un devis</Link>
        </aside>
      </div>
    </section>
  );
}

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Accompagnement technique"
        text="Mortech Solutions aide les clients a choisir, commander et deployer leurs solutions IT, reseaux, securite et domotique."
      />
      <Services />
      <PolicyPreview />
    </>
  );
}

function ContactPage({ onSubmit, messageSent }) {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Demander un devis"
        text="Envoyez votre besoin pour recevoir une proposition adaptee au materiel, a la livraison et a l'installation."
      />
      <ContactForm onSubmit={onSubmit} messageSent={messageSent} />
    </>
  );
}

function LoginPage({ onSubmit, loginSent }) {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="eyebrow">Mon compte</span>
        <h1>Connexion</h1>
        <p>Accedez a votre espace client pour suivre vos demandes, devis et commandes.</p>
        <form onSubmit={onSubmit}>
          <label>Email<input type="email" required placeholder="client@email.com" /></label>
          <label>Mot de passe<input type="password" required placeholder="********" /></label>
          <button className="primary-button" type="submit">Se connecter</button>
        </form>
        {loginSent && <p className="success"><Check size={16} /> Formulaire de connexion valide.</p>}
        <Link className="secondary-button full" to="/inscription"><UserPlus size={17} /> Creer un compte</Link>
      </div>
    </section>
  );
}

function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-panel wide">
        <span className="eyebrow">Nouveau client</span>
        <h1>Creation de compte</h1>
        <form>
          <label>Nom complet<input required placeholder="Votre nom" /></label>
          <label>Societe<input placeholder="Nom de societe" /></label>
          <label>Email<input type="email" required placeholder="client@email.com" /></label>
          <label>Telephone<input required placeholder="+212 ..." /></label>
          <label>Mot de passe<input type="password" required placeholder="********" /></label>
          <button className="primary-button" type="button">Creer le compte</button>
        </form>
        <Link className="secondary-button full" to="/login">J'ai deja un compte</Link>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="A propos"
        title="Mortech Solutions"
        text="Une boutique professionnelle pour centraliser vos besoins en securite electronique, reseau, informatique et automatisme."
      />
      <PolicyPreview />
      <Services />
    </>
  );
}

function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-hero">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % dynamicHeroWords.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero" id="accueil">
      <div className="hero-content">
        <span className="eyebrow">Infrastructure de securite electronique et informatique</span>
        <h1>Mortech Solutions</h1>
        <div className="dynamic-title" aria-live="polite">
          Expert en <span key={dynamicHeroWords[wordIndex]}>{dynamicHeroWords[wordIndex]}</span>
        </div>
        <p>Boutique professionnelle pour videosurveillance, reseaux, controle d'acces, domotique, informatique et solutions de securite.</p>
        <div className="hero-actions">
          <Link className="primary-button" to="/produits">Voir les produits</Link>
        </div>
      </div>
      <div className="hero-panel">
        <div><Camera /><strong>Materiel securite</strong><span>Dahua, Hikvision, Uniview</span></div>
        <div><ShieldCheck /><strong>Certifie & garanti</strong><span>Conseil, installation et SAV</span></div>
        <div><Network /><strong>Reseaux rapides</strong><span>Switch, fibre, firewall, Wi-Fi</span></div>
      </div>
    </section>
  );
}

function CategoryBrowser({ isMenuOpen, setIsMenuOpen }) {
  return (
    <section className={`category-browser ${isMenuOpen ? 'is-open' : ''}`}>
      <div className="section-heading">
        <div><span className="eyebrow">Catalogue</span><h2>Categories de produits</h2></div>
        <button className="secondary-button compact" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <SlidersHorizontal size={16} /> Parcourir
        </button>
      </div>
      <div className="category-panel">
        <div className="category-panel-title">Categories de produits</div>
        <div className="category-tree">
          {categoryGroups.map((group) => (
            <article className="category-group" key={group.name}>
              <h3>
                <Link to={getCategoryUrl(normalizeProductCategory(group.name))}>
                  <ChevronDown size={15} />{group.name}
                </Link>
              </h3>
              <div className="category-branches">
                {group.sections.map((section) => (
                  <div className="category-branch" key={section.name}>
                    <strong>{section.name}</strong>
                    <div className="category-links">
                      {section.links.map((link) => (
                        <Link to={getCategoryUrl(normalizeProductCategory(group.name))} key={link}>
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickCategories() {
  return (
    <section className="quick-categories">
      <div className="section-heading">
        <div><span className="eyebrow">Cette semaine</span><h2>Categories les plus demandees</h2></div>
        <Link to="/produits">Tous les produits</Link>
      </div>
      <div className="quick-grid">
        {quickCategories.map(([title, text, Icon, category]) => (
          <Link to={getCategoryUrl(category)} className="quick-card" key={title}>
            <Icon size={24} /><strong>{title}</strong><span>{text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductsSection({ categories, activeCategory, setActiveCategory, filteredProducts, addToCart, limit, title = 'Produits populaires' }) {
  const visibleProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;
  const visibleCategories = categories.includes(activeCategory) ? categories : [...categories, activeCategory];
  return (
    <section className="products-section" id="produits">
      <div className="section-heading">
        <div><span className="eyebrow">Boutique</span><h2>{title}</h2></div>
        <div className="tabs" role="tablist" aria-label="Filtrer produits">
          {visibleCategories.map((category) => (
            <button className={category === activeCategory ? 'active' : ''} key={category} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}
      </div>
      {!filteredProducts.length && <p className="empty-state">Aucun produit ne correspond a votre recherche.</p>}
      {limit && filteredProducts.length > limit && <Link className="primary-button more-products" to="/produits">Voir tout le catalogue</Link>}
    </section>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <div className="product-media">
        <span className="badge">{product.badge}</span>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <span>{product.brand}</span>
        <h3>{product.name}</h3>
        <div className="rating"><Star size={15} fill="currentColor" /> <span>Disponible conseil technique</span></div>
        <div className="product-footer">
          <strong>{product.stock ? formatPrice(product.price) : 'Contactez-nous'}</strong>
          <button onClick={() => addToCart(product)} disabled={!product.stock}>
            {product.stock ? <><ShoppingCart size={17} /> Ajouter</> : 'Devis'}
          </button>
        </div>
      </div>
    </article>
  );
}

function Services() {
  const services = [
    [Truck, 'Livraison Maroc', 'Preparation rapide et suivi des commandes pour clients professionnels.'],
    [ShieldCheck, 'Garantie materiel', 'Produits selectionnes avec accompagnement technique et SAV.'],
    [Headphones, 'Support projet', 'Aide au choix pour installation camera, reseau, alarme et pointage.'],
    [CreditCard, 'Devis & panier', 'Ajoutez les produits au panier ou demandez un devis selon le stock.'],
  ];

  return (
    <section className="services" id="services">
      {services.map(([Icon, title, text]) => (
        <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>
      ))}
    </section>
  );
}

function AccountAndContact({ onSubmit, messageSent }) {
  return (
    <section className="forms-section" id="contact">
      <div className="account-panel">
        <span className="eyebrow">Mon compte</span>
        <h2>Espace client</h2>
        <form>
          <label>Email<input type="email" placeholder="client@email.com" /></label>
          <label>Mot de passe<input type="password" placeholder="********" /></label>
          <button type="button" className="primary-button">Connexion</button>
          <button type="button" className="secondary-button">Creer un compte</button>
        </form>
      </div>
      <div className="contact-panel">
        <span className="eyebrow">Contact</span>
        <h2>Parlez-nous de votre besoin</h2>
        <form onSubmit={onSubmit}>
          <label>Nom complet<input required placeholder="Votre nom" /></label>
          <label>Telephone<input required placeholder="+212 ..." /></label>
          <label>Projet<textarea required placeholder="Camera, reseau, controle d'acces, domotique..." /></label>
          <button className="primary-button" type="submit">Envoyer la demande</button>
        </form>
        {messageSent && <p className="success"><Check size={16} /> Votre demande est prete a etre traitee.</p>}
      </div>
    </section>
  );
}

function ContactForm({ onSubmit, messageSent }) {
  return (
    <section className="forms-section single" id="contact">
      <div className="contact-panel">
        <span className="eyebrow">Contact</span>
        <h2>Parlez-nous de votre besoin</h2>
        <form onSubmit={onSubmit}>
          <label>Nom complet<input required placeholder="Votre nom" /></label>
          <label>Telephone<input required placeholder="+212 ..." /></label>
          <label>Email<input type="email" placeholder="client@email.com" /></label>
          <label>Projet<textarea required placeholder="Camera, reseau, controle d'acces, domotique..." /></label>
          <button className="primary-button" type="submit">Envoyer la demande</button>
        </form>
        {messageSent && <p className="success"><Check size={16} /> Votre demande est prete a etre traitee.</p>}
      </div>
    </section>
  );
}

function PolicyPreview() {
  return (
    <section className="policy-section" id="apropos">
      <article><Building2 /><h3>A propos</h3><p>Mortech Solutions accompagne les entreprises dans les infrastructures IT, securite electronique et automatismes.</p></article>
      <article><Truck /><h3>Livraison</h3><p>Preparation de commande, confirmation de disponibilite et livraison selon ville et volume du materiel.</p></article>
      <article><ShieldCheck /><h3>Retour & CGV</h3><p>Conditions professionnelles claires pour retours, garanties, validation devis et commande.</p></article>
    </section>
  );
}

function CartDrawer({ isOpen, onClose, cart, total, updateQty }) {
  return (
    <aside className={`cart-drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="cart-head">
        <h2>Panier</h2>
        <button className="icon-button" onClick={onClose} aria-label="Fermer panier"><X /></button>
      </div>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <span>{formatPrice(item.price)}</span>
              <div className="qty-controls">
                <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {!cart.length && <p className="empty-state">Votre panier est vide.</p>}
      </div>
      <div className="cart-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
      <Link className="primary-button full" to="/panier" onNavigate={onClose}>Voir le panier</Link>
    </aside>
  );
}

function Footer() {
  return (
    <footer>
      <img src={logo} alt="Mortech Solutions" />
      <div><strong>Mortech Solutions</strong><span>Videosurveillance, reseaux, domotique, alarme et informatique professionnelle.</span></div>
      <a href="tel:+212528241743"><Phone size={16} /> +(212) 528.24.17.43</a>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
