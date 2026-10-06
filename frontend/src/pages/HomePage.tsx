import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Flower2,
  Sparkles,
  Heart,
  ShieldCheck,
  UserCheck,
  Star,
  Check,
  MapPin,
  Instagram,
  Phone,
  FileText,
  UploadCloud,
  Stethoscope
} from 'lucide-react';
import ConsultationForm from '../components/ConsultationForm';
import type { PageId } from '../types/navigation';

interface HomePageProps {
  onNavigateToPage: (page: PageId) => void;
  onOpenBookingModal: (prefills?: { category?: string; service?: string; branch?: string }) => void;
  onBookTreatment: (category: string, serviceId: string) => void;
}

type CareCategory = 'skin' | 'hair' | 'laser' | 'aesthetics';

const CARE_CATEGORIES_DATA: Record<CareCategory, {
  tabLabel: string;
  protocolTitle: string;
  protocolDesc: string;
  protocolImage: string;
  services: Array<{
    title: string;
    desc: string;
    duration: string;
    serviceId: string;
  }>;
}> = {
  skin: {
    tabLabel: 'Clinical Dermatology',
    protocolTitle: 'Clinical Dermatology',
    protocolDesc: 'Evidence-based therapies for healthy, clear, and resilient skin.',
    protocolImage: '/luxury_treatment_suite.jpg',
    services: [
      {
        title: 'Advanced Acne & Scar Revision',
        desc: 'Targeted laser and RF therapies to calm active acne and smooth deep scar tissue.',
        duration: '45 mins',
        serviceId: 'acne'
      },
      {
        title: 'Medical Chemical Peels',
        desc: 'Clinical-strength formulation resurfacing to clarify texture and restore luminosity.',
        duration: '30 mins',
        serviceId: 'peels'
      },
      {
        title: 'Dermatological Microdermabrasion',
        desc: 'Gentle mechanical exfoliation to eliminate cellular debris and refine skin grain.',
        duration: '40 mins',
        serviceId: 'microdermabrasion'
      },
      {
        title: 'Eczema & Psoriasis Protocols',
        desc: 'Systemic evaluation and targeted clinical plans for chronic inflammatory disorders.',
        duration: 'Consultation',
        serviceId: 'eczema'
      }
    ]
  },
  hair: {
    tabLabel: 'Hair & Scalp Restoration',
    protocolTitle: 'Hair & Scalp Restoration',
    protocolDesc: 'Precision microsurgery and autologous bio-therapies for hair longevity.',
    protocolImage: '/hair_treatment_premium.png',
    services: [
      {
        title: 'Advanced FUE Hairline & Density Restoration',
        desc: 'Follicular unit extraction for permanent, natural density hairline design.',
        duration: '4-6 hrs',
        serviceId: 'fue-hair-transplant'
      },
      {
        title: 'Autologous Growth Factor Scalp Rejuvenation (GFC)',
        desc: 'High-concentration platelet bio-therapy targeting follicular root strength.',
        duration: '45 mins',
        serviceId: 'gfc-therapy'
      },
      {
        title: 'Digital Scalp Trichoscopy Examination',
        desc: 'High-magnification microscopic scalp analysis to map density and follicle health.',
        duration: '30 mins',
        serviceId: 'trichoscopy'
      },
      {
        title: 'Alopecia Areata Clinical Protocols',
        desc: 'Targeted intralesional and systemic clinical therapies for rapid hair regrowth.',
        duration: 'Consultation',
        serviceId: 'alopecia'
      }
    ]
  },
  laser: {
    tabLabel: 'Advanced Laser Therapies',
    protocolTitle: 'Advanced Laser Therapies',
    protocolDesc: 'US-FDA approved laser systems delivering precise, safe rejuvenation.',
    protocolImage: '/laser_suite_clinical.jpg',
    services: [
      {
        title: 'RevLite Q-Switched Laser Toning',
        desc: 'Dual-wavelength photoacoustic pulses to clear deep melasma and sun pigmentation.',
        duration: '45 mins',
        serviceId: 'revlite-laser'
      },
      {
        title: 'ResurFX Fractional Non-Ablative Laser',
        desc: 'Deep dermal collagen remodelling to smooth surgical scars and fine lines.',
        duration: '45 mins',
        serviceId: 'resurfx-laser'
      },
      {
        title: 'Painless Triple-Wavelength Laser Hair Reduction',
        desc: 'Advanced contact cooling technology for permanent hair reduction across Indian skin.',
        duration: '30-60 mins',
        serviceId: 'laser-hair-removal'
      },
      {
        title: 'Vascular Laser for Rosacea & Angiomas',
        desc: 'Specific light absorption to collapse dilated facial capillaries safely.',
        duration: '30 mins',
        serviceId: 'vascular-laser'
      }
    ]
  },
  aesthetics: {
    tabLabel: 'Aesthetic Cosmetology',
    protocolTitle: 'Aesthetic Cosmetology',
    protocolDesc: 'Refined anti-aging and facial contouring tailored to natural facial balance.',
    protocolImage: '/facial_aesthetic_treatment.jpg',
    services: [
      {
        title: 'Advanced Anti-Aging & Wrinkle Correction',
        desc: 'Targeted neuromodulator therapies to soften dynamic forehead and eye lines.',
        duration: '45 mins',
        serviceId: 'anti-aging'
      },
      {
        title: 'Hyaluronic Dermal Volume Restructuring',
        desc: 'Restores youthful mid-face contour, cheek fullness, and structural harmony.',
        duration: '45 mins',
        serviceId: 'dermal-fillers'
      },
      {
        title: 'Medical Hydration & Radiance Infusion',
        desc: 'Multi-step ultrasound active serum infusion and oxygenation for healthy glow.',
        duration: '50 mins',
        serviceId: 'hydra-glow'
      },
      {
        title: 'Double Chin Lipolysis & Jawline Sculpting',
        desc: 'Non-invasive submental contouring to sculpt a defined cervical profile.',
        duration: '40 mins',
        serviceId: 'lipolysis'
      }
    ]
  }
};

const TESTIMONIALS = [
  {
    quote: "Our targeted combination of carbon-peel lasers and prescription retinoids calmed active cystic lesions while remodeling deep collagen scarring within 12 weeks.",
    doctor: "Dr. Amy Cherian",
    role: "Consultant Dermatologist",
    caseTitle: "Acne Scar Revision",
    avatar: "/doctor_amy.png",
    author: "Dr. Amy Cherian",
    treatment: "Acne Scar Revision"
  },
  {
    quote: "Micro-follicular unit extraction paired with structured GFC sessions achieved natural crown density and a resilient, organic hairline.",
    doctor: "Dr. Ryan Paul",
    role: "Trichology & Hair Specialist",
    caseTitle: "FUE Hair Restoration",
    avatar: "/doctor_ryan.png",
    author: "Dr. Ryan Paul",
    treatment: "FUE Hair Restoration"
  },
  {
    quote: "By addressing cellular barrier health and melanocyte regulation, our clinical regimen achieved sustained radiance with zero post-inflammatory rebound.",
    doctor: "Dr. Bismi George",
    role: "Chief Aesthetic Physician",
    caseTitle: "Skin Rejuvenation Protocol",
    avatar: "/doctor_bismi.png",
    author: "Dr. Bismi George",
    treatment: "Skin Rejuvenation Protocol"
  },
  {
    quote: "Clinical dermatology requires precise diagnosis before procedural intervention. Evidence-based care ensures safe, predictable, and lasting transformation.",
    doctor: "Dr. Yogiraj",
    role: "Founder & Chief Dermatologist",
    caseTitle: "Clinical Excellence",
    avatar: "/doctor_yogiraj.png",
    author: "Dr. Yogiraj",
    treatment: "Founder & Chief Dermatologist"
  }
];

const PATIENT_CARE_STAGES = [
  {
    num: '01',
    title: 'Listen',
    tag: 'Clinical Intake',
    desc: 'An unhurried consultation to understand your dermatological history, previous treatments, lifestyle, and individual aesthetic goals without pressure.',
    highlights: ['Unhurried 30-min dialog', 'Zero sales pressure', 'Holistic root-cause audit']
  },
  {
    num: '02',
    title: 'Understand',
    tag: 'Diagnostic Analysis',
    desc: 'Detailed clinical assessment and dermoscopic examination to evaluate skin phototype, follicular density, and underlying barrier health.',
    highlights: ['High-resolution dermoscopy', 'Phototype & barrier grading', 'Objective assessment']
  },
  {
    num: '03',
    title: 'Personalise',
    tag: 'Treatment Protocol',
    desc: 'Formulation of a customized, evidence-based treatment plan combining medical topicals, clinical procedures, or FDA-approved lasers.',
    highlights: ['Customized prescription', 'US-FDA approved technology', 'Milestone roadmap']
  },
  {
    num: '04',
    title: 'Care',
    tag: 'Sustained Recovery',
    desc: 'Gentle procedural execution by qualified physicians, transparent post-care instructions, and structured follow-up reviews to ensure sustained wellness.',
    highlights: ['Physician-administered', 'Comprehensive post-care kits', 'Scheduled reviews']
  }
];

interface PatientStory {
  id: string;
  author: string;
  location: string;
  quote: string;
  treatmentTag: string;
}

const PATIENT_STORIES_DATA: PatientStory[] = [
  {
    id: '1',
    author: 'Arunachalam Pillai',
    location: 'Patient, Trivandrum',
    quote: "Had my FUE hair transplant performed under Dr. Yogiraj's clinical protocol. Incredibly dense regrowth with natural hairline. State-of-the-art facility and transparent care!",
    treatmentTag: 'Hair Transplant (FUE)'
  },
  {
    id: '2',
    author: 'Anjali Menon',
    location: 'Patient, Trivandrum',
    quote: "YCDC is the oldest and most trusted clinic in Trivandrum. I had their chemical peels for hyperpigmentation. Dr. Yogiraj's diagnosis was spot-on, and the clinical care is exceptional.",
    treatmentTag: 'Chemical Peels (Google Review)'
  },
  {
    id: '3',
    author: 'Deepak Mohan',
    location: 'Patient, Bangalore',
    quote: "Very professional clinic. The staff explain everything patiently. The laser treatment is completely pain-free compared to other clinics. Value for money and premium service.",
    treatmentTag: 'Laser Hair Reduction'
  },
  {
    id: '4',
    author: 'Dr. Rahul Krishnan',
    location: 'Patient, Bangalore',
    quote: "As a doctor myself, I appreciate YCDC's evidence-based approach. My acne scars reduced significantly and the Whitefield clinic has the latest lasers. Highly recommended.",
    treatmentTag: 'Acne Correction (Google Review)'
  },
  {
    id: '5',
    author: 'Meera Varghese',
    location: 'Patient, Kochi',
    quote: "Underwent HydraFacial and anti-pigmentation therapy before my wedding. My skin felt radiant, even-toned and deeply nourished. Truly world-class medical aesthetics.",
    treatmentTag: 'HydraFacial Glow'
  },
  {
    id: '6',
    author: 'Suresh Nambiar',
    location: 'Patient, Trivandrum',
    quote: "Suffered from chronic psoriasis for years before visiting YCDC. The clinical team provided a systematic diagnostic treatment plan that gave me lasting relief.",
    treatmentTag: 'Clinical Dermatology'
  },
  {
    id: '7',
    author: 'Pooja Hegde',
    location: 'Patient, Bangalore',
    quote: "The PRP hair sessions combined with personalized nutritional guidance halted my hair thinning completely. Professional, hygienic, and scientifically grounded.",
    treatmentTag: 'PRP Therapy'
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToPage,
  onOpenBookingModal,
  onBookTreatment: _onBookTreatment
}) => {
  const [activeCareCategory, setActiveCareCategory] = useState<CareCategory>('skin');
  const [activeStage, setActiveStage] = useState<number>(1);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const storiesScrollRef = useRef<HTMLDivElement>(null);
  const [isStoriesPaused, setIsStoriesPaused] = useState<boolean>(false);

  // Auto-running continuous carousel loop for Patient Stories
  useEffect(() => {
    const track = storiesScrollRef.current;
    if (!track) return;

    let animId: number;
    const speed = 0.8; // Smooth luxury auto-scroll

    const loop = () => {
      if (!isStoriesPaused && track) {
        track.scrollLeft += speed;
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        } else if (track.scrollLeft < 0) {
          track.scrollLeft += halfWidth;
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [isStoriesPaused]);

  const scrollStories = (direction: 'left' | 'right') => {
    if (storiesScrollRef.current) {
      const scrollAmount = 450;
      storiesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const currentTestimonial = TESTIMONIALS[testimonialIndex];
  const careData = CARE_CATEGORIES_DATA[activeCareCategory];

  // Scroll reveal observer for elements + automatic active stage on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. General scroll reveal observer for smooth entrance animations
    let revealObserver: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-active');
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px 40px 0px',
        }
      );
    }

    const scanAndObserve = () => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('reveal-active');
        } else if (!el.classList.contains('reveal-active') && revealObserver) {
          revealObserver.observe(el);
        }
      });
    };

    scanAndObserve();
    const timeoutId1 = setTimeout(scanAndObserve, 100);
    const timeoutId2 = setTimeout(scanAndObserve, 300);

    // 2. High-performance scroll spy for Care Journey: dynamically tracks the card closest to viewport focal center
    let isTicking = false;
    const handleCareJourneyScroll = () => {
      if (isTicking) return;
      isTicking = true;
      requestAnimationFrame(() => {
        isTicking = false;
        const stageCards = document.querySelectorAll<HTMLElement>('.stage-card');
        if (!stageCards.length) return;
        const focalLine = window.innerHeight * 0.45;
        let closestStage = 1;
        let minDistance = Infinity;

        stageCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height * 0.5;
          const distance = Math.abs(cardCenter - focalLine);
          // Only evaluate cards that are visible in the active viewing zone
          if (rect.bottom > 60 && rect.top < window.innerHeight - 60) {
            if (distance < minDistance) {
              minDistance = distance;
              const stageNum = Number(card.getAttribute('data-stage'));
              if (stageNum && !isNaN(stageNum)) {
                closestStage = stageNum;
              }
            }
          }
        });
        setActiveStage((prev) => (prev !== closestStage ? closestStage : prev));
      });
    };

    window.addEventListener('scroll', handleCareJourneyScroll, { passive: true });
    handleCareJourneyScroll();

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      revealObserver?.disconnect();
      window.removeEventListener('scroll', handleCareJourneyScroll);
    };
  }, []);

  return (
    <>
      {/* =================================================================
          1. CINEMATIC HERO SECTION: Animated Radiant Skin & Editorial Aesthetics
          ================================================================= */}
      <section className="master-hero-section">
        {/* Animated High-End Hero Image with Subtle Breathing Ken Burns Motion */}
        <div className="master-hero-img-wrap">
          <img
            src="/banner_radiant_skin.jpg"
            alt="YCDC Clinical Dermatology &amp; Luxury Skin Rejuvenation"
            className="master-hero-animated-img"
          />
        </div>

        {/* Ambient Warm Rose-Gold Glow on Peonies */}
        <div className="master-hero-ambient-glow" />

        {/* Floating Luminous Particle & Petal Accents */}
        <div className="master-hero-particles-container">
          <div className="hero-particle hero-particle-1" />
          <div className="hero-particle hero-particle-2" />
          <div className="hero-particle hero-particle-3" />
          <div className="hero-particle hero-particle-4" />
        </div>

        {/* Contrast & Vignette Overlays */}
        <div className="master-hero-overlay-dark" />
        <div className="master-hero-overlay-top" />
        <div className="master-hero-overlay-bottom" />

        {/* Main Hero Container */}
        <div className="container master-hero-container">
          <div className="master-hero-main-row">
            {/* Left Content Column */}
            <div className="master-hero-text-col reveal reveal-left">
              {/* Gold Luxury Provenance Eyebrow */}
              <div className="hero-luxury-eyebrow">
                <span className="hero-eyebrow-accent">✦</span>
                <span>EST. 1980 &bull; CLINICAL EXCELLENCE &bull; ISO 9001:2015</span>
                <span className="hero-eyebrow-accent">✦</span>
              </div>

              <h1 className="master-hero-title">
                Expert care.<br />
                <span className="master-hero-italic">Beautifully personal.</span>
              </h1>

              {/* Poetic Authority Editorial Subtitle */}
              <p className="hero-luxury-subtext">
                Where board-certified dermatological science meets deeply unhurried, bespoke skin and hair restoration.
              </p>

              {/* Action Buttons */}
              <div className="master-hero-actions">
                <button
                  onClick={() => onOpenBookingModal()}
                  className="btn-hero-primary"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => onNavigateToPage('treatments')}
                  className="btn-hero-secondary"
                >
                  <span>Explore Treatments</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Elevated Luxury Metric Capsule */}
              <div className="hero-luxury-metrics-capsule">
                <div className="hero-luxury-metric-item">
                  <span className="hero-metric-gold">45+</span>
                  <span className="hero-metric-label">Years</span>
                </div>
                <span className="hero-metric-sep">|</span>
                <div className="hero-luxury-metric-item">
                  <span className="hero-metric-gold">10K+</span>
                  <span className="hero-metric-label">Patients</span>
                </div>
                <span className="hero-metric-sep">|</span>
                <div className="hero-luxury-metric-item">
                  <span className="hero-metric-gold">2</span>
                  <span className="hero-metric-label">Locations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. FEATURE RIBBON STRIP (5 Pillars)
          ================================================================= */}
      <section className="master-ribbon-strip">
        <div className="container master-ribbon-container">
          <div className="master-ribbon-items-row">
            <div className="master-ribbon-item">
              <div className="master-ribbon-icon-circle">
                <UserCheck size={16} />
              </div>
              <span className="master-ribbon-label">Expert Dermatologists</span>
            </div>

            <div className="master-ribbon-item">
              <div className="master-ribbon-icon-circle">
                <Heart size={16} />
              </div>
              <span className="master-ribbon-label">Personalised Treatment Plans</span>
            </div>

            <div className="master-ribbon-item">
              <div className="master-ribbon-icon-circle">
                <Sparkles size={16} />
              </div>
              <span className="master-ribbon-label">Advanced Technology</span>
            </div>

            <div className="master-ribbon-item">
              <div className="master-ribbon-icon-circle">
                <ShieldCheck size={16} />
              </div>
              <span className="master-ribbon-label">Safe &amp; Effective Treatments</span>
            </div>

            <div className="master-ribbon-item">
              <div className="master-ribbon-icon-circle">
                <Flower2 size={16} />
              </div>
              <span className="master-ribbon-label">Compassionate Patient Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. HERITAGE & CLINICAL MASTERY (Providing Best Skin and Hair Care Services – ISO Certified)
          ================================================================= */}
      <section className="heritage-mastery-section">
        <div className="container">
          <div className="heritage-mastery-grid">
            {/* Left: Clinic Reception Image with Offset Decorative Outline Frame (DSC09955-scaled-880x952.jpg) */}
            <div className="reveal reveal-left">
              <div className="heritage-photo-wrap">
                {/* Photo Frame containing the reception desk photo */}
                <div className="heritage-photo-frame">
                  <img
                    src="/ycdc_reception_desk.png"
                    onError={(e) => { e.currentTarget.src = '/DSC09955-scaled-880x952.jpg'; }}
                    alt="Dr. Yogiraj Centre for Dermatology &amp; Cosmetology Reception Desk"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Right: Heritage & ISO Content */}
            <div className="heritage-content-col reveal reveal-right">
              {/* Decorative flourish line above badge */}
              <svg width="74" height="12" viewBox="0 0 74 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '14px', display: 'block', opacity: 0.85 }}>
                <path d="M1 6C13 1 22 11 37 6C52 1 61 11 73 6" stroke="#B7C3AE" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span className="section-pill-badge" style={{ margin: 0 }}>
                  HERITAGE &amp; CLINICAL MASTERY
                </span>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-soldier-green)',
                  background: '#EEF3EB',
                  border: '1px solid #C8D1C0',
                  borderRadius: '9999px',
                  padding: '5px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ShieldCheck size={14} color="#B49A68" /> YCDC ISO Certified Badge
                </span>
              </div>

              <h2 className="heritage-title">
                Providing Best Skin and Hair Care Services &ndash; ISO Certified
              </h2>

              <div className="heritage-quote-box">
                <p className="heritage-quote-text" style={{ fontSize: '1.08rem' }}>
                  &ldquo;ISO Certified for quality and safety, YCDC meets rigorous international standards, giving you peace of mind along with effective, personalized solutions.&rdquo;
                </p>
              </div>

              <p className="heritage-body-p">
                Our team of expert Dermatologists and Hair Transplant Surgeons specializes in skin rejuvenation, laser treatments, hair restoration, and hair transplant procedures. We work closely with each client to provide customized skin care and hair solutions, helping you achieve healthy, glowing skin and thick, voluminous hair.
              </p>

              <p className="heritage-body-p">
                At YCDC, we bring over 50 years of expertise in advanced skin care and hair treatments, combining experience with innovation to deliver exceptional results. Our clinics in Trivandrum, Kerala, and Bangalore, Karnataka, are equipped with state-of-the-art dermatology and hair restoration technology, ensuring precision, safety, and superior outcomes.
              </p>

              {/* Signature & Membership Badge (Single Line) */}
              <div className="heritage-footer-row">
                <div className="heritage-signature-box">
                  <img
                    src="https://ycdc.in/wp-content/uploads/2025/05/Yogiraj-2.png"
                    onError={(e) => { e.currentTarget.src = '/Yogiraj-2.png'; }}
                    alt="Dr. Yogiraj"
                    className="heritage-signature-img"
                  />
                </div>

                <div className="heritage-badge-info">
                  <strong>
                    <Check size={16} color="#536B4C" /> Over 50 Years of Clinical Expertise
                  </strong>
                  <span className="heritage-badge-subtitle">
                    ISO 9001:2015 Certified &bull; National Dermatological Standards
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. STRUCTURED CLINICAL & AESTHETIC CARE (Given Image 2)
          ================================================================= */}
      <section className="care-categories-section">
        <div className="container">
          <div className="care-categories-header reveal reveal-up">
            <span className="section-pill-badge">
              CARE CATEGORIES
            </span>
            <h2 className="care-categories-title">
              Structured Clinical &amp; Aesthetic Care
            </h2>
            <p className="care-categories-sub">
              Explore our integrated medical specialties. Rather than generic treatment packages, every therapy is formulated after clinical assessment.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="care-tabs-row reveal reveal-up">
            {(Object.keys(CARE_CATEGORIES_DATA) as CareCategory[]).map((catKey) => {
              const cat = CARE_CATEGORIES_DATA[catKey];
              const isActive = activeCareCategory === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setActiveCareCategory(catKey)}
                  className={`care-tab-btn ${isActive ? 'active' : ''}`}
                >
                  {cat.tabLabel}
                </button>
              );
            })}
          </div>

          {/* Active Category Content */}
          <div className="care-content-grid">
            {/* Left: 4 Treatment Cards List */}
            <div className="care-services-list reveal reveal-left">
              {careData.services.map((srv, idx) => (
                <div
                  key={idx}
                  className="care-service-item"
                  onClick={() => onNavigateToPage('treatments')}
                  style={{ cursor: 'pointer' }}
                  title="View procedure details in treatments catalogue"
                >
                  <div style={{ flex: 1 }}>
                    <h4 className="care-service-item-title">{srv.title}</h4>
                    <p className="care-service-item-desc">{srv.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="care-service-badge">{srv.duration}</span>
                    <ChevronRight size={16} style={{ color: '#889988', opacity: 0.8 }} />
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="care-services-actions">
                <button
                  onClick={() => onNavigateToPage('treatments')}
                  className="btn-care-primary"
                >
                  Explore All {careData.tabLabel} Procedures <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right: Visual Protocol Card */}
            <div className="care-preview-card reveal reveal-right">
              <img
                src={careData.protocolImage}
                alt={careData.protocolTitle}
                className="care-preview-img"
              />
              <div className="care-preview-overlay" />
              <div className="care-preview-caption">
                <span className="care-preview-pill">CLINICAL PROTOCOL</span>
                <h3 className="care-preview-title">{careData.protocolTitle}</h3>
                <p className="care-preview-desc">{careData.protocolDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. OUR SPECIALITIES: Skin Care, Hair Care & Aesthetics
          ================================================================= */}
      <section className="master-specialities-section">
        <div className="container">
          <div className="master-specialities-header reveal reveal-up">
            <div style={{ textAlign: 'left' }}>
              <div className="master-section-eyebrow">OUR SPECIALITIES</div>
              <h2 className="master-section-title">
                Complete Care for<br />Your Skin, Hair &amp; Confidence
              </h2>
            </div>

            <div className="master-specialities-header-right">
              <p className="master-specialities-sub">
                From medical dermatology to advanced aesthetics, we offer evidence-based treatments tailored to your unique needs.
              </p>
              <button
                onClick={() => onNavigateToPage('treatments')}
                className="master-view-all-link"
              >
                View All Treatments &rarr;
              </button>
            </div>
          </div>

          {/* 3 Wide Arched Cards */}
          <div className="master-specialities-grid">
            <div
              className="master-spec-card reveal reveal-left"
              onClick={() => onNavigateToPage('treatments')}
            >
              <div className="master-spec-img-wrap">
                <img src="/arched_skin.jpg" alt="Skin Care at YCDC" />
              </div>
              <div className="master-spec-card-content">
                <div style={{ textAlign: 'left' }}>
                  <h3 className="master-spec-card-title">Skin Care</h3>
                  <p className="master-spec-card-desc">Healthy, radiant skin at every stage.</p>
                </div>
                <div className="master-spec-arrow-circle">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            <div
              className="master-spec-card reveal reveal-up"
              onClick={() => onNavigateToPage('treatments')}
            >
              <div className="master-spec-img-wrap">
                <img src="/arched_hair.jpg" alt="Hair Care at YCDC" />
              </div>
              <div className="master-spec-card-content">
                <div style={{ textAlign: 'left' }}>
                  <h3 className="master-spec-card-title">Hair Care</h3>
                  <p className="master-spec-card-desc">Stronger, healthier hair with expert care.</p>
                </div>
                <div className="master-spec-arrow-circle">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            <div
              className="master-spec-card reveal reveal-right"
              onClick={() => onNavigateToPage('treatments')}
            >
              <div className="master-spec-img-wrap">
                <img src="/arched_aesthetics.jpg" alt="Aesthetics at YCDC" />
              </div>
              <div className="master-spec-card-content">
                <div style={{ textAlign: 'left' }}>
                  <h3 className="master-spec-card-title">Aesthetics</h3>
                  <p className="master-spec-card-desc">Enhance. Rejuvenate. Be your best you.</p>
                </div>
                <div className="master-spec-arrow-circle">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          6. THE FOUR STAGES OF PATIENT CARE (Care Journey)
          ================================================================= */}
      <section className="four-stages-section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Ambient Decorative Graphic Orbs */}
        <div className="graphic-orb graphic-orb-gold" style={{ width: '480px', height: '480px', top: '-100px', right: '-100px' }} />
        <div className="graphic-orb graphic-orb-green" style={{ width: '420px', height: '420px', bottom: '-80px', left: '-80px' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="four-stages-grid">
            {/* Left Narrative Column */}
            <div className="four-stages-left reveal reveal-left">
              <span className="section-pill-badge">
                CARE JOURNEY
              </span>
              <h2 className="four-stages-title">
                The Four Stages of Patient Care
              </h2>
              <p className="four-stages-desc">
                We do not apply standard formulas. Every patient&apos;s journey through YCDC follows an orderly, unhurried diagnostic path to identify root causes before initiating treatment.
              </p>

              {/* Quick Stepper Pills */}
              <div className="care-journey-stepper mobile-horizontal-track">
                {PATIENT_CARE_STAGES.map((stage, idx) => {
                  const stageNum = idx + 1;
                  const isActive = activeStage === stageNum;
                  return (
                    <button
                      key={stage.num}
                      type="button"
                      onClick={() => {
                        setActiveStage(stageNum);
                        const el = document.getElementById(`stage-card-${stageNum}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`care-step-pill ${isActive ? 'active' : ''}`}
                    >
                      <span className="step-pill-num">{stage.num}</span>
                      <span className="step-pill-title">{stage.title}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onNavigateToPage('team')}
                className="btn-care-journey"
              >
                <UserCheck size={18} />
                <span>Meet Our Medical Specialists</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Right: 4 Stacked Cards with Scroll Spy & Interactive Highlight */}
            <div className="four-stages-stack reveal-stagger">
              {PATIENT_CARE_STAGES.map((stage, idx) => {
                const stageNum = idx + 1;
                const isActive = activeStage === stageNum;
                return (
                  <div
                    key={stage.num}
                    id={`stage-card-${stageNum}`}
                    data-stage={stageNum}
                    className={`stage-card reveal reveal-up reveal-delay-${stageNum} ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveStage(stageNum)}
                  >
                    <div className="stage-card-header">
                      <div className="stage-card-title-group">
                        <span className="stage-card-num">{stage.num}</span>
                        <h4 className="stage-card-name">{stage.title}</h4>
                      </div>
                      <span className="stage-phase-badge">{stage.tag}</span>
                    </div>

                    <p className="stage-card-text">{stage.desc}</p>

                    <div className="stage-card-highlights">
                      {stage.highlights.map((highlight, hIdx) => (
                        <span key={hIdx} className="stage-highlight-tag">
                          <Check size={13} className="stage-check-icon" />
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          7. REAL PEOPLE. REAL RESULTS. (Stories of Confidence)
          ================================================================= */}
      <section className="master-results-section">
        <div className="container">
          <div className="master-results-header reveal reveal-up">
            <div style={{ textAlign: 'left' }}>
              <div className="master-section-eyebrow">REAL PEOPLE. REAL RESULTS.</div>
              <h2 className="master-section-title">Stories of Confidence</h2>
            </div>
            <button
              onClick={() => onNavigateToPage('before-after')}
              className="master-view-more-link"
            >
              View More Stories &rarr;
            </button>
          </div>

          <div className="master-results-grid">
            {/* Case 1: Acne Before / After Card */}
            <div className="master-ba-card reveal reveal-left">
              <div className="master-ba-images-row">
                <div className="master-ba-img-box">
                  <img src="/acne_before.png" alt="Acne Treatment Before" />
                  <span className="master-ba-badge">Before</span>
                </div>
                <div className="master-ba-img-box">
                  <img src="/acne_after.png" alt="Acne Treatment After" />
                  <span className="master-ba-badge">After</span>
                </div>
              </div>
            </div>

            {/* Case 2: Hair Before / After Card */}
            <div className="master-ba-card reveal reveal-up">
              <div className="master-ba-images-row">
                <div className="master-ba-img-box">
                  <img src="/hair_before.png" alt="Hair Restoration Before" />
                  <span className="master-ba-badge">Before</span>
                </div>
                <div className="master-ba-img-box">
                  <img src="/hair_after.png" alt="Hair Restoration After" />
                  <span className="master-ba-badge">After</span>
                </div>
              </div>
            </div>

            {/* Case 3: What Doctors Say / Clinical Insights */}
            <div className="master-testimonial-card reveal reveal-right" style={{ textAlign: 'left' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B9727B' }}>
                    WHAT DOCTORS SAY
                  </span>
                  <span className="master-testimonial-tag">{currentTestimonial.caseTitle}</span>
                </div>
                <div className="master-testimonial-quote-mark">&ldquo;</div>
                <p className="master-testimonial-quote-text">
                  &ldquo;{currentTestimonial.quote}&rdquo;
                </p>
              </div>

              <div className="master-testimonial-bottom-row">
                <div className="master-testimonial-author-group">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.doctor}
                    className="master-testimonial-avatar"
                  />
                  <div>
                    <h5 className="master-testimonial-name">{currentTestimonial.doctor}</h5>
                    <span style={{ fontSize: '0.76rem', color: '#6C7469', fontWeight: 500 }}>
                      {currentTestimonial.role}
                    </span>
                  </div>
                </div>

                <div className="master-testimonial-nav-arrows">
                  <button
                    onClick={prevTestimonial}
                    className="master-testimonial-nav-btn"
                    aria-label="Previous doctor insight"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="master-testimonial-nav-btn"
                    aria-label="Next doctor insight"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          8. PATIENT STORIES (Trusted by Thousands of Happy Patients)
          ================================================================= */}
      <section className="patient-stories-section" id="patient-stories">
        <div className="container">
          <div className="patient-stories-header reveal reveal-up">
            <div className="patient-stories-header-left">
              <span className="patient-stories-badge">PATIENT STORIES</span>
              <h2 className="patient-stories-title">Trusted by Thousands of Happy Patients</h2>
              <p className="patient-stories-sub">
                Read genuine feedback from patients who experienced transformative skincare and hair treatments at YCDC.
              </p>
            </div>

            <div className="patient-stories-nav-arrows">
              <button
                onClick={() => scrollStories('left')}
                className="patient-stories-nav-btn"
                aria-label="Previous stories"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scrollStories('right')}
                className="patient-stories-nav-btn"
                aria-label="Next stories"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            className="patient-stories-carousel-wrapper"
            onMouseEnter={() => setIsStoriesPaused(true)}
            onMouseLeave={() => setIsStoriesPaused(false)}
            onTouchStart={() => setIsStoriesPaused(true)}
            onTouchEnd={() => setIsStoriesPaused(false)}
          >
            <div className="patient-stories-track" ref={storiesScrollRef}>
              {[...PATIENT_STORIES_DATA, ...PATIENT_STORIES_DATA].map((story, idx) => (
                <div key={`${story.id}-${idx}`} className="patient-story-card">
                  <div className="patient-story-top-row">
                    <div className="patient-story-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} className="patient-story-star" fill="#B9727B" />
                      ))}
                    </div>
                    <span className="patient-story-pill">{story.treatmentTag}</span>
                  </div>

                  <p className="patient-story-quote">
                    &ldquo;{story.quote}&rdquo;
                  </p>

                  <div className="patient-story-divider" />

                  <div className="patient-story-footer">
                    <div className="patient-story-author-col">
                      <span className="patient-story-author">{story.author}</span>
                      <span className="patient-story-location">{story.location}</span>
                    </div>
                    <span className="patient-story-verified">
                      <ShieldCheck size={14} color="#536B4C" />
                      <span>Verified Patient</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          8. CONSULTATION FACILITIES / OUR CENTRES (Given Image 4)
          ================================================================= */}
      <section className="consultation-facilities-section">
        <div className="container">
          <div className="facilities-header reveal reveal-up">
            <span className="section-pill-badge">
              OUR CENTRES
            </span>
            <h2 className="facilities-title">
              Consultation Facilities
            </h2>
            <p className="facilities-sub">
              Visit our established clinical spaces equipped with surgical theatres, laser suites, and private diagnostic chambers.
            </p>
          </div>

          <div className="facilities-grid">
            {/* Center 1: Pattom, Trivandrum */}
            <div className="facility-card reveal reveal-left">
              <div>
                <div className="facility-card-header">
                  <h3 className="facility-card-name">Pattom, Trivandrum</h3>
                  <span className="facility-operating-pill">OPERATING CENTRE</span>
                </div>

                <div className="facility-meta-group">
                  <div className="facility-meta-label">Address</div>
                  <div className="facility-meta-val">
                    Marappalam Road, Opposite IndusInd Bank, Pattom, Thiruvananthapuram, Kerala - 695004
                  </div>
                </div>

                <div className="facility-meta-group">
                  <div className="facility-meta-label">Working Hours</div>
                  <div className="facility-meta-val">
                    Mon - Sat: 9:00 AM - 7:00 PM (Sundays Closed)
                  </div>
                </div>

                <div className="facility-meta-group">
                  <div className="facility-meta-label">Telephone Inquiries</div>
                  <div className="facility-meta-val">
                    <a href="tel:+914713100707" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
                      +91 471 310 0707
                    </a>
                  </div>
                </div>
              </div>

              <div className="facility-actions-row">
                <a
                  href="https://maps.google.com/?q=YCDC+Pattom+Trivandrum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-facility-maps"
                >
                  <MapPin size={15} /> Open Maps
                </a>
                <a
                  href="tel:+914713100707"
                  className="btn-facility-book"
                >
                  <Phone size={14} /> Call Trivandrum
                </a>
              </div>
            </div>

            {/* Center 2: Whitefield, Bangalore */}
            <div className="facility-card reveal reveal-right">
              <div>
                <div className="facility-card-header">
                  <h3 className="facility-card-name">Whitefield, Bangalore</h3>
                  <span className="facility-operating-pill">OPERATING CENTRE</span>
                </div>

                <div className="facility-meta-group">
                  <div className="facility-meta-label">Address</div>
                  <div className="facility-meta-val">
                    4th Floor, Premium Square, Whitefield Main Road, Near ITPL, Bengaluru, Karnataka - 560066
                  </div>
                </div>

                <div className="facility-meta-group">
                  <div className="facility-meta-label">Working Hours</div>
                  <div className="facility-meta-val">
                    Mon - Sat: 9:00 AM - 7:00 PM (Sundays Closed)
                  </div>
                </div>

                <div className="facility-meta-group">
                  <div className="facility-meta-label">Telephone Inquiries</div>
                  <div className="facility-meta-val">
                    <a href="tel:+917593864264" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
                      +91 75938 64264
                    </a>
                  </div>
                </div>
              </div>

              <div className="facility-actions-row">
                <a
                  href="https://maps.google.com/?q=YCDC+Whitefield+Bangalore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-facility-maps"
                >
                  <MapPin size={15} /> Open Maps
                </a>
                <a
                  href="tel:+917593864264"
                  className="btn-facility-book"
                >
                  <Phone size={14} /> Call Whitefield
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          8.5. REMOTE SCREENING: Request Online Virtual Diagnosis
          ================================================================= */}
      <section id="virtual-diagnosis" className="virtual-diagnosis-section">
        <div className="container">
          <div className="virtual-diagnosis-grid">
            {/* Left Narrative Column & 3 Steps */}
            <div className="virtual-diagnosis-left">
              <span className="section-pill-badge virtual-badge">
                REMOTE SCREENING
              </span>

              <h2 className="virtual-diagnosis-title">
                Request Online <br />
                Virtual Diagnosis
              </h2>

              <p className="virtual-diagnosis-subtext">
                Can&apos;t make it to our Bangalore or Trivandrum clinic? YCDC offers a secure, virtual pre-screening consultation.
              </p>

              <div className="virtual-steps-list">
                {/* Step 1 */}
                <div className="virtual-step-item">
                  <div className="virtual-step-icon-box">
                    <FileText size={20} />
                  </div>
                  <div className="virtual-step-text-wrap">
                    <h4 className="virtual-step-title">1. Share Concerns &amp; Symptoms</h4>
                    <p className="virtual-step-desc">
                      Fill out our diagnostic questionnaire regarding skin or hair concerns.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="virtual-step-item">
                  <div className="virtual-step-icon-box">
                    <UploadCloud size={20} />
                  </div>
                  <div className="virtual-step-text-wrap">
                    <h4 className="virtual-step-title">2. Secure Photo Upload</h4>
                    <p className="virtual-step-desc">
                      Upload clear pictures of the affected skin area for dermatologist evaluation.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="virtual-step-item">
                  <div className="virtual-step-icon-box">
                    <Stethoscope size={20} />
                  </div>
                  <div className="virtual-step-text-wrap">
                    <h4 className="virtual-step-title">3. Doctor Review &amp; Treatment Path</h4>
                    <p className="virtual-step-desc">
                      Our specialists review your details and contact you with custom prescriptions or clinic invitation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Virtual Screening Wizard Form */}
            <div className="virtual-diagnosis-card-wrap">
              <ConsultationForm />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          9. FOLLOW OUR JOURNEY (Social & Patient Education Gallery)
          ================================================================= */}
      <section className="follow-journey-section">
        <div className="container">
          <div className="follow-journey-header reveal reveal-up">
            <h2 className="follow-journey-title">
              Follow Our Journey
            </h2>
            <p className="follow-journey-sub">
              Updates, events, patient education and more from YCDC.
            </p>
          </div>

          <div className="journey-cards-grid reveal reveal-up">
            {/* Card 1: Doctor Consultation Office */}
            <a
              href="https://www.instagram.com/ycdc_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="journey-card-item"
              title="Expert Clinical Consultation & Diagnosis"
            >
              <img
                src="/journey_doc_office.jpg"
                alt="YCDC Dermatologist in Consultation"
                className="journey-card-img"
              />
              <div className="journey-card-overlay">
                <div className="journey-card-insta-badge">
                  <Instagram size={17} />
                </div>
              </div>
            </a>

            {/* Card 2: Luxury Reception Lounge */}
            <a
              href="https://www.instagram.com/ycdc_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="journey-card-item"
              title="YCDC Luxury Clinic Lounge"
            >
              <img
                src="/ycdc_reception_lobby.jpg"
                alt="YCDC Clinic Reception Lounge"
                className="journey-card-img"
              />
              <div className="journey-card-overlay">
                <div className="journey-card-insta-badge">
                  <Instagram size={17} />
                </div>
              </div>
            </a>

            {/* Card 3: Advanced Facial Cosmetic Therapy */}
            <a
              href="https://www.instagram.com/ycdc_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="journey-card-item"
              title="Advanced Rejuvenation Treatments"
            >
              <img
                src="/facial_aesthetic_treatment.jpg"
                alt="Cosmetic Skin Treatment"
                className="journey-card-img"
              />
              <div className="journey-card-overlay">
                <div className="journey-card-insta-badge">
                  <Instagram size={17} />
                </div>
              </div>
            </a>

            {/* Card 4: Dr. Maya Senior Specialist */}
            <a
              href="https://www.instagram.com/ycdc_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="journey-card-item"
              title="Medical Leadership & Clinical Team"
            >
              <img
                src="/doctor_maya.png"
                alt="Dr. Maya at YCDC"
                className="journey-card-img"
                style={{ objectPosition: 'top center', backgroundColor: '#F8FAF7' }}
              />
              <div className="journey-card-overlay">
                <div className="journey-card-insta-badge">
                  <Instagram size={17} />
                </div>
              </div>
            </a>

            {/* Card 5: Aesthetic Treatment Suite */}
            <a
              href="https://www.instagram.com/ycdc_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="journey-card-item"
              title="State-of-the-Art Treatment Suites"
            >
              <img
                src="/luxury_treatment_suite.jpg"
                alt="YCDC Treatment Suite"
                className="journey-card-img"
              />
              <div className="journey-card-overlay">
                <div className="journey-card-insta-badge">
                  <Instagram size={17} />
                </div>
              </div>
            </a>

            {/* Card 6: Radiant Skin Petals */}
            <a
              href="https://www.instagram.com/ycdc_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="journey-card-item"
              title="Healthy Skin, Happier You"
            >
              <img
                src="/banner_radiant_skin.jpg"
                alt="Radiant Skin Patient Care"
                className="journey-card-img"
              />
              <div className="journey-card-overlay">
                <div className="journey-card-insta-badge">
                  <Instagram size={17} />
                </div>
              </div>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="follow-journey-actions reveal reveal-up">
            <a
              href="https://www.instagram.com/ycdc_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-journey-instagram"
            >
              <Instagram size={17} /> Follow Us on Instagram &rarr;
            </a>

            <button
              type="button"
              onClick={() => onNavigateToPage('gallery')}
              className="btn-journey-more"
            >
              View More Posts
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
