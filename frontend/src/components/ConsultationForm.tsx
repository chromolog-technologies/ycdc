import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  ShieldCheck, 
  Trash2, 
  FileText, 
  Camera, 
  Lock, 
  CheckCircle,
  Smartphone,
  Mail,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import type { ConsultationFormProps } from '../types';

const BRANCHES = [
  { id: 'trivandrum', name: 'Pattom, Trivandrum' },
  { id: 'bangalore', name: 'Whitefield, Bangalore' }
];

const CONCERN_TYPES = [
  { id: 'acne', name: 'Acne, Pimples & Scars' },
  { id: 'hairfall', name: 'Hair Fall & Thinning' },
  { id: 'aging', name: 'Fine Lines, Wrinkles & Anti-Aging' },
  { id: 'pigmentation', name: 'Pigmentation, Melasma & Dark Spots' },
  { id: 'glow', name: 'Dull Skin & Face Glow' },
  { id: 'general', name: 'General Skin Rashes / Infections' }
];

export default function ConsultationForm({ onSuccessClose }: ConsultationFormProps) {
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState('trivandrum');
  const [concern, setConcern] = useState('acne');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState('');
  
  // File upload simulation states
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consultId, setConsultId] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setFileName(file.name);
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFile(URL.createObjectURL(file));
      }, 1000);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || phone.length < 10) {
      alert('Please fill out patient name and a valid phone number.');
      return;
    }

    setSubmitting(true);
    const branchName = BRANCHES.find(b => b.id === branch)?.name || branch;
    const concernName = CONCERN_TYPES.find(c => c.id === concern)?.name || concern;

    const formData = new FormData();
    formData.append('patient_name', name);
    formData.append('patient_phone', phone);
    formData.append('patient_email', email);
    formData.append('branch', branchName);
    formData.append('type', 'Online Consultation');
    formData.append('concern_type', concernName);
    formData.append('medical_history', history);
    
    if (fileInputRef.current?.files?.[0]) {
      formData.append('photo_attached', fileInputRef.current.files[0]);
    }

    fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          setConsultId(`CONS-${data.lead.id}`);
          setIsSubmitted(true);
        } else {
          alert(data.message || 'Error submitting consultation assessment.');
        }
      })
      .catch(err => {
        console.error("Error submitting assessment:", err);
        setSubmitting(false);
        alert('Server error occurred. Please try again.');
      });
  };

  if (isSubmitted) {
    return (
      <div className="glass consultation-form-card animate-fade-in" style={{ borderRadius: '12px', textAlign: 'center', border: '1px solid var(--gold-400)' }}>
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
          <CheckCircle size={36} />
        </div>
        <h3 style={{ fontSize: '2rem', color: 'var(--plum-900)' }}>Consultation Requested</h3>
        <p style={{ color: 'var(--muted-charcoal)', marginTop: '8px', maxWidth: '450px', margin: '8px auto 0' }}>
          Your digital assessment has been registered under ID <strong style={{ color: 'var(--plum-800)' }}>{consultId}</strong>. A dermatologist will analyze your details and contact you via Phone/WhatsApp.
        </p>

        <div style={{
          background: '#white',
          border: '1px solid var(--silk-200)',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '400px',
          margin: '24px auto',
          textAlign: 'left',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--deep-olive)', marginBottom: '8px', fontWeight: 'bold' }}>
            <Lock size={14} /> Medical Privacy & Data Confidentiality
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--botanical-ink-muted)' }}>
            Your photos and medical history are encrypted and only accessible by authorized YCDC medical practitioners in accordance with clinical privacy standards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={() => {
              const text = encodeURIComponent(`Hi YCDC, I just submitted an online consultation request. ID: ${consultId}. Name: ${name}. Concern: ${CONCERN_TYPES.find(c => c.id === concern)?.name}.`);
              window.open(`https://wa.me/917593864264?text=${text}`, '_blank');
            }} 
            className="btn btn-accent"
          >
            Connect on WhatsApp
          </button>
          {onSuccessClose && (
            <button onClick={onSuccessClose} className="btn btn-outline" style={{ cursor: 'pointer' }}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="consultation-form-card">
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span className="virtual-screening-pill">
          VIRTUAL SCREENING WIZARD
        </span>
        <h4 className="virtual-wizard-title">
          Online Consultation Request
        </h4>
        <p className="virtual-wizard-desc">
          Follow the steps below to share your concern details and upload pictures.
        </p>
      </div>

      {/* Step Wizard Progress Tracker (4 Dots Matching Reference) */}
      <div className="virtual-wizard-tracker">
        <div className={`wizard-dot ${step >= 1 ? 'active' : ''}`}></div>
        <div className={`wizard-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`wizard-dot ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`wizard-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`wizard-dot ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`wizard-line ${isSubmitted ? 'active' : ''}`}></div>
        <div className={`wizard-dot ${isSubmitted ? 'active' : ''}`}></div>
      </div>

      <div className="form-step-wrapper">
        <div 
          className="form-step-container" 
          style={{ transform: `translateX(-${(step - 1) * 33.333}%)` }}
        >
          {/* STEP 1: BRANCH & CONCERN */}
          <div className={`form-step-slide ${step === 1 ? 'active' : ''}`} style={{ paddingRight: '15px' }}>
            <div className="form-group">
              <label className="form-label">
                <MapPin size={13} /> PREFERRED BRANCH
              </label>
              <select 
                value={branch} 
                onChange={(e) => setBranch(e.target.value)} 
                className="form-select"
              >
                {BRANCHES.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label">
                <Sparkles size={13} /> CONCERN CATEGORY
              </label>
              <select 
                value={concern} 
                onChange={(e) => setConcern(e.target.value)} 
                className="form-select"
              >
                {CONCERN_TYPES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="button" 
              onClick={() => setStep(2)} 
              className="btn-wizard-continue"
            >
              CONTINUE TO CONTACT DETAILS
            </button>
          </div>

          {/* STEP 2: DEMOGRAPHICS */}
          <div className={`form-step-slide ${step === 2 ? 'active' : ''}`} style={{ paddingLeft: '15px', paddingRight: '15px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={12} /> Full Name
              </label>
              <input 
                type="text" 
                placeholder="Patient's Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input" 
                required={step === 2}
              />
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Smartphone size={12} /> Phone Number
              </label>
              <input 
                type="tel" 
                placeholder="10-digit Mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input" 
                pattern="[0-9]{10}"
                required={step === 2}
              />
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} /> Email (Optional)
              </label>
              <input 
                type="email" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input" 
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn-wizard-back" 
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (!name.trim() || !phone.trim() || phone.length < 10) {
                    alert('Please enter patient name and a valid 10-digit phone number.');
                    return;
                  }
                  setStep(3);
                }} 
                className="btn-wizard-continue" 
                style={{ flex: 2, marginTop: 0 }}
              >
                CONTINUE TO SYMPTOMS
              </button>
            </div>
          </div>

          {/* STEP 3: CONCERNS & PHOTO UPLOAD */}
          <div className={`form-step-slide ${step === 3 ? 'active' : ''}`} style={{ paddingLeft: '15px' }}>
            <div className="form-group">
              <label className="form-label">Brief medical history / symptoms</label>
              <textarea 
                placeholder="For example: I have had active acne breakouts for 6 months..."
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="form-textarea"
                style={{ minHeight: '60px' }}
              />
            </div>

            {/* Simulated Image Uploader */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={14} /> Upload Photos (Acne / Hair / Skin spots)
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--gold-400)',
                  borderRadius: '6px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(245, 240, 233, 0.2)',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold-600)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--gold-400)'}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                
                {isUploading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '3px solid var(--gold-300)',
                      borderTop: '3px solid var(--gold-600)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold-600)', fontWeight: '500' }}>Encrypting...</span>
                  </div>
                ) : uploadedFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={20} style={{ color: 'var(--plum-800)' }} />
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '500', display: 'block', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {fileName}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'green' }}>Ready to send</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }} 
                      style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <UploadCloud size={24} style={{ color: 'var(--gold-600)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Choose clinical photo</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--soft-sage-light, rgba(205, 210, 190, 0.25))', borderRadius: '6px', marginBottom: '16px', marginTop: '16px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--deep-olive)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--botanical-ink-muted)', textAlign: 'left', lineHeight: '1.3' }}>
                Secure preliminary screening. Compliant with medical confidentiality &amp; data privacy standards.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="btn-wizard-back" 
                style={{ flex: 1 }}
                disabled={submitting}
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="btn-wizard-continue" 
                style={{ flex: 2, marginTop: 0 }}
              >
                {submitting ? 'Submitting...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
