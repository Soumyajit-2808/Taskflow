import React, { useState } from 'react';
import { CheckSquare, AlertCircle, ArrowRight, Check, Palette, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeCustomizerModal from './ThemeCustomizerModal';

const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'throwawaymail.com'
];

// Keyboard walks
const KEYBOARD_WALKS = ['qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', 'wsxedc', 'edcrfv', 'rfvtgb', '123456', '654321', 'abcdef', 'poiuyt', 'lkjhgf', 'mnbvcx'];

function checkGibberishClient(str) {
  const s = str.toLowerCase();
  if (/(.)\1{3,}/.test(s)) return 'contains excessive repeating characters';
  for (const walk of KEYBOARD_WALKS) {
    if (s.includes(walk)) return `contains keyboard sequence pattern '${walk}'`;
  }
  // Home-row mashing (e.g. afdsf, sffsd, asdf, sdfsd)
  if (s.length >= 4 && /^[asdfghjkl]+$/.test(s)) {
    if (new Set(s).size <= 5) return 'appears to be home-row keyboard smashing';
  }
  // Top/bottom row
  if (s.length >= 4) {
    if (/^[qwertyuiop]+$/.test(s) && new Set(s).size <= 5) return 'appears to be top-row keyboard smashing';
    if (/^[zxcvbnm]+$/.test(s) && new Set(s).size <= 5) return 'appears to be bottom-row keyboard smashing';
  }
  // 4+ consonants without vowels
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(s) && !/sch|ngth|phr/i.test(s)) {
    return 'contains an unpronounceable consonant cluster';
  }
  // No vowels
  if (s.length >= 4 && !/[aeiouy]/i.test(s)) {
    return 'contains no vowels';
  }
  return null;
}

export default function AuthView() {
  const { login, register, authError, setAuthError } = useAuth();
  const { isLight, toggleQuickTheme, accent, accents } = useTheme();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailWarning, setEmailWarning] = useState('');

  const activeAccent = accents.find((a) => a.id === accent);

  const validateEmailLive = (val) => {
    setEmail(val);
    if (!val || !isRegister) {
      setEmailWarning('');
      return;
    }

    const trimmed = val.trim().toLowerCase();
    const parts = trimmed.split('@');
    if (parts.length === 2) {
      const [local, domain] = parts;
      if (DISPOSABLE_DOMAINS.includes(domain)) {
        setEmailWarning('Disposable/temporary email addresses are not allowed.');
        return;
      }
      
      const localGibberish = checkGibberishClient(local);
      if (localGibberish) {
        setEmailWarning(`Email username ${localGibberish}. Please use a real email address.`);
        return;
      }

      if (domain) {
        if (!domain.includes('.') || domain.endsWith('.')) {
          setEmailWarning('Please provide a complete domain with top-level extension (e.g. .com).');
          return;
        }
        const domainParts = domain.split('.');
        const domainGibberish = checkGibberishClient(domainParts[0]);
        if (domainGibberish) {
          setEmailWarning(`Domain '${domainParts[0]}' ${domainGibberish}.`);
          return;
        }
      }
    }
    setEmailWarning('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailWarning) return;
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        padding: '24px',
        position: 'relative'
      }}
    >
      {/* Floating Theme Switcher */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 40
        }}
      >
        <button
          onClick={() => setIsThemeModalOpen(true)}
          className="btn btn-secondary"
          style={{
            height: '34px',
            padding: '0 10px',
            fontSize: '0.75rem',
            gap: '6px',
            borderRadius: '8px'
          }}
          aria-label="Customize theme and colors"
          title="Customize Theme & Palette"
        >
          <Palette size={15} style={{ color: 'var(--primary-500)' }} />
          <span>Theme</span>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: activeAccent?.hex || 'var(--primary-500)',
              boxShadow: `0 0 6px ${activeAccent?.hex || 'var(--primary-500)'}`
            }}
          />
        </button>

        <button
          onClick={toggleQuickTheme}
          className="btn btn-ghost"
          style={{ width: '34px', height: '34px', padding: 0, borderRadius: '8px' }}
          aria-label={`Toggle quick ${isLight ? 'dark' : 'light'} mode`}
          title={`Toggle quick ${isLight ? 'dark' : 'light'} mode`}
        >
          {isLight ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </div>

      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              marginBottom: '12px',
              boxShadow: 'var(--accent-glow)'
            }}
          >
            <CheckSquare size={26} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            TaskFlow
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isRegister
              ? 'Create your account to start organizing'
              : 'Welcome back to your workspace'}
          </p>
        </div>

        {/* Error Feedback */}
        {authError && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--danger-border)'
            }}
            role="alert"
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div>
              <label className="label" htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="input"
                required
              />
            </div>
          )}

          <div>
            <label className="label" htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => validateEmailLive(e.target.value)}
              placeholder="developer@example.com"
              className="input"
              style={{
                borderColor: emailWarning ? 'var(--danger-border)' : undefined
              }}
              required
            />
            {emailWarning && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--danger-text)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <AlertCircle size={12} /> {emailWarning}
              </span>
            )}
          </div>

          <div>
            <label className="label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="input"
              required
            />
            {isRegister && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                Must be at least 8 characters with letters & numbers.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '42px', marginTop: '8px' }}
            disabled={loading || (isRegister && Boolean(emailWarning))}
            id="btn-auth-submit"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div style={{ textAlign: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setAuthError(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-500)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              {isRegister ? 'Sign In' : 'Create an Account'}
            </button>
          </p>
        </div>
      </div>

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </div>
  );
}

