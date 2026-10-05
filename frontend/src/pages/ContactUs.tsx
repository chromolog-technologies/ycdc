import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ContactUs() {
  const [branch, setBranch] = useState('trivandrum');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('skin');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || phone.length < 10) {
      alert('Please fill in valid contact details.');
      return;
    }

    setSubmitting(true);
    const branchName = branch === 'bangalore' ? 'Whitefield, Bangalore' : 'Pattom, Trivandrum';
    const catName = category === 'skin' ? 'Skin Care' : category === 'hair' ? 'Hair & Scalp' : category === 'laser' ? 'Laser & RF' : 'Cosmetic Aesthetics';

    fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: name,
        patient_phone: phone,
        patient_email: email,
        branch: branchName,
        type: 'Contact',
        concern_type: `Inquiry: ${catName}`,
        medical_history: message || 'General inquiry regarding clinic services.'
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          setIsSuccess(true);
          setName('');
          setPhone('');
          setEmail('');
          setMessage('');
        } else {
          alert(data.message || 'Error submitting message.');
        }
      })
      .catch(err => {
        console.error("Error submitting contact:", err);
        setSubmitting(false);
        alert('Server error occurred. Please try again.');
      });
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--silk-100)', paddingBottom: '60px' }}>
      {/* Page Header */}
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
            Get In Touch
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: '#ffffff', fontSize: '3rem', marginBottom: '20px', fontWeight: 600 }}>
            Contact YCDC Clinics
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', color: 'rgba(255, 255, 255, 0.92)', fontSize: '1.15rem', lineHeight: '1.7' }}>
            Have questions about a treatment or need scheduling support? Connect with our Whitefield or Pattom branches directly.
          </p>
        </div>
      </section>

      {/* Split Form & Details Grid */}
      <section className="section-padding" style={{ padding: '60px 0' }}>
        <div className="container consultation-layout">
          {/* Contact Form */}
          <div className="glass" style={{ padding: '40px', borderRadius: '16px', background: 'white', border: '1px solid var(--silk-200)', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#233D32', marginBottom: '8px', fontWeight: 600 }}>
              Send a Direct Message
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted-charcoal)', marginBottom: '24px' }}>
              Our medical receptionists will review your message and contact you within 2 business hours.
            </p>

            {isSuccess ? (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ color: '#233D32', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <CheckCircle2 size={56} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', color: '#233D32', fontSize: '1.6rem', marginBottom: '8px', fontWeight: 600 }}>
                  Message Sent Successfully!
                </h4>
                <p style={{ color: 'var(--muted-charcoal)', fontSize: '0.95rem', marginBottom: '24px' }}>
                  Thank you for contacting YCDC. We have registered your enquiry and will connect with you shortly.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)} 
                  className="btn btn-outline" 
                  style={{ padding: '10px 24px', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Branch</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ 
                      flex: 1, 
                      padding: '14px 16px', 
                      borderRadius: '10px', 
                      border: branch === 'trivandrum' ? '2px solid #233D32' : '1.5px solid #E2DCD2', 
                      backgroundColor: branch === 'trivandrum' ? 'rgba(35, 61, 50, 0.08)' : 'white', 
                      color: branch === 'trivandrum' ? '#233D32' : '#565F55',
                      cursor: 'pointer', 
                      textAlign: 'center', 
                      fontWeight: branch === 'trivandrum' ? '700' : '500', 
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      boxShadow: branch === 'trivandrum' ? '0 2px 8px rgba(35, 61, 50, 0.12)' : 'none'
                    }}>
                      <input type="radio" name="branch" value="trivandrum" checked={branch === 'trivandrum'} onChange={() => setBranch('trivandrum')} style={{ display: 'none' }} />
                      Pattom, Trivandrum
                    </label>
                    <label style={{ 
                      flex: 1, 
                      padding: '14px 16px', 
                      borderRadius: '10px', 
                      border: branch === 'bangalore' ? '2px solid #233D32' : '1.5px solid #E2DCD2', 
                      backgroundColor: branch === 'bangalore' ? 'rgba(35, 61, 50, 0.08)' : 'white', 
                      color: branch === 'bangalore' ? '#233D32' : '#565F55',
                      cursor: 'pointer', 
                      textAlign: 'center', 
                      fontWeight: branch === 'bangalore' ? '700' : '500', 
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      boxShadow: branch === 'bangalore' ? '0 2px 8px rgba(35, 61, 50, 0.12)' : 'none'
                    }}>
                      <input type="radio" name="branch" value="bangalore" checked={branch === 'bangalore'} onChange={() => setBranch('bangalore')} style={{ display: 'none' }} />
                      Whitefield, Bangalore
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="form-input" 
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="10-digit number" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="form-input" 
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      pattern="[0-9]{10}" 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="form-input" 
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Treatment Area of Interest</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="form-select"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="skin">Clinical Dermatology (Skin/Acne)</option>
                    <option value="hair">Hair & Scalp Care (PRP/FUE)</option>
                    <option value="laser">Laser & RF Rejuvenation</option>
                    <option value="aesthetics">Cosmetic Injections & Aesthetics</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Your Message / Inquiry Details</label>
                  <textarea 
                    placeholder="Write your questions or describe your concerns here..." 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    className="form-textarea" 
                    style={{ width: '100%', boxSizing: 'border-box', minHeight: '120px' }}
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn btn-primary" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    padding: '14px 28px', 
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: '8px'
                  }}
                >
                  {submitting ? 'Sending...' : 'Send Message'} <Send size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'left' }}>
            {/* Pattom branch details */}
            <div className="glass" style={{ padding: '32px', borderRadius: '16px', background: 'white', border: '1px solid var(--silk-200)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#233D32', fontWeight: 600 }}>Pattom, Trivandrum</h4>
                <span className="badge badge-premium" style={{ fontSize: '0.7rem' }}>Active Center</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <MapPin size={18} style={{ color: '#233D32', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#242923', lineHeight: '1.5' }}>Marappalam Road, Opposite IndusInd Bank, Pattom, Thiruvananthapuram - 695004</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Phone size={18} style={{ color: '#233D32', flexShrink: 0 }} />
                  <a href="tel:+914713100707" style={{ color: '#233D32', fontWeight: 'bold' }}>+91 471 310 0707</a>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Mail size={18} style={{ color: '#233D32', flexShrink: 0 }} />
                  <a href="mailto:trivandrum@ycdcdermatology.com" style={{ color: '#233D32', textDecoration: 'none' }}>trivandrum@ycdcdermatology.com</a>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Clock size={18} style={{ color: '#233D32', flexShrink: 0 }} />
                  <span style={{ color: '#565F55' }}>Mon - Sat: 9:00 AM - 7:00 PM (Sunday Closed)</span>
                </div>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #EFE9DF' }}>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#B49A68', fontWeight: 'bold', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Open Trivandrum Map Navigation &rarr;
                </a>
              </div>
            </div>

            {/* Whitefield branch details */}
            <div className="glass" style={{ padding: '32px', borderRadius: '16px', background: 'white', border: '1px solid var(--silk-200)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#233D32', fontWeight: 600 }}>Whitefield, Bangalore</h4>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Main Clinic</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <MapPin size={18} style={{ color: '#233D32', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#242923', lineHeight: '1.5' }}>4th Floor, Premium Square, Whitefield Main Road, Near ITPL, Bengaluru - 560066</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Phone size={18} style={{ color: '#233D32', flexShrink: 0 }} />
                  <a href="tel:+917593864264" style={{ color: '#233D32', fontWeight: 'bold' }}>+91 75938 64264</a>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Mail size={18} style={{ color: '#233D32', flexShrink: 0 }} />
                  <a href="mailto:info@ycdcdermatology.com" style={{ color: '#233D32', textDecoration: 'none' }}>info@ycdcdermatology.com</a>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Clock size={18} style={{ color: '#233D32', flexShrink: 0 }} />
                  <span style={{ color: '#565F55' }}>Mon - Sat: 9:00 AM - 7:00 PM (Sunday Closed)</span>
                </div>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #EFE9DF' }}>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#B49A68', fontWeight: 'bold', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Open Bangalore Map Navigation &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
