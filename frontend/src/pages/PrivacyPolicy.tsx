import { Shield, Lock, Eye, CheckCircle2, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Title Hero Banner - Signature YCDC Deep Forest Green */}
      <section style={{
        position: 'relative',
        padding: 'clamp(90px, 12vh, 130px) 0 70px',
        background: 'linear-gradient(135deg, #172920 0%, #233D32 60%, #1A2E24 100%)',
        color: '#FFFFFF',
        textAlign: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(215, 203, 190, 0.25)'
      }}>
        {/* Soft Gold / Rose Ambient Radiance */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 165, 167, 0.18) 0%, rgba(180, 154, 104, 0.12) 50%, transparent 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230, 202, 133, 0.15) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(230, 202, 133, 0.55)',
            color: '#F3E5AB',
            background: 'rgba(230, 202, 133, 0.12)',
            borderRadius: '9999px',
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '18px'
          }}>
            ✦ Clinical Compliance &amp; Standards
          </span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            color: '#FFFFFF',
            marginBottom: '14px',
            letterSpacing: '-0.02em',
            fontWeight: 500,
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.25)'
          }}>
            Privacy Policy &amp; Terms
          </h1>
          <p style={{
            color: 'rgba(250, 246, 240, 0.88)',
            maxWidth: '660px',
            margin: '0 auto',
            fontSize: '0.98rem',
            lineHeight: 1.6
          }}>
            Learn how YCDC protects patient confidentiality, handles medical screening details, and adheres to strict medical practitioner ethics and quality codes.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section style={{ padding: 'clamp(40px, 6vw, 70px) 0' }}>
        <div className="container" style={{ maxWidth: '840px', padding: '0 20px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: 'clamp(28px, 5vw, 50px)',
            borderRadius: '24px',
            border: '1px solid rgba(215, 203, 190, 0.65)',
            boxShadow: '0 16px 44px rgba(35, 61, 50, 0.08), 0 2px 8px rgba(0, 0, 0, 0.02)',
            textAlign: 'left'
          }}>
            {/* Intro Header */}
            <div style={{
              display: 'flex',
              gap: '18px',
              alignItems: 'center',
              marginBottom: '32px',
              borderBottom: '1px solid rgba(215, 203, 190, 0.55)',
              paddingBottom: '22px'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: 'rgba(35, 61, 50, 0.08)',
                border: '1px solid rgba(35, 61, 50, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield size={28} style={{ color: '#233D32' }} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#233D32', margin: 0, fontWeight: 600 }}>
                  Patient Data Commitment
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#657766', marginTop: '4px', margin: 0 }}>
                  Last Updated: 2026 | ISO 9001:2015 &amp; Medical Practitioner Ethics Compliant
                </p>
              </div>
            </div>

            {/* Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#38433A', lineHeight: '1.75' }}>
              
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.28rem',
                  color: '#233D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  fontWeight: 600
                }}>
                  <Lock size={19} style={{ color: '#B49A68', flexShrink: 0 }} /> 1. Patient Confidentiality
                </h4>
                <p style={{ margin: 0, fontSize: '0.94rem' }}>
                  At Dr. Yogiraj Centre for Dermatology &amp; Cosmetology (YCDC), we hold your medical information, consultation summaries, and diagnostic photos in the highest confidence. Under no circumstances are clinical records shared, rented, or disclosed to third-party commercial marketing platforms.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.28rem',
                  color: '#233D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  fontWeight: 600
                }}>
                  <Eye size={19} style={{ color: '#B49A68', flexShrink: 0 }} /> 2. Information We Collect
                </h4>
                <p style={{ margin: 0, fontSize: '0.94rem' }}>
                  We collect essential information to facilitate clinical appointments, provide accurate preliminary evaluations, and coordinate continuous dermatological care:
                </p>
                <ul style={{ paddingLeft: '22px', marginTop: '10px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                  <li><strong style={{ color: '#233D32' }}>Booking Details:</strong> Full Name, Email, Phone Number, Selected Branch Location (Bangalore or Trivandrum), and preferred Date/Time.</li>
                  <li><strong style={{ color: '#233D32' }}>Clinical &amp; Screening Details:</strong> Self-disclosed skin or hair concerns, treatment history, and uploaded photographs for remote doctor assessment.</li>
                  <li><strong style={{ color: '#233D32' }}>Care Coordination Logs:</strong> Appointment confirmations, reminder notifications, and specialist follow-up communications.</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.28rem',
                  color: '#233D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={19} style={{ color: '#B49A68', flexShrink: 0 }} /> 3. How We Use Patient Data
                </h4>
                <p style={{ margin: 0, fontSize: '0.94rem' }}>
                  Your clinical details and contact information are used exclusively to:
                </p>
                <ul style={{ paddingLeft: '22px', marginTop: '10px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                  <li>Schedule, confirm, and manage clinical consultations and treatment appointments.</li>
                  <li>Assist YCDC senior dermatologists and surgeons with preliminary diagnostic evaluations.</li>
                  <li>Provide critical post-treatment recovery guidelines, follow-up reminders, and care support.</li>
                  <li>Send clinical health advisories, dermatological updates, and safety announcements (only upon confirmed opt-in).</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.28rem',
                  color: '#233D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  fontWeight: 600
                }}>
                  <Shield size={19} style={{ color: '#B49A68', flexShrink: 0 }} /> 4. Data Security &amp; Clinical Storage
                </h4>
                <p style={{ margin: 0, fontSize: '0.94rem' }}>
                  All self-scheduled consultations and clinical screening inquiries are stored in secure, encrypted medical environments. We implement stringent administrative, physical, and digital safeguards to prevent unauthorized access or disclosure of patient health information.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.28rem',
                  color: '#233D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  fontWeight: 600
                }}>
                  <Shield size={19} style={{ color: '#B49A68', flexShrink: 0 }} /> 5. Terms of Care &amp; Clinical Consultations
                </h4>
                <p style={{ margin: 0, fontSize: '0.94rem' }}>
                  Clinical advice delivered through digital channels represents a preliminary triage and does not replace in-person dermatological examination, dermoscopy, or biopsy when required. Treatment protocols are personalized and administered by certified medical professionals following comprehensive in-clinic assessment.
                </p>
              </div>

            </div>

            {/* Social Icons inside Privacy Policy */}
            <div style={{
              marginTop: '44px',
              paddingTop: '28px',
              borderTop: '1px solid rgba(215, 203, 190, 0.55)',
              textAlign: 'center'
            }}>
              <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#233D32', marginBottom: '14px', fontWeight: 600 }}>
                Follow YCDC on Social Channels
              </h5>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <a
                  href="https://www.instagram.com/ycdc_in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF6F0',
                    border: '1px solid rgba(215, 203, 190, 0.7)',
                    color: '#233D32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#233D32';
                    e.currentTarget.style.borderColor = '#233D32';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF6F0';
                    e.currentTarget.style.borderColor = 'rgba(215, 203, 190, 0.7)';
                    e.currentTarget.style.color = '#233D32';
                  }}
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF6F0',
                    border: '1px solid rgba(215, 203, 190, 0.7)',
                    color: '#233D32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#233D32';
                    e.currentTarget.style.borderColor = '#233D32';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF6F0';
                    e.currentTarget.style.borderColor = 'rgba(215, 203, 190, 0.7)';
                    e.currentTarget.style.color = '#233D32';
                  }}
                  title="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF6F0',
                    border: '1px solid rgba(215, 203, 190, 0.7)',
                    color: '#233D32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#233D32';
                    e.currentTarget.style.borderColor = '#233D32';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF6F0';
                    e.currentTarget.style.borderColor = 'rgba(215, 203, 190, 0.7)';
                    e.currentTarget.style.color = '#233D32';
                  }}
                  title="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF6F0',
                    border: '1px solid rgba(215, 203, 190, 0.7)',
                    color: '#233D32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#233D32';
                    e.currentTarget.style.borderColor = '#233D32';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF6F0';
                    e.currentTarget.style.borderColor = 'rgba(215, 203, 190, 0.7)';
                    e.currentTarget.style.color = '#233D32';
                  }}
                  title="Twitter"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
