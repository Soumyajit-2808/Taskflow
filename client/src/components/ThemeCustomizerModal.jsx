import React from 'react';
import { X, Check, Palette, Sparkles, RotateCcw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeCustomizerModal({ isOpen, onClose }) {
  const { theme, accent, setTheme, setAccent, resetToDefaults, themes, accents } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
    >
      <div
        className="modal-content"
        style={{
          maxWidth: '620px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--accent-glow)'
              }}
            >
              <Palette size={20} />
            </div>
            <div>
              <h2
                id="theme-modal-title"
                style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                Theme & Appearance
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Select your base canvas and accent color independently.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: '8px' }}
            aria-label="Close theme settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}
        >
          {/* Section 1: Base Canvas Themes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>1. Base Canvas Theme</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Sets background surfaces, card layers, and contrast mode
                </p>
              </div>
              <span className="badge" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                {themes.find((t) => t.id === theme)?.name || 'Custom'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '10px'
              }}
            >
              {themes.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: isSelected
                        ? '2px solid var(--primary-500)'
                        : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--bg-hover)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 150ms ease',
                      position: 'relative',
                      boxShadow: isSelected ? 'var(--shadow-focus)' : 'none'
                    }}
                  >
                    {/* Visual Color Swatch */}
                    <div
                      style={{
                        height: '42px',
                        borderRadius: '6px',
                        backgroundColor: t.bg,
                        border: `1px solid ${t.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 6px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: '70%',
                          height: '24px',
                          borderRadius: '4px',
                          backgroundColor: t.surface,
                          border: `1px solid ${t.border}`,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '6px'
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '6px',
                            borderRadius: '3px',
                            backgroundColor: t.text,
                            opacity: 0.8
                          }}
                        />
                      </div>

                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-500)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                          }}
                        >
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{t.name}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--text-tertiary)',
                          lineHeight: 1.25,
                          display: 'block',
                          marginTop: '2px'
                        }}
                      >
                        {t.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Accent Color Schemes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>2. Brand Accent Palette</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Powers buttons, active indicators, focus rings, and glowing highlights
                </p>
              </div>
              <span
                className="badge"
                style={{
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary-text)',
                  fontWeight: 600
                }}
              >
                {accents.find((a) => a.id === accent)?.name || 'Custom'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '10px'
              }}
            >
              {accents.map((a) => {
                const isSelected = accent === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isSelected
                        ? `2px solid ${a.hex}`
                        : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--bg-hover)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 150ms ease',
                      boxShadow: isSelected ? `0 0 0 2px ${a.hex}40` : 'none'
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: a.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                        boxShadow: `0 2px 6px ${a.hex}60`
                      }}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 600 : 500,
                        color: 'var(--text-primary)',
                        textAlign: 'left'
                      }}
                    >
                      {a.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Live Preview Showcase */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} style={{ color: 'var(--primary-500)' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Live Combination Preview
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8125rem' }}>
                Primary Action
              </button>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary-text)'
                }}
              >
                Active Tag
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--primary-500)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '0.8125rem',
                  boxShadow: 'var(--shadow-focus)'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-500)' }} />
                <span>Focused Element</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)'
          }}
        >
          <button
            onClick={resetToDefaults}
            className="btn btn-ghost"
            style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.875rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

