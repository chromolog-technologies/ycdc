import { Award, Briefcase, GraduationCap, Instagram, Mail, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import type { Doctor, OurTeamProps } from '../types';

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. K. Yogiraj',
    qualification: 'DV, MD (D&V)',
    designation: 'Chairman & MD',
    bio: 'Managing Director of the Yogiraj Centre for Dermatology & Cosmetology, brings an illustrious career spanning over five decades in Clinical and Cosmetic Dermatology. As a former Professor in the Department of Dermatology and Venereology at Medical College, Trivandrum, he has shaped the future of postgraduate education and research in dermatology.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_yogiraj.png',
  },
  {
    id: 2,
    name: 'Dr. Niranjana Raj',
    qualification: 'FRGUHS, MD (Dermatology, Venereology & Leprosy)',
    designation: 'Chief Consultant Dermatologist',
    bio: 'Lead consultant specializing in advanced lasers, aesthetic injectables, and clinical dermatology workflows.',
    branch: 'bangalore',
    instagram_url: 'https://www.instagram.com/drniranjanaraj/',
    active: true,
    image_path: 'https://ycdc.in/wp-content/uploads/2025/05/niranjana.jpg',
  },
  {
    id: 3,
    name: 'Dr. Yasmin Rehman',
    qualification: 'MBBS, DDVL',
    designation: 'Consultant Dermatologist',
    bio: 'Expert in chemical peels, acne therapies, and general clinical skin conditions.',
    branch: 'bangalore',
    instagram_url: undefined,
    active: true,
    image_path: 'https://ycdc.in/wp-content/uploads/2025/05/Dr.-Niranjana-Raj.jpg',
  },
  {
    id: 4,
    name: 'Dr. Vignessh Raj',
    qualification: 'MBBS, MD (Dermatology)',
    designation: 'Aesthetic Dermatologist',
    bio: 'Specializes in RF microneedling, skin resurfacing, and body shaping treatments.',
    branch: 'bangalore',
    instagram_url: undefined,
    active: true,
    image_path: 'https://ycdc.in/wp-content/uploads/2025/05/Dr.-NR.jpg',
  },
  {
    id: 5,
    name: 'Dr. Vennela R',
    qualification: 'MBBS, MD',
    designation: 'Hair Transplant Surgeon',
    bio: 'Dedicated trichologist and hair transplant surgeon practicing FUE micro-grafting.',
    branch: 'bangalore',
    instagram_url: undefined,
    active: true,
    image_path: 'https://ycdc.in/wp-content/uploads/2025/05/cosmetologist-doing-trichoscopy-and-watching-resul-2024-10-18-10-16-52-utc-scaled.jpg',
  },
  {
    id: 6,
    name: 'Dr. Maya Vincent',
    qualification: 'MBBS, MD – Dermatology',
    designation: 'Senior Consultant Dermatologist',
    bio: 'Expert senior physician with 15+ years experience in chronic skin conditions.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_maya.png',
  },
  {
    id: 7,
    name: 'Dr. Sunil Menon',
    qualification: 'MBBS, MD – Dermatology',
    designation: 'Consultant Dermatologist',
    bio: 'Specialist in laser treatments and pediatric dermatology.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_sunil.png',
  },
  {
    id: 8,
    name: 'Dr. Bismi Sherief',
    qualification: 'MBBS, DNB (Dermatology & Venereology)',
    designation: 'Consultant Dermatologist',
    bio: 'Expert clinical doctor focusing on venereology and autoimmune skin conditions.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_bismi.png',
  },
  {
    id: 9,
    name: 'Dr. Deepthi Benny',
    qualification: 'MBBS, DNB Dermatology',
    designation: 'Consultant Dermatologist',
    bio: 'Dedicated clinical practitioner specialized in hyperpigmentation and laser toning.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_deepthi.png',
  },
  {
    id: 10,
    name: 'Dr. Ryan Raju',
    qualification: 'MBBS, MD Dermatology, Venereology & Leprology',
    designation: 'Aesthetic Specialist',
    bio: 'Aesthetic expert focused on anti-wrinkle injections, dermal fillers, and thread lifts.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_ryan.png',
  },
  {
    id: 11,
    name: 'Dr. Devi Menon',
    qualification: 'MBBS, MD Dermatology, Venereology & Leprology',
    designation: 'Clinical Dermatologist',
    bio: 'Specializes in allergy testing, eczema management, and psoriasis protocols.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_devi.png',
  },
  {
    id: 12,
    name: 'Dr. Shruthi S Kumar',
    qualification: 'MBBS, MD Dermatology, Venereology & Leprology',
    designation: 'Consultant Dermatologist',
    bio: 'Clinical expert in acne scar management and chemical peeling strategies.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_shruthi.png',
  },
  {
    id: 13,
    name: 'Dr. Amy Mary Sebastian',
    qualification: 'MBBS, MD Dermatology, Venereology & Leprology',
    designation: 'Clinical Consultant',
    bio: 'Consulting clinical dermatologist focusing on general dermatological wellness.',
    branch: 'trivandrum',
    instagram_url: undefined,
    active: true,
    image_path: '/doctor_amy.png',
  }
];

const getDoctorImageUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('/')) {
    return path;
  }
  return `http://localhost:8000${path}`;
};

export default function OurTeam({ onOpenApplyModal }: OurTeamProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const loading = false;

  useEffect(() => {
    fetch(`${API_BASE_URL}/doctors`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDoctors(data);
        }
      })
      .catch(err => {
        console.warn("Backend API not reachable, using high-fidelity local doctors data:", err);
      });
  }, []);

  // Filter lists
  const BENGALURU_TEAM = doctors.filter(d => d.branch === 'bangalore');
  const TRIVANDRUM_TEAM = doctors.filter(d => d.branch === 'trivandrum' && d.name !== 'Dr. K. Yogiraj');
  const leader = doctors.find(d => d.name === 'Dr. K. Yogiraj') || MOCK_DOCTORS[0];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--silk-100)', minHeight: '100vh' }}>
      {/* Page Title Hero Banner */}
      <section style={{
        position: 'relative',
        padding: '120px 0 80px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%), url("/cosmetic_treatment_premium.png") no-repeat center center/cover',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Soft Background Decorative Grid */}
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
            Meet Our Clinicians
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'white', marginBottom: '10px' }}>
            Our Medical Specialists
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '650px', margin: '0 auto' }}>
            At YCDC, under the visionary leadership of Dr. K. Yogiraj, we promise unparalleled care and excellence in every service we offer.
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="badge badge-premium">Medical Leadership</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-500)', marginTop: '10px' }}>
              Visionary <span style={{ color: 'var(--plum-900)' }}>Pioneer</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '50px',
            alignItems: 'center'
          }}>
            {/* Dr. Yogiraj Image / Presentation */}
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--silk-200)',
              backgroundColor: 'var(--silk-100)',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {leader.image_path ? (
                <img 
                  src={getDoctorImageUrl(leader.image_path)} 
                  alt={leader.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, var(--gold-500) 0%, var(--plum-900) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  padding: '40px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid var(--plum-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '20px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                  }}>
                    KY
                  </div>
                  <h3 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '8px' }}>{leader.name}</h3>
                  <span className="badge badge-premium" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>
                    {leader.designation || 'Chairman & MD'}
                  </span>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: '16px' }}>
                    50+ Years of Illustrious Leadership in Indian Dermatology
                  </p>
                </div>
              )}
            </div>

            {/* Dr. Yogiraj Bio */}
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--plum-800)', fontWeight: 'bold' }}>
                {leader.name}, {leader.qualification}
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--plum-900)', marginTop: '8px', marginBottom: '20px' }}>
                "The Doctor's Doctor"
              </h3>
              <p style={{ color: 'var(--muted-charcoal)', lineHeight: '1.7', marginBottom: '24px', fontSize: '1.05rem' }}>
                {leader.bio}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--plum-100)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--plum-800)' }}>
                    <Award size={18} />
                  </div>
                  <div>
                    <h6 style={{ fontWeight: 'bold', color: 'var(--plum-900)', fontSize: '0.95rem' }}>Professor & Head (Rtd.)</h6>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)' }}>Department of Dermatology, Medical College, Trivandrum</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--plum-100)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--plum-800)' }}>
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h6 style={{ fontWeight: 'bold', color: 'var(--plum-900)', fontSize: '0.95rem' }}>5 Decades of Expertise</h6>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)' }}>Pioneer in advanced clinical & aesthetic dermatology</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--plum-100)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--plum-800)' }}>
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h6 style={{ fontWeight: 'bold', color: 'var(--plum-900)', fontSize: '0.95rem' }}>MD (D&V), DV</h6>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)' }}>Trained at leading global medical institutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trivandrum Team Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--silk-100)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge badge-premium">Pattom Clinic</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-500)', marginTop: '10px' }}>
              Our <span style={{ color: 'var(--plum-900)' }}>Trivandrum Specialists</span>
            </h2>
            <p style={{ color: 'var(--muted-charcoal)', maxWidth: '600px', margin: '12px auto 0' }}>
              Consult our highly skilled clinical dermatologists and venereology specialists in Thiruvananthapuram.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-charcoal)' }}>Loading team...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '30px'
            }}>
              {TRIVANDRUM_TEAM.map((doctor, idx) => (
                <div
                  key={doctor.id}
                  className="glass doctor-card animate-fade-in-up"
                  style={{
                    padding: '30px 24px',
                    borderRadius: '12px',
                    border: '1px solid var(--silk-200)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    animationDelay: `${idx * 100}ms`
                  }}
                >
                  <div>
                    {/* Doctor Avatar Badge / Photo */}
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--gold-100)',
                      color: 'var(--gold-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-serif)',
                      marginBottom: '20px',
                      border: '1px solid var(--gold-400)',
                      overflow: 'hidden'
                    }}>
                      {doctor.image_path ? (
                        <img src={getDoctorImageUrl(doctor.image_path)} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        doctor.name.split(' ').slice(1).map(n => n[0]).join('')
                      )}
                    </div>

                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)', marginBottom: '6px' }}>
                      {doctor.name}
                    </h4>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-500)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                      {doctor.designation}
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.5' }}>
                      {doctor.qualification}
                    </p>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-charcoal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: 'var(--gold-500)' }} /> Trivandrum
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bengaluru Team Section */}
      <section className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge badge-premium">Whitefield Clinic</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-500)', marginTop: '10px' }}>
              Our <span style={{ color: 'var(--plum-900)' }}>Bengaluru Specialists</span>
            </h2>
            <p style={{ color: 'var(--muted-charcoal)', maxWidth: '600px', margin: '12px auto 0' }}>
              Meet our board-certified dermatologists, trichologists, and transplant surgeons practicing at our Bangalore center.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-charcoal)' }}>Loading team...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '30px'
            }}>
              {BENGALURU_TEAM.map((doctor, idx) => (
                <div
                  key={doctor.id}
                  className="glass doctor-card animate-fade-in-up"
                  style={{
                    padding: '30px 24px',
                    borderRadius: '12px',
                    border: '1px solid var(--silk-200)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    animationDelay: `${idx * 100}ms`
                  }}
                >
                  <div>
                    {/* Doctor Avatar Badge / Photo */}
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--plum-100)',
                      color: 'var(--plum-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-serif)',
                      marginBottom: '20px',
                      border: '1px solid var(--plum-500)',
                      overflow: 'hidden'
                    }}>
                      {doctor.image_path ? (
                        <img src={getDoctorImageUrl(doctor.image_path)} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        doctor.name.split(' ').slice(1).map(n => n[0]).join('')
                      )}
                    </div>

                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)', marginBottom: '6px' }}>
                      {doctor.name}
                    </h4>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-500)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                      {doctor.designation}
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', lineHeight: '1.5' }}>
                      {doctor.qualification}
                    </p>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-charcoal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: 'var(--plum-800)' }} /> Bangalore
                    </span>
                    {doctor.instagram_url && (
                      <a href={doctor.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--plum-800)' }} title="Follow Instagram">
                        <Instagram size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recruitment CTA Section */}
      <section className="section-padding" style={{
        background: 'linear-gradient(to right, var(--plum-900), var(--gold-600))',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <span className="badge badge-premium" style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              Work With Us
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'white', marginBottom: '16px' }}>
              Want to Join Our Team?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '32px' }}>
              Be a part of our expert team at YCDC and make a difference in dermatology and cosmetology. Work with industry leaders, state-of-the-art facilities, and transform lives.
            </p>
            <button
              onClick={onOpenApplyModal}
              className="btn btn-accent"
              style={{ padding: '16px 40px', fontSize: '1rem', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '10px', border: 'none' }}
            >
              Apply Now <Mail size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
