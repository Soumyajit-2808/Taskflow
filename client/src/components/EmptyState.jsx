import React from 'react';
import { ClipboardList, FilterX, Plus } from 'lucide-react';

export default function EmptyState({ isFiltered, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        border: '1px dashed var(--border-default)',
        borderRadius: '12px'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-muted)',
          color: 'var(--text-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        {isFiltered ? <FilterX size={24} /> : <ClipboardList size={24} />}
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {isFiltered ? 'No matching tasks found' : 'No tasks yet'}
      </h3>

      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          maxWidth: '360px',
          margin: '8px 0 20px'
        }}
      >
        {isFiltered
          ? 'Try adjusting your search keywords, status, or priority filters.'
          : 'Stay organized and focused. Create your first task to get started.'}
      </p>

      <button onClick={onAction} className="btn btn-primary">
        {isFiltered ? (
          'Reset Filters'
        ) : (
          <>
            <Plus size={16} /> Create Task
          </>
        )}
      </button>
    </div>
  );
}

