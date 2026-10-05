import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles, Stethoscope, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, searchTreatments } from '../data/treatmentsData';
import type { Treatment } from '../types';

interface HeaderSearchProps {
  onNavigateToTreatments?: (searchQuery: string) => void;
  iconColor?: string;
}

const POPULAR_SEARCHES = [
  'Hydrafacial',
  'PRP Therapy',
  'Soprano Diode Laser',
  'Dust Allergy Test',
  'Botox',
  'Chemical Peels',
  'MNRF Laser',
  'Hair Transplant'
];

export default function HeaderSearch({ onNavigateToTreatments, iconColor }: HeaderSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
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
            backgroundColor: 'rgba(185, 114, 123, 0.28)',
            color: '#6E4369',
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
        <div
          className="header-search-line-container"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            height: '42px',
            width: 'clamp(260px, 28vw, 360px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 1002
          }}
        >
          {/* Left search icon inside the line */}
          <div
            style={{
              padding: '0 8px 0 2px',
              display: 'flex',
              alignItems: 'center',
              color: '#045935',
              flexShrink: 0
            }}
          >
            <Search size={17} style={{ opacity: 0.85 }} />
          </div>

          {/* Search Input sitting on top of the line */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search treatments..."
            aria-label="Search name of treatments"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#242923',
              fontFamily: 'inherit',
              padding: '8px 4px',
              letterSpacing: '0.01em',
              fontWeight: 500
            }}
          />

          {/* Clear or Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            style={{
              background: 'none',
              border: 'none',
              color: '#657766',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
            title="Close (Esc)"
          >
            <X size={16} />
          </button>

          {/* The line that draws from left to right */}
          <div
            className="search-draw-line"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, #045935 0%, #D9A5A7 100%)',
              transformOrigin: 'left center',
              animation: 'expandLineLeftToRight 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              boxShadow: '0 1px 4px rgba(4, 89, 53, 0.2)'
            }}
          />

          {/* Results / Suggestions Dropdown */}
          {isOpen && (
            <div
              className="search-results-dropdown animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 'clamp(320px, 35vw, 440px)',
                maxHeight: '440px',
                overflowY: 'auto',
                backgroundColor: '#FAF6F0',
                backdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(215, 203, 190, 0.85)',
                boxShadow: '0 20px 40px rgba(42, 54, 43, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)',
                padding: '12px',
                zIndex: 1050
              }}
            >
              {/* If user hasn't typed yet, show popular treatments */}
              {!query.trim() && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 10px 6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#657766',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    <Sparkles size={13} style={{ color: '#B9727B' }} /> Popular Treatments
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      padding: '6px 8px 10px'
                    }}
                  >
                    {POPULAR_SEARCHES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setQuery(item);
                          inputRef.current?.focus();
                        }}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(185, 114, 123, 0.35)',
                          borderRadius: '20px',
                          padding: '5px 12px',
                          fontSize: '0.78rem',
                          color: '#2A362B',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#045935';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.borderColor = '#045935';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = '#242923';
                          e.currentTarget.style.borderColor = 'rgba(217, 165, 167, 0.4)';
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div
                    style={{
                      borderTop: '1px solid rgba(215, 203, 190, 0.5)',
                      padding: '8px 10px 4px',
                      fontSize: '0.75rem',
                      color: '#7F8E80',
                      textAlign: 'center'
                    }}
                  >
                    Type procedure name, concern (e.g. acne, hair), or laser type
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
                      padding: '6px 10px 10px',
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
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
                            borderRadius: '10px',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'rgba(35, 61, 50, 0.08)' : 'transparent',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(35, 61, 50, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: isCosmetic ? 'rgba(217, 165, 167, 0.2)' : 'rgba(4, 89, 53, 0.12)',
                                color: isCosmetic ? '#D9A5A7' : '#045935',
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
                          <ChevronRight size={15} style={{ color: '#909F90', flexShrink: 0 }} />
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
                      marginTop: '8px',
                      padding: '10px',
                      backgroundColor: '#045935',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D9A5A7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#045935';
                    }}
                  >
                    View all matching treatments in catalog <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* If user typed and no results found */}
              {query.trim() && results.length === 0 && (
                <div style={{ padding: '20px 14px', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(217, 165, 167, 0.18)',
                      color: '#D9A5A7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px'
                    }}
                  >
                    <Search size={20} />
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#242923', marginBottom: '4px' }}>
                    No treatments found for "{query}"
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#657766', maxWidth: '280px', margin: '0 auto 14px' }}>
                    Try searching for common procedures like <em>Hydrafacial</em>, <em>PRP</em>, <em>Acne</em>, <em>Laser</em>, or <em>Allergy</em>.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSubmitSearch('')}
                    style={{
                      background: 'none',
                      border: '1px solid #536B4C',
                      color: '#536B4C',
                      borderRadius: '20px',
                      padding: '6px 16px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
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
