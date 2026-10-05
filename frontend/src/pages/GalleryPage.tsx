import { useState, useEffect } from 'react';
import { Play, X, Image as ImageIcon, Video, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config';
import type { GalleryItem } from '../types';

const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'before-after-hair',
    type: 'image',
    category: 'treatments',
    title: 'Before After - FUE Hair Restoration',
    thumbnail_path: '/hair_after.png',
    description: 'Excellent density and natural hairline restoration 6 months after a FUE hair transplant session.'
  },
  {
    id: 'before-after-acne',
    type: 'image',
    category: 'treatments',
    title: 'Before After - Acne Scar Correction',
    thumbnail_path: '/acne_after.png',
    description: 'Visible skin smoothing and reduction of deep pitted acne scars after 3 sessions of Secret RF Microneedling.'
  },
  {
    id: 'before-after-gfc',
    type: 'image',
    category: 'treatments',
    title: 'Before After - GFC Hair Density',
    thumbnail_path: '/gfc_after.jpg',
    description: 'Scalp GFC growth factor concentrate therapy for hair shaft thickening and density.'
  },
  {
    id: 'trichoscopy-exam',
    type: 'image',
    category: 'treatments',
    title: 'Advanced Diagnostic Hair & Scalp Trichoscopy',
    thumbnail_path: '/hair_treatment_premium.png',
    description: 'Digital trichoscopy scalp analysis to evaluate hair root health and map out custom treatments.'
  },
  {
    id: 'clinic-lobby',
    type: 'image',
    category: 'infrastructure',
    title: 'YCDC Luxury Reception Lounge',
    thumbnail_path: '/ycdc_reception_lobby.jpg',
    description: 'Our welcoming reception lounge with back-lit YCDC insignia designed to provide patients with an unhurried, royal clinical ambiance.'
  },
  {
    id: 'luxury-treatment-suite',
    type: 'image',
    category: 'infrastructure',
    title: 'Private Clinical Aesthetic Suite',
    thumbnail_path: '/luxury_treatment_suite.jpg',
    description: 'Ergonomically equipped aesthetic procedure room with serene sage and dusty rose design for clinical comfort.'
  },
  {
    id: 'laser-infra',
    type: 'image',
    category: 'infrastructure',
    title: 'US-FDA Approved Laser Suite',
    thumbnail_path: '/laser_suite_clinical.jpg',
    description: 'State-of-the-art laser procedure room equipped for pain-free permanent hair reduction and non-ablative skin toning.'
  },
  {
    id: 'facial-aesthetic-rejuvenation',
    type: 'image',
    category: 'treatments',
    title: 'Aesthetic Facial Rejuvenation & Skin Tightening',
    thumbnail_path: '/facial_aesthetic_treatment.jpg',
    description: 'Ultrasound and radiofrequency facial rejuvenation protocol applied with high-precision gold applicator.'
  },
  {
    id: 'treatment-showcase-video',
    type: 'video',
    category: 'treatments',
    title: 'YCDC Clinic Experience & Facility Tour',
    thumbnail_path: '/luxury_treatment_suite.jpg',
    video_path: 'https://www.youtube.com/watch?v=RWr8XeBUxTU',
    description: 'Detailed clinical video tour demonstrating our professional environment, FDA-approved lasers, and workflows.'
  }
];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(MOCK_GALLERY);
  const loading = false;
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'infrastructure' | 'treatments'>('all');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredItems = galleryItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'image' || filter === 'video') return item.type === filter;
    return item.category === filter;
  });

  const handleNext = () => {
    if (!activeMedia) return;
    const currentIndex = filteredItems.findIndex(item => item.id === activeMedia.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % filteredItems.length;
      setActiveMedia(filteredItems[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (!activeMedia) return;
    const currentIndex = filteredItems.findIndex(item => item.id === activeMedia.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
      setActiveMedia(filteredItems[prevIndex]);
    }
  };

  useEffect(() => {
    if (!activeMedia) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setActiveMedia(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMedia, filteredItems]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/gallery`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setGalleryItems(data);
        }
      })
      .catch(err => {
        console.warn("Backend API not reachable, using high-fidelity local gallery data:", err);
      });
  }, []);


  const getMediaUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    if (path.startsWith('/uploads') || path.startsWith('uploads')) {
      return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
    }
    // Return relative path (static fallback assets)
    return path;
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--silk-100)', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Title Hero Banner */}
      <section style={{
        position: 'relative',
        padding: '120px 0 80px',
        background: 'url("/skin_treatment_premium.png") no-repeat center center/cover',
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
          <span className="badge badge-premium" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }}>
            Inside YCDC
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'white', marginBottom: '10px' }}>
            Media Gallery
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '650px', margin: '0 auto' }}>
            Take a look at our clinical workspaces, premium diagnostic infrastructure, lasers, and procedures in action.
          </p>
        </div>
      </section>

      {/* Main Gallery Area */}
      <section className="section-padding" style={{ padding: '60px 0' }}>
        <div className="container">
          {/* Media Filtering Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '40px',
            borderBottom: '1px solid var(--silk-200)',
            paddingBottom: '20px'
          }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '10px 22px',
                borderRadius: '50px',
                border: filter === 'all' ? '2px solid var(--deep-olive)' : '1px solid var(--warm-fog)',
                backgroundColor: filter === 'all' ? 'var(--deep-olive)' : 'var(--warm-ivory-light)',
                color: filter === 'all' ? 'white' : 'var(--botanical-ink)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: filter === 'all' ? '0 4px 15px rgba(87, 85, 39, 0.25)' : 'none',
                transition: 'var(--transition-fast)'
              }}
            >
              <Layers size={14} /> All Media
            </button>
            <button
              onClick={() => setFilter('infrastructure')}
              style={{
                padding: '10px 22px',
                borderRadius: '50px',
                border: filter === 'infrastructure' ? '2px solid var(--deep-olive)' : '1px solid var(--warm-fog)',
                backgroundColor: filter === 'infrastructure' ? 'var(--deep-olive)' : 'var(--warm-ivory-light)',
                color: filter === 'infrastructure' ? 'white' : 'var(--botanical-ink)',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: filter === 'infrastructure' ? '0 4px 15px rgba(87, 85, 39, 0.25)' : 'none',
                transition: 'var(--transition-fast)'
              }}
            >
              Clinic Infrastructure
            </button>
            <button
              onClick={() => setFilter('treatments')}
              style={{
                padding: '10px 22px',
                borderRadius: '50px',
                border: filter === 'treatments' ? '2px solid var(--deep-olive)' : '1px solid var(--warm-fog)',
                backgroundColor: filter === 'treatments' ? 'var(--deep-olive)' : 'var(--warm-ivory-light)',
                color: filter === 'treatments' ? 'white' : 'var(--botanical-ink)',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: filter === 'treatments' ? '0 4px 15px rgba(87, 85, 39, 0.25)' : 'none',
                transition: 'var(--transition-fast)'
              }}
            >
              Treatments & Clinical
            </button>
            <button
              onClick={() => setFilter('video')}
              style={{
                padding: '10px 22px',
                borderRadius: '50px',
                border: filter === 'video' ? '2px solid var(--deep-olive)' : '1px solid var(--warm-fog)',
                backgroundColor: filter === 'video' ? 'var(--deep-olive)' : 'var(--warm-ivory-light)',
                color: filter === 'video' ? 'white' : 'var(--botanical-ink)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: filter === 'video' ? '0 4px 15px rgba(87, 85, 39, 0.25)' : 'none',
                transition: 'var(--transition-fast)'
              }}
            >
              <Video size={14} /> Videos
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-charcoal)' }}>Loading media files...</div>
          ) : (
            /* Grid Layout */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveMedia(item)}
                  className="glass animate-fade-in-up"
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid var(--silk-200)',
                    boxShadow: 'var(--shadow-sm)',
                    backgroundColor: 'white',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Thumbnail Wrapper */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#e2e2e2' }}>
                    <img
                      src={getMediaUrl(item.thumbnail_path)}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Icon Indicator Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(43, 20, 39, 0.75)',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      {item.type === 'video' ? <Play size={14} fill="white" /> : <ImageIcon size={14} />}
                    </div>

                    {/* Dark transparent tint on hover */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(43, 20, 39, 0.1)',
                      transition: 'background-color 0.3s ease'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(43, 20, 39, 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(43, 20, 39, 0.1)'}
                    />
                  </div>

                  {/* Info Text */}
                  <div style={{ padding: '20px', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--gold-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.category === 'infrastructure' ? 'Clinic Facility' : 'Clinical Treatment'}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--plum-900)', marginTop: '4px', marginBottom: '8px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.4' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Video Player Modal */}
      {activeMedia && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(141, 73, 128, 0.97)', /* Deep plum tinted dark backdrop */
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '60px 16px 24px' : '40px 80px'
        }}
          onClick={() => setActiveMedia(null)}
        >
          {/* Close Button */}
          <button style={{
            position: 'absolute',
            top: isMobile ? '16px' : '24px',
            right: isMobile ? '16px' : '24px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)',
            zIndex: 10010
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onClick={() => setActiveMedia(null)}
          >
            <X size={24} />
          </button>

          {/* Left Navigation Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Previous Media"
            style={{
              position: 'absolute',
              left: isMobile ? '12px' : '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: 'white',
              width: isMobile ? '40px' : '52px',
              height: isMobile ? '40px' : '52px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s, transform 0.2s',
              zIndex: 10005,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={isMobile ? 22 : 28} />
          </button>

          {/* Right Navigation Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Next Media"
            style={{
              position: 'absolute',
              right: isMobile ? '12px' : '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: 'white',
              width: isMobile ? '40px' : '52px',
              height: isMobile ? '40px' : '52px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s, transform 0.2s',
              zIndex: 10005,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={isMobile ? 22 : 28} />
          </button>

          {/* Modal Container */}
          <div style={{
            maxWidth: '900px',
            width: '100%',
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
            onClick={(e) => e.stopPropagation()} // Prevent close on outer click
          >
            {/* Display Video or Image */}
            {activeMedia.type === 'video' ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
                {(() => {
                  const url = activeMedia.video_path || '';
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                  const match = url.match(regExp);
                  const youtubeId = (match && match[2].length === 11) ? match[2] : null;

                  if (youtubeId) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                        title={activeMedia.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', backgroundColor: 'black' }}
                      />
                    );
                  }

                  return (
                    <video
                      src={getMediaUrl(activeMedia.video_path)}
                      controls
                      autoPlay
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', backgroundColor: 'black' }}
                    />
                  );
                })()}
              </div>
            ) : (
              <img
                src={getMediaUrl(activeMedia.thumbnail_path)}
                alt={activeMedia.title}
                style={{
                  width: 'auto',
                  maxWidth: '100%',
                  maxHeight: isMobile ? '55vh' : '70vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            )}

            {/* Description Overlay */}
            <div style={{ color: 'white', textAlign: 'left', padding: '10px 0', overflowY: 'auto', maxHeight: isMobile ? '20vh' : '15vh' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {activeMedia.category === 'infrastructure' ? 'Infrastructure facility' : 'clinical session'}
              </span>
              <h3 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: isMobile ? '1.4rem' : '1.8rem', marginTop: '4px', marginBottom: '8px' }}>
                {activeMedia.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? '0.85rem' : '0.95rem', lineHeight: '1.4' }}>
                {activeMedia.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
