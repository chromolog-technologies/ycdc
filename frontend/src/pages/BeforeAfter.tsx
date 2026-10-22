import { useState, useRef, useEffect } from 'react';
import { Sparkles, Calendar, X, Shield, Award, CheckCircle2, Eye } from 'lucide-react';
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
      doctor: "Dr. K. Yogiraj & Dr. Ryan Paul",
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
      doctor: "Dr. Amy Cherian & Dr. Bismi George",
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
      doctor: "Dr. Maya Vincent & Dr. Yogiraj",
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
    
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
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
    <div className="animate-fade-in" style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Hero Header Banner */}
      <section style={{
        position: 'relative',
        padding: '130px 0 85px',
        background: 'linear-gradient(180deg, rgba(20, 28, 21, 0.75) 0%, rgba(35, 46, 36, 0.88) 100%), url("/hero_clinical_results.jpg") no-repeat center center/cover',
        color: '#FFFFFF',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.04,
          backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '0 20px' }}>
          <span 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#F0E6D2',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '18px'
            }}
          >
            <Sparkles size={14} color="#D4AF37" /> Scientific Transformations
          </span>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', 
            color: '#FFFFFF', 
            marginBottom: '16px', 
            fontWeight: 600,
            lineHeight: 1.18,
            letterSpacing: '-0.02em'
          }}>
            Clinical Before & After Results
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxWidth: '680px', 
            margin: '0 auto', 
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', 
            lineHeight: 1.65,
            fontWeight: 400
          }}>
            Explore authentic, unretouched transformations of clinical dermatology and trichology therapies performed by our senior specialists.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '60px 0 70px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Category Tabs */}
          <div className="reveal reveal-up" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '44px', flexWrap: 'wrap' }}>
            {caseStudies.map((c: any) => {
              const isActive = activeCategory === c.category;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCategory(c.category);
                    setSliderPosition(50);
                  }}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '9999px',
                    border: isActive ? '2px solid #536B4C' : '1px solid rgba(215, 203, 190, 0.75)',
                    backgroundColor: isActive ? '#536B4C' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#2A362B',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 6px 20px rgba(83, 107, 76, 0.28)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {c.categoryLabel}
                </button>
              );
            })}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}>
            {/* Interactive Slider Card */}
            <div className="reveal reveal-left" style={{
              padding: '18px',
              borderRadius: '20px',
              border: '1px solid rgba(215, 203, 190, 0.7)',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 12px 35px rgba(83, 107, 76, 0.08)'
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
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '420px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'ew-resize',
                  userSelect: 'none',
                  backgroundColor: '#EBE5DC'
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
                  backgroundColor: 'rgba(26, 36, 27, 0.78)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  zIndex: 2,
                  pointerEvents: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
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
                    backgroundColor: '#536B4C',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    pointerEvents: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 12px rgba(83, 107, 76, 0.4)'
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
                  width: '3px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.35)',
                  transform: 'translateX(-50%)',
                  zIndex: 3,
                  pointerEvents: 'none'
                }}>
                  {/* Handle Circular Button */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #536B4C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 18px rgba(83, 107, 76, 0.35)',
                      color: '#536B4C',
                      fontWeight: 'bold',
                      fontSize: '1.05rem'
                    }}
                  >
                    ↔
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#6C7469', textAlign: 'center', marginTop: '14px', fontWeight: 500 }}>
                👈 Drag or swipe across image to compare real clinical results 👉
              </p>
            </div>

            {/* Case Details Card */}
            <div className="reveal reveal-right" style={{ textAlign: 'left' }}>
              <span style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(83, 107, 76, 0.1)',
                border: '1px solid rgba(83, 107, 76, 0.22)',
                color: '#43583D',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>
                <CheckCircle2 size={13} color="#536B4C" /> Verified Clinical Case Study
              </span>
              <h2 style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)', 
                color: '#1E271F', 
                marginBottom: '14px',
                lineHeight: 1.22
              }}>
                {currentCase.title}
              </h2>
              <p style={{ color: '#4A584C', lineHeight: '1.68', marginBottom: '24px', fontSize: '0.96rem' }}>
                {currentCase.description}
              </p>

              {/* Technical Specifications */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(215, 203, 190, 0.65)',
                boxShadow: '0 4px 16px rgba(83, 107, 76, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '28px'
              }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#536B4C', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Primary Concern
                  </strong>
                  <span style={{ fontSize: '0.96rem', color: '#1E271F', fontWeight: 600 }}>
                    {currentCase.details.concern}
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#536B4C', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Treating Physician
                  </strong>
                  <span style={{ fontSize: '0.96rem', color: '#1E271F', fontWeight: 600 }}>
                    {currentCase.details.doctor}
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#536B4C', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Technology / Protocol Applied
                  </strong>
                  <span style={{ fontSize: '0.96rem', color: '#1E271F', fontWeight: 600 }}>
                    {currentCase.details.technology}
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#536B4C', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Total Treatment Duration
                  </strong>
                  <span style={{ fontSize: '0.96rem', color: '#1E271F', fontWeight: 600 }}>
                    {currentCase.details.sessions}
                  </span>
                </div>
              </div>

              {/* Book Consultation */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onBookTreatment(currentCase.category, currentCase.id)}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '14px 28px',
                    borderRadius: '9999px',
                    backgroundColor: '#536B4C',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(83, 107, 76, 0.28)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#43583D'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#536B4C'; }}
                >
                  Book Treatment Consultation <Calendar size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Quality Certifications */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '50px 0', borderTop: '1px solid rgba(215, 203, 190, 0.6)', borderBottom: '1px solid rgba(215, 203, 190, 0.6)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '48px', alignItems: 'center', maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(83, 107, 76, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#536B4C" />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E271F', margin: 0 }}>Authentic Patient Results</h5>
              <p style={{ fontSize: '0.8rem', color: '#6C7469', margin: '2px 0 0' }}>Zero retouching or digital alteration filters.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(83, 107, 76, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="#536B4C" />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E271F', margin: 0 }}>US-FDA Approved Lasers</h5>
              <p style={{ fontSize: '0.8rem', color: '#6C7469', margin: '2px 0 0' }}>Gold-standard clinical medical technology.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(83, 107, 76, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} color="#536B4C" />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E271F', margin: 0 }}>Doctor-Led Expertise</h5>
              <p style={{ fontSize: '0.8rem', color: '#6C7469', margin: '2px 0 0' }}>30+ years of clinical excellence under Dr. Yogiraj.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Galleries Section */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '65px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Gallery 1 */}
          <div className="reveal reveal-up" style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span style={{ 
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(83, 107, 76, 0.1)',
                color: '#536B4C',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                Hair Restoration Archive
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: '#1E271F', fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', margin: '4px 0 0' }}>
                Hairline & Follicular <span style={{ color: '#536B4C' }}>Outcomes</span>
              </h2>
              <p style={{ maxWidth: '600px', margin: '10px auto 0', color: '#5E6E60', fontSize: '0.92rem' }}>
                Verified clinical cases exhibiting post-procedure hairline density improvement and natural growth angles.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '18px' }}>
              {HAIRLINE_GLOWUP_GALLERY.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImage(imgUrl)}
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    border: '1px solid rgba(215, 203, 190, 0.7)',
                    aspectRatio: '1/1',
                    background: '#EBE5DC',
                    boxShadow: '0 4px 12px rgba(83, 107, 76, 0.05)',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Hairline transformation ${idx + 1}`} 
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <Eye size={15} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery 2 */}
          <div className="reveal reveal-up">
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span style={{ 
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(83, 107, 76, 0.1)',
                color: '#536B4C',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                Skin & Trichology Evidence
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: '#1E271F', fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', margin: '4px 0 0' }}>
                Crown Density & <span style={{ color: '#536B4C' }}>Skin Texture Transformations</span>
              </h2>
              <p style={{ maxWidth: '600px', margin: '10px auto 0', color: '#5E6E60', fontSize: '0.92rem' }}>
                Clinical documentation demonstrating vertex coverage and acne scar remodeling protocols.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '18px' }}>
              {VERTEX_TRANSPLANT_GALLERY.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImage(imgUrl)}
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    border: '1px solid rgba(215, 203, 190, 0.7)',
                    aspectRatio: '1/1',
                    background: '#EBE5DC',
                    boxShadow: '0 4px 12px rgba(83, 107, 76, 0.05)',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Clinical transformation ${idx + 1}`} 
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <Eye size={15} />
                  </div>
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
            backgroundColor: 'rgba(15, 23, 17, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '92%', maxHeight: '90%' }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close preview"
              style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#536B4C',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>
            <img 
              src={selectedImage} 
              alt="High resolution clinical case result" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '82vh', 
                objectFit: 'contain', 
                borderRadius: '16px', 
                border: '2px solid rgba(215, 203, 190, 0.8)', 
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)' 
              }} 
            />
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginTop: '12px', fontSize: '0.85rem' }}>
              Click anywhere outside or the close icon to return
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
