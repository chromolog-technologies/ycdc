import { useState, useRef, useEffect } from 'react';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config';
import type { BeforeAfterProps, CaseStudy } from '../types';

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: "hair",
    category: "hair",
    categoryLabel: "Hair Restoration (FUE)",
    title: "Advanced FUE Hairline & Density Restoration",
    description: "Patient presented with Norwood Grade 3 hairline recession and diffuse thinning across the scalp crown. Following a 2,800 graft FUE hair transplant combined with post-op GFC micro-therapy, complete natural hairline density was successfully achieved over 8 months.",
    beforeImg: "/hair_before.png",
    afterImg: "/hair_after.png",
    details: {
      doctor: "Dr. K. Yogiraj & Dr. Vennela Reddy",
      technology: "Sapphire FUE & Growth Factor Concentrate (GFC)",
      sessions: "1 Surgical Session + 4 GFC Therapies",
      concern: "Hairline Recession & Frontal Thinning"
    }
  },
  {
    id: "skin",
    category: "skin",
    categoryLabel: "Acne Scar Correction",
    title: "Fractional RF Microneedling & TCA Cross",
    description: "Deep rolling and boxcar acne scars treated with a multi-layered approach using Secret RF Fractional Microneedling and targeted medical peels. Skin texture dramatically smoothed with over 85% scar depth reduction.",
    beforeImg: "/acne_before.png",
    afterImg: "/acne_after.png",
    details: {
      doctor: "Dr. Niranjana Raj",
      technology: "Secret RF Fractional Microneedling & Chemical Peels",
      sessions: "4 Monthly Sessions",
      concern: "Deep Acne Scars & Hyperpigmentation"
    }
  },
  {
    id: "laser",
    category: "laser",
    categoryLabel: "Laser & Scalp GFC",
    title: "Autologous Growth Factor Scalp Rejuvenation",
    description: "Advanced GFC scalp therapy for androgenetic alopecia in early stages. Stimulated dormant hair follicles resulting in visible hair shaft thickening and reduced daily shedding.",
    beforeImg: "/gfc_before.jpg",
    afterImg: "/gfc_after.jpg",
    details: {
      doctor: "Dr. Maya Vincent",
      technology: "High-Concentration Scalp GFC Therapy",
      sessions: "6 Sessions (4 weeks apart)",
      concern: "Scalp Thinning & Hair Shedding"
    }
  }
];

const HAIRLINE_GLOWUP_GALLERY = [
  "/hair_before.png",
  "/hair_after.png",
  "/gfc_before.jpg",
  "/gfc_after.jpg",
  "/hair_treatment_premium.png",
  "/clinic_lobby_premium.png"
];

const VERTEX_TRANSPLANT_GALLERY = [
  "/hair_after.png",
  "/acne_after.png",
  "/gfc_after.jpg",
  "/skin_treatment_premium.png",
  "/laser_treatment_premium.png"
];

export default function BeforeAfter({ onBookTreatment }: BeforeAfterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("hair");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(DEFAULT_CASE_STUDIES);

  useEffect(() => {
    fetch(`${API_BASE_URL}/case-studies`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            category: item.category,
            categoryLabel: item.category_label || item.title,
            title: item.title,
            description: item.description,
            beforeImg: item.before_img_path ? (item.before_img_path.startsWith('http') ? item.before_img_path : `http://localhost:8000${item.before_img_path}`) : '/hair_before.png',
            afterImg: item.after_img_path ? (item.after_img_path.startsWith('http') ? item.after_img_path : `http://localhost:8000${item.after_img_path}`) : '/hair_after.png',
            details: {
              doctor: item.doctor || "Dr. K. Yogiraj & Team",
              technology: item.technology || "Clinical Dermatology Protocol",
              sessions: item.sessions || "3-6 Sessions",
              concern: item.concern || item.title
            }
          }));
          setCaseStudies(mapped);
        }
      })
      .catch(err => {
        console.error("Error loading case studies from backend API, using local fallbacks:", err);
      });
  }, []);

  const currentCase = caseStudies.find(c => c.category === activeCategory) || caseStudies[0] || DEFAULT_CASE_STUDIES[0];

  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.offsetWidth);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Check with ResizeObserver if available
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [activeCategory]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--silk-100)', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Hero Header Banner */}
      <section style={{
        position: 'relative',
        padding: '120px 0 80px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.55) 0%, rgba(0, 0, 0, 0.65) 100%), url("/hero_clinical_results.jpg") no-repeat center center/cover',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(var(--brand-pink) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
            Proven Transformations
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'white', marginBottom: '14px', fontWeight: 600 }}>
            Clinical Before & Afters
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.92)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Explore scientific, authentic results of clinical dermatology and hair restoration treatments performed by our leading specialists.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-padding" style={{ padding: '60px 0' }}>
        <div className="container">
          {/* Category Tabs */}
          <div className="reveal reveal-up" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {caseStudies.map((c: any) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCategory(c.category);
                  setSliderPosition(50);
                }}
                style={{
                  padding: '12px 26px',
                  borderRadius: '50px',
                  border: activeCategory === c.category ? '2px solid var(--deep-olive)' : '1px solid var(--warm-fog)',
                  backgroundColor: activeCategory === c.category ? 'var(--deep-olive)' : 'var(--warm-ivory-light)',
                  color: activeCategory === c.category ? 'white' : 'var(--botanical-ink)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: activeCategory === c.category ? '0 4px 15px rgba(87, 85, 39, 0.3)' : 'var(--shadow-sm)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {c.categoryLabel}
              </button>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Interactive Slider Card */}
            <div className="glass reveal reveal-left hover-premium" style={{
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--silk-200)',
              backgroundColor: 'white',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="shimmer-bg"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '420px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'ew-resize',
                  userSelect: 'none'
                }}
              >
                {/* BEFORE Image (Underneath, showing right half) */}
                <img
                  src={currentCase.beforeImg}
                  alt="Before Treatment"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* BEFORE Overlay Badge */}
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  bottom: '16px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}>
                  BEFORE
                </div>

                {/* AFTER Image Wrapper (Left cropped side) */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${sliderPosition}%`,
                  height: '100%',
                  overflow: 'hidden',
                  borderRight: '2px solid white',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}>
                  <img
                    src={currentCase.afterImg}
                    alt="After Treatment"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: containerWidth || 500,
                      height: '100%',
                      objectFit: 'cover',
                      maxWidth: 'none'
                    }}
                  />
                  
                  {/* AFTER Overlay Badge */}
                  <div style={{
                    position: 'absolute',
                    left: '16px',
                    bottom: '16px',
                    backgroundColor: 'var(--plum-800)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    pointerEvents: 'none'
                  }}>
                    AFTER
                  </div>
                </div>

                {/* Slider Handle Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${sliderPosition}%`,
                  width: '2px',
                  backgroundColor: 'white',
                  transform: 'translateX(-50%)',
                  zIndex: 3,
                  pointerEvents: 'none'
                }}>
                  {/* Handle Circular Button */}
                  <div 
                    className="slider-handle-glow"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: '2px solid var(--plum-900)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                  >
                    <span style={{ color: 'var(--plum-900)', fontWeight: 'bold', fontSize: '1rem' }}>↔</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)', textAlign: 'center', marginTop: '12px', fontStyle: 'italic' }}>
                👈 Drag or swipe across the image to compare results 👉
              </p>
            </div>

            {/* Case Details Card */}
            <div className="reveal reveal-right" style={{ textAlign: 'left' }}>
              <span className="badge badge-premium" style={{ marginBottom: '14px' }}>
                Verified Transformation Case
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--plum-900)', marginBottom: '12px' }}>
                {currentCase.title}
              </h3>
              <p style={{ color: 'var(--muted-charcoal)', lineHeight: '1.6', marginBottom: '24px' }}>
                {currentCase.description}
              </p>

              {/* Technical Specifications */}
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--silk-200)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '30px'
              }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--plum-800)', letterSpacing: '0.05em' }}>Primary Concern</strong>
                  <span style={{ fontSize: '0.95rem', color: 'var(--charcoal)', fontWeight: '500' }}>{currentCase.details.concern}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--plum-800)', letterSpacing: '0.05em' }}>Treating Physician</strong>
                  <span style={{ fontSize: '0.95rem', color: 'var(--charcoal)', fontWeight: '500' }}>{currentCase.details.doctor}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--plum-800)', letterSpacing: '0.05em' }}>Technology/Therapy Used</strong>
                  <span style={{ fontSize: '0.95rem', color: 'var(--charcoal)', fontWeight: '500' }}>{currentCase.details.technology}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--plum-800)', letterSpacing: '0.05em' }}>Total Treatment Duration</strong>
                  <span style={{ fontSize: '0.95rem', color: 'var(--charcoal)', fontWeight: '500' }}>{currentCase.details.sessions}</span>
                </div>
              </div>

              {/* Book Consultation */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onBookTreatment(currentCase.category, currentCase.id)}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Book Consultation <Calendar size={16} />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('consultation');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-outline-gold"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Virtual Diagnosis <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Quality Certifications */}
      <section style={{ backgroundColor: 'white', padding: '60px 0', borderTop: '1px solid var(--silk-200)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} style={{ color: 'var(--plum-800)' }} />
            <div>
              <h5 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--plum-900)' }}>Authentic Patient Results</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)' }}>No retouching or enhancement filters applied.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} style={{ color: 'var(--plum-800)' }} />
            <div>
              <h5 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--plum-900)' }}>ISO Certified Standards</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)' }}>State-of-the-art diagnostic and clinical equipment.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} style={{ color: 'var(--plum-800)' }} />
            <div>
              <h5 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--plum-900)' }}>Personalized Protocols</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)' }}>Tailored settings customized for Indian skin types.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Galleries Section */}
      <section className="section-padding" style={{ backgroundColor: 'white', borderTop: '1px solid var(--silk-200)', borderBottom: '1px solid var(--silk-200)', padding: '60px 0' }}>
        <div className="container">
          {/* Gallery 1 */}
          <div className="reveal reveal-up" style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="badge badge-premium">Results Gallery</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-500)', marginTop: '10px' }}>
                Hairline <span style={{ color: 'var(--plum-800)' }}>Glowup Outcomes</span>
              </h2>
              <p style={{ maxWidth: '600px', margin: '12px auto 0', color: 'var(--muted-charcoal)' }}>
                View our clinical cases showing progress and post-procedure hairline density improvement.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {HAIRLINE_GLOWUP_GALLERY.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  className="hover-premium" 
                  onClick={() => setSelectedImage(imgUrl)}
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--silk-200)',
                    aspectRatio: '1/1',
                    background: 'var(--silk-100)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Hairline Glowup ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gallery 2 */}
          <div className="reveal reveal-up">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="badge badge-premium">Results Gallery</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-500)', marginTop: '10px' }}>
                Vertex Hair <span style={{ color: 'var(--plum-800)' }}>Transplantation Results</span>
              </h2>
              <p style={{ maxWidth: '600px', margin: '12px auto 0', color: 'var(--muted-charcoal)' }}>
                Clinical results demonstrating crown and vertex area coverage following FUE hair transplants.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {VERTEX_TRANSPLANT_GALLERY.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  className="hover-premium" 
                  onClick={() => setSelectedImage(imgUrl)}
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--silk-200)',
                    aspectRatio: '1/1',
                    background: 'var(--silk-100)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Vertex Transplant ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(26, 8, 21, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            padding: '20px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img 
              src={selectedImage} 
              alt="High resolution clinical case result" 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px', border: '2px solid var(--gold-500)', boxShadow: 'var(--shadow-lg)' }} 
            />
            <p style={{ color: 'white', textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
              Click anywhere to close preview
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
