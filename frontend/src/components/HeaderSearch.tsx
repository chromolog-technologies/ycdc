import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Stethoscope,
  ChevronRight,
  Zap,
  Activity,
  Compass,
  PhoneCall
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, searchTreatments } from '../data/treatmentsData';
import type { Treatment } from '../types';

interface HeaderSearchProps {
  onNavigateToTreatments?: (searchQuery: string) => void;
  iconColor?: string;
}

type CategoryTab = 'all' | 'skin' | 'hair' | 'laser' | 'clinical';

interface CategoryTabItem {
  id: CategoryTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}

const CATEGORY_TABS: CategoryTabItem[] = [
  { id: 'all', label: 'All', icon: Compass },
  { id: 'skin', label: 'Skin', icon: Sparkles },
  { id: 'hair', label: 'Hair', icon: Activity },
  { id: 'laser', label: 'Laser', icon: Zap },
  { id: 'clinical', label: 'Clinical', icon: Stethoscope }
];

interface PillItem {
  name: string;
  badge: string;
  icon: string;
}

const TREATMENTS_BY_CATEGORY: Record<CategoryTab, PillItem[]> = {
  all: [
    { name: 'Hydrafacial', badge: 'Glow', icon: '✨' },
    { name: 'PRP Therapy', badge: 'Hair', icon: '💉' },
    { name: 'Soprano Diode Laser', badge: 'LHR', icon: '⚡' },
    { name: 'Dust Allergy Test', badge: 'Clinical', icon: '🔬' },
    { name: 'Botox', badge: 'Anti-Aging', icon: '✨' },
    { name: 'Chemical Peels', badge: 'Radiance', icon: '🧪' },
    { name: 'MNRF Laser', badge: 'Scars', icon: '⚡' },
    { name: 'Hair Transplant', badge: 'Precision', icon: '🌿' }
  ],
  skin: [
    { name: 'Hydrafacial', badge: 'MD Hydration', icon: '✨' },
    { name: 'Chemical Peels', badge: 'Acne & Glow', icon: '🧪' },
    { name: 'Botox', badge: 'Expression Lines', icon: '💉' },
    { name: 'Dermal Fillers', badge: 'Volume Restoration', icon: '✨' },
    { name: 'Comedone Extraction', badge: 'Deep Clean', icon: '🌿' }
  ],
  hair: [
    { name: 'PRP Therapy', badge: 'Hair Regrowth', icon: '💉' },
    { name: 'GFC Hair Therapy', badge: 'Growth Factors', icon: '🔬' },
    { name: 'Hair Transplant', badge: 'FUE Precision', icon: '🌿' },
    { name: 'Stem Cell Therapy', badge: 'Follicle Booster', icon: '🧬' },
    { name: 'Mesotherapy', badge: 'Scalp Nutrition', icon: '💧' }
  ],
  laser: [
    { name: 'Soprano Diode Laser', badge: 'Painless LHR', icon: '⚡' },
    { name: 'MNRF Laser', badge: 'Secret RF Scars', icon: '⚡' },
    { name: 'Revlite Laser', badge: 'Q-Switch Pigment', icon: '⚡' },
    { name: 'ResurFX Laser', badge: 'Fractional Resurfacing', icon: '⚡' },
    { name: 'Tri-Beam Laser', badge: 'Melasma & Tattoos', icon: '⚡' }
  ],
  clinical: [
    { name: 'Dust Allergy Test', badge: 'Inhalant Panel', icon: '🔬' },
    { name: 'Food Allergy Test', badge: 'Dietary Screening', icon: '🔬' },
    { name: 'Skin Biopsy', badge: 'Histopathology', icon: '🧪' },
    { name: 'Phototherapy', badge: 'NBUVB Therapy', icon: '💡' },
    { name: 'Cryotherapy', badge: 'Lesion Removal', icon: '❄️' }
  ]
};

const COMMON_CONCERNS = [
  'Acne & Scars',
  'Pigmentation',
  'Hair Fall',
  'Skin Brightening',
  'Anti-Aging',
  'Allergies'
];

export default function HeaderSearch({ onNavigateToTreatments, iconColor }: HeaderSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [results, setResults] = useState<Treatment[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Open search and autofocus input
  const handleOpen = () => {
    setIsOpen(true);
    setSelectedIndex(-1);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Close and reset
  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    setActiveTab('all');
  };

  // Live search filtering
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }
    const matched = searchTreatments(query, MOCK_SERVICES);
    setResults(matched);
    setSelectedIndex(-1);
  }, [query]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation (ESC, Up, Down, Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClose();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectTreatment(results[selectedIndex]);
      } else if (query.trim()) {
        handleSubmitSearch(query.trim());
      }
    }
  };

  const handleSelectTreatment = (treatment: Treatment) => {
    handleClose();
    if (onNavigateToTreatments) {
      onNavigateToTreatments(treatment.name);
    } else {
      navigate(`/treatments?search=${encodeURIComponent(treatment.name)}`);
    }
  };

  const handleSubmitSearch = (searchTerm: string) => {
    handleClose();
    if (onNavigateToTreatments) {
      onNavigateToTreatments(searchTerm);
    } else {
      navigate(`/treatments?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Current pills based on activeTab
  const currentPills = useMemo(() => {
    return TREATMENTS_BY_CATEGORY[activeTab] || TREATMENTS_BY_CATEGORY.all;
  }, [activeTab]);

  // Highlight query term in result text
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            backgroundColor: 'rgba(35, 61, 50, 0.15)',
            color: '#233D32',
            fontWeight: 700,
            padding: '1px 3px',
            borderRadius: '3px'
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className={`header-search-wrapper ${isOpen ? 'is-open' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Search treatments"
          className="header-search-icon-btn"
          title="Search treatments (Click to search)"
          style={{
            background: 'none',
            border: 'none',
            color: iconColor || '#2A362B',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            outline: 'none'
          }}
        >
          <Search size={18} />
        </button>
      ) : (
        <div className="header-search-capsule-wrapper" style={{ position: 'relative' }}>
          {/* Unified Luxury Pill Capsule */}
          <div
            className="header-search-capsule"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              width: 'clamp(280px, 32vw, 420px)',
              backgroundColor: '#FFFFFF',
              borderRadius: '9999px',
              border: '1.5px solid #233D32',
              boxShadow: '0 6px 20px rgba(35, 61, 50, 0.12), 0 1px 3px rgba(0, 0, 0, 0.04)',
              padding: '0 6px 0 10px',
              boxSizing: 'border-box',
              zIndex: 1002,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Left search icon with soft circular badge */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(35, 61, 50, 0.08)',
                color: '#233D32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: '8px'
              }}
            >
              <Search size={15} strokeWidth={2.4} />
            </div>

            {/* Completely borderless search input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search treatments, concerns, lasers..."
              aria-label="Search treatments"
              className="header-search-input"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                WebkitAppearance: 'none',
                appearance: 'none',
                fontSize: '0.88rem',
                color: '#1A2921',
                fontFamily: 'inherit',
                padding: '0',
                margin: '0',
                letterSpacing: '0.01em',
                fontWeight: 500,
                minWidth: 0
              }}
            />

            {/* Quick Clear Query Button */}
            {query.trim() ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear query"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(35, 61, 50, 0.08)',
                  border: 'none',
                  color: '#233D32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  marginRight: '4px',
                  transition: 'background-color 0.15s ease'
                }}
                title="Clear input"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            ) : null}

            {/* Close Search Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close search"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FAF6F0',
                border: '1px solid rgba(35, 61, 50, 0.12)',
                color: '#233D32',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#233D32';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FAF6F0';
                e.currentTarget.style.color = '#233D32';
              }}
              title="Close (Esc)"
            >
              <X size={14} strokeWidth={2.2} />
            </button>
          </div>

          {/* Results / Treatment Finder Dropdown */}
          {isOpen && (
            <div
              className="search-results-dropdown animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: 'clamp(320px, 38vw, 480px)',
                maxHeight: '480px',
                overflowY: 'auto',
                backgroundColor: '#FDFBF7',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1.5px solid rgba(217, 165, 167, 0.35)',
                boxShadow: '0 24px 60px rgba(35, 61, 50, 0.18), 0 4px 16px rgba(0, 0, 0, 0.04)',
                padding: '14px',
                zIndex: 1050,
                boxSizing: 'border-box'
              }}
            >
              {/* If user hasn't typed yet, show smart category tabs & curated treatments */}
              {!query.trim() && (
                <div>
                  {/* Category Filter Tabs Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      padding: '0 2px'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#233D32',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase'
                      }}
                    >
                      <Sparkles size={13} style={{ color: '#D9A5A7' }} /> Treatment Directory
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#7F8E80', fontWeight: 500 }}>
                      40+ Procedures
                    </span>
                  </div>

                  {/* Category Filter Tabs */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '5px',
                      overflowX: 'auto',
                      paddingBottom: '8px',
                      scrollbarWidth: 'none'
                    }}
                  >
                    {CATEGORY_TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            border: isActive
                              ? '1px solid #233D32'
                              : '1px solid rgba(35, 61, 50, 0.14)',
                            backgroundColor: isActive ? '#233D32' : '#FFFFFF',
                            color: isActive ? '#FFFFFF' : '#233D32',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: isActive ? '0 2px 8px rgba(35, 61, 50, 0.18)' : 'none'
                          }}
                        >
                          <TabIcon size={12} style={{ color: isActive ? '#F3E5AB' : '#233D32' }} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Curated Procedure Chips for Active Category */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      padding: '8px 2px 12px'
                    }}
                  >
                    {currentPills.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setQuery(item.name);
                          inputRef.current?.focus();
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(35, 61, 50, 0.14)',
                          borderRadius: '9999px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          color: '#233D32',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#233D32';
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#233D32';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(35, 61, 50, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.color = '#233D32';
                          e.currentTarget.style.borderColor = 'rgba(35, 61, 50, 0.14)';
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.03)';
                        }}
                      >
                        <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
                        <span>{item.name}</span>
                        <span
                          style={{
                            fontSize: '0.66rem',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(35, 61, 50, 0.06)',
                            color: '#536B4C',
                            fontWeight: 600
                          }}
                        >
                          {item.badge}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Common Concerns Quick-Selector */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(215, 203, 190, 0.6)',
                      paddingTop: '10px',
                      marginTop: '2px'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#657766',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '6px'
                      }}
                    >
                      Search by Primary Concern:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {COMMON_CONCERNS.map((concern) => (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => {
                            setQuery(concern);
                            inputRef.current?.focus();
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px dashed rgba(217, 165, 167, 0.6)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            color: '#4A5B4C',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(217, 165, 167, 0.15)';
                            e.currentTarget.style.borderColor = '#D9A5A7';
                            e.currentTarget.style.color = '#233D32';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(217, 165, 167, 0.6)';
                            e.currentTarget.style.color = '#4A5B4C';
                          }}
                        >
                          {concern}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Concierge Assistance Footer */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(215, 203, 190, 0.6)',
                      marginTop: '12px',
                      paddingTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.74rem'
                    }}
                  >
                    <a
                      href="tel:+919741678787"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#233D32',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      <PhoneCall size={12} style={{ color: '#D9A5A7' }} /> Call Doctor Hotline
                    </a>
                    <button
                      type="button"
                      onClick={() => handleSubmitSearch('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#536B4C',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Browse full catalog <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* If user typed and results found */}
              {query.trim() && results.length > 0 && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 6px 10px',
                      borderBottom: '1px solid rgba(215, 203, 190, 0.6)',
                      fontSize: '0.76rem',
                      color: '#657766'
                    }}
                  >
                    <span>
                      Found <strong>{results.length}</strong> treatment{results.length === 1 ? '' : 's'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#909F90' }}>
                      Press Enter to view all
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '8px' }}>
                    {results.slice(0, 7).map((treatment, idx) => {
                      const isSelected = selectedIndex === idx;
                      const isCosmetic = treatment.procedure_type === 'cosmetic';
                      return (
                        <div
                          key={treatment.id}
                          onClick={() => handleSelectTreatment(treatment)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'rgba(35, 61, 50, 0.08)' : '#FFFFFF',
                            border: isSelected
                              ? '1px solid #233D32'
                              : '1px solid rgba(35, 61, 50, 0.08)',
                            transition: 'all 0.18s ease',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(35, 61, 50, 0.07)';
                            e.currentTarget.style.borderColor = '#233D32';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                              e.currentTarget.style.borderColor = 'rgba(35, 61, 50, 0.08)';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                backgroundColor: isCosmetic ? 'rgba(217, 165, 167, 0.25)' : 'rgba(35, 61, 50, 0.12)',
                                color: isCosmetic ? '#D9A5A7' : '#233D32',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {isCosmetic ? <Sparkles size={16} /> : <Stethoscope size={16} />}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: '0.86rem',
                                  fontWeight: 600,
                                  color: '#242923',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {highlightMatch(treatment.name, query)}
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginTop: '2px'
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    color: isCosmetic ? '#D9A5A7' : '#536B4C'
                                  }}
                                >
                                  {treatment.category_name}
                                </span>
                                {treatment.price_range && (
                                  <>
                                    <span style={{ opacity: 0.4, fontSize: '0.65rem' }}>•</span>
                                    <span style={{ fontSize: '0.7rem', color: '#657766' }}>
                                      {treatment.price_range}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={16} style={{ color: '#909F90', flexShrink: 0 }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* View all button */}
                  <button
                    type="button"
                    onClick={() => handleSubmitSearch(query)}
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      padding: '11px',
                      backgroundColor: '#233D32',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s ease',
                      boxShadow: '0 4px 14px rgba(35, 61, 50, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D9A5A7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#233D32';
                    }}
                  >
                    View all matching treatments in catalog <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* If user typed and no results found */}
              {query.trim() && results.length === 0 && (
                <div style={{ padding: '24px 14px', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(217, 165, 167, 0.2)',
                      color: '#D9A5A7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px'
                    }}
                  >
                    <Search size={22} />
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#242923', marginBottom: '4px' }}>
                    No treatments found for "{query}"
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#657766', maxWidth: '300px', margin: '0 auto 16px' }}>
                    Try searching for common treatments like <em>Hydrafacial</em>, <em>PRP</em>, <em>Acne</em>, <em>Diode Laser</em>, or <em>Allergy</em>.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSubmitSearch('')}
                    style={{
                      backgroundColor: '#233D32',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: '9999px',
                      padding: '8px 20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(35, 61, 50, 0.15)'
                    }}
                  >
                    Browse Complete Catalog
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
