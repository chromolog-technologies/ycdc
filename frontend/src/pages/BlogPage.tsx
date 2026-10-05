import { useState, useEffect } from 'react';
import { Search, Calendar, User, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { API_BASE_URL } from '../config';
import type { BlogPost } from '../types';

const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'ycdc-skin-care-tips',
    category: 'skin',
    category_label: 'Skin Care',
    title: 'Skin Care Tips – For Healthy & Glowing Skin',
    author: 'Dr. Niranjana Raj (Chief Consultant)',
    date: 'August 24, 2025',
    read_time: '3 min read',
    excerpt: 'Beautiful skin starts with the right care. At YCDC, we believe in simple yet effective skin care practices that keep your skin nourished, hydrated, and radiant every day.',
    image_path: '/skin_treatment_premium.png',
    body_content: [
      'Beautiful skin starts with the right care. At YCDC, we believe in simple yet effective skin care practices that keep your skin nourished, hydrated, and radiant every day. Using cutting-edge ResurFX Laser and Secret RF Microneedling, we effectively target pimple scars, uneven texture, and active breakouts.',
      '1. Protect Your Skin from Sun Damage: Always use a broad-spectrum sunscreen with SPF 30 or higher. UVA and UVB rays accelerate skin aging and trigger hyperpigmentation. Reapply sunscreen every 3 hours if outdoors.',
      '2. Keep Your Skin Hydrated: Drinking adequate water and using a hyaluronic acid-based moisturizer helps lock in moisture, strengthening the skin barrier against environmental pollutants.',
      '3. Follow a Gentle Cleansing Routine: Cleanse your face twice daily with a soap-free, pH-balanced cleanser suitable for your skin type. Avoid harsh scrubbing which can cause micro-tears.'
    ]
  },
  {
    id: 'laser-hair-reduction-guide',
    category: 'anti-aging',
    category_label: 'Lasers',
    title: 'A Complete Guide to Laser Hair Reduction',
    author: 'Dr. K. Yogiraj (Chairman)',
    date: 'July 15, 2025',
    read_time: '4 min read',
    excerpt: 'Understand how US-FDA approved laser systems deliver long-term hair reduction safely across all skin types with zero downtime.',
    image_path: '/laser_treatment_premium.png',
    body_content: [
      'Embrace self-confidence and overcome the hassle of frequent waxing or shaving. Laser hair reduction uses selective photothermolysis to target melanin in hair follicles, significantly disabling follicular re-growth over time without damaging surrounding skin tissue.',
      'At YCDC, we utilize US-FDA approved triple-wavelength lasers that are exceptionally safe for Indian skin types. The integrated cooling tips ensure the treatment is virtually painless.',
      'Normally, a series of 6 to 8 sessions is required to target hairs in their active growth (anagen) phase. Sessions are spaced 4 to 6 weeks apart, revealing smooth, hair-free skin with no recovery downtime.'
    ]
  },
  {
    id: 'hair-loss-solutions',
    category: 'hair',
    category_label: 'Hair Care',
    title: 'Restoring Hair Health: Reasons and Modern Treatments for Hair Loss',
    author: 'Dr. Vennela R (Hair Specialist)',
    date: 'June 10, 2025',
    read_time: '5 min read',
    excerpt: 'Experiencing hair thinning? Explore the biological reasons behind hair fall and clinical hair loss solutions including PRP and FUE transplants.',
    image_path: '/hair_treatment_premium.png',
    body_content: [
      'Hair loss causing thinning or baldness is a very common concern. Understanding the root cause—whether it is genetic androgenetic alopecia, hormonal imbalances, nutritional deficiencies, or stress-induced telogen effluvium—is the first step to successful restoration.',
      'Modern trichology offers highly effective solutions: medications to block DHT, Platelet-Rich Plasma (PRP) scalp injections to stimulate hair bulbs, and FUE hair transplant surgery.',
      'FUE involves harvesting healthy hair follicles from the donor area (usually the back of the head) and transplanting them into balding zones. It delivers lifelong growth, natural direction, and maximum hair density.'
    ]
  }
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(MOCK_BLOGS);
  const loading = false;
  const [activeCategory, setActiveCategory] = useState<'all' | 'skin' | 'hair' | 'anti-aging'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/blog`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(err => {
        console.warn("Backend API not reachable, using high-fidelity local blog data:", err);
      });
  }, []);

  const filteredPosts = blogs.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads') || path.startsWith('uploads')) {
      return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
    }
    return path; // Fallback to public folder static asset
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--silk-100)', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Title Hero Banner */}
      <section style={{
        position: 'relative',
        padding: '120px 0 80px',
        background: 'url("/cosmetic_treatment_premium.png") no-repeat center center/cover',
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
            Clinical Insights
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'white', marginBottom: '10px' }}>
            YCDC Skin & Hair Blog
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '650px', margin: '0 auto' }}>
            Expert advice, treatment guides, and clinical insights written directly by our board-certified dermatologists.
          </p>
        </div>
      </section>

      {/* Main Blog Section */}
      <section className="section-padding" style={{ padding: '60px 0' }}>
        <div className="container">
          
          {/* Article Reader View */}
          {selectedPost ? (
            <div className="glass animate-scale-up" style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '16px',
              border: '1px solid var(--silk-200)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'left',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {/* Back Button */}
              <button 
                onClick={() => setSelectedPost(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--deep-olive)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '30px',
                  padding: 0
                }}
              >
                <ArrowLeft size={18} /> Back to Articles
              </button>

              {/* Cover Image */}
              <div style={{ height: '350px', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
                <img 
                  src={getImageUrl(selectedPost.image_path)} 
                  alt={selectedPost.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              {/* Metadata */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--botanical-ink-muted)', borderBottom: '1px solid var(--warm-fog)', paddingBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} style={{ color: 'var(--deep-olive)' }} /> {selectedPost.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} style={{ color: 'var(--deep-olive)' }} /> {selectedPost.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} style={{ color: 'var(--deep-olive)' }} /> {selectedPost.read_time}
                </span>
                <span className="badge badge-premium" style={{ fontSize: '0.7rem' }}>
                  {selectedPost.category_label}
                </span>
              </div>

              {/* Article Title */}
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--botanical-ink)', marginBottom: '24px', lineHeight: '1.2' }}>
                {selectedPost.title}
              </h2>

              {/* Body Content */}
              <div style={{ fontSize: '1.05rem', color: 'var(--charcoal)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {selectedPost.body_content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Footer CTA */}
              <div style={{
                marginTop: '50px',
                paddingTop: '30px',
                borderTop: '1px solid var(--silk-200)',
                textAlign: 'center'
              }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--botanical-ink)', marginBottom: '8px' }}>
                  Have questions about this topic?
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted-charcoal)', marginBottom: '20px' }}>
                  Schedule a private clinical consultation with our specialists at Bangalore or Trivandrum.
                </p>
                <button
                  onClick={() => {
                    const el = document.getElementById('consultation');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setSelectedPost(null);
                  }}
                  className="btn btn-primary"
                  style={{ cursor: 'pointer' }}
                >
                  Consult Online Now
                </button>
              </div>
            </div>
          ) : (
            // Grid / Search view
            <>
              {/* Search & Category Filter bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['all', 'skin', 'hair', 'anti-aging'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '50px',
                        border: activeCategory === cat ? '2px solid var(--deep-olive)' : '1px solid var(--warm-fog)',
                        backgroundColor: activeCategory === cat ? 'var(--deep-olive)' : 'var(--warm-ivory-light)',
                        color: activeCategory === cat ? 'white' : 'var(--botanical-ink)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: activeCategory === cat ? '0 4px 15px rgba(87, 85, 39, 0.25)' : 'none',
                        textTransform: 'capitalize',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {cat === 'all' ? 'All Articles' : cat === 'skin' ? 'Skin Care' : cat === 'hair' ? 'Hair Care' : 'Anti-Aging'}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-charcoal)' }} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 16px 10px 38px',
                      borderRadius: '30px',
                      border: '1px solid var(--silk-200)',
                      outline: 'none',
                      fontSize: '0.9rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-charcoal)' }}>Loading articles...</div>
              ) : filteredPosts.length > 0 ? (
                /* Grid of posts */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '30px'
                }}>
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="glass animate-fade-in-up"
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: 'white',
                        border: '1px solid var(--silk-200)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        {/* Post Thumbnail */}
                        <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#e2e2e2' }}>
                          <img 
                            src={getImageUrl(post.image_path)} 
                            alt={post.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>

                        {/* Card Content */}
                        <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span className="badge badge-plum" style={{ fontSize: '0.65rem' }}>
                              {post.category_label}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted-charcoal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> {post.read_time}
                            </span>
                          </div>
                          
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--plum-900)', marginBottom: '8px', lineHeight: '1.3' }}>
                            {post.title}
                          </h4>
                          
                          <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.5' }}>
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer action */}
                      <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--silk-100)', paddingTop: '16px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-charcoal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {post.date}
                        </span>
                        
                        <button
                          onClick={() => setSelectedPost(post)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--plum-800)',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0
                          }}
                        >
                          Read Article <BookOpen size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-charcoal)' }}>
                  <h4>No articles found matching "{searchQuery}"</h4>
                  <p>Try switching categories or verifying your search spelling.</p>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </div>
  );
}
