import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Menu,
  X,
  ArrowRight,
  Instagram,
  Youtube,
  Mail,
  Facebook,
  ShieldCheck,
  Lock,
  Award,
  ChevronUp,
  Calendar,
  MessageSquare
} from 'lucide-react';
import HomePage from './pages/HomePage';
import BookingWidget from './components/BookingWidget';
import LeadDashboard from './components/LeadDashboard';
import AboutUs from './pages/AboutUs';
import TreatmentsList from './pages/TreatmentsList';
import ContactUs from './pages/ContactUs';
import OurTeam from './pages/OurTeam';
import BeforeAfter from './pages/BeforeAfter';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ApplyNowModal from './components/ApplyNowModal';
import HeaderSearch from './components/HeaderSearch';
import AdminPortal from './pages/AdminPortal';
import { API_BASE_URL } from './config';
import useScrollReveal from './hooks/useScrollReveal';
import { getPageFromPath, PAGE_PATHS } from './routes/pageRoutes';
import type { PageId } from './types/navigation';
import { scrollToTop } from './utils/scroll';
import { useAppContext } from './contexts';
import { RootLayout } from './layouts';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  closeBookingModal,
  openBookingModal,
  setApplyModalOpen,
  setDashboardModalOpen,
  setMobileMenuOpen,
  toggleMobileMenu
} from './store/appUiSlice';

import './App.css';

function AppContent() {
  const dispatch = useAppDispatch();
  const { phone, whatsapp, socialLinks } = useAppContext();

  const {
    activeTreatmentTab: activeTab,
    mobileMenuOpen,
    showBookingModal,
    showDashboardModal,
    showApplyModal,
    bookingPrefills
  } = useAppSelector((state) => state.appUi);

  const navigate = useNavigate();
  const location = useLocation();
  const [seoConfigs, setSeoConfigs] = useState<any>(null);

  const { refresh } = useScrollReveal();
  const currentPage = getPageFromPath(location.pathname);

  // Dynamic Header & Scroll Animation state
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(currentScroll > 50);
      setShowBackToTop(currentScroll > 320);
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re-observe animations when route or active tab changes
  useEffect(() => {
    refresh();
  }, [currentPage, activeTab]);

  // Fetch SEO configurations
  useEffect(() => {
    fetch(`${API_BASE_URL}/seo`)
      .then(res => res.json())
      .then(data => setSeoConfigs(data))
      .catch(err => console.error('Failed to fetch SEO configs:', err));
  }, []);

  useEffect(() => {
    if (!seoConfigs) return;
    const routeName = currentPage === 'before-after' ? 'before-after' : currentPage;
    const config = seoConfigs[routeName];
    if (config) {
      document.title = config.title || 'YCDC | Yogiraj Centre for Dermatology & Cosmetology';

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', config.meta_description || '');
    } else {
      document.title = 'YCDC | Yogiraj Centre for Dermatology & Cosmetology';
    }
  }, [currentPage, seoConfigs]);

  // Google Analytics Pageview Tracker
  useEffect(() => {
    const win = window as any;
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
    }
  }, [currentPage, location]);

  const navigateToPage = (page: PageId) => {
    navigate(PAGE_PATHS[page] ?? PAGE_PATHS.home);
    dispatch(setMobileMenuOpen(false));
    scrollToTop();
  };

  const handleBookTreatment = (category: string, serviceId: string) => {
    dispatch(openBookingModal({ category, service: serviceId }));
  };

  const handleWhatsAppConnect = (branch: string) => {
    const text = encodeURIComponent(`Hello YCDC, I would like to inquire about a clinical consultation at your ${branch} branch.`);
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <>
      {/* 1. Royal Berry Top Bar (Phone, Centers, Patient Login, Virtual Diagnosis) - Only on inner pages */}
      {currentPage !== 'admin' && currentPage !== 'home' && (
        <div className="top-bar-royal-berry">
          <div className="container top-bar-royal-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', textDecoration: 'none' }}>
                <Phone size={13} /> +91 98765 43210
              </a>
              <span style={{ opacity: 0.5 }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} /> Bengaluru | Thiruvananthapuram
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button
                onClick={() => navigate('/admin')}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.82rem', cursor: 'pointer', opacity: 0.95 }}
              >
                Patient Login
              </button>
              <span style={{ opacity: 0.5 }}>|</span>
              <button
                onClick={() => {
                  navigateToPage('home');
                  setTimeout(() => {
                    const el = document.getElementById('virtual-diagnosis');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Virtual Diagnosis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Navigation Header matching Client Master Design Image */}
      {currentPage !== 'admin' && (() => {
        const isTransparentHeader = currentPage === 'home' && !isScrolled;
        return (
          <header
            className={`header-reference-bar ${isTransparentHeader ? 'header-transparent' : 'header-scrolled'}`}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 1000,
              transition: 'all 0.3s ease',
              backgroundColor: isTransparentHeader ? 'transparent' : 'rgba(250, 246, 240, 0.96)',
              backdropFilter: isTransparentHeader ? 'none' : 'blur(10px)',
              borderBottom: isTransparentHeader ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(215, 203, 190, 0.55)',
              boxShadow: isScrolled ? '0 4px 20px rgba(51, 84, 53, 0.08)' : 'none',
              padding: isScrolled ? '12px 0' : '16px 0'
            }}
          >
            {/* Elegant Luxury Scroll Progress Indicator */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${scrollProgress}%`,
                height: '3px',
                background: 'linear-gradient(90deg, #B49A68 0%, #233D32 50%, #E6CA85 100%)',
                zIndex: 1002,
                transition: 'width 0.12s ease-out'
              }} 
            />
            <div
              className="container"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '1440px',
                padding: '0 clamp(16px, 3vw, 40px)'
              }}
            >
              {/* Official YCDC Logo */}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigateToPage('home'); }}
                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
                aria-label="YCDC - Dr. Yogiraj Centre for Dermatology & Cosmetology"
              >
                <img
                  src="/ycdc-logo.png"
                  alt="YCDC - Dr. Yogiraj Centre for Dermatology & Cosmetology"
                  style={{
                    height: isScrolled ? '40px' : '46px',
                    width: 'auto',
                    objectFit: 'contain',
                    transition: 'all 0.3s ease',
                    filter: isTransparentHeader
                      ? 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.6)) brightness(1.15)'
                      : 'none'
                  }}
                />
              </a>

              {/* Desktop Navigation Links matching client master design */}
              <nav
                className="desktop-menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 1.6vw, 28px)'
                }}
              >
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About' },
                  { id: 'treatments', label: 'Treatments' },
                  { id: 'team', label: 'Doctors' },
                  { id: 'before-after', label: 'Results' },
                  { id: 'blog', label: 'Blogs' },
                  { id: 'contact', label: 'Contact' }
                ].map((item) => {
                  const isActive = currentPage === item.id;
                  const linkColor = isTransparentHeader
                    ? (isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.88)')
                    : (isActive ? '#2A362B' : '#5E6E60');
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateToPage(item.id as PageId)}
                      className={`header-nav-link ${isActive ? 'active' : ''}`}
                      style={{
                        color: linkColor,
                        fontWeight: isActive ? 700 : 500,
                        position: 'relative',
                        paddingBottom: '4px',
                        borderBottom: isActive ? (isTransparentHeader ? '2px solid #ffffff' : '2px solid #2A362B') : '2px solid transparent'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Right Action: Search Icon + Book a Consultation Button + Menu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <HeaderSearch
                  iconColor={isTransparentHeader ? '#ffffff' : '#2A362B'}
                  onNavigateToTreatments={(searchQuery) => {
                    navigate(`/treatments?search=${encodeURIComponent(searchQuery)}`);
                    dispatch(setMobileMenuOpen(false));
                    scrollToTop();
                  }}
                />

                <button
                  onClick={() => dispatch(openBookingModal(undefined))}
                  className="btn-header-consultation-master"
                  style={{
                    backgroundColor: '#D9A5A7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '11px 22px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: isTransparentHeader ? '0 4px 16px rgba(217, 165, 167, 0.45)' : '0 4px 14px rgba(217, 165, 167, 0.28)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  Book a Consultation <ArrowRight size={15} />
                </button>

                {/* Menu Icon (Matches reference layout beside button) */}
                <button
                  className="header-reference-menu-btn"
                  onClick={() => dispatch(toggleMobileMenu())}
                  aria-label="Toggle Navigation Menu"
                  style={{
                    color: isTransparentHeader ? '#ffffff' : '#2A362B',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              padding: '24px 28px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #E8D5E0',
              borderBottom: '1px solid #E8D5E0',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 12px 30px rgba(60, 35, 53, 0.1)',
              textAlign: 'left'
            }}>
              <button onClick={() => { dispatch(setMobileMenuOpen(false)); navigateToPage('home'); }} className={`header-nav-link ${currentPage === 'home' ? 'active' : ''}`} style={{ textAlign: 'left', fontSize: '1.05rem' }}>Home</button>
              <button onClick={() => { dispatch(setMobileMenuOpen(false)); navigateToPage('about'); }} className={`header-nav-link ${currentPage === 'about' ? 'active' : ''}`} style={{ textAlign: 'left', fontSize: '1.05rem' }}>About Us</button>
              <button onClick={() => { dispatch(setMobileMenuOpen(false)); navigateToPage('team'); }} className={`header-nav-link ${currentPage === 'team' ? 'active' : ''}`} style={{ textAlign: 'left', fontSize: '1.05rem' }}>Our Team</button>
              <button onClick={() => { dispatch(setMobileMenuOpen(false)); navigateToPage('before-after'); }} className={`header-nav-link ${currentPage === 'before-after' ? 'active' : ''}`} style={{ textAlign: 'left', fontSize: '1.05rem' }}>Before &amp; After</button>
              <button onClick={() => { dispatch(setMobileMenuOpen(false)); navigateToPage('treatments'); }} className={`header-nav-link ${currentPage === 'treatments' ? 'active' : ''}`} style={{ textAlign: 'left', fontSize: '1.05rem' }}>Treatments</button>
              <button onClick={() => { dispatch(setMobileMenuOpen(false)); navigateToPage('gallery'); }} className={`header-nav-link ${currentPage === 'gallery' ? 'active' : ''}`} style={{ textAlign: 'left', fontSize: '1.05rem' }}>Gallery</button>
              <button onClick={() => { dispatch(setMobileMenuOpen(false)); navigateToPage('blog'); }} className={`header-nav-link ${currentPage === 'blog' ? 'active' : ''}`} style={{ textAlign: 'left', fontSize: '1.05rem' }}>Blog</button>
              <button onClick={() => { dispatch(setMobileMenuOpen(false)); navigateToPage('contact'); }} className={`header-nav-link ${currentPage === 'contact' ? 'active' : ''}`} style={{ textAlign: 'left', fontSize: '1.05rem' }}>Contact</button>
              <button
                onClick={() => {
                  dispatch(setMobileMenuOpen(false));
                  dispatch(openBookingModal({ service: 'Virtual Screening' }));
                }}
                className="header-nav-link-accent"
                style={{ textAlign: 'left', fontSize: '1.05rem' }}
              >
                Virtual Diagnosis
              </button>

              <button
                onClick={() => { dispatch(setMobileMenuOpen(false)); dispatch(openBookingModal(undefined)); }}
                className="btn-header-book"
                style={{ width: '100%', marginTop: '8px', padding: '12px' }}
              >
                BOOK APPOINTMENT
              </button>
            </div>
          )}
        </header>
        );
      })()}

      <main key={currentPage} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentPage === 'home' && (
          <HomePage
            onNavigateToPage={navigateToPage}
            onOpenBookingModal={(p) => dispatch(openBookingModal(p))}
            onBookTreatment={handleBookTreatment}
          />
        )}

        {currentPage === 'about' && (
          <AboutUs onNavigateToContact={() => navigateToPage('contact')} />
        )}

        {currentPage === 'team' && (
          <OurTeam onOpenApplyModal={() => dispatch(setApplyModalOpen(true))} />
        )}

        {currentPage === 'before-after' && (
          <BeforeAfter onBookTreatment={handleBookTreatment} />
        )}

        {currentPage === 'treatments' && (
          <TreatmentsList onBookTreatment={handleBookTreatment} />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage />
        )}

        {currentPage === 'blog' && (
          <BlogPage />
        )}

        {currentPage === 'contact' && (
          <ContactUs />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicy />
        )}

        {currentPage === 'admin' && (
          <AdminPortal />
        )}
      </main>

      {/* 13. Footer */}
      {currentPage !== 'admin' && (
        <>
          <footer className="footer-royal-banner">
            <div className="container" style={{ maxWidth: '1440px', padding: '0 clamp(16px, 3.5vw, 48px)' }}>
              {/* Top Sub-Bar matching Image 5 */}
              <div className="footer-royal-topbar">
                {/* Left: Original YCDC Logo */}
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigateToPage('home')}>
                  <img
                    src="/ycdc-logo.png"
                    alt="YCDC - Dr. Yogiraj Centre for Dermatology &amp; Cosmetology"
                    style={{
                      height: '52px',
                      width: 'auto',
                      objectFit: 'contain',
                      filter: 'none'
                    }}
                  />
                </div>

                {/* Center: Calligraphy Tagline in Elegant Serif Italic */}
                <div className="footer-script-tag">
                  Healthy Skin <span className="luxury-gold-dot">&bull;</span> Majestic You
                </div>

                {/* Right: Socials */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-icon-btn" title="Instagram">
                      <Instagram size={17} />
                    </a>
                    <a href={socialLinks.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="footer-social-icon-btn" title="Facebook">
                      <Facebook size={17} />
                    </a>
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="footer-social-icon-btn" title="YouTube">
                      <Youtube size={17} />
                    </a>
                  </div>
                </div>

              {/* 4 Columns matching Luxury Clinical Design */}
              <div className="footer-royal-grid-4col">
                {/* Col 1: YCDC India */}
                <div>
                  <h5 className="footer-col-title">YCDC India</h5>
                  <p className="footer-col-desc">
                    Yogiraj Centre for Dermatology &amp; Cosmetology is an ISO 9001:2015 certified clinical and cosmetic dermatology institution providing evidence-based skin, hair, and laser therapies under the clinical leadership of Dr. K. Yogiraj.
                  </p>
                  <div className="footer-iso-badge">
                    <ShieldCheck size={14} style={{ color: '#B49A68' }} />
                    <span>ISO 9001:2015 Accredited</span>
                  </div>
                </div>

                {/* Col 2: Primary Destinations */}
                <div>
                  <h5 className="footer-col-title">Primary Destinations</h5>
                  <div className="footer-col-list">
                    <button onClick={() => navigateToPage('home')}>Home</button>
                    <button onClick={() => navigateToPage('treatments')}>Treatments</button>
                    <button onClick={() => navigateToPage('team')}>Specialists</button>
                    <button onClick={() => navigateToPage('before-after')}>Clinical Results</button>
                    <button onClick={() => navigateToPage('about')}>About YCDC</button>
                    <button onClick={() => navigateToPage('contact')}>Contact Us</button>
                  </div>
                </div>

                {/* Col 3: Operating Centres */}
                <div>
                  <h5 className="footer-col-title">Operating Centres</h5>
                  <div className="footer-col-list">
                    <button onClick={() => navigateToPage('contact')}>Pattom, Thiruvananthapuram</button>
                    <button onClick={() => navigateToPage('contact')}>Whitefield, Bengaluru</button>
                    <button onClick={() => navigateToPage('gallery')}>Facility Gallery</button>
                    <button onClick={() => navigateToPage('blog')}>Clinical Blog</button>
                    <button onClick={() => {
                      if (currentPage !== 'home') {
                        navigateToPage('home');
                        setTimeout(() => {
                          const el = document.getElementById('virtual-diagnosis');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 200);
                      } else {
                        const el = document.getElementById('virtual-diagnosis');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}>Virtual Diagnosis</button>
                  </div>
                </div>

                {/* Col 4: Standards & Privacy */}
                <div>
                  <h5 className="footer-col-title">Standards &amp; Privacy</h5>
                  <div className="footer-col-list">
                    <span className="footer-standard-item">
                      <ShieldCheck size={14} style={{ color: '#E7C2C2' }} /> ISO 9001:2015 Certified Quality
                    </span>
                    <span className="footer-standard-item">
                      <Lock size={14} style={{ color: '#E7C2C2' }} /> Clinical Data Privacy Compliant
                    </span>
                    <span className="footer-standard-item">
                      <Award size={14} style={{ color: '#B49A68' }} /> Indian Medical Board Registered
                    </span>
                    <button onClick={() => navigate('/admin')} style={{ color: '#B49A68', marginTop: '8px', fontWeight: 600 }}>
                      Admin Portal &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Sub-bar with clearance from floating buttons */}
              <div className="footer-royal-bottombar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} style={{ color: '#E7C2C2' }} /> Whitefield, Bengaluru &amp; Pattom, Trivandrum
                  </span>
                  <span>|</span>
                  <a href="tel:+917593864264" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} style={{ color: '#E7C2C2' }} /> +91 75938 64264
                  </a>
                  <span>|</span>
                  <a href="mailto:info@ycdc.in" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={13} style={{ color: '#E7C2C2' }} /> info@ycdc.in
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button onClick={() => navigateToPage('privacy')} className="footer-link-btn" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Privacy Policy</button>
                  <span>|</span>
                  <button onClick={() => navigateToPage('privacy')} className="footer-link-btn" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Terms of Care</button>
                </div>
              </div>
            </div>
          </footer>

          {/* Floating Action Buttons */}
          <div className="floating-cta-phone">
            <button
              onClick={() => window.open(`tel:${phone}`, '_self')}
              className="floating-circle-btn"
              style={{ backgroundColor: 'var(--deep-olive)', color: '#ffffff' }}
              title="Call YCDC Clinic"
              aria-label="Call YCDC Clinic"
            >
              <Phone size={22} />
            </button>
          </div>

          <div className="floating-cta-whatsapp">
            <button
              onClick={() => handleWhatsAppConnect('Floating Widget')}
              className="floating-circle-btn"
              style={{ backgroundColor: '#25D366', color: '#ffffff', border: 'none' }}
              title="WhatsApp Consultation"
              aria-label="WhatsApp Consultation"
            >
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.943 11.474.943 6.037.943 1.611 5.313 1.607 10.744c-.001 1.674.437 3.313 1.272 4.757l-.995 3.633 3.763-.98zm12.355-6.388c-.328-.164-1.94-.959-2.24-1.069-.3-.11-.518-.164-.738.164-.22.329-.85.85-1.042 1.069-.19.22-.382.246-.71.082-.328-.164-1.386-.511-2.64-1.631-.975-.87-1.633-1.947-1.824-2.274-.19-.328-.02-.505.143-.669.148-.148.328-.383.493-.574.165-.19.22-.328.328-.546.11-.22.055-.41-.028-.574-.082-.164-.738-1.78-.997-2.42-.25-.6-.525-.515-.71-.523-.19-.009-.41-.01-.628-.01-.22 0-.573.082-.873.41-.3.329-1.147 1.122-1.147 2.733 0 1.61 1.173 3.167 1.336 3.386.164.22 2.307 3.523 5.59 4.947.78.338 1.39.54 1.86.689.784.249 1.497.213 2.06.13.628-.092 1.94-.793 2.214-1.56.273-.767.273-1.423.19-1.56-.081-.137-.3-.22-.628-.383z" />
              </svg>
            </button>
          </div>

          {/* Floating Back to Top Button */}
          {showBackToTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="back-to-top-btn"
              title="Scroll to Top"
              aria-label="Scroll to Top"
              style={{
                position: 'fixed',
                bottom: '28px',
                right: '28px',
                zIndex: 999,
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#233D32',
                color: '#ffffff',
                border: '2px solid rgba(180, 154, 104, 0.4)',
                boxShadow: '0 8px 24px rgba(35, 61, 50, 0.35)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <ChevronUp size={22} />
            </button>
          )}

          {/* Mobile Bottom Quick-Action Bar (< 768px) */}
          <div className="mobile-bottom-quickbar">
            <a 
              href="tel:+917593864264" 
              className="mobile-quick-btn mobile-call-btn"
              aria-label="Call YCDC Clinic"
              title="Call YCDC Clinic"
            >
              <Phone size={19} />
            </a>
            <button 
              onClick={() => dispatch(openBookingModal(undefined))}
              className="mobile-quick-btn mobile-book-btn"
              aria-label="Book Appointment"
              title="Book Appointment"
            >
              <Calendar size={19} />
            </button>
            <a 
              href="https://wa.me/917593864264?text=Hello%20YCDC%20Clinic%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-quick-btn mobile-whatsapp-btn"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={19} />
            </a>
          </div>
        </>
      )}

      {/* Pop-up Modals */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(41, 45, 38, 0.72)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{ width: '100%', maxWidth: '600px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '16px' }}>
            <BookingWidget
              onClose={() => dispatch(closeBookingModal())}
              initialCategory={bookingPrefills.category}
              initialService={bookingPrefills.service}
            />
          </div>
        </div>
      )}

      {showDashboardModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(41, 45, 38, 0.72)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{ width: '100%', maxWidth: '980px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '16px' }}>
            <LeadDashboard onClose={() => dispatch(setDashboardModalOpen(false))} />
          </div>
        </div>
      )}

      {showApplyModal && (
        <ApplyNowModal onClose={() => dispatch(setApplyModalOpen(false))} />
      )}
    </>
  );
}

function App() {
  return (
    <RootLayout>
      <AppContent />
    </RootLayout>
  );
}

export default App;
