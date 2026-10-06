import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, searchTreatments } from '../data/treatmentsData';
import type { Treatment } from '../types';

interface HeaderSearchProps {
  onNavigateToTreatments?: (searchQuery: string) => void;
  iconColor?: string;
}

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
        <div
          className="header-search-line-container"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            height: '42px',
            width: 'clamp(260px, 28vw, 360px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 1002,
            background: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none'
          }}
        >
          {/* Left search icon inside the line */}
          <div
            style={{
              padding: '0 8px 0 2px',
              display: 'flex',
              alignItems: 'center',
              color: '#233D32',
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
            aria-label="Search treatments"
            className="header-search-input"
            style={{
              flex: 1,
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 0,
              boxShadow: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#242923',
              fontFamily: 'inherit',
              padding: '8px 4px',
              letterSpacing: '0.01em',
              fontWeight: 500
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
                background: 'none',
                border: 'none',
                color: '#657766',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                marginRight: '2px',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              title="Clear input"
            >
              <X size={14} />
            </button>
          ) : null}

          {/* Close Search Button */}
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
              background: 'linear-gradient(90deg, #233D32 0%, #D9A5A7 100%)',
              transformOrigin: 'left center',
              animation: 'expandLineLeftToRight 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              boxShadow: '0 1px 4px rgba(35, 61, 50, 0.2)'
            }}
          />

          {/* Results / Treatment Finder Dropdown */}
          {isOpen && query.trim() && (
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
              {/* If user typed and results found */}
              {results.length > 0 && (
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
                                  fontSize: '0.88rem',
                                  fontWeight: 600,
                                  color: '#242923',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {highlightMatch(treatment.name, query)}
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
              {results.length === 0 && (
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
