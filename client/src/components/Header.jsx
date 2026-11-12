import React, { useState } from 'react';
import { CheckSquare, Moon, Sun, Search, LogOut, User as UserIcon, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeCustomizerModal from './ThemeCustomizerModal';

export default function Header({ search, setSearch, onOpenNewTask }) {
  const { user, logout } = useAuth();
  const { theme, accent, isLight, toggleQuickTheme, themes, accents } = useTheme();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const activeThemeMeta = themes.find((t) => t.id === theme);
  const activeAccentMeta = accents.find((a) => a.id === accent);

  return (
    <>
      <header
        style={{
          height: '56px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              boxShadow: 'var(--accent-glow)'
            }}
          >
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                TaskFlow
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--primary-text)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--primary-subtle)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks... (Ctrl+K)"
            className="input"
            style={{
              paddingLeft: '36px',
              paddingRight: '64px',
              height: '36px',
              fontSize: '0.8125rem'
            }}
            aria-label="Search tasks"
          />
          <kbd
            style={{
              position: 'absolute',
              right: '8px',
              fontSize: '0.6875rem',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Right User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme & Color Studio Trigger */}
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
            title={`Customize Theme: ${activeThemeMeta?.name} (${activeAccentMeta?.name})`}
            id="btn-theme-studio"
          >
            <Palette size={15} style={{ color: 'var(--primary-500)' }} />
            <span style={{ fontWeight: 500, display: 'none', md: 'inline' }}>Theme</span>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activeAccentMeta?.hex || 'var(--primary-500)',
                boxShadow: `0 0 6px ${activeAccentMeta?.hex || 'var(--primary-500)'}`
              }}
            />
          </button>

          {/* Quick Light/Dark Toggle */}
          <button
            onClick={toggleQuickTheme}
            className="btn btn-ghost"
            style={{ width: '34px', height: '34px', padding: 0, borderRadius: '8px' }}
            aria-label={`Toggle quick ${isLight ? 'dark' : 'light'} mode`}
            title={`Toggle quick ${isLight ? 'dark' : 'light'} mode`}
            id="btn-quick-theme"
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* User Profile & Logout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingLeft: '10px',
              borderLeft: '1px solid var(--border-subtle)',
              marginLeft: '4px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.8125rem',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              {user?.fullName?.charAt(0).toUpperCase() || <UserIcon size={16} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                {user?.fullName || 'User'}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                {user?.email}
              </span>
            </div>

            <button
              onClick={logout}
              className="btn btn-ghost"
              style={{ padding: '6px 8px', marginLeft: '4px' }}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} style={{ color: 'var(--danger-text)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Theme Studio Modal */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </>
  );
}
