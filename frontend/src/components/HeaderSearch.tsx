import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, searchTreatments } from '../data/treatmentsData';
import type { Treatment } from '../types';

interface HeaderSearchProps {
  onNavigateToTreatments?: (searchQuery: string) => void;
  iconColor?: string;
  isTransparentHeader?: boolean;
}

export default function HeaderSearch({ onNavigateToTreatments, iconColor, isTransparentHeader }: HeaderSearchProps) {
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



  // Highlight query term in result text cleanly with bolding
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <strong
          key={i}
          style={{
            fontWeight: 700,
            color: '#15241C'
          }}
        >
          {part}
        </strong>
      ) : (
        <span key={i} style={{ color: '#4D584F', fontWeight: 400 }}>
          {part}
        </span>
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
              color: isTransparentHeader ? '#E6CA85' : '#233D32',
              flexShrink: 0
            }}
          >
            <Search size={17} style={{ opacity: isTransparentHeader ? 1 : 0.85 }} />
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
            className={`header-search-input ${isTransparentHeader ? 'is-transparent-header' : ''}`}
            style={{
              flex: 1,
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 0,
              boxShadow: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: isTransparentHeader ? '#FFFFFF' : '#242923',
              fontFamily: 'inherit',
              padding: '8px 4px',
              letterSpacing: '0.01em',
              fontWeight: isTransparentHeader ? 600 : 500
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
                color: isTransparentHeader ? 'rgba(255, 255, 255, 0.85)' : '#657766',
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
              color: isTransparentHeader ? 'rgba(255, 255, 255, 0.9)' : '#657766',
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
              height: isTransparentHeader ? '2.5px' : '2px',
              background: isTransparentHeader
                ? 'linear-gradient(90deg, #E6CA85 0%, #FFFFFF 40%, #D9A5A7 100%)'
                : 'linear-gradient(90deg, #233D32 0%, #D9A5A7 100%)',
              transformOrigin: 'left center',
              animation: 'expandLineLeftToRight 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              boxShadow: isTransparentHeader
                ? '0 0 10px rgba(230, 202, 133, 0.75), 0 0 4px rgba(255, 255, 255, 0.9)'
                : '0 1px 4px rgba(35, 61, 50, 0.2)'
            }}
          />

          {/* Results / Treatment Finder Dropdown - Simple & Minimalist Design */}
          {isOpen && query.trim() && (
            <div
              className="search-results-dropdown animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 'clamp(290px, 32vw, 420px)',
                maxHeight: '400px',
                overflowY: 'auto',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                padding: '4px 0',
                zIndex: 1050
              }}
            >
              {/* If user typed and results found */}
              {results.length > 0 && (
                <div>
                  {results.slice(0, 7).map((treatment, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={treatment.id}
                        onClick={() => handleSelectTreatment(treatment)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          padding: '10px 16px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(35, 61, 50, 0.06)' : 'transparent',
                          borderBottom: idx === Math.min(results.length, 7) - 1 ? 'none' : '1px solid rgba(0, 0, 0, 0.04)',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(35, 61, 50, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                          <Search size={14} style={{ color: '#889B8A', flexShrink: 0, opacity: 0.7 }} />
                          <div
                            style={{
                              fontSize: '0.88rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              minWidth: 0,
                              flex: 1
                            }}
                          >
                            {highlightMatch(treatment.name, query)}
                          </div>
                        </div>
                        <ChevronRight size={14} style={{ color: '#BAC6BB', flexShrink: 0 }} />
                      </div>
                    );
                  })}

                  {/* Clean, simple text footer link */}
                  <div
                    onClick={() => handleSubmitSearch(query)}
                    style={{
                      padding: '10px 16px',
                      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#233D32',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(35, 61, 50, 0.02)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(35, 61, 50, 0.06)';
                      e.currentTarget.style.color = '#B49A68';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(35, 61, 50, 0.02)';
                      e.currentTarget.style.color = '#233D32';
                    }}
                  >
                    <span>View all matching treatments &ldquo;{query}&rdquo;</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              )}

              {/* If user typed and no results found */}
              {results.length === 0 && (
                <div style={{ padding: '22px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.88rem', color: '#657766', marginBottom: '8px' }}>
                    No treatments found for &ldquo;{query}&rdquo;
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmitSearch('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#233D32',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Browse full treatments catalog &rarr;
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
