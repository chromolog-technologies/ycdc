import { useEffect } from 'react';
import { Award, ShieldCheck, Heart } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import useScrollReveal from '../hooks/useScrollReveal';
import type { AboutUsProps } from '../types';

export default function AboutUs({ onNavigateToContact }: AboutUsProps) {
  const { refresh } = useScrollReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    refresh();
  }, []);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--silk-100)', paddingBottom: '60px' }}>
      {/* Page Hero */}
      <section className="section-padding" style={{ 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%), url("/ycdc_reception_lobby.jpg") no-repeat center center/cover', 
        color: '#ffffff',
        textAlign: 'center',
        padding: '96px 0',
        position: 'relative'
      }}>
        <div className="container">
          <span 
            className="badge badge-gold" 
            style={{ 
              marginBottom: '16px', 
              display: 'inline-block',
              backgroundColor: 'rgba(180, 154, 104, 0.25)', 
              color: '#F3E5AB', 
              borderColor: 'rgba(243, 229, 171, 0.45)',
              padding: '6px 18px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em'
            }}
          >
            Our Legacy
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: '#ffffff', fontSize: '3rem', marginBottom: '20px', fontWeight: 600 }}>
            Over <AnimatedCounter target={4} /> Decades of Healing & Aesthetic Science
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', color: 'rgba(255, 255, 255, 0.92)', fontSize: '1.15rem', lineHeight: '1.7' }}>
            Yogiraj Centre for Dermatology & Cosmetology (YCDC) is built on a foundation of clinical excellence, safety, and natural-looking rejuvenation.
          </p>
        </div>
      </section>

      {/* Legacy Story Section */}
      <section className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container treatment-layout">
          <div className="reveal reveal-left" style={{ textAlign: 'left' }}>
            <span className="badge badge-premium" style={{ marginBottom: '12px' }}>The Journey</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', marginBottom: '20px', fontSize: '2.2rem' }}>
              The Pioneer of Clinical Dermatology
            </h2>
            <p style={{ color: 'var(--muted-charcoal)', marginBottom: '16px', lineHeight: '1.7' }}>
              Founded in 1978 by the legendary practitioner <strong>Dr. K. Yogiraj</strong>, YCDC has evolved from a single clinical dermatology chamber into a state-of-the-art multi-specialty center across Karnataka and Kerala.
            </p>
            <p style={{ color: 'var(--muted-charcoal)', marginBottom: '16px', lineHeight: '1.7' }}>
              Under his visionary guidance, we were among the first in South India to introduce medical hair restoration (FUE hair transplants) and FDA-approved laser skin treatments. We bridge the gap between pure clinical pathology and high-end aesthetic medicine.
            </p>
            <p style={{ color: 'var(--muted-charcoal)', lineHeight: '1.7' }}>
              Today, YCDC operates modern ISO-certified clinics in Pattom (Trivandrum) and Whitefield (Bengaluru), combining advanced diagnostic tools with personalized, evidence-based therapy.
            </p>
          </div>
          <div className="reveal reveal-right" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '400px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
            <img 
              src="/doctor_yogiraj.png" 
              alt="Dr. K. Yogiraj" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '24px',
              background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.85))',
              color: 'white',
              textAlign: 'left'
            }}>
              <h5 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>Dr. K. Yogiraj</h5>
              <span style={{ fontSize: '0.85rem', color: '#F3E5AB' }}>Founder & Chief Director</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Principles Grid */}
      <section className="section-padding" style={{ backgroundColor: 'var(--silk-100)', position: 'relative', overflow: 'hidden' }}>
        <div className="graphic-orb graphic-orb-gold" style={{ width: '400px', height: '400px', top: '-60px', right: '-80px' }} />
        <div className="graphic-orb graphic-orb-green" style={{ width: '350px', height: '350px', bottom: '-50px', left: '-50px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal reveal-up" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge badge-premium">Our Philosophy</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', marginTop: '10px', fontSize: '2.2rem' }}>
              The Foundations of Our Care
            </h2>
          </div>

          <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="glass hover-premium" style={{ padding: '32px', borderRadius: '14px', background: 'white', border: '1px solid var(--silk-200)', textAlign: 'left', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(35, 61, 50, 0.1)', color: '#233D32', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShieldCheck size={24} />
              </div>
              <h5 style={{ fontWeight: 'bold', color: '#233D32', fontSize: '1.2rem', marginBottom: '10px' }}>ISO Certified Protocols</h5>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-charcoal)', lineHeight: '1.6' }}>
                Our clinics maintain strict ISO 9001:2015 certified standards for sanitization, laser safety, and records management to ensure patient safety first.
              </p>
            </div>

            <div className="glass hover-premium" style={{ padding: '32px', borderRadius: '14px', background: 'white', border: '1px solid var(--silk-200)', textAlign: 'left', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(35, 61, 50, 0.1)', color: '#233D32', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Heart size={24} />
              </div>
              <h5 style={{ fontWeight: 'bold', color: '#233D32', fontSize: '1.2rem', marginBottom: '10px' }}>Patient-First Ethos</h5>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-charcoal)', lineHeight: '1.6' }}>
                No cookie-cutter treatments. We design specific prescriptions and customized skincare schedules mapped to your genetic skin profile.
              </p>
            </div>

            <div className="glass hover-premium" style={{ padding: '32px', borderRadius: '14px', background: 'white', border: '1px solid var(--silk-200)', textAlign: 'left', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(35, 61, 50, 0.1)', color: '#233D32', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Award size={24} />
              </div>
              <h5 style={{ fontWeight: 'bold', color: '#233D32', fontSize: '1.2rem', marginBottom: '10px' }}>Expert Practitioners</h5>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-charcoal)', lineHeight: '1.6' }}>
                All procedures are overseen by board-certified dermatologists, plastic surgeons, and specialized transplant technicians with global credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Detailed */}
      <section className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="reveal reveal-up" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge badge-premium">Specialist Roster</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', marginTop: '10px', fontSize: '2.2rem' }}>
              Meet Our Board-Certified Team
            </h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: 'var(--muted-charcoal)', lineHeight: '1.6' }}>
              Consult our team of qualified dermatologists and surgeons representing decades of academic and clinical research.
            </p>
          </div>

          <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {/* Doctor 1 */}
            <div className="glass hover-premium" style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--silk-200)', display: 'flex', flexDirection: 'column', textAlign: 'left', background: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                <img src="/doctor_yogiraj.png" alt="Dr. Yogiraj" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 2 }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Chairman</span>
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#233D32', fontWeight: 600 }}>Dr. K. Yogiraj</h4>
                <span style={{ fontSize: '0.85rem', color: '#B49A68', fontWeight: '600', display: 'block', margin: '4px 0 10px' }}>
                  MD, DVD, DHA (<AnimatedCounter target={48} suffix="+" /> Years Exp)
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.6' }}>
                  A pioneer in hair transplant surgeries and pediatric clinical dermatology in India. Directs global operations for both clinics.
                </p>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="glass hover-premium" style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--silk-200)', display: 'flex', flexDirection: 'column', textAlign: 'left', background: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                <img src="/doctor_niranjana.png" alt="Dr. Niranjana Raj" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 2 }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Chief Consultant</span>
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#233D32', fontWeight: 600 }}>Dr. Niranjana Raj</h4>
                <span style={{ fontSize: '0.85rem', color: '#B49A68', fontWeight: '600', display: 'block', margin: '4px 0 10px' }}>
                  MD (Derm), FAM (<AnimatedCounter target={12} suffix="+" /> Years Exp)
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.6' }}>
                  Specialist in medical lasers, chemical peels, dermal fillers, and custom bridal glow cosmetic care. Operates in Whitefield, Bangalore.
                </p>
              </div>
            </div>

            {/* Doctor 3 */}
            <div className="glass hover-premium" style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--silk-200)', display: 'flex', flexDirection: 'column', textAlign: 'left', background: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                <img src="/doctor_vennela.png" alt="Dr. Vennela Reddy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 2 }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Surgeon</span>
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#233D32', fontWeight: 600 }}>Dr. Vennela Reddy</h4>
                <span style={{ fontSize: '0.85rem', color: '#B49A68', fontWeight: '600', display: 'block', margin: '4px 0 10px' }}>
                  MS, MCh (Plastic Surgery) (<AnimatedCounter target={9} suffix="+" /> Years Exp)
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.6' }}>
                  Specialize in FUE hair transplantations, hairline designs, eyebrow hair restoration, and post-traumatic scars correction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Infrastructure & Facilities Showcase */}
      <section className="section-padding" style={{ backgroundColor: 'var(--silk-100)' }}>
        <div className="container">
          <div className="reveal reveal-up" style={{ textAlign: 'center', marginBottom: '46px' }}>
            <span className="badge badge-premium">World-Class Facilities</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', marginTop: '10px', fontSize: '2.2rem' }}>
              Designed for Unhurried Clinical Excellence
            </h2>
            <p style={{ maxWidth: '650px', margin: '12px auto 0', color: 'var(--muted-charcoal)', lineHeight: '1.6' }}>
              Step inside our modern operating centres in Whitefield, Bengaluru and Pattom, Trivandrum—featuring US-FDA approved laser consoles, private aesthetic suites, and royal hospitality.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="glass hover-premium" style={{ borderRadius: '16px', overflow: 'hidden', background: 'white', border: '1px solid var(--silk-200)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img src="/ycdc_reception_lobby.jpg" alt="YCDC Reception Lobby" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
              </div>
              <div style={{ padding: '20px', textAlign: 'left' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', fontSize: '1.2rem', marginBottom: '6px' }}>Executive Reception Lounge</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.5' }}>
                  Calming architectural ambiance with illuminated brass detailing and dedicated patient hospitality desks.
                </p>
              </div>
            </div>

            <div className="glass hover-premium" style={{ borderRadius: '16px', overflow: 'hidden', background: 'white', border: '1px solid var(--silk-200)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img src="/laser_suite_clinical.jpg" alt="US-FDA Laser Suite" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
              </div>
              <div style={{ padding: '20px', textAlign: 'left' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', fontSize: '1.2rem', marginBottom: '6px' }}>FDA-Approved Laser Suites</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.5' }}>
                  RevLite, ResurFX, and Soprano cooling laser platforms operated in sterile clinical environments.
                </p>
              </div>
            </div>

            <div className="glass hover-premium" style={{ borderRadius: '16px', overflow: 'hidden', background: 'white', border: '1px solid var(--silk-200)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img src="/luxury_treatment_suite.jpg" alt="Private Aesthetic Treatment Suite" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
              </div>
              <div style={{ padding: '20px', textAlign: 'left' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', fontSize: '1.2rem', marginBottom: '6px' }}>Private Care Suites</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.5' }}>
                  Acoustically insulated consultation and treatment chambers designed for utmost privacy and patient comfort.
                </p>
              </div>
            </div>

            <div className="glass hover-premium" style={{ borderRadius: '16px', overflow: 'hidden', background: 'white', border: '1px solid var(--silk-200)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img src="/facial_aesthetic_treatment.jpg" alt="Clinical Facial Aesthetics" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
              </div>
              <div style={{ padding: '20px', textAlign: 'left' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', fontSize: '1.2rem', marginBottom: '6px' }}>Aesthetic Cosmetology</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.5' }}>
                  High-precision gold-probe radiofrequency, chemical resurfacing, and dermal volume restructuring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action banner */}
      <section className="container reveal reveal-up" style={{ marginTop: '54px', marginBottom: '30px' }}>
        <div 
          className="plum-gradient" 
          style={{ 
            background: 'linear-gradient(135deg, #233D32 0%, #1A2F26 100%)', 
            padding: '56px 36px', 
            borderRadius: '24px', 
            color: '#ffffff', 
            textAlign: 'center',
            boxShadow: '0 16px 42px rgba(35, 61, 50, 0.28)',
            border: '1px solid rgba(180, 154, 104, 0.35)'
          }}
        >
          <span 
            className="badge badge-gold" 
            style={{ 
              marginBottom: '16px', 
              display: 'inline-block',
              backgroundColor: 'rgba(180, 154, 104, 0.25)', 
              color: '#F3E5AB',
              border: '1px solid rgba(243, 229, 171, 0.45)',
              padding: '6px 18px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em'
            }}
          >
            Personalized Consultation
          </span>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: '#ffffff', fontSize: '2.4rem', marginBottom: '14px', fontWeight: 600 }}>
            Experience Premium Skincare at YCDC
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.92)', maxWidth: '640px', margin: '0 auto 28px', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Book a physical appointment or secure virtual screening to consult with Dr. Yogiraj and team.
          </p>
          <button 
            onClick={onNavigateToContact} 
            className="btn btn-primary"
            style={{
              backgroundColor: '#D9A5A7',
              color: '#242923',
              fontWeight: 700,
              padding: '14px 38px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c58f92')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D9A5A7')}
          >
            Connect With Our Center
          </button>
        </div>
      </section>
    </div>
  );
}
