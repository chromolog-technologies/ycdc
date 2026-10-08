import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MapPin, 
  Sparkles, 
  Stethoscope, 
  AlertCircle, 
  Phone, 
  MessageSquare,
  ArrowRight,
  X,
  CheckCircle2,
  ShieldCheck,
  Award,
  Calendar
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import type { Treatment, TreatmentsListProps } from '../types';
import { TREATMENT_IMAGES, MOCK_SERVICES } from '../data/treatmentsData';

const FAQS = [
  {
    q: "What is the difference between Dermatic and Cosmetic procedures?",
    a: "Dermatic procedures focus on clinical diagnoses, allergy testing, immunofluorescence (DIF), biopsies, phototherapy, and minor surgical removals (warts, keloids, ingrown nails). Cosmetic procedures focus on laser resurfacing, skin brightening, anti-aging injectables (Botox/fillers), facial aesthetics, and advanced hair restoration (PRP, GFC, FUE)."
  },
  {
    q: "Which procedures are currently available at Trivandrum Branch?",
    a: "All 37 procedures listed above—including advanced Allergy Panels (Dust & Food), Micro-surgeries, Revlite/Soprano/ResurFX/Secret RF Lasers, Botox, Fillers, Hydrafacial, GFC, PRP, and Hair Transplants—are fully operational at our Pattom, Trivandrum center."
  },
  {
    q: "When will the Bangalore Branch procedure list be updated?",
    a: "The Bangalore (Whitefield) clinic procedure catalog is being compiled and will be published online very soon. However, consultations, clinical dermatological treatments, lasers, and hair care are already available at Whitefield. Please contact us via WhatsApp or Phone to book your Bangalore appointment."
  },
  {
    q: "Are allergy skin prick tests and patch tests safe?",
    a: "Yes, all diagnostic tests including Dust & Food allergy prick tests and European standard patch tests are performed by experienced clinical dermatologists with emergency anti-histamine backup on site."
  },
  {
    q: "How many sessions are recommended for PRP and GFC Hair Therapies?",
    a: "Usually a primary sequence of 4 to 6 sessions spaced 3-4 weeks apart yields optimal reduction in hair shedding and triggers visible follicular density growth."
  }
];

export default function TreatmentsList({ onBookTreatment }: TreatmentsListProps) {
  const [treatments, setTreatments] = useState<Treatment[]>(MOCK_SERVICES);
  const [selectedBranch, setSelectedBranch] = useState<'all' | 'trivandrum' | 'bangalore'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'dermatic' | 'cosmetic'>('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeModalTreatment, setActiveModalTreatment] = useState<Treatment | null>(null);

  const [searchParams] = useSearchParams();

  // Sync URL search query if navigated from Header search
  useEffect(() => {
    const queryFromUrl = searchParams.get('search');
    if (queryFromUrl !== null) {
      setSearchQuery(queryFromUrl);
      setSelectedType('all');
      setActiveFilter('all');
      setTimeout(() => {
        const el = document.getElementById('treatments-catalog');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [searchParams]);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (activeModalTreatment) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActiveModalTreatment(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeModalTreatment]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const mapped = data.map((t: any) => ({
            ...t,
            branch: t.branch || 'trivandrum',
            procedure_type: t.procedure_type || (t.category === 'skin' && t.name.toLowerCase().includes('test') ? 'dermatic' : 'cosmetic'),
            image: TREATMENT_IMAGES[t.id] || 'https://ycdc.in/wp-content/uploads/2025/07/beautiful-young-indian-woman-enjoying-face-lifting-2025-03-18-17-16-15-utc-scaled.jpg'
          }));
          setTreatments(mapped);
        }
      })
      .catch(err => {
        console.warn("Using high-fidelity local procedures dataset:", err);
      });
  }, []);

  // Filter & Search logic
  const filteredTreatments = treatments.filter((t) => {
    const matchesBranch = selectedBranch === 'all' || (t.branch === selectedBranch || t.branch === 'both');
    const matchesType = selectedType === 'all' || t.procedure_type === selectedType;
    const matchesCategory = activeFilter === 'all' || t.category === activeFilter;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.treats.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesType && matchesCategory && matchesSearch;
  });

  const dermaticCount = treatments.filter(t => t.procedure_type === 'dermatic' && (selectedBranch === 'all' || t.branch === selectedBranch || t.branch === 'both')).length;
  const cosmeticCount = treatments.filter(t => t.procedure_type === 'cosmetic' && (selectedBranch === 'all' || t.branch === selectedBranch || t.branch === 'both')).length;

  const toggleFaq = (index: number) => {
    setExpandedFaq(prev => prev === index ? null : index);
  };

  const handleWhatsAppClick = (branchName: string) => {
    const phone = branchName === 'Bangalore' ? '919008985222' : '919447012345';
    const message = encodeURIComponent(`Hello YCDC ${branchName} Clinic, I would like to inquire about clinical procedures and appointments.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // Helper for small card descriptions (around 1-2 clean lines)
  const getShortDescription = (desc: string) => {
    if (!desc) return '';
    if (desc.length <= 110) return desc;
    const periodIdx = desc.indexOf('. ');
    if (periodIdx > 35 && periodIdx <= 110) {
      return desc.substring(0, periodIdx + 1);
    }
    const trimmed = desc.substring(0, 105);
    const lastSpace = trimmed.lastIndexOf(' ');
    return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + '...';
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--silk-100)', paddingBottom: '60px' }}>
      {/* Page Header */}
      <section className="section-padding" style={{ 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%), url("/luxury_treatment_suite.jpg") no-repeat center center/cover', 
        color: 'white',
        textAlign: 'center',
        padding: '100px 0 80px'
      }}>
        <div className="container">
          <span 
            className="badge badge-gold" 
            style={{ 
              marginBottom: '16px', 
              display: 'inline-block',
              backgroundColor: 'rgba(180, 154, 104, 0.3)', 
              color: '#F3E5AB', 
              border: '1px solid rgba(243, 229, 171, 0.5)',
              padding: '6px 18px',
              borderRadius: '30px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              backdropFilter: 'blur(8px)'
            }}
          >
            Clinical Dermatology & Cosmetic Aesthetics
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: '2.8rem', marginBottom: '18px' }}>
            Dermatic & Cosmetic Procedures Catalog
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Explore our specialized clinical allergy testing, dermato-surgeries, laser skin resurfacing, and advanced hair growth therapies across our branches.
          </p>

          {/* Branch Selector Pills in Header */}
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedBranch('all')}
              style={{
                padding: '10px 22px',
                borderRadius: '30px',
                border: selectedBranch === 'all' ? '2px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.3)',
                backgroundColor: selectedBranch === 'all' ? 'var(--gold-500)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease'
              }}
            >
              <MapPin size={15} /> All Locations
            </button>
            <button
              onClick={() => setSelectedBranch('trivandrum')}
              style={{
                padding: '10px 22px',
                borderRadius: '30px',
                border: selectedBranch === 'trivandrum' ? '2px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.3)',
                backgroundColor: selectedBranch === 'trivandrum' ? 'var(--gold-500)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease'
              }}
            >
              <MapPin size={15} /> Trivandrum Branch (Pattom)
            </button>
            <button
              onClick={() => setSelectedBranch('bangalore')}
              style={{
                padding: '10px 22px',
                borderRadius: '30px',
                border: selectedBranch === 'bangalore' ? '2px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.3)',
                backgroundColor: selectedBranch === 'bangalore' ? 'var(--gold-500)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease'
              }}
            >
              <MapPin size={15} /> Bangalore Branch (Whitefield)
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Container */}
      <section id="treatments-catalog" style={{ marginTop: '-25px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="glass" style={{ padding: 'clamp(16px, 3vw, 24px) clamp(16px, 3.5vw, 30px)', borderRadius: '14px', background: 'white', boxShadow: 'var(--shadow-md)', border: '1px solid var(--silk-200)' }}>
            
            {/* Primary Filter Tabs: Dermatic vs Cosmetic */}
            <div className="treatments-filter-tabs" style={{ marginBottom: '20px', borderBottom: '1px solid var(--silk-200)', paddingBottom: '16px' }}>
              <button
                onClick={() => setSelectedType('all')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  border: 'none',
                  backgroundColor: selectedType === 'all' ? '#233D32' : 'var(--silk-100)',
                  color: selectedType === 'all' ? 'white' : '#233D32',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                All Procedures ({selectedBranch === 'bangalore' ? 0 : 37})
              </button>
              <button
                onClick={() => setSelectedType('dermatic')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  border: 'none',
                  backgroundColor: selectedType === 'dermatic' ? '#233D32' : 'var(--silk-100)',
                  color: selectedType === 'dermatic' ? 'white' : '#233D32',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Stethoscope size={16} /> Dermatic Procedures ({selectedBranch === 'bangalore' ? 0 : dermaticCount})
              </button>
              <button
                onClick={() => setSelectedType('cosmetic')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  border: 'none',
                  backgroundColor: selectedType === 'cosmetic' ? '#B49A68' : 'var(--silk-100)',
                  color: selectedType === 'cosmetic' ? 'white' : '#233D32',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Sparkles size={16} /> Cosmetic Procedures ({selectedBranch === 'bangalore' ? 0 : cosmeticCount})
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              {/* Category buttons */}
              <div className="mobile-horizontal-track" style={{ gap: '8px', flex: 1, minWidth: 0 }}>
                {[
                  { key: 'all', label: 'All Specialties' },
                  { key: 'skin', label: 'Skin & Allergy' },
                  { key: 'laser', label: 'Lasers & RF' },
                  { key: 'hair', label: 'Hair & Scalp' },
                  { key: 'aesthetics', label: 'Aesthetic Surgeries' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveFilter(cat.key)}
                    className="btn"
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      borderRadius: '20px',
                      backgroundColor: activeFilter === cat.key ? '#233D32' : 'var(--silk-100)',
                      color: activeFilter === cat.key ? 'white' : 'var(--muted-charcoal)',
                      border: '1px solid transparent',
                      transition: 'var(--transition-fast)',
                      cursor: 'pointer',
                      fontWeight: activeFilter === cat.key ? '600' : 'normal',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-charcoal)' }} />
                <input
                  type="text"
                  placeholder="Search procedures, allergy tests, lasers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 38px',
                    borderRadius: '30px',
                    border: '1px solid var(--silk-200)',
                    outline: 'none',
                    fontSize: '0.88rem',
                    backgroundColor: 'var(--silk-100)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Banner for Bangalore Branch */}
      {selectedBranch === 'bangalore' && (
        <section style={{ marginTop: '40px' }}>
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, #fff9e6 0%, #fff0f5 100%)',
              border: '2px dashed var(--gold-500)',
              borderRadius: '16px',
              padding: '40px 30px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <AlertCircle size={44} style={{ color: 'var(--gold-600)', marginBottom: '14px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', fontSize: '1.8rem', marginBottom: '10px' }}>
                Bangalore Branch Procedures Updating Soon
              </h3>
              <p style={{ maxWidth: '650px', margin: '0 auto 24px', color: 'var(--muted-charcoal)', fontSize: '1rem', lineHeight: '1.6' }}>
                The full catalog of clinical and cosmetic procedures specifically customized for our <strong>Whitefield, Bangalore</strong> branch is currently being updated and will be published here shortly.
              </p>
              <p style={{ fontSize: '0.9rem', color: '#233D32', fontWeight: '600', marginBottom: '24px' }}>
                All core treatments, consultations, lasers, and hair care are fully active at our Whitefield clinic. Reach out to our Bangalore care team directly:
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleWhatsAppClick('Bangalore')}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#25D366', borderColor: '#25D366', color: 'white', fontWeight: 'bold' }}
                >
                  <MessageSquare size={16} /> WhatsApp Bangalore Clinic
                </button>
                <a
                  href="tel:+919008985222"
                  className="btn btn-outline"
                  style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#233D32', borderColor: '#233D32', fontWeight: 'bold' }}
                >
                  <Phone size={16} /> Call Whitefield Branch
                </a>
                <button
                  onClick={() => setSelectedBranch('trivandrum')}
                  className="btn btn-secondary"
                  style={{ padding: '12px 24px', cursor: 'pointer' }}
                >
                  View Trivandrum Procedures ({37})
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Treatments Cards Grid */}
      <section className="section-padding" style={{ padding: '40px 0 60px' }}>
        <div className="container">

          {/* Active branch label bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted-charcoal)' }}>
              Showing <strong>{filteredTreatments.length}</strong> procedure{filteredTreatments.length === 1 ? '' : 's'} 
              {selectedBranch === 'trivandrum' ? ' available at Trivandrum Branch' : selectedBranch === 'bangalore' ? ' for Bangalore Branch' : ' across branches'}
            </span>
            <span className="badge badge-premium" style={{ fontSize: '0.75rem', backgroundColor: 'rgba(35, 61, 50, 0.1)', color: '#233D32', borderColor: 'rgba(35, 61, 50, 0.25)', whiteSpace: 'nowrap' }}>
              {selectedBranch === 'trivandrum' ? '📍 Trivandrum Branch (Pattom)' : selectedBranch === 'bangalore' ? '📍 Bangalore Branch (Whitefield)' : '📍 All Branches'}
            </span>
          </div>

          {filteredTreatments.length > 0 ? (
            <div className="treatments-catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '22px', width: '100%' }}>
              {filteredTreatments.map((t) => (
                <div 
                  key={t.id}
                  className="glass hover-premium"
                  onClick={() => setActiveModalTreatment(t)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid var(--silk-200)',
                    overflow: 'hidden',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(35, 61, 50, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(35, 61, 50, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--silk-200)';
                  }}
                >
                  {/* Card Cover Image */}
                  {t.image && (
                    <div style={{ height: '185px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--silk-200)' }}>
                      <img 
                        src={t.image} 
                        alt={t.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', maxWidth: '48%', zIndex: 2 }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 'bold', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          padding: '4px 8px', 
                          borderRadius: '20px', 
                          backgroundColor: t.procedure_type === 'dermatic' ? '#233D32' : '#B49A68',
                          color: 'white',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'inline-block',
                          maxWidth: '100%'
                        }}>
                          {t.procedure_type === 'dermatic' ? '🩺 DERMATIC' : '✨ COSMETIC'}
                        </span>
                      </div>

                      <div style={{ position: 'absolute', top: '10px', right: '10px', maxWidth: '48%', zIndex: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 'bold', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          backdropFilter: 'blur(4px)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'inline-block',
                          maxWidth: '100%'
                        }}>
                          {t.branch === 'bangalore' ? 'Bangalore Branch' : t.branch === 'both' ? 'All Branches' : 'Trivandrum Branch'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Content Details */}
                  <div style={{ padding: 'clamp(14px, 4vw, 20px)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Category and duration */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#233D32', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {t.category_name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#B49A68', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                          <Clock size={12} /> {t.duration}
                        </span>
                      </div>

                      <h4 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', fontSize: '1.2rem', marginBottom: '8px', lineHeight: '1.35', fontWeight: 600 }}>
                        {t.name}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.55', marginBottom: '14px' }}>
                        {getShortDescription(t.description)}
                      </p>
                    </div>

                    {/* Interactive Card Action Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--silk-200)', marginTop: '6px', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#233D32', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                        View Details <ArrowRight size={14} />
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookTreatment(t.category, t.id);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          border: 'none',
                          backgroundColor: 'rgba(35, 61, 50, 0.08)',
                          color: '#233D32',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#233D32';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(35, 61, 50, 0.08)';
                          e.currentTarget.style.color = '#233D32';
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedBranch !== 'bangalore' ? (
            <div style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderRadius: '12px', border: '1px solid var(--silk-200)' }}>
              <p style={{ color: 'var(--muted-charcoal)', fontSize: '1.1rem' }}>No procedures found matching your criteria. Try adjusting your search query or filter.</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Treatments FAQ Section */}
      <section className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-premium">Patient Knowledge</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', marginTop: '10px', fontSize: '2.2rem' }}>
              Procedures & Diagnostics FAQ
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                style={{ 
                  border: '1px solid var(--silk-200)', 
                  borderRadius: '10px', 
                  backgroundColor: 'var(--silk-100)',
                  overflow: 'hidden',
                  textAlign: 'left'
                }}
              >
                <div 
                  onClick={() => toggleFaq(idx)}
                  style={{ 
                    padding: '20px 24px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer', 
                    userSelect: 'none'
                  }}
                >
                  <span style={{ fontWeight: '600', color: '#233D32', fontSize: '0.95rem' }}>{faq.q}</span>
                  {expandedFaq === idx ? <ChevronUp size={18} style={{ color: '#233D32' }} /> : <ChevronDown size={18} style={{ color: '#233D32' }} />}
                </div>

                {expandedFaq === idx && (
                  <div style={{ padding: '0 24px 20px', fontSize: '0.9rem', color: 'var(--muted-charcoal)', lineHeight: '1.6', borderTop: '1px solid var(--silk-200)', paddingTop: '16px', backgroundColor: 'white' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Treatment Modal */}
      {activeModalTreatment && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModalTreatment(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(20, 35, 25, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(8px, 3vw, 20px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '740px',
              maxHeight: '90vh',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid var(--silk-200)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Top Banner / Image Header */}
            <div style={{ position: 'relative', height: '220px', backgroundColor: '#233D32', overflow: 'hidden' }}>
              {activeModalTreatment.image ? (
                <>
                  <img
                    src={activeModalTreatment.image}
                    alt={activeModalTreatment.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%)'
                  }} />
                </>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #233D32 0%, #1A2F26 100%)'
                }} />
              )}

              {/* Close Button */}
              <button
                onClick={() => setActiveModalTreatment(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#233D32')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)')}
              >
                <X size={20} />
              </button>

              {/* Badges on Top of Image Header */}
              <div style={{ position: 'absolute', bottom: '16px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    backgroundColor: activeModalTreatment.procedure_type === 'dermatic' ? '#233D32' : '#B49A68',
                    color: 'white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                  }}>
                    {activeModalTreatment.procedure_type === 'dermatic' ? '🩺 DERMATIC PROCEDURE' : '✨ COSMETIC PROCEDURE'}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    {activeModalTreatment.category_name}
                  </span>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  color: '#F3E5AB',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Clock size={13} /> {activeModalTreatment.duration}
                </span>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ padding: '28px 28px 20px', overflowY: 'auto', flex: 1, textAlign: 'left' }}>
              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                color: '#233D32',
                fontSize: '1.85rem',
                marginBottom: '10px',
                lineHeight: '1.3',
                fontWeight: 600
              }}>
                {activeModalTreatment.name}
              </h3>

              {/* Location & Branch Availability */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', color: '#B49A68', fontSize: '0.85rem', fontWeight: 600 }}>
                <MapPin size={15} />
                <span>
                  Available at: {activeModalTreatment.branch === 'bangalore' ? 'Whitefield, Bengaluru Clinic' : activeModalTreatment.branch === 'both' ? 'Trivandrum & Bangalore Clinics' : 'Pattom, Trivandrum Clinic'}
                </span>
              </div>

              {/* Full Comprehensive Description */}
              <div style={{ marginBottom: '22px' }}>
                <h5 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#565F55', fontWeight: 700, marginBottom: '6px' }}>
                  Procedure Overview & Indications
                </h5>
                <p style={{ fontSize: '0.95rem', color: '#242923', lineHeight: '1.7' }}>
                  {activeModalTreatment.description}
                </p>
              </div>

              {/* Scientific & Clinical Mechanism Box */}
              {activeModalTreatment.science && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(35, 61, 50, 0.05) 0%, rgba(200, 209, 192, 0.2) 100%)',
                  border: '1px solid rgba(35, 61, 50, 0.18)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#233D32', fontWeight: 700, fontSize: '0.88rem' }}>
                    <Stethoscope size={18} />
                    <span>Clinical Mechanism of Action</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#334035', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                    {activeModalTreatment.science}
                  </p>
                </div>
              )}

              {/* Indicated For / Treats Tags */}
              {activeModalTreatment.treats && (
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#565F55', fontWeight: 700, marginBottom: '10px' }}>
                    Indicated For & Target Concerns
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeModalTreatment.treats.split(',').map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: 'var(--silk-100)',
                          border: '1px solid var(--silk-200)',
                          color: '#233D32',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 size={13} style={{ color: '#233D32' }} />
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Quality Assurance Guarantee */}
              <div style={{
                backgroundColor: '#FCFAF6',
                border: '1px solid #EFE9DF',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: '12px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#565F55' }}>
                  <ShieldCheck size={16} style={{ color: '#233D32', flexShrink: 0 }} />
                  <span>ISO 9001:2015 Clinical Safety</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#565F55' }}>
                  <Award size={16} style={{ color: '#233D32', flexShrink: 0 }} />
                  <span>US-FDA Approved Devices</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#565F55' }}>
                  <Sparkles size={16} style={{ color: '#233D32', flexShrink: 0 }} />
                  <span>Personalized Skin Protocol</span>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div style={{
              padding: '16px 28px',
              backgroundColor: '#FCFAF6',
              borderTop: '1px solid var(--silk-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <button
                onClick={() => setActiveModalTreatment(null)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  border: '1px solid var(--silk-200)',
                  backgroundColor: 'white',
                  color: '#565F55',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const branchName = activeModalTreatment.branch === 'bangalore' ? 'Whitefield, Bangalore' : 'Pattom, Trivandrum';
                    const phone = activeModalTreatment.branch === 'bangalore' ? '919008985222' : '919447012345';
                    const message = encodeURIComponent(`Hello YCDC ${branchName} Clinic, I would like to inquire about "${activeModalTreatment.name}".`);
                    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '30px',
                    border: 'none',
                    backgroundColor: '#25D366',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)'
                  }}
                >
                  <MessageSquare size={16} /> WhatsApp Inquiry
                </button>

                <button
                  onClick={() => {
                    const cat = activeModalTreatment.category;
                    const sId = activeModalTreatment.id;
                    setActiveModalTreatment(null);
                    onBookTreatment(cat, sId);
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '30px',
                    border: 'none',
                    backgroundColor: '#233D32',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(35, 61, 50, 0.25)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A2F26')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#233D32')}
                >
                  <Calendar size={16} /> Book This Treatment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
