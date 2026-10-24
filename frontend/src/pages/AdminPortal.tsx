import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Activity, 
  Image, 
  LogOut, 
  Trash2, 
  Edit, 
  Check, 
  AlertTriangle,
  Lock,
  Mail,
  X,
  Star,
  PlusCircle,
  Video,
  FileSpreadsheet,
  Layers,
  Compass,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { leadService } from '../services/leadService';
import api from '../lib/api';
import { backendAssetUrl } from '../config';

export default function AdminPortal() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem('ycdc_admin_token'));
  const [user, setUser] = useState<any | null>(JSON.parse(localStorage.getItem('ycdc_admin_user') || 'null'));
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active section tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'doctors' | 'testimonials' | 'treatments' | 'gallery' | 'blogs' | 'casestudies' | 'seo'>('dashboard');
  
  // CRM sub-tabs
  const [subCrmTab, setSubCrmTab] = useState<'appointments' | 'screenings' | 'contacts' | 'careers'>('appointments');

  // Data lists
  const [leads, setLeads] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [seoConfigs, setSeoConfigs] = useState<any[]>([]);

  // Selection & Modal states
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadNotes, setLeadNotes] = useState('');

  // Calendar Year & Month (0-indexed)
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedCalDate, setSelectedCalDate] = useState<string | null>(null);

  // CRUD Forms Inline Toggle States
  const [showDocModal, setShowDocModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<any | null>(null); 

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<any | null>(null);

  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState<any | null>(null);

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<any | null>(null);

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<any | null>(null);

  const [showCaseStudyModal, setShowCaseStudyModal] = useState(false);
  const [currentCaseStudy, setCurrentCaseStudy] = useState<any | null>(null);

  const [showSeoModal, setShowSeoModal] = useState(false);
  const [currentSeo, setCurrentSeo] = useState<any | null>(null);

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any | null>(null);

  // File references
  const docImageRef = useRef<HTMLInputElement>(null);
  const galleryThumbRef = useRef<HTMLInputElement>(null);
  const galleryVideoRef = useRef<HTMLInputElement>(null);
  const blogImageRef = useRef<HTMLInputElement>(null);
  const beforeImageRef = useRef<HTMLInputElement>(null);
  const afterImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token, activeTab]);

  const showToastMessage = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const data = await adminService.login({ email, password });
      localStorage.setItem('ycdc_admin_token', data.token);
      localStorage.setItem('ycdc_admin_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      showToastMessage('Successfully logged in!');
    } catch (err: any) {
      console.error(err);
      setLoginError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('ycdc_admin_token');
      localStorage.removeItem('ycdc_admin_user');
      setToken(null);
      setUser(null);
      navigate('/');
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'crm' || activeTab === 'dashboard') {
        setLeads(await adminService.getLeads());
      } 
      
      if (activeTab === 'doctors' || activeTab === 'dashboard') {
        setDoctors(await adminService.getDoctors());
      } 
      
      if (activeTab === 'testimonials' || activeTab === 'dashboard') {
        setTestimonials(await adminService.getTestimonials());
      } 
      
      if (activeTab === 'treatments' || activeTab === 'dashboard') {
        setTreatments(await adminService.getServices());
      } 
      
      if (activeTab === 'gallery' || activeTab === 'dashboard') {
        setGallery(await adminService.getGallery());
      } 
      
      if (activeTab === 'blogs' || activeTab === 'dashboard') {
        setBlogs(await adminService.getBlogs());
      } 
      
      if (activeTab === 'casestudies' || activeTab === 'dashboard') {
        setCaseStudies(await adminService.getCaseStudies());
      } 
      
      if (activeTab === 'seo' || activeTab === 'dashboard') {
        setSeoConfigs(await adminService.getSeo());
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // CRM status/notes updates
  const updateLeadStatus = async (id: number, status: string) => {
    try {
      await leadService.updateLeadStatusAdmin(id, status);
      showToastMessage(`Status updated to ${status}`);
      loadAllData();
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveLeadNotes = async (id: number) => {
    try {
      await leadService.updateLeadNotesAdmin(id, leadNotes);
      showToastMessage('Notes saved successfully');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await leadService.deleteLeadAdmin(id);
      showToastMessage('Lead removed from CRM');
      setSelectedLead(null);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Doctors CRUD
  const saveDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (currentDoc) {
      formData.append('_method', 'PUT');
    }
    try {
      await adminService.submitDoctor(currentDoc ? String(currentDoc.id) : null, formData);
      showToastMessage(currentDoc ? 'Doctor updated!' : 'Doctor added!');
      setShowDocModal(false);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      alert(JSON.stringify(err.response?.data?.errors || err.response?.data?.message || err.message));
    }
  };

  const deleteDoctor = async (id: number) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await adminService.deleteDoctor(id);
      showToastMessage('Doctor deleted');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Testimonials CRUD
  const saveTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      rating: fd.get('rating'),
      text: fd.get('text'),
      treatment: fd.get('treatment'),
      active: fd.get('active') ? 1 : 0
    };

    try {
      await adminService.submitTestimonial(currentTestimonial ? String(currentTestimonial.id) : null, payload);
      showToastMessage(currentTestimonial ? 'Testimonial updated!' : 'Testimonial added!');
      setShowTestimonialModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await adminService.deleteTestimonial(id);
      showToastMessage('Testimonial deleted');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Treatments CRUD
  const saveTreatment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Multipart so the optional treatment image can be uploaded
    const formData = new FormData(e.currentTarget);
    formData.set('active', formData.get('active') ? '1' : '0');
    if (currentTreatment) {
      formData.append('_method', 'PUT');
    }

    try {
      await adminService.submitService(currentTreatment ? String(currentTreatment.id) : null, formData);
      showToastMessage(currentTreatment ? 'Treatment updated!' : 'Treatment added!');
      setShowTreatmentModal(false);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      alert(JSON.stringify(err.response?.data?.errors || err.response?.data?.message || err.message));
    }
  };

  const deleteTreatment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this treatment?')) return;
    try {
      await adminService.deleteService(id);
      showToastMessage('Treatment deleted');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Gallery CRUD
  const saveGallery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (currentGallery) {
      formData.append('_method', 'PUT');
    }
    try {
      await adminService.submitGalleryItem(currentGallery ? String(currentGallery.id) : null, formData);
      showToastMessage(currentGallery ? 'Gallery item updated!' : 'Gallery item added!');
      setShowGalleryModal(false);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      alert(JSON.stringify(err.response?.data?.errors || err.response?.data?.message || err.message));
    }
  };

  const deleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await adminService.deleteGalleryItem(id);
      showToastMessage('Gallery item deleted');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Blogs CRUD
  const saveBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (currentBlog) {
      formData.append('_method', 'PUT');
    }
    try {
      await adminService.submitBlog(currentBlog ? String(currentBlog.id) : null, formData);
      showToastMessage(currentBlog ? 'Blog article updated!' : 'Blog article published!');
      setShowBlogModal(false);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      alert(JSON.stringify(err.response?.data?.errors || err.response?.data?.message || err.message));
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await adminService.deleteBlog(id);
      showToastMessage('Blog post deleted');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Case Studies CRUD
  const saveCaseStudy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (currentCaseStudy) {
      formData.append('_method', 'PUT');
    }
    try {
      await adminService.submitCaseStudy(currentCaseStudy ? String(currentCaseStudy.id) : null, formData);
      showToastMessage(currentCaseStudy ? 'Case Study updated!' : 'Case Study created!');
      setShowCaseStudyModal(false);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      alert(JSON.stringify(err.response?.data?.errors || err.response?.data?.message || err.message));
    }
  };

  const deleteCaseStudy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      await adminService.deleteCaseStudy(id);
      showToastMessage('Case study deleted');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // SEO CRUD
  const saveSeo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get('title'),
      meta_description: fd.get('meta_description'),
      keywords: fd.get('keywords')
    };
    try {
      await adminService.updateSeo(currentSeo.id, payload);
      showToastMessage('SEO settings saved successfully');
      setShowSeoModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Appointment/CRM Lead CRUD
  const saveAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      patient_name: fd.get('patient_name'),
      patient_phone: fd.get('patient_phone'),
      patient_email: fd.get('patient_email'),
      branch: fd.get('branch'),
      type: fd.get('type') || 'Appointment',
      service_requested: fd.get('service_requested'),
      doctor_requested: fd.get('doctor_requested'),
      preferred_date: fd.get('preferred_date'),
      preferred_time: fd.get('preferred_time'),
      concern_type: fd.get('concern_type'),
      medical_history: fd.get('medical_history'),
      notes: fd.get('notes'),
      status: fd.get('status') || 'Pending'
    };

    try {
      let data;
      if (currentAppointment) {
        data = (await api.put(`/admin/leads/${currentAppointment.id}`, payload)).data;
      } else {
        data = (await api.post('/admin/leads', payload)).data;
      }
      showToastMessage(currentAppointment ? 'Appointment updated!' : 'Appointment scheduled!');
      setShowAppointmentModal(false);
      loadAllData();
      if (selectedLead && selectedLead.id === currentAppointment?.id) {
        setSelectedLead(data.data || data.lead);
      }
    } catch (err: any) {
      console.error(err);
      alert(JSON.stringify(err.response?.data?.errors || err.response?.data?.message || err.message));
    }
  };

  const hasPermission = (perm: string) => {
    if (!user) return false;
    if (user.roles.includes('super-admin')) return true;
    return user.permissions.includes(perm);
  };

  const formatBranchName = (b: string) => {
    if (b === 'trivandrum') return 'Pattom, Trivandrum';
    if (b === 'bangalore') return 'Whitefield, Bangalore';
    return 'All Branches (Super Admin)';
  };

  // Leads Sub-filtering
  const filteredLeads = leads.filter(l => {
    if (subCrmTab === 'appointments') {
      return l.type === 'Appointment';
    }
    if (subCrmTab === 'screenings') {
      return l.type === 'Online Consultation';
    }
    if (subCrmTab === 'contacts') {
      return l.type === 'Contact' && l.concern_type !== 'Careers / Job Application';
    }
    if (subCrmTab === 'careers') {
      return l.type === 'Contact' && l.concern_type === 'Careers / Job Application';
    }
    return true;
  });

  // Calculate Monthly Statistics for Charts
  const getDonutChartData = () => {
    const apps = leads.filter(l => l.type === 'Appointment').length;
    const consults = leads.filter(l => l.type === 'Online Consultation').length;
    const contacts = leads.filter(l => l.type === 'Contact' && l.concern_type !== 'Careers / Job Application').length;
    const careers = leads.filter(l => l.concern_type === 'Careers / Job Application').length;
    const total = apps + consults + contacts + careers || 1;

    return {
      apps, consults, contacts, careers,
      appsPct: (apps / total) * 100,
      consultsPct: (consults / total) * 100,
      contactsPct: (contacts / total) * 100,
      careersPct: (careers / total) * 100,
    };
  };

  const getMonthlyTrendData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trend = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = monthNames[d.getMonth()];
      const mVal = d.getMonth();
      const yVal = d.getFullYear();

      const count = leads.filter(l => {
        if (!l.created_at) return false;
        const dateObj = new Date(l.created_at);
        return dateObj.getMonth() === mVal && dateObj.getFullYear() === yVal;
      }).length;

      trend.push({ label: mLabel, count });
    }
    return trend;
  };

  // --- CALENDAR RENDER HELPERS ---
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sun
  };

  const renderCalendarCells = () => {
    const totalDays = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const cells = [];

    // Empty cells for padding
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} style={{ height: '70px', border: '1px solid var(--silk-200)', backgroundColor: 'var(--silk-100)' }} />);
    }

    // Days cells
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = leads.filter(l => l.type === 'Appointment' && l.preferred_date === dateStr);
      const hasAppts = dayAppointments.length > 0;

      cells.push(
        <div 
          key={`day-${day}`}
          onClick={() => dayAppointments.length && setSelectedCalDate(dateStr)}
          style={{
            height: '75px',
            border: '1px solid var(--silk-200)',
            padding: '6px',
            cursor: hasAppts ? 'pointer' : 'default',
            backgroundColor: hasAppts ? 'rgba(92, 26, 68, 0.04)' : 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.2s',
            position: 'relative'
          }}
          className={hasAppts ? 'hover-calendar-card' : ''}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: hasAppts ? 'bold' : 'normal', color: hasAppts ? 'var(--plum-900)' : 'var(--charcoal)' }}>{day}</span>
          {hasAppts && (
            <div style={{
              backgroundColor: 'var(--plum-800)',
              color: 'white',
              fontSize: '0.65rem',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: 'bold',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: 'auto'
            }}
            title={dayAppointments.map(a => a.patient_name).join(', ')}
            >
              👤 {dayAppointments.length === 1 
                ? dayAppointments[0].patient_name 
                : `${dayAppointments[0].patient_name} +${dayAppointments.length - 1}`}
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  const donut = getDonutChartData();
  const monthlyTrend = getMonthlyTrendData();

  // Helper reset functions to close all active forms when changing tabs
  const resetAllForms = () => {
    setShowDocModal(false);
    setShowTestimonialModal(false);
    setShowTreatmentModal(false);
    setShowGalleryModal(false);
    setShowBlogModal(false);
    setShowCaseStudyModal(false);
    setShowSeoModal(false);
    setShowAppointmentModal(false);
    setSelectedLead(null);
  };

  // --- RENDER LOGIN FORM ---
  if (!token || !user) {
    return (
      <div className="plum-gradient" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div className="glass" style={{ width: '100%', maxWidth: '440px', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', color: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span className="badge badge-premium" style={{ backgroundColor: 'var(--gold-600)', color: 'white', borderColor: 'var(--gold-400)' }}>
              YCDC Admin Portal
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'white', marginTop: '12px' }}>
              Management Login
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>
              Access CRM enquiries & clinical resource dashboards
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold-300)', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Mail size={16} style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '14px' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ycdc.com"
                  required
                  style={{ width: '100%', padding: '12px 14px', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold-300)', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Password</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Lock size={16} style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '14px' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '12px 14px', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            {loginError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '4px', color: '#f87171', fontSize: '0.85rem' }}>
                <AlertTriangle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loginLoading}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', marginTop: '10px' }}
            >
              {loginLoading ? 'Signing In...' : 'Verify & Log In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN ADMIN DASHBOARD ---
  return (
    <div style={{ backgroundColor: 'var(--silk-100)', minHeight: '100vh', padding: '40px 0' }}>
      
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--plum-800)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          boxShadow: 'var(--shadow-md)',
          zIndex: 9999,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} style={{ color: 'var(--gold-300)' }} /> {toast}
        </div>
      )}

      <div className="container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
        
        {/* User Status Bar */}
        <div className="glass-dark" style={{ padding: '16px 24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', color: 'white', flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h5 style={{ margin: 0, color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{user.name}</h5>
              <span className="badge badge-plum" style={{ fontSize: '0.65rem', padding: '3px 8px', backgroundColor: 'var(--plum-900)', color: 'var(--gold-300)' }}>
                {user.roles[0].toUpperCase()}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
              Assigned Access Scope: <strong style={{ color: 'white' }}>{formatBranchName(user.branch)}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleLogout}
              className="btn btn-outline-white" 
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Sign Out <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Layout: Sidebar & Content Panel */}
        <div style={{ display: 'flex', gap: '30px', flex: 1, minHeight: 0, alignItems: 'stretch' }}>
          
          {/* Sidebar Menu (Fixed Left) */}
          <div className="glass" style={{ width: '240px', flexShrink: 0, borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--silk-200)', height: '100%', overflowY: 'auto' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted-charcoal)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 12px 4px' }}>Overview</span>
            
            <button 
              onClick={() => { resetAllForms(); setActiveTab('dashboard'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'dashboard' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'dashboard' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <LayoutDashboard size={18} /> Overview Dashboard
            </button>

            <button 
              onClick={() => { resetAllForms(); setActiveTab('crm'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'crm' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'crm' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <FileText size={18} /> Scoped Leads CRM
            </button>

            <span style={{ fontSize: '0.7rem', color: 'var(--muted-charcoal)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '16px 12px 4px' }}>Clinical Resources</span>

            <button 
              onClick={() => { resetAllForms(); setActiveTab('doctors'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'doctors' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'doctors' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <Users size={18} /> Doctors
            </button>

            <button 
              onClick={() => { resetAllForms(); setActiveTab('testimonials'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'testimonials' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'testimonials' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <MessageSquare size={18} /> Testimonials
            </button>

            <button 
              onClick={() => { resetAllForms(); setActiveTab('treatments'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'treatments' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'treatments' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <Activity size={18} /> Treatments (Services)
            </button>

            <button 
              onClick={() => { resetAllForms(); setActiveTab('gallery'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'gallery' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'gallery' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <Image size={18} /> Media Gallery
            </button>

            <span style={{ fontSize: '0.7rem', color: 'var(--muted-charcoal)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '16px 12px 4px' }}>Editorial & Growth</span>

            <button 
              onClick={() => { resetAllForms(); setActiveTab('blogs'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'blogs' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'blogs' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <FileSpreadsheet size={18} /> Blogs Manager
            </button>

            <button 
              onClick={() => { resetAllForms(); setActiveTab('casestudies'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'casestudies' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'casestudies' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <Layers size={18} /> Before & After
            </button>

            <button 
              onClick={() => { resetAllForms(); setActiveTab('seo'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', fontSize: '0.9rem',
                backgroundColor: activeTab === 'seo' ? 'var(--plum-100)' : 'transparent',
                color: activeTab === 'seo' ? 'var(--plum-900)' : 'var(--muted-charcoal)'
              }}
            >
              <Compass size={18} /> SEO Configs
            </button>
          </div>

          {/* Main Content Workspace Panel (Scrollable Right) */}
          <div className="glass" style={{ flex: 1, borderRadius: '12px', border: '1px solid var(--silk-200)', backgroundColor: 'white', padding: '30px', boxShadow: 'var(--shadow-sm)', height: '100%', overflowY: 'auto' }}>
            
            {loading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted-charcoal)' }}>
                <div style={{ border: '3px solid var(--silk-200)', borderTop: '3px solid var(--plum-800)', borderRadius: '50%', width: '40px', height: '40px', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                <p>Loading clinical dashboard data...</p>
              </div>
            ) : (
              <>
                {/* --- 0. OVERVIEW DASHBOARD WORKSPACE --- */}
                {activeTab === 'dashboard' && (
                  <div>
                    {showAppointmentModal ? (
                      // Inline Appointment creation form inside Overview Dashboard
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            Schedule New Appointment
                          </h4>
                          <button onClick={() => setShowAppointmentModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <form onSubmit={saveAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label className="form-label">Patient / Contact Name</label>
                            <input type="text" name="patient_name" required className="form-input" />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Phone Number</label>
                              <input type="text" name="patient_phone" required className="form-input" />
                            </div>
                            <div>
                              <label className="form-label">Email Address</label>
                              <input type="email" name="patient_email" className="form-input" />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Clinic Branch</label>
                              <select name="branch" defaultValue="Pattom, Trivandrum" className="form-select">
                                <option value="Pattom, Trivandrum">Pattom, Trivandrum</option>
                                <option value="Whitefield, Bangalore">Whitefield, Bangalore</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Enquiry Type</label>
                              <select name="type" defaultValue="Appointment" className="form-select">
                                <option value="Appointment">Appointment Slot</option>
                                <option value="Online Consultation">Virtual Screening</option>
                                <option value="Contact">General Contact Message</option>
                              </select>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Service Requested</label>
                              <input type="text" name="service_requested" className="form-input" placeholder="e.g. PRP Hair Growth Therapy" />
                            </div>
                            <div>
                              <label className="form-label">Doctor Requested</label>
                              <input type="text" name="doctor_requested" className="form-input" placeholder="e.g. Dr. Vennela Reddy" />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Preferred Date</label>
                              <input type="date" name="preferred_date" className="form-input" />
                            </div>
                            <div>
                              <label className="form-label">Preferred Time Slot</label>
                              <select name="preferred_time" defaultValue="Flexible" className="form-select">
                                <option value="Flexible">Flexible (Unassigned)</option>
                                <option value="09:00 AM">09:00 AM</option>
                                <option value="09:30 AM">09:30 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="10:30 AM">10:30 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="11:30 AM">11:30 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="12:30 PM">12:30 PM</option>
                                <option value="01:00 PM">01:00 PM</option>
                                <option value="01:30 PM">01:30 PM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="02:30 PM">02:30 PM</option>
                                <option value="03:00 PM">03:00 PM</option>
                                <option value="03:30 PM">03:30 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                                <option value="04:30 PM">04:30 PM</option>
                                <option value="05:00 PM">05:00 PM</option>
                                <option value="05:30 PM">05:30 PM</option>
                                <option value="06:00 PM">06:00 PM</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="form-label">Main Concern / Medical History</label>
                            <textarea name="medical_history" className="form-textarea" rows={3} placeholder="Type symptoms or initial diagnosis remarks..." />
                          </div>
                          <div>
                            <label className="form-label">Internal Follow-up Notes</label>
                            <textarea name="notes" className="form-textarea" rows={2} placeholder="Add clinical follow-up remarks..." />
                          </div>
                          <div>
                            <label className="form-label">Workflow Status</label>
                            <select name="status" defaultValue="Pending" className="form-select">
                              <option value="Pending">Pending Review</option>
                              <option value="Contacted">Contacted / Scheduled</option>
                              <option value="Confirmed">Confirmed (Time Slot Booked)</option>
                              <option value="Closed">Closed / Completed</option>
                            </select>
                          </div>
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Schedule Appointment
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Dashboard Telemetry Summary View
                      <div>
                        <div style={{ marginBottom: '24px' }}>
                          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>Overview Dashboard</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>
                            Live telemetry stats and schedulers for <strong style={{ color: 'var(--plum-800)' }}>{formatBranchName(user.branch)}</strong>
                          </p>
                        </div>

                        {/* KPI Cards Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                          <div className="glass" style={{ padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--plum-800)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--muted-charcoal)', textTransform: 'uppercase' }}>Total Leads Ingested</div>
                            <h4 style={{ fontSize: '2rem', margin: '10px 0 0', fontWeight: 'bold', color: 'var(--plum-900)' }}>{leads.length}</h4>
                          </div>
                          <div className="glass" style={{ padding: '20px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--muted-charcoal)', textTransform: 'uppercase' }}>Confirmed Appts</div>
                            <h4 style={{ fontSize: '2rem', margin: '10px 0 0', fontWeight: 'bold', color: '#10b981' }}>
                              {leads.filter(l => l.type === 'Appointment' && l.status === 'Confirmed').length}
                            </h4>
                          </div>
                          <div className="glass" style={{ padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--muted-charcoal)', textTransform: 'uppercase' }}>Pending Screenings</div>
                            <h4 style={{ fontSize: '2rem', margin: '10px 0 0', fontWeight: 'bold', color: '#f59e0b' }}>
                              {leads.filter(l => l.type === 'Online Consultation' && l.status === 'Pending').length}
                            </h4>
                          </div>
                          <div className="glass" style={{ padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--muted-charcoal)', textTransform: 'uppercase' }}>Job Applications</div>
                            <h4 style={{ fontSize: '2rem', margin: '10px 0 0', fontWeight: 'bold', color: '#3b82f6' }}>
                              {leads.filter(l => l.concern_type === 'Careers / Job Application').length}
                            </h4>
                          </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="glass" style={{ padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid var(--silk-200)', backgroundColor: 'var(--silk-50)' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--plum-900)', marginBottom: '12px' }}>⚡ Operations Quick Actions</div>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button onClick={() => { resetAllForms(); setShowAppointmentModal(true); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <PlusCircle size={14} /> Add Appointment
                            </button>
                            <button onClick={() => { resetAllForms(); setActiveTab('doctors'); setShowDocModal(true); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <PlusCircle size={14} /> Add Doctor
                            </button>
                            <button onClick={() => { resetAllForms(); setActiveTab('testimonials'); setShowTestimonialModal(true); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <PlusCircle size={14} /> Add Testimonial
                            </button>
                            <button onClick={() => { resetAllForms(); setActiveTab('blogs'); setShowBlogModal(true); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <PlusCircle size={14} /> Publish Blog
                            </button>
                            <button onClick={() => { resetAllForms(); setActiveTab('casestudies'); setShowCaseStudyModal(true); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <PlusCircle size={14} /> Add Case Study
                            </button>
                          </div>
                        </div>

                        {/* Charts Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                          <div className="glass" style={{ padding: '24px', borderRadius: '8px', border: '1px solid var(--silk-200)' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--plum-900)', marginBottom: '20px' }}>Enquiry Channel Distribution</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                              <svg width="150" height="150" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
                                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--silk-200)" strokeWidth="4"></circle>
                                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--plum-800)" strokeWidth="4" strokeDasharray={`${donut.appsPct} ${100 - donut.appsPct}`} strokeDashoffset="0"></circle>
                                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray={`${donut.consultsPct} ${100 - donut.consultsPct}`} strokeDashoffset={-donut.appsPct}></circle>
                                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${donut.contactsPct} ${100 - donut.contactsPct}`} strokeDashoffset={-(donut.appsPct + donut.consultsPct)}></circle>
                                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${donut.careersPct} ${100 - donut.careersPct}`} strokeDashoffset={-(donut.appsPct + donut.consultsPct + donut.contactsPct)}></circle>
                              </svg>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--plum-800)' }} />
                                  <span style={{ color: 'var(--charcoal)' }}>Appointments ({donut.apps})</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                  <span style={{ color: 'var(--charcoal)' }}>Virtual Consults ({donut.consults})</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                                  <span style={{ color: 'var(--charcoal)' }}>Contact General ({donut.contacts})</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                                  <span style={{ color: 'var(--charcoal)' }}>Job Applications ({donut.careers})</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="glass" style={{ padding: '24px', borderRadius: '8px', border: '1px solid var(--silk-200)' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--plum-900)', marginBottom: '20px' }}>Monthly Leads Reception Trend</div>
                            <div style={{ height: '150px', position: 'relative' }}>
                              <svg width="100%" height="130" viewBox="0 0 300 100" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--plum-800)" stopOpacity="0.4"/>
                                    <stop offset="100%" stopColor="var(--plum-800)" stopOpacity="0.0"/>
                                  </linearGradient>
                                </defs>
                                <line x1="0" y1="25" x2="300" y2="25" stroke="var(--silk-200)" strokeWidth="0.5" />
                                <line x1="0" y1="50" x2="300" y2="50" stroke="var(--silk-200)" strokeWidth="0.5" />
                                <line x1="0" y1="75" x2="300" y2="75" stroke="var(--silk-200)" strokeWidth="0.5" />
                                <polygon points={`0,100 0,${100 - (monthlyTrend[0]?.count * 10 || 5)} 60,${100 - (monthlyTrend[1]?.count * 10 || 8)} 120,${100 - (monthlyTrend[2]?.count * 10 || 15)} 180,${100 - (monthlyTrend[3]?.count * 10 || 12)} 240,${100 - (monthlyTrend[4]?.count * 10 || 22)} 300,${100 - (monthlyTrend[5]?.count * 10 || 35)} 300,100`} fill="url(#chartGrad)" />
                                <polyline fill="none" stroke="var(--plum-800)" strokeWidth="2.5" points={`0,${100 - (monthlyTrend[0]?.count * 10 || 5)} 60,${100 - (monthlyTrend[1]?.count * 10 || 8)} 120,${100 - (monthlyTrend[2]?.count * 10 || 15)} 180,${100 - (monthlyTrend[3]?.count * 10 || 12)} 240,${100 - (monthlyTrend[4]?.count * 10 || 22)} 300,${100 - (monthlyTrend[5]?.count * 10 || 35)}`} />
                                <circle cx="0" cy={100 - (monthlyTrend[0]?.count * 10 || 5)} r="3.5" fill="var(--plum-900)" stroke="white" strokeWidth="1" />
                                <circle cx="60" cy={100 - (monthlyTrend[1]?.count * 10 || 8)} r="3.5" fill="var(--plum-900)" stroke="white" strokeWidth="1" />
                                <circle cx="120" cy={100 - (monthlyTrend[2]?.count * 10 || 15)} r="3.5" fill="var(--plum-900)" stroke="white" strokeWidth="1" />
                                <circle cx="180" cy={100 - (monthlyTrend[3]?.count * 10 || 12)} r="3.5" fill="var(--plum-900)" stroke="white" strokeWidth="1" />
                                <circle cx="240" cy={100 - (monthlyTrend[4]?.count * 10 || 22)} r="3.5" fill="var(--plum-900)" stroke="white" strokeWidth="1" />
                                <circle cx="300" cy={100 - (monthlyTrend[5]?.count * 10 || 35)} r="3.5" fill="var(--plum-900)" stroke="white" strokeWidth="1" />
                              </svg>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted-charcoal)', marginTop: '8px' }}>
                                {monthlyTrend.map((t, idx) => (
                                  <div key={idx} style={{ textAlign: 'center', width: '50px' }}>
                                    <div>{t.label}</div>
                                    <strong style={{ color: 'var(--plum-900)' }}>{t.count}</strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Calendar */}
                        <div className="glass" style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--silk-200)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '1.2rem' }}>📅</span>
                              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--plum-900)' }}>Clinical Appointment Scheduler</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--plum-800)' }}><ChevronLeft size={20} /></button>
                              <strong style={{ fontSize: '0.95rem', color: 'var(--plum-900)', width: '120px', textAlign: 'center' }}>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calMonth]} {calYear}
                              </strong>
                              <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--plum-800)' }}><ChevronRight size={20} /></button>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--muted-charcoal)', marginBottom: '8px' }}>
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                            {renderCalendarCells()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 1. CRM LEADS WORKSPACE --- */}
                {activeTab === 'crm' && (
                  <div>
                    {showAppointmentModal ? (
                      // Appointment Create/Edit Form (Inline)
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            {currentAppointment ? 'Edit Appointment/Enquiry Details' : 'Schedule New Appointment'}
                          </h4>
                          <button onClick={() => setShowAppointmentModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>

                        <form onSubmit={saveAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label className="form-label">Patient / Contact Name</label>
                            <input type="text" name="patient_name" defaultValue={currentAppointment?.patient_name || ''} required className="form-input" />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Phone Number</label>
                              <input type="text" name="patient_phone" defaultValue={currentAppointment?.patient_phone || ''} required className="form-input" />
                            </div>
                            <div>
                              <label className="form-label">Email Address</label>
                              <input type="email" name="patient_email" defaultValue={currentAppointment?.patient_email || ''} className="form-input" />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Clinic Branch</label>
                              <select name="branch" defaultValue={currentAppointment?.branch || 'Pattom, Trivandrum'} className="form-select">
                                <option value="Pattom, Trivandrum">Pattom, Trivandrum</option>
                                <option value="Whitefield, Bangalore">Whitefield, Bangalore</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Enquiry Type</label>
                              <select name="type" defaultValue={currentAppointment?.type || 'Appointment'} className="form-select">
                                <option value="Appointment">Appointment Slot</option>
                                <option value="Online Consultation">Virtual Screening</option>
                                <option value="Contact">General Contact Message</option>
                              </select>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Service Requested</label>
                              <input type="text" name="service_requested" defaultValue={currentAppointment?.service_requested || ''} className="form-input" placeholder="e.g. PRP Hair Growth Therapy" />
                            </div>
                            <div>
                              <label className="form-label">Doctor Requested</label>
                              <input type="text" name="doctor_requested" defaultValue={currentAppointment?.doctor_requested || ''} className="form-input" placeholder="e.g. Dr. Vennela Reddy" />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Preferred Date</label>
                              <input type="date" name="preferred_date" defaultValue={currentAppointment?.preferred_date || ''} className="form-input" />
                            </div>
                            <div>
                              <label className="form-label">Preferred Time Slot</label>
                              <select name="preferred_time" defaultValue={currentAppointment?.preferred_time || 'Flexible'} className="form-select">
                                <option value="Flexible">Flexible (Unassigned)</option>
                                <option value="09:00 AM">09:00 AM</option>
                                <option value="09:30 AM">09:30 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="10:30 AM">10:30 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="11:30 AM">11:30 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="12:30 PM">12:30 PM</option>
                                <option value="01:00 PM">01:00 PM</option>
                                <option value="01:30 PM">01:30 PM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="02:30 PM">02:30 PM</option>
                                <option value="03:00 PM">03:00 PM</option>
                                <option value="03:30 PM">03:30 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                                <option value="04:30 PM">04:30 PM</option>
                                <option value="05:00 PM">05:00 PM</option>
                                <option value="05:30 PM">05:30 PM</option>
                                <option value="06:00 PM">06:00 PM</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="form-label">Main Concern / Medical History</label>
                            <textarea name="medical_history" defaultValue={currentAppointment?.medical_history || ''} className="form-textarea" rows={3} placeholder="Type symptoms or initial diagnosis remarks..." />
                          </div>
                          <div>
                            <label className="form-label">Internal Follow-up Notes</label>
                            <textarea name="notes" defaultValue={currentAppointment?.notes || ''} className="form-textarea" rows={2} placeholder="Add follow-up notes or internal clinical comments..." />
                          </div>
                          <div>
                            <label className="form-label">Workflow Status</label>
                            <select name="status" defaultValue={currentAppointment?.status || 'Pending'} className="form-select">
                              <option value="Pending">Pending Review</option>
                              <option value="Contacted">Contacted / Scheduled</option>
                              <option value="Confirmed">Confirmed (Time Slot Booked)</option>
                              <option value="Closed">Closed / Completed</option>
                            </select>
                          </div>
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Save Appointment Details
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Leads CRM List View
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>Scoped Lead CRM</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>
                              Filtered inquiries submitted for <strong style={{ color: 'var(--plum-800)' }}>{formatBranchName(user.branch)}</strong>
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={() => { resetAllForms(); setShowAppointmentModal(true); }} 
                              className="btn btn-primary" 
                              style={{ padding: '8px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <PlusCircle size={14} /> Add Appointment
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          {[
                            { id: 'appointments', label: 'Appointments' },
                            { id: 'screenings', label: 'Online Consultations' },
                            { id: 'contacts', label: 'General Enquiries' },
                            { id: 'careers', label: 'Careers (Job Applications)' }
                          ].map((subTab) => (
                            <button
                              key={subTab.id}
                              onClick={() => { setSubCrmTab(subTab.id as any); setSelectedLead(null); }}
                              style={{
                                padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem',
                                backgroundColor: subCrmTab === subTab.id ? 'var(--plum-800)' : 'var(--silk-200)',
                                color: subCrmTab === subTab.id ? 'white' : 'var(--muted-charcoal)',
                                transition: 'var(--transition-fast)'
                              }}
                            >
                              {subTab.label} ({leads.filter(l => {
                                if (subTab.id === 'appointments') return l.type === 'Appointment';
                                if (subTab.id === 'screenings') return l.type === 'Online Consultation';
                                if (subTab.id === 'contacts') return l.type === 'Contact' && l.concern_type !== 'Careers / Job Application';
                                if (subTab.id === 'careers') return l.type === 'Contact' && l.concern_type === 'Careers / Job Application';
                                return false;
                              }).length})
                            </button>
                          ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', alignItems: 'start' }}>
                          <div style={{ borderRight: '1px solid var(--silk-200)', paddingRight: '20px', maxHeight: '550px', overflowY: 'auto' }}>
                            {filteredLeads.length === 0 ? (
                              <p style={{ textAlign: 'center', color: 'var(--muted-charcoal)', padding: '40px 0' }}>No records registered under this category.</p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {filteredLeads.map((l) => (
                                  <div 
                                    key={l.id}
                                    onClick={() => { setSelectedLead(l); setLeadNotes(l.notes || ''); }}
                                    style={{
                                      padding: '16px', borderRadius: '8px', border: '1px solid var(--silk-200)', cursor: 'pointer',
                                      backgroundColor: selectedLead?.id === l.id ? 'var(--silk-200)' : 'white',
                                      transition: 'var(--transition-fast)'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <h6 style={{ margin: 0, fontWeight: 'bold', color: 'var(--plum-900)' }}>{l.patient_name}</h6>
                                      <span style={{
                                        fontSize: '0.7rem', padding: '3px 8px', borderRadius: '30px', fontWeight: 'bold',
                                        backgroundColor: l.status === 'Pending' ? '#fef3c7' : l.status === 'Contacted' ? '#dbeafe' : l.status === 'Confirmed' ? '#dcfce7' : '#f3f4f6',
                                        color: l.status === 'Pending' ? '#b45309' : l.status === 'Contacted' ? '#1d4ed8' : l.status === 'Confirmed' ? '#15803d' : '#374151',
                                      }}>
                                        {l.status}
                                      </span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', margin: '6px 0 0', color: 'var(--muted-charcoal)' }}>
                                      {subCrmTab === 'careers' ? `Experience: ${l.medical_history?.replace('Experience: ', '') || 'N/A'}` : l.service_requested || l.concern_type || 'General enquiry'}
                                    </p>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--muted-charcoal)', marginTop: '4px' }}>Branch: {l.branch}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            {selectedLead ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px' }}>
                                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--plum-900)' }}>
                                    {subCrmTab === 'careers' ? 'Candidate Details' : 'Inquiry Details'}
                                  </h4>
                                  <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                      onClick={() => { setCurrentAppointment(selectedLead); setShowAppointmentModal(true); }} 
                                      style={{ background: 'none', border: 'none', color: 'var(--plum-800)', cursor: 'pointer' }}
                                      title="Edit details"
                                    >
                                      <Edit size={20} />
                                    </button>
                                    <button onClick={() => deleteLead(selectedLead.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete record">
                                      <Trash2 size={20} />
                                    </button>
                                  </div>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                  <tbody>
                                    <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                      <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)', width: '140px' }}>
                                        {subCrmTab === 'careers' ? 'Candidate Name' : 'Patient Name'}
                                      </td>
                                      <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.patient_name}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                      <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Phone Number</td>
                                      <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}><a href={`tel:${selectedLead.patient_phone}`} style={{ textDecoration: 'underline', color: 'var(--plum-800)' }}>{selectedLead.patient_phone}</a></td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                      <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Email Address</td>
                                      <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.patient_email || 'Not provided'}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                      <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Preferred Branch</td>
                                      <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.branch}</td>
                                    </tr>
                                    {subCrmTab === 'appointments' && (
                                      <>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Treatment</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.service_requested || 'N/A'}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Doctor</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.doctor_requested || 'N/A'}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Booking Slot</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.preferred_date} at {selectedLead.preferred_time}</td>
                                        </tr>
                                      </>
                                    )}
                                    {subCrmTab === 'screenings' && (
                                      <>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Concern</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.concern_type || 'N/A'}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>History</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)', whiteSpace: 'pre-wrap' }}>{selectedLead.medical_history || 'N/A'}</td>
                                        </tr>
                                      </>
                                    )}
                                    {subCrmTab === 'contacts' && (
                                      <>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Concern</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.concern_type || 'N/A'}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Message</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)', whiteSpace: 'pre-wrap' }}>{selectedLead.notes || 'N/A'}</td>
                                        </tr>
                                      </>
                                    )}
                                    {subCrmTab === 'careers' && (
                                      <>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Experience</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.medical_history || 'N/A'}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                          <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Remarks</td>
                                          <td style={{ padding: '8px 0', color: 'var(--charcoal)' }}>{selectedLead.notes || 'N/A'}</td>
                                        </tr>
                                      </>
                                    )}
                                    {selectedLead.photo_attached && (
                                      <tr style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                        <td style={{ padding: '8px 0', fontWeight: '600', color: 'var(--muted-charcoal)' }}>Attached File</td>
                                        <td style={{ padding: '8px 0' }}>
                                          <a href={selectedLead.photo_url || backendAssetUrl(`/uploads/leads/${selectedLead.photo_attached}`)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--plum-800)', fontWeight: 'bold', textDecoration: 'underline' }}>View File</a>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>

                                <div>
                                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--plum-900)', display: 'block', marginBottom: '8px' }}>CRM Follow-up Status</label>
                                  <div style={{ display: 'flex', gap: '10px' }}>
                                    {['Pending', 'Contacted', 'Confirmed', 'Closed'].map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => updateLeadStatus(selectedLead.id, s)}
                                        style={{
                                          padding: '8px 12px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--silk-200)',
                                          backgroundColor: selectedLead.status === s ? 'var(--plum-800)' : 'white',
                                          color: selectedLead.status === s ? 'white' : 'var(--muted-charcoal)'
                                        }}
                                      >
                                        {s}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {subCrmTab !== 'contacts' && subCrmTab !== 'careers' && (
                                  <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--plum-900)', display: 'block', marginBottom: '8px' }}>Internal Admin Notes</label>
                                    <textarea
                                      value={leadNotes}
                                      onChange={(e) => setLeadNotes(e.target.value)}
                                      placeholder="Add follow-up notes or internal comments..."
                                      style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '4px', border: '1px solid var(--silk-200)', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                                    />
                                    <button onClick={() => saveLeadNotes(selectedLead.id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '8px' }}>
                                      Save Notes
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-charcoal)' }}>
                                <p>Select an enquiry item from the column on the left to inspect.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 2. DOCTORS DIRECTORY CRUD --- */}
                {activeTab === 'doctors' && (
                  <div>
                    {showDocModal ? (
                      // Inline Doctor form
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            {currentDoc ? 'Edit Doctor Details' : 'Add New Doctor'}
                          </h4>
                          <button onClick={() => setShowDocModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <form onSubmit={saveDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label className="form-label">Doctor Name</label>
                            <input type="text" name="name" defaultValue={currentDoc?.name || ''} required className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">Qualifications</label>
                            <input type="text" name="qualification" defaultValue={currentDoc?.qualification || ''} required className="form-input" placeholder="e.g. MBBS, MD (Dermatology)" />
                          </div>
                          <div>
                            <label className="form-label">Designation / Title</label>
                            <input type="text" name="designation" defaultValue={currentDoc?.designation || ''} className="form-input" placeholder="e.g. Senior Dermatologist" />
                          </div>
                          <div>
                            <label className="form-label">Clinic Branch</label>
                            <select name="branch" defaultValue={currentDoc?.branch || 'trivandrum'} className="form-select">
                              <option value="trivandrum">Pattom Center, Trivandrum</option>
                              <option value="bangalore">Whitefield Center, Bangalore</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Biography Description</label>
                            <textarea name="bio" defaultValue={currentDoc?.bio || ''} className="form-textarea" rows={3} />
                          </div>
                          <div>
                            <label className="form-label">Instagram URL</label>
                            <input type="url" name="instagram_url" defaultValue={currentDoc?.instagram_url || ''} className="form-input" placeholder="https://instagram.com/drname" />
                          </div>
                          <div>
                            <label className="form-label">Profile Image (JPEG/PNG/WEBP)</label>
                            <input type="file" name="image" ref={docImageRef} className="form-input" accept="image/*" />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" name="active" defaultChecked={currentDoc ? currentDoc.active : true} id="doc-active" />
                            <label htmlFor="doc-active" style={{ fontSize: '0.85rem', color: 'var(--charcoal)', cursor: 'pointer' }}>Set as active</label>
                          </div>
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Save Doctor Details
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Doctor List View
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>Doctors Directory</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>Add and manage doctors in Trivandrum or Bangalore clinics</p>
                          </div>
                          {hasPermission('manage-doctors') && (
                            <button onClick={() => { resetAllForms(); setShowDocModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <PlusCircle size={16} /> Add Doctor
                            </button>
                          )}
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--silk-200)', color: 'var(--plum-900)', fontWeight: 'bold' }}>
                              <th style={{ padding: '12px' }}>Photo</th>
                              <th style={{ padding: '12px' }}>Name</th>
                              <th style={{ padding: '12px' }}>Branch</th>
                              <th style={{ padding: '12px' }}>Qualifications</th>
                              <th style={{ padding: '12px' }}>Status</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {doctors.map((doc) => (
                              <tr key={doc.id} style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                <td style={{ padding: '12px' }}>
                                  <img 
                                    src={doc.image_path ? backendAssetUrl(doc.image_path) : '/doctor_yogiraj.png'} 
                                    alt={doc.name} 
                                    style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--silk-200)' }} 
                                  />
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--plum-900)' }}>
                                  {doc.name}
                                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-charcoal)', fontWeight: 'normal' }}>{doc.designation || 'Specialist Consultant'}</div>
                                </td>
                                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{doc.branch}</td>
                                <td style={{ padding: '12px' }}>{doc.qualification}</td>
                                <td style={{ padding: '12px' }}>
                                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '30px', backgroundColor: doc.active ? '#dcfce7' : '#fee2e2', color: doc.active ? '#15803d' : '#b91c1c', fontWeight: 'bold' }}>
                                    {doc.active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => { resetAllForms(); setCurrentDoc(doc); setShowDocModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--plum-800)', cursor: 'pointer' }}><Edit size={16} /></button>
                                    <button onClick={() => deleteDoctor(doc.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 3. TESTIMONIALS CRUD --- */}
                {activeTab === 'testimonials' && (
                  <div>
                    {showTestimonialModal ? (
                      // Inline Testimonial form
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            {currentTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                          </h4>
                          <button onClick={() => setShowTestimonialModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <form onSubmit={saveTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label className="form-label">Client Name</label>
                            <input type="text" name="name" defaultValue={currentTestimonial?.name || ''} required className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">Star Rating (1 - 5)</label>
                            <select name="rating" defaultValue={currentTestimonial?.rating || 5} className="form-select">
                              <option value={5}>5 Stars (Excellent)</option>
                              <option value={4}>4 Stars (Very Good)</option>
                              <option value={3}>3 Stars (Good)</option>
                              <option value={2}>2 Stars (Fair)</option>
                              <option value={1}>1 Star (Poor)</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Treatment/Service Availed</label>
                            <input type="text" name="treatment" defaultValue={currentTestimonial?.treatment || ''} className="form-input" placeholder="e.g. PRP Hair Treatment, Hydrafacial" />
                          </div>
                          <div>
                            <label className="form-label">Review Text</label>
                            <textarea name="text" defaultValue={currentTestimonial?.text || ''} required className="form-textarea" rows={4} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" name="active" defaultChecked={currentTestimonial ? currentTestimonial.active : true} id="t-active" />
                            <label htmlFor="t-active" style={{ fontSize: '0.85rem', color: 'var(--charcoal)', cursor: 'pointer' }}>Publish immediately</label>
                          </div>
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Save Testimonial
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Testimonials List View
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>Client Testimonials</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>Manage client feedback and reviews displayed on homepage</p>
                          </div>
                          {hasPermission('manage-testimonials') && (
                            <button onClick={() => { resetAllForms(); setShowTestimonialModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <PlusCircle size={16} /> Add Testimonial
                            </button>
                          )}
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--silk-200)', color: 'var(--plum-900)', fontWeight: 'bold' }}>
                              <th style={{ padding: '12px' }}>Name</th>
                              <th style={{ padding: '12px' }}>Treatment</th>
                              <th style={{ padding: '12px' }}>Rating</th>
                              <th style={{ padding: '12px' }}>Review Text</th>
                              <th style={{ padding: '12px' }}>Status</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {testimonials.map((t) => (
                              <tr key={t.id} style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--plum-900)' }}>{t.name}</td>
                                <td style={{ padding: '12px' }}>{t.treatment || 'General Care'}</td>
                                <td style={{ padding: '12px' }}>
                                  <div style={{ display: 'flex', gap: '2px', color: '#eab308' }}>
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                      <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                  </div>
                                </td>
                                <td style={{ padding: '12px', fontSize: '0.8rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.text}</td>
                                <td style={{ padding: '12px' }}>
                                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '30px', backgroundColor: t.active ? '#dcfce7' : '#fee2e2', color: t.active ? '#15803d' : '#b91c1c', fontWeight: 'bold' }}>
                                    {t.active ? 'Published' : 'Hidden'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => { resetAllForms(); setCurrentTestimonial(t); setShowTestimonialModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--plum-800)', cursor: 'pointer' }}><Edit size={16} /></button>
                                    <button onClick={() => deleteTestimonial(t.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 4. TREATMENTS (SERVICES) CRUD --- */}
                {activeTab === 'treatments' && (
                  <div>
                    {showTreatmentModal ? (
                      // Inline Treatment Form
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            {currentTreatment ? 'Edit Treatment Details' : 'Add New Clinical Treatment'}
                          </h4>
                          <button onClick={() => setShowTreatmentModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <form onSubmit={saveTreatment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {!currentTreatment && (
                            <div>
                              <label className="form-label">Unique Slug ID (lowercase, hyphenated)</label>
                              <input type="text" name="id" required className="form-input" placeholder="e.g. prp-hair-therapy" />
                            </div>
                          )}
                          {currentTreatment && (
                            <input type="hidden" name="id" value={currentTreatment.id} />
                          )}
                          <div>
                            <label className="form-label">Treatment Name</label>
                            <input type="text" name="name" defaultValue={currentTreatment?.name || ''} required className="form-input" placeholder="e.g. PRP Hair Growth Therapy" />
                          </div>
                          <div>
                            <label className="form-label">Category</label>
                            <select name="category" defaultValue={currentTreatment?.category || 'skin'} className="form-select">
                              <option value="skin">Skin (Clinical Dermatology)</option>
                              <option value="hair">Hair (Hair & Scalp Care)</option>
                              <option value="laser">Laser (FDA Approved Lasers)</option>
                              <option value="aesthetics">Aesthetics (Cosmetic Cosmetology)</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Category Label Tag</label>
                            <input type="text" name="category_name" defaultValue={currentTreatment?.category_name || ''} required className="form-input" placeholder="e.g. Hair & Scalp Restoration" />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="form-label">Clinic Branch</label>
                              <select name="branch" defaultValue={currentTreatment?.branch || 'trivandrum'} className="form-select">
                                <option value="trivandrum">Pattom Center, Trivandrum</option>
                                <option value="bangalore">Whitefield Center, Bangalore</option>
                                <option value="both">Both Branches</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Procedure Type</label>
                              <select name="procedure_type" defaultValue={currentTreatment?.procedure_type || 'cosmetic'} className="form-select">
                                <option value="dermatic">Dermatic (Clinical)</option>
                                <option value="cosmetic">Cosmetic</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="form-label">Procedure Duration</label>
                            <input type="text" name="duration" defaultValue={currentTreatment?.duration || ''} required className="form-input" placeholder="e.g. 45-60 mins" />
                          </div>
                          <div>
                            <label className="form-label">Estimate Price Range</label>
                            <input type="text" name="price_range" defaultValue={currentTreatment?.price_range || ''} required className="form-input" placeholder="e.g. ₹2,500 - ₹5,000" />
                          </div>
                          <div>
                            <label className="form-label">Description overview</label>
                            <textarea name="description" defaultValue={currentTreatment?.description || ''} required className="form-textarea" rows={3} />
                          </div>
                          <div>
                            <label className="form-label">Scientific mechanism / How it works</label>
                            <textarea name="science" defaultValue={currentTreatment?.science || ''} required className="form-textarea" rows={3} />
                          </div>
                          <div>
                            <label className="form-label">What it treats (comma separated symptoms/concerns)</label>
                            <input type="text" name="treats" defaultValue={currentTreatment?.treats || ''} required className="form-input" placeholder="e.g. Hair fall, thinning, androgenetic alopecia" />
                          </div>
                          <div>
                            <label className="form-label">Treatment Image (JPEG/PNG/WEBP, optional)</label>
                            <input type="file" name="image" className="form-input" accept="image/*" />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" name="active" defaultChecked={currentTreatment ? currentTreatment.active : true} id="tr-active" />
                            <label htmlFor="tr-active" style={{ fontSize: '0.85rem', color: 'var(--charcoal)', cursor: 'pointer' }}>Active on site booking options</label>
                          </div>
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Save Treatment Details
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Treatment List View
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>Clinical Treatments</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>Add and edit skin, hair, laser, and cosmetology services</p>
                          </div>
                          {hasPermission('manage-treatments') && (
                            <button onClick={() => { resetAllForms(); setShowTreatmentModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <PlusCircle size={16} /> Add Treatment
                            </button>
                          )}
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--silk-200)', color: 'var(--plum-900)', fontWeight: 'bold' }}>
                              <th style={{ padding: '12px' }}>Name</th>
                              <th style={{ padding: '12px' }}>Category</th>
                              <th style={{ padding: '12px' }}>Duration</th>
                              <th style={{ padding: '12px' }}>Price Range</th>
                              <th style={{ padding: '12px' }}>Status</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {treatments.map((tr) => (
                              <tr key={tr.id} style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--plum-900)' }}>{tr.name}</td>
                                <td style={{ padding: '12px', textTransform: 'capitalize' }}>
                                  {tr.category}
                                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-charcoal)' }}>{tr.category_name}</div>
                                </td>
                                <td style={{ padding: '12px' }}>{tr.duration}</td>
                                <td style={{ padding: '12px' }}>{tr.price_range}</td>
                                <td style={{ padding: '12px' }}>
                                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '30px', backgroundColor: tr.active ? '#dcfce7' : '#fee2e2', color: tr.active ? '#15803d' : '#b91c1c', fontWeight: 'bold' }}>
                                    {tr.active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => { resetAllForms(); setCurrentTreatment(tr); setShowTreatmentModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--plum-800)', cursor: 'pointer' }}><Edit size={16} /></button>
                                    <button onClick={() => deleteTreatment(tr.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 5. MEDIA GALLERY CRUD --- */}
                {activeTab === 'gallery' && (
                  <div>
                    {showGalleryModal ? (
                      // Inline Gallery Form
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            {currentGallery ? 'Edit Gallery Details' : 'Upload New Media'}
                          </h4>
                          <button onClick={() => setShowGalleryModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <form onSubmit={saveGallery} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {!currentGallery && (
                            <div>
                              <label className="form-label">Unique Slug ID (lowercase, hyphenated)</label>
                              <input type="text" name="id" required className="form-input" placeholder="e.g. lobby-trivandrum" />
                            </div>
                          )}
                          {currentGallery && (
                            <input type="hidden" name="id" value={currentGallery.id} />
                          )}
                          <div>
                            <label className="form-label">Media Title</label>
                            <input type="text" name="title" defaultValue={currentGallery?.title || ''} required className="form-input" placeholder="e.g. Main Lobby Reception Area" />
                          </div>
                          <div>
                            <label className="form-label">Media Type</label>
                            <select name="type" defaultValue={currentGallery?.type || 'image'} disabled={!!currentGallery} className="form-select">
                              <option value="image">Image (Photograph)</option>
                              <option value="video">Video (MP4 Clip)</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Category</label>
                            <select name="category" defaultValue={currentGallery?.category || 'infrastructure'} className="form-select">
                              <option value="infrastructure">Infrastructure (Workspaces & Clinics)</option>
                              <option value="treatments">Treatments (Procedures in Action)</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Media Description</label>
                            <textarea name="description" defaultValue={currentGallery?.description || ''} required className="form-textarea" rows={3} />
                          </div>
                          <div>
                            <label className="form-label">Thumbnail Image (JPEG/PNG/WEBP)</label>
                            <input type="file" name="thumbnail" ref={galleryThumbRef} required={!currentGallery} className="form-input" accept="image/*" />
                          </div>
                          {(!currentGallery || currentGallery.type === 'video') && (
                            <div>
                              <label className="form-label">Video Clip (MP4/WebM, Max 10MB)</label>
                              <input type="file" name="video" ref={galleryVideoRef} className="form-input" accept="video/*" />
                            </div>
                          )}
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Save Gallery Media
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Gallery List View
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>Media Gallery</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>Manage photos & videos displayed in clinical workspace gallery</p>
                          </div>
                          {hasPermission('manage-gallery') && (
                            <button onClick={() => { resetAllForms(); setShowGalleryModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <PlusCircle size={16} /> Add Media
                            </button>
                          )}
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--silk-200)', color: 'var(--plum-900)', fontWeight: 'bold' }}>
                              <th style={{ padding: '12px' }}>Thumbnail</th>
                              <th style={{ padding: '12px' }}>Title</th>
                              <th style={{ padding: '12px' }}>Type</th>
                              <th style={{ padding: '12px' }}>Category</th>
                              <th style={{ padding: '12px' }}>Description</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gallery.map((item) => (
                              <tr key={item.id} style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                <td style={{ padding: '12px' }}>
                                  <img 
                                    src={backendAssetUrl(item.thumbnail_path)} 
                                    alt={item.title} 
                                    style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--silk-200)' }} 
                                  />
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--plum-900)' }}>{item.title}</td>
                                <td style={{ padding: '12px', textTransform: 'capitalize' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {item.type === 'video' ? <Video size={14} /> : <Image size={14} />} {item.type}
                                  </span>
                                </td>
                                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{item.category}</td>
                                <td style={{ padding: '12px', fontSize: '0.8rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => { resetAllForms(); setCurrentGallery(item); setShowGalleryModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--plum-800)', cursor: 'pointer' }}><Edit size={16} /></button>
                                    <button onClick={() => deleteGallery(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 6. BLOGS CRUD WORKSPACE --- */}
                {activeTab === 'blogs' && (
                  <div>
                    {showBlogModal ? (
                      // Inline Blog Form
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            {currentBlog ? 'Edit Blog Article' : 'Publish Blog Post'}
                          </h4>
                          <button onClick={() => setShowBlogModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <form onSubmit={saveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {!currentBlog && (
                            <div>
                              <label className="form-label">Unique Slug ID (lowercase, hyphenated)</label>
                              <input type="text" name="id" required className="form-input" placeholder="e.g. hair-fall-prevention-tips" />
                            </div>
                          )}
                          {currentBlog && (
                            <input type="hidden" name="id" value={currentBlog.id} />
                          )}
                          <div>
                            <label className="form-label">Blog Title</label>
                            <input type="text" name="title" defaultValue={currentBlog?.title || ''} required className="form-input" placeholder="e.g. 5 Dermatologist Tips for Healthy Glowing Skin" />
                          </div>
                          <div>
                            <label className="form-label">Author Name</label>
                            <input type="text" name="author" defaultValue={currentBlog?.author || 'Dr. K. Yogiraj & Team'} required className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">Read Time</label>
                            <input type="text" name="read_time" defaultValue={currentBlog?.read_time || '5 min read'} required className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">Category</label>
                            <select name="category" defaultValue={currentBlog?.category || 'skin'} className="form-select">
                              <option value="skin">Skin (Clinical Dermatology)</option>
                              <option value="hair">Hair (Hair & Scalp Care)</option>
                              <option value="anti-aging">Anti-Aging (Anti-Aging Treatments)</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Category Label Tag</label>
                            <input type="text" name="category_label" defaultValue={currentBlog?.category_label || 'Skin Care'} required className="form-input" placeholder="e.g. Skin Wellness" />
                          </div>
                          <div>
                            <label className="form-label">Article Excerpt</label>
                            <textarea name="excerpt" defaultValue={currentBlog?.excerpt || ''} required className="form-textarea" rows={2} />
                          </div>
                          <div>
                            <label className="form-label">Article Body Content (paragraphs separated by double return)</label>
                            <textarea name="body_content" defaultValue={Array.isArray(currentBlog?.body_content) ? currentBlog.body_content.join('\n\n') : ''} required className="form-textarea" rows={8} placeholder="Write contents here. Empty lines create new paragraphs." />
                          </div>
                          <div>
                            <label className="form-label">Cover Image (JPEG/PNG/WEBP)</label>
                            <input type="file" name="image" ref={blogImageRef} required={!currentBlog} className="form-input" accept="image/*" />
                          </div>
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Publish Blog Post
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Blog List View
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>Blogs & Editorial</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>Publish and edit skin care and hair wellness articles</p>
                          </div>
                          <button onClick={() => { resetAllForms(); setShowBlogModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PlusCircle size={16} /> Publish Post
                          </button>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--silk-200)', color: 'var(--plum-900)', fontWeight: 'bold' }}>
                              <th style={{ padding: '12px' }}>Cover</th>
                              <th style={{ padding: '12px' }}>Title</th>
                              <th style={{ padding: '12px' }}>Author</th>
                              <th style={{ padding: '12px' }}>Category</th>
                              <th style={{ padding: '12px' }}>Read Time</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {blogs.map((b) => (
                              <tr key={b.id} style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                <td style={{ padding: '12px' }}>
                                  <img 
                                    src={backendAssetUrl(b.image_path)} 
                                    alt={b.title} 
                                    style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} 
                                  />
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--plum-900)' }}>{b.title}</td>
                                <td style={{ padding: '12px' }}>{b.author}</td>
                                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{b.category}</td>
                                <td style={{ padding: '12px' }}>{b.read_time}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => { resetAllForms(); setCurrentBlog(b); setShowBlogModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--plum-800)', cursor: 'pointer' }}><Edit size={16} /></button>
                                    <button onClick={() => deleteBlog(b.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 7. BEFORE & AFTER --- */}
                {activeTab === 'casestudies' && (
                  <div>
                    {showCaseStudyModal ? (
                      // Inline Case Study Form
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            {currentCaseStudy ? 'Edit Case Study Details' : 'Add New Case Study (Before & After)'}
                          </h4>
                          <button onClick={() => setShowCaseStudyModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <form onSubmit={saveCaseStudy} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {!currentCaseStudy && (
                            <div>
                              <label className="form-label">Unique Slug ID (lowercase, hyphenated)</label>
                              <input type="text" name="id" required className="form-input" placeholder="e.g. acne-scar-resurfacing" />
                            </div>
                          )}
                          {currentCaseStudy && (
                            <input type="hidden" name="id" value={currentCaseStudy.id} />
                          )}
                          <div>
                            <label className="form-label">Case Study Title</label>
                            <input type="text" name="title" defaultValue={currentCaseStudy?.title || ''} required className="form-input" placeholder="e.g. Deep Acne Scar Resurfacing" />
                          </div>
                          <div>
                            <label className="form-label">Category</label>
                            <select name="category" defaultValue={currentCaseStudy?.category || 'hair'} className="form-select">
                              <option value="hair">Hair (Hair Care / Transplants)</option>
                              <option value="skin">Skin (Skin Care / Resurfacing)</option>
                              <option value="laser">Laser (Laser Treatments)</option>
                              <option value="aesthetics">Aesthetics (Cosmetic Rejuvenation)</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Category Label Tag</label>
                            <input type="text" name="category_label" defaultValue={currentCaseStudy?.category_label || ''} required className="form-input" placeholder="e.g. GFC Therapy, Laser Resurfacing" />
                          </div>
                          <div>
                            <label className="form-label">Case Study Description</label>
                            <textarea name="description" defaultValue={currentCaseStudy?.description || ''} required className="form-textarea" rows={3} />
                          </div>
                          <div>
                            <label className="form-label">Consultant Doctor</label>
                            <input type="text" name="doctor" defaultValue={currentCaseStudy?.doctor || 'Dr. K. Yogiraj & Team'} required className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">Technology & Methods Used</label>
                            <input type="text" name="technology" defaultValue={currentCaseStudy?.technology || ''} required className="form-input" placeholder="e.g. Secret Fractional RF Microneedling" />
                          </div>
                          <div>
                            <label className="form-label">Number of Sessions required</label>
                            <input type="text" name="sessions" defaultValue={currentCaseStudy?.sessions || ''} required className="form-input" placeholder="e.g. 3 Sessions (spaced 4 weeks apart)" />
                          </div>
                          <div>
                            <label className="form-label">Diagnosis / Patient Concern</label>
                            <input type="text" name="concern" defaultValue={currentCaseStudy?.concern || ''} required className="form-input" placeholder="e.g. Severe rolling scars & blemishes" />
                          </div>
                          <div>
                            <label className="form-label">Before Photograph (JPEG/PNG/WEBP)</label>
                            <input type="file" name="before_image" ref={beforeImageRef} required={!currentCaseStudy} className="form-input" accept="image/*" />
                          </div>
                          <div>
                            <label className="form-label">After Photograph (JPEG/PNG/WEBP)</label>
                            <input type="file" name="after_image" ref={afterImageRef} required={!currentCaseStudy} className="form-input" accept="image/*" />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" name="active" defaultChecked={currentCaseStudy ? currentCaseStudy.active : true} id="cs-active" />
                            <label htmlFor="cs-active" style={{ fontSize: '0.85rem', color: 'var(--charcoal)', cursor: 'pointer' }}>Active on site comparison slider</label>
                          </div>
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Save Case Study Details
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Case Study List View
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>Before & After Case Studies</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>Configure clinical resurfacing results and comparative slider galleries</p>
                          </div>
                          <button onClick={() => { resetAllForms(); setShowCaseStudyModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PlusCircle size={16} /> Add Case Study
                          </button>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--silk-200)', color: 'var(--plum-900)', fontWeight: 'bold' }}>
                              <th style={{ padding: '12px' }}>Before/After Photos</th>
                              <th style={{ padding: '12px' }}>Title</th>
                              <th style={{ padding: '12px' }}>Category</th>
                              <th style={{ padding: '12px' }}>Doctor</th>
                              <th style={{ padding: '12px' }}>Concern</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {caseStudies.map((cs) => (
                              <tr key={cs.id} style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                <td style={{ padding: '12px' }}>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <img src={backendAssetUrl(cs.before_img_path)} alt="Before" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                    <img src={backendAssetUrl(cs.after_img_path)} alt="After" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                  </div>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--plum-900)' }}>{cs.title}</td>
                                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{cs.category}</td>
                                <td style={{ padding: '12px' }}>{cs.doctor}</td>
                                <td style={{ padding: '12px' }}>{cs.concern}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => { resetAllForms(); setCurrentCaseStudy(cs); setShowCaseStudyModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--plum-800)', cursor: 'pointer' }}><Edit size={16} /></button>
                                    <button onClick={() => deleteCaseStudy(cs.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 8. SEO CONFIGURATIONS --- */}
                {activeTab === 'seo' && (
                  <div>
                    {showSeoModal ? (
                      // Inline SEO Form
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                            Configure SEO: /{currentSeo?.route_name === 'home' ? '' : currentSeo?.route_name} Page
                          </h4>
                          <button onClick={() => setShowSeoModal(false)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <form onSubmit={saveSeo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label className="form-label">Document Title tag (Tab Title)</label>
                            <input type="text" name="title" defaultValue={currentSeo?.title || ''} required className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">Meta Description</label>
                            <textarea name="meta_description" defaultValue={currentSeo?.meta_description || ''} required className="form-textarea" rows={4} />
                          </div>
                          <div>
                            <label className="form-label">Meta Keywords</label>
                            <input type="text" name="keywords" defaultValue={currentSeo?.keywords || ''} className="form-input" placeholder="YCDC, skin care, dermatology" />
                          </div>
                          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>
                            Save SEO Settings
                          </button>
                        </form>
                      </div>
                    ) : (
                      // SEO List View
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--plum-900)', fontSize: '1.8rem' }}>SEO Configurations</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-charcoal)', margin: 0 }}>Configure webpage tab titles, meta tags, and search engine crawler keywords</p>
                          </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--silk-200)', color: 'var(--plum-900)', fontWeight: 'bold' }}>
                              <th style={{ padding: '12px' }}>Route Path</th>
                              <th style={{ padding: '12px' }}>Document Tab Title</th>
                              <th style={{ padding: '12px' }}>Meta Description</th>
                              <th style={{ padding: '12px' }}>Meta Keywords</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {seoConfigs.map((cfg) => (
                              <tr key={cfg.id} style={{ borderBottom: '1px solid var(--silk-200)' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--plum-800)' }}>/{cfg.route_name === 'home' ? '' : cfg.route_name}</td>
                                <td style={{ padding: '12px' }}>{cfg.title}</td>
                                <td style={{ padding: '12px', fontSize: '0.8rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.meta_description}</td>
                                <td style={{ padding: '12px', fontSize: '0.8rem', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.keywords || 'None'}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <button onClick={() => { resetAllForms(); setCurrentSeo(cfg); setShowSeoModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--plum-800)', cursor: 'pointer' }}><Edit size={16} /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

              </>
            )}

          </div>

        </div>

      </div>

      {/* ================= READ-ONLY POPUP MODALS ================= */}

      {/* 0. Calendar Date Appointment Viewer Modal */}
      {selectedCalDate && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(26, 8, 21, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: 'white', padding: '30px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '14px', marginBottom: '20px' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--plum-900)' }}>
                Appointments: {selectedCalDate}
              </h4>
              <button onClick={() => setSelectedCalDate(null)} style={{ background: 'none', border: 'none', color: 'var(--muted-charcoal)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
              {leads.filter(l => l.type === 'Appointment' && l.preferred_date === selectedCalDate).map((appt) => {
                let notifTime = 'Pending Confirmation';
                try {
                  const dateObj = new Date(appt.preferred_date);
                  if (!isNaN(dateObj.getTime())) {
                    dateObj.setDate(dateObj.getDate() - 1);
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
                    const timePart = appt.preferred_time === 'Flexible' || !appt.preferred_time ? '09:00 AM' : appt.preferred_time;
                    notifTime = `${formattedDate} at ${timePart} (24 hours prior)`;
                  }
                } catch (e) {
                  notifTime = 'Pending Confirmation';
                }

                return (
                  <div key={appt.id} style={{ padding: '16px', border: '1px solid var(--silk-200)', borderRadius: '8px', backgroundColor: 'var(--silk-50)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--silk-200)', paddingBottom: '8px', marginBottom: '10px' }}>
                      <strong style={{ color: 'var(--plum-900)', fontSize: '1rem' }}>👤 {appt.patient_name}</strong>
                      <span style={{
                        fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold',
                        backgroundColor: appt.status === 'Pending' ? '#fef3c7' : appt.status === 'Contacted' ? '#dbeafe' : appt.status === 'Confirmed' ? '#dcfce7' : '#f3f4f6',
                        color: appt.status === 'Pending' ? '#b45309' : appt.status === 'Contacted' ? '#1d4ed8' : appt.status === 'Confirmed' ? '#15803d' : '#374151',
                      }}>{appt.status}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                      <div>📞 Phone: <a href={`tel:${appt.patient_phone}`} style={{ textDecoration: 'underline', color: 'var(--plum-800)', fontWeight: '500' }}>{appt.patient_phone}</a></div>
                      <div>✉️ Email: <span style={{ color: 'var(--charcoal)' }}>{appt.patient_email || 'Not provided'}</span></div>
                      <div>📍 Branch: <span style={{ color: 'var(--charcoal)' }}>{appt.branch}</span></div>
                      <div>🩺 Doctor: <span style={{ color: 'var(--charcoal)' }}>{appt.doctor_requested || 'Not specified'}</span></div>
                      <div>⚙️ Service: <span style={{ color: 'var(--charcoal)' }}>{appt.service_requested || 'General Consultation'}</span></div>
                      <div>⏱️ Time Selected: <span style={{ color: 'var(--plum-800)', fontWeight: 'bold' }}>{appt.preferred_time || 'Flexible'}</span></div>
                      <div>⚠️ Consultation Status: <strong style={{ color: appt.status === 'Confirmed' ? '#15803d' : '#b45309' }}>{appt.status === 'Confirmed' ? 'Checked & Confirmed (Time Slot Booked)' : 'Pending Branch Confirmation'}</strong></div>
                      
                      <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(92, 26, 68, 0.05)', borderRadius: '4px', borderLeft: '3px solid var(--plum-800)' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--plum-900)' }}>📩 Email Notification Reminder Schedule</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--charcoal)', marginTop: '2px' }}>{notifTime}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setSelectedCalDate(null)} className="btn btn-outline" style={{ width: '100%', marginTop: '20px' }}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}
