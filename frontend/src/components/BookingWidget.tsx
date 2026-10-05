import React, { useEffect } from 'react';
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  User, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  X,
  Smartphone,
  Mail,
  UserCheck
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  nextBookingStep,
  previousBookingStep,
  resetBookingForm,
  setBookingField,
  setBookingSelection,
  setBookingSubmitting,
  setBookingSuccess
} from '../store/bookingSlice';
import type { BookingWidgetProps } from '../types';

const BRANCHES = [
  { id: 'trivandrum', name: 'Pattom, Trivandrum', address: 'Marappalam Road, Opp. IndusInd Bank, Pattom' },
  { id: 'bangalore', name: 'Whitefield, Bangalore', address: '4th Floor, Premium Square, Whitefield Main Road' }
];

const CATEGORIES = [
  { 
    id: 'skin', 
    name: 'Skin Care', 
    services: [
      { id: 'acne-therapy', name: 'Advanced Anti-Acne Therapy', price: '₹1,800 - ₹3,500' },
      { id: 'peels', name: 'Premium Chemical Peels', price: '₹2,500 - ₹5,000' },
      { id: 'microderm', name: 'Microdermabrasion & Polish', price: '₹3,000' }
    ] 
  },
  { 
    id: 'hair', 
    name: 'Hair & Scalp', 
    services: [
      { id: 'prp', name: 'PRP Hair Growth Therapy', price: '₹4,500/session' },
      { id: 'transplant', name: 'Follicular Hair Transplant Consultation', price: '₹500 (Consultation)' },
      { id: 'scalp-regen', name: 'Scalp Rejuvenation Treatment', price: '₹3,200' }
    ] 
  },
  { 
    id: 'laser', 
    name: 'Laser & RF', 
    services: [
      { id: 'secret-rf', name: 'Secret RF Microneedling (Scar/Aging)', price: '₹8,000 - ₹12,000' },
      { id: 'hair-reduction', name: 'Laser Hair Reduction (Full Face)', price: '₹4,000' },
      { id: 'q-switch', name: 'Q-Switched Laser (Pigment/Tattoo)', price: '₹5,000 - ₹9,000' }
    ] 
  },
  { 
    id: 'aesthetics', 
    name: 'Cosmetic Aesthetics', 
    services: [
      { id: 'botox', name: 'Anti-Wrinkle Botox & Dermal Fillers', price: 'Price on Consultation' },
      { id: 'hydrafacial', name: 'Luxurious Hydrafacial Medi-Facial', price: '₹5,500' },
      { id: 'carbon-peel', name: 'Hollywood Carbon Laser Glow Peel', price: '₹4,500' }
    ] 
  }
];

const DOCTORS = [
  { id: 'yogiraj', name: 'Dr. K. Yogiraj', role: 'Chairman & Director', branches: ['bangalore', 'trivandrum'], specialty: ['skin', 'hair', 'laser', 'aesthetics'] },
  { id: 'niranjana', name: 'Dr. Niranjana Raj', role: 'Chief Dermatologist', branches: ['bangalore'], specialty: ['skin', 'laser', 'aesthetics'] },
  { id: 'yasmin', name: 'Dr. Yasmin Abdul Rahman', role: 'Senior Cosmetic Dermatologist', branches: ['bangalore'], specialty: ['skin', 'aesthetics'] },
  { id: 'vennela', name: 'Dr. Vennela Reddy', role: 'Hair Transplant Specialist', branches: ['bangalore'], specialty: ['hair'] },
  { id: 'maya', name: 'Dr. Maya Vincent', role: 'Senior Consultant Dermatologist', branches: ['trivandrum'], specialty: ['skin', 'laser'] },
  { id: 'devi', name: 'Dr. Devi Menon', role: 'Dermatologist & Trichologist', branches: ['trivandrum'], specialty: ['skin', 'hair'] },
  { id: 'sunil', name: 'Dr. Sunil Menon', role: 'Aesthetic Surgeon', branches: ['trivandrum'], specialty: ['aesthetics', 'laser'] }
];



export default function BookingWidget({ onClose, initialBranch, initialCategory, initialService }: BookingWidgetProps) {
  const dispatch = useAppDispatch();
  const {
    step,
    branch,
    category,
    service,
    doctor,
    date,
    patientName,
    patientPhone,
    patientEmail,
    patientNotes,
    bookingId,
    isSuccess,
    submitting
  } = useAppSelector((state) => state.booking);
  const timeSlot = 'Flexible';

  useEffect(() => {
    const categoryValue = initialCategory || 'skin';
    const defaultService = CATEGORIES.find(c => c.id === categoryValue)?.services[0]?.id || 'acne-therapy';

    dispatch(resetBookingForm({
      step: 1,
      branch: initialBranch || 'trivandrum',
      category: categoryValue,
      service: initialService || defaultService
    }));
  }, [dispatch, initialBranch, initialCategory, initialService]);

  // Filtered lists
  const availableServices = CATEGORIES.find(c => c.id === category)?.services || [];
  const availableDoctors = DOCTORS.filter(d => 
    d.branches.includes(branch) && d.specialty.includes(category)
  );

  // Auto select service when category changes
  const handleCategoryChange = (catId: string) => {
    const services = CATEGORIES.find(c => c.id === catId)?.services || [];
    const nextService = services.length > 0 ? services[0].id : service;
    if (services.length > 0) {
      dispatch(setBookingSelection({ service: nextService }));
    }
    // Update doctor filter based on branch and new category
    const docs = DOCTORS.filter(d => d.branches.includes(branch) && d.specialty.includes(catId));
    const nextDoctor = docs.length > 0 ? docs[0].id : 'yogiraj';
    if (docs.length > 0) {
      dispatch(setBookingSelection({ category: catId, service: nextService, doctor: nextDoctor }));
    } else {
      dispatch(setBookingSelection({ category: catId, service: nextService, doctor: 'yogiraj' }));
    }
  };

  const handleNext = () => {
    if (step === 3) {
      // Validate date
      if (!date) {
        alert('Please select a preferred date.');
        return;
      }
    }
    if (step === 4) {
      // Validate patient details
      if (!patientName.trim()) {
        alert('Please enter patient name.');
        return;
      }
      if (!patientPhone.trim() || patientPhone.length < 10) {
        alert('Please enter a valid phone number.');
        return;
      }
    }
    dispatch(nextBookingStep());
  };

  const handleBack = () => {
    dispatch(previousBookingStep());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || patientPhone.length < 10) {
      alert('Please fill out patient name and a valid phone number.');
      return;
    }

    dispatch(setBookingSubmitting(true));
    const branchName = BRANCHES.find(b => b.id === branch)?.name || branch;
    const servName = availableServices.find(s => s.id === service)?.name || service;
    const docName = DOCTORS.find(d => d.id === doctor)?.name || doctor;

    fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_email: patientEmail,
        branch: branchName,
        type: 'Appointment',
        service_requested: servName,
        doctor_requested: docName,
        preferred_date: date,
        preferred_time: timeSlot,
        medical_history: patientNotes
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(setBookingSuccess(`YCDC-${data.lead.id}`));
        } else {
          dispatch(setBookingSubmitting(false));
          alert(data.message || 'Error creating appointment reservation.');
        }
      })
      .catch(err => {
        console.error("Error creating booking:", err);
        dispatch(setBookingSubmitting(false));
        alert('Server error occurred. Please try again.');
      });
  };

  // Get tomorrow's date for date picker min value
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  if (isSuccess) {
    const branchDetail = BRANCHES.find(b => b.id === branch);
    const selectedService = availableServices.find(s => s.id === service);
    const selectedDoctor = DOCTORS.find(d => d.id === doctor);

    return (
      <div className="glass animate-fade-in" style={{ padding: '40px', borderRadius: '12px', border: '1px solid var(--gold-400)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--gold-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--gold-600)'
          }}>
            <UserCheck size={36} />
          </div>
          <h3 style={{ fontSize: '2rem', color: 'var(--plum-900)' }}>Appointment Confirmed</h3>
          <p style={{ color: 'var(--muted-charcoal)', marginTop: '8px' }}>Your premium consultation slot has been reserved.</p>
        </div>

        {/* Elegant Receipt */}
        <div style={{
          background: '#fff',
          border: '1px dashed var(--gold-500)',
          borderRadius: '8px',
          padding: '24px',
          fontFamily: 'var(--font-sans)',
          marginBottom: '30px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0edf0', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receipt ID</span>
              <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--plum-900)' }}>{bookingId}</h5>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted-charcoal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'green', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'green', display: 'inline-block' }}></span>
                CONFIRMED
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted-charcoal)', fontSize: '0.9rem' }}>Patient Name</span>
              <span style={{ fontWeight: '500', color: 'var(--charcoal)' }}>{patientName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted-charcoal)', fontSize: '0.9rem' }}>Branch Clinic</span>
              <span style={{ fontWeight: '500', color: 'var(--charcoal)' }}>{branchDetail?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted-charcoal)', fontSize: '0.9rem' }}>Specialist Doctor</span>
              <span style={{ fontWeight: '500', color: 'var(--charcoal)' }}>{selectedDoctor?.name} ({selectedDoctor?.role})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted-charcoal)', fontSize: '0.9rem' }}>Treatment</span>
              <span style={{ fontWeight: '500', color: 'var(--charcoal)' }}>{selectedService?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0edf0', paddingTop: '12px', marginTop: '4px' }}>
              <span style={{ color: 'var(--muted-charcoal)', fontSize: '0.9rem' }}>Preferred Date</span>
              <span style={{ fontWeight: '600', color: 'var(--plum-800)' }}>{date}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={() => {
              const text = encodeURIComponent(`Hi, I just booked an appointment at YCDC. Receipt ID: ${bookingId}. Name: ${patientName}. Service: ${selectedService?.name}. Date: ${date} at ${timeSlot}. Please confirm.`);
              window.open(`https://wa.me/917593864264?text=${text}`, '_blank');
            }} 
            className="btn btn-accent"
          >
            Notify via WhatsApp
          </button>
          {onClose && (
            <button onClick={onClose} className="btn btn-outline" style={{ cursor: 'pointer' }}>
              Close Window
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.22)', background: '#ffffff' }}>
      {/* Widget Header */}
      <div 
        className="plum-gradient" 
        style={{ 
          background: 'linear-gradient(135deg, #233D32 0%, #1A2F26 100%)', 
          padding: 'clamp(16px, 3.5vw, 24px) clamp(16px, 4vw, 30px)', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#F3E5AB', fontWeight: 'bold' }}>Interactive Booking System</span>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', color: '#ffffff', marginTop: '4px', fontWeight: 600 }}>Schedule Appointment</h4>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              border: 'none', 
              color: '#ffffff', 
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', height: '4px', backgroundColor: '#E2DCD2' }}>
        <div style={{ 
          width: `${(step / 5) * 100}%`, 
          backgroundColor: '#233D32', 
          transition: 'width 0.4s ease' 
        }} />
      </div>

      {/* Form Steps */}
      <div style={{ padding: 'clamp(20px, 4vw, 32px) clamp(16px, 4vw, 36px)', textAlign: 'left' }}>
        {step === 1 && (
          <div className="animate-fade-in">
            <h5 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#233D32', marginBottom: '16px', fontWeight: 600 }}>
              Step 1: Choose Clinic Location
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {BRANCHES.map((b) => (
                <div 
                  key={b.id}
                  onClick={() => dispatch(setBookingSelection({ branch: b.id }))}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: branch === b.id ? '2px solid #233D32' : '1.5px solid #E2DCD2',
                    backgroundColor: branch === b.id ? 'rgba(35, 61, 50, 0.06)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: branch === b.id ? '0 4px 14px rgba(35, 61, 50, 0.1)' : 'none'
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: branch === b.id ? '#233D32' : '#E2DCD2',
                    color: branch === b.id ? 'white' : '#565F55',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <h6 style={{ fontSize: '1.05rem', fontWeight: '700', color: branch === b.id ? '#233D32' : '#242923', marginBottom: '2px' }}>{b.name}</h6>
                    <p style={{ fontSize: '0.85rem', color: '#565F55', margin: 0 }}>{b.address}</p>
                  </div>
                  {branch === b.id && (
                    <div style={{ color: '#233D32' }}>
                      <Check size={22} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h5 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#233D32', marginBottom: '16px', fontWeight: 600 }}>
              Step 2: Select Specialty & Treatment
            </h5>
            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryChange(c.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: category === c.id ? '2px solid #233D32' : '1.5px solid #E2DCD2',
                      backgroundColor: category === c.id ? '#233D32' : 'white',
                      color: category === c.id ? 'white' : '#242923',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      boxShadow: category === c.id ? '0 4px 12px rgba(35, 61, 50, 0.2)' : 'none'
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Available Treatments</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                {availableServices.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => dispatch(setBookingSelection({ service: s.id }))}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '10px',
                      border: service === s.id ? '2px solid #233D32' : '1.5px solid #E2DCD2',
                      backgroundColor: service === s.id ? 'rgba(35, 61, 50, 0.06)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Sparkles size={16} style={{ color: service === s.id ? '#233D32' : '#B49A68' }} />
                      <span style={{ fontSize: '0.95rem', fontWeight: service === s.id ? '700' : '500', color: service === s.id ? '#233D32' : '#242923' }}>{s.name}</span>
                    </div>
                    {service === s.id && <Check size={18} style={{ color: '#233D32' }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h5 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#233D32', marginBottom: '16px', fontWeight: 600 }}>
              Step 3: Select Doctor & Schedule
            </h5>
            
            <div className="form-group">
              <label className="form-label">Specialist Doctor</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px', marginBottom: '20px' }}>
                {availableDoctors.length > 0 ? (
                  availableDoctors.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => dispatch(setBookingSelection({ doctor: d.id }))}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '10px',
                        border: doctor === d.id ? '2px solid #233D32' : '1.5px solid #E2DCD2',
                        backgroundColor: doctor === d.id ? 'rgba(35, 61, 50, 0.06)' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#233D32',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        <User size={18} />
                      </div>
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: doctor === d.id ? '#233D32' : '#242923' }}>{d.name}</span>
                        <span style={{ fontSize: '0.82rem', color: '#565F55', marginLeft: '8px' }}>({d.role})</span>
                      </div>
                      {doctor === d.id && <Check size={18} style={{ color: '#233D32' }} />}
                    </div>
                  ))
                ) : (
                  <div
                    onClick={() => dispatch(setBookingSelection({ doctor: 'yogiraj' }))}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: '2px solid #233D32',
                      backgroundColor: 'rgba(35, 61, 50, 0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#233D32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} />
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#233D32' }}>Dr. K. Yogiraj</span>
                      <span style={{ fontSize: '0.82rem', color: '#565F55', marginLeft: '8px' }}>(Chairman & Director)</span>
                    </div>
                    <Check size={18} style={{ color: '#233D32' }} />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarIcon size={16} /> Select Date
              </label>
              <input 
                type="date" 
                min={getMinDate()}
                value={date}
                onChange={(e) => dispatch(setBookingField({ field: 'date', value: e.target.value }))}
                className="form-input" 
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h5 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#233D32', marginBottom: '16px', fontWeight: 600 }}>
              Step 4: Contact & Details
            </h5>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter patient's full name"
                value={patientName}
                onChange={(e) => dispatch(setBookingField({ field: 'patientName', value: e.target.value }))}
                className="form-input" 
                style={{ width: '100%', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={16} /> Phone Number
                </label>
                <input 
                  type="tel" 
                  placeholder="10-digit number"
                  value={patientPhone}
                  onChange={(e) => dispatch(setBookingField({ field: 'patientPhone', value: e.target.value }))}
                  className="form-input" 
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={16} /> Email (Optional)
                </label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={patientEmail}
                  onChange={(e) => dispatch(setBookingField({ field: 'patientEmail', value: e.target.value }))}
                  className="form-input" 
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Describe Skin / Hair Concerns</label>
              <textarea 
                placeholder="Mention any symptoms, ongoing medications, or specific details..."
                value={patientNotes}
                onChange={(e) => dispatch(setBookingField({ field: 'patientNotes', value: e.target.value }))}
                className="form-textarea"
                style={{ width: '100%', boxSizing: 'border-box', minHeight: '110px' }}
              />
            </div>
          </div>
        )}

        {/* Step Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: step > 1 ? 'space-between' : 'flex-end', 
          marginTop: '28px', 
          paddingTop: '20px', 
          borderTop: '1px solid #E2DCD2' 
        }}>
          {step > 1 && (
            <button 
              type="button" 
              onClick={handleBack} 
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          
          {step < 4 ? (
            <button 
              type="button" 
              onClick={handleNext} 
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              {submitting ? 'Confirming...' : 'Confirm Reservation'} <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
