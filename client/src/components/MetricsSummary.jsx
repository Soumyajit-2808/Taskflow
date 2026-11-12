import React from 'react';
import { Layers, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function MetricsSummary({ stats, onSelectMetric, activeMetric }) {
  const cards = [
    {
      id: 'all',
      title: 'Total Tasks',
      value: stats?.total ?? 0,
      sub: 'Across all categories',
      icon: Layers,
      color: 'var(--primary-500)',
      bg: 'var(--primary-subtle)'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      value: stats?.in_progress ?? 0,
      sub: 'Active focus tasks',
      icon: Clock,
      color: 'var(--status-inprogress-dot)',
      bg: 'var(--status-inprogress-bg)'
    },
    {
      id: 'completed',
      title: 'Completed',
      value: stats?.completed ?? 0,
      sub: 'Accomplished tasks',
      icon: CheckCircle2,
      color: 'var(--status-completed-dot)',
      bg: 'var(--status-completed-bg)'
    },
    {
      id: 'overdue',
      title: 'Overdue',
      value: stats?.overdue ?? 0,
      sub: 'Requires attention',
      icon: AlertOctagon,
      color: 'var(--danger-button)',
      bg: 'var(--danger-bg)',
      highlight: (stats?.overdue ?? 0) > 0
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeMetric === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectMetric(card.id)}
            className="card"
            style={{
              cursor: 'pointer',
              border: isSelected
                ? '2px solid var(--border-focus)'
                : card.highlight
                ? '1px solid var(--danger-border)'
                : '1px solid var(--border-subtle)',
              transition: 'all 150ms ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              backgroundColor: isSelected ? 'var(--bg-muted)' : 'var(--bg-surface)'
            }}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectMetric(card.id);
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {card.title}
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={18} />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: card.highlight ? 'var(--danger-text)' : 'var(--text-primary)'
                }}
              >
                {card.value}
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  marginTop: '4px'
                }}
              >
                {card.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

