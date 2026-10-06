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
      <div className="glass consultation-form-card animate-fade-in" style={{ textAlign: 'center' }}>
        <div style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          backgroundColor: 'rgba(35, 61, 50, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          color: '#233D32'
        }}>
          <CheckCircle size={32} />
        </div>
        <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.85rem)', color: 'var(--color-deep-forest)', marginBottom: '8px', fontWeight: 600 }}>
          Consultation Requested
        </h3>
        <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 16px', lineHeight: 1.55 }}>
          Your digital assessment has been registered under ID <strong style={{ color: 'var(--color-deep-forest)' }}>{consultId}</strong>. A dermatologist will analyze your details and contact you via Phone/WhatsApp.
        </p>

        <div style={{
          background: '#ffffff',
          border: '1px solid var(--color-rose-quartz-border)',
          borderRadius: '12px',
          padding: '16px',
          maxWidth: '380px',
          margin: '18px auto',
          textAlign: 'left',
          fontSize: '0.85rem',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-deep-forest)', marginBottom: '6px', fontWeight: 'bold' }}>
            <Lock size={14} /> Medical Privacy &amp; Data Confidentiality
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.45 }}>
            Your photos and medical history are encrypted and only accessible by authorized YCDC medical practitioners in accordance with clinical privacy standards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '18px' }}>
          <button 
            onClick={() => {
              const text = encodeURIComponent(`Hi YCDC, I just submitted an online consultation request. ID: ${consultId}. Name: ${name}. Concern: ${CONCERN_TYPES.find(c => c.id === concern)?.name}.`);
              window.open(`https://wa.me/917593864264?text=${text}`, '_blank');
            }} 
            className="btn-wizard-continue btn-wizard-submit"
            style={{ width: 'auto', padding: '12px 22px' }}
          >
            Connect on WhatsApp
          </button>
          {onSuccessClose && (
            <button 
              onClick={onSuccessClose} 
              className="btn-wizard-back" 
              style={{ width: 'auto', padding: '12px 20px' }}
            >
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
        {/* STEP 1: BRANCH & CONCERN */}
        {step === 1 && (
          <div className="form-step-slide active animate-fade-in">
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

            <div className="form-group">
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
              Continue to Contact Details &rarr;
            </button>
          </div>
        )}

        {/* STEP 2: DEMOGRAPHICS */}
        {step === 2 && (
          <div className="form-step-slide active animate-fade-in">
            <div className="form-group">
              <label className="form-label">
                <User size={12} /> Full Name *
              </label>
              <input 
                type="text" 
                placeholder="Patient's Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input" 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Smartphone size={12} /> Phone Number *
              </label>
              <input 
                type="tel" 
                placeholder="10-digit Mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className="form-input" 
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
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

            <div className="wizard-actions-row">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn-wizard-back" 
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
              >
                Continue to Symptoms &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONCERNS & PHOTO UPLOAD */}
        {step === 3 && (
          <div className="form-step-slide active animate-fade-in">
            <div className="form-group">
              <label className="form-label">Brief medical history / symptoms</label>
              <textarea 
                placeholder="For example: I have had active acne breakouts for 6 months..."
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="form-textarea"
                style={{ minHeight: '68px' }}
              />
            </div>

            {/* Simulated Image Uploader */}
            <div className="form-group">
              <label className="form-label">
                <Camera size={14} /> Upload Photos (Acne / Hair / Skin spots)
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="photo-uploader-box"
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
                      aria-label="Remove uploaded file"
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

            <div className="wizard-compliance-badge">
              <ShieldCheck size={18} style={{ color: 'var(--deep-olive)', flexShrink: 0 }} />
              <span>
                Secure preliminary screening. Compliant with medical confidentiality &amp; data privacy standards.
              </span>
            </div>

            <div className="wizard-actions-row">
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="btn-wizard-back" 
                disabled={submitting}
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="btn-wizard-continue btn-wizard-submit"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
