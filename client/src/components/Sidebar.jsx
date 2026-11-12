import React, { useState } from 'react';
import {
  Plus,
  Inbox,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Tag,
  Trash2,
  FolderPlus
} from 'lucide-react';

export default function Sidebar({
  activeFilter,
  setActiveFilter,
  categories,
  onAddCategory,
  onDeleteCategory,
  selectedCategory,
  setSelectedCategory,
  onOpenNewTask,
  stats
}) {
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#6366f1');

  const colorOptions = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    onAddCategory({ name: catName.trim(), color: catColor });
    setCatName('');
    setIsAddingCat(false);
  };

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: Inbox, count: stats?.total ?? 0 },
    { id: 'today', label: 'Due Today', icon: Calendar, count: stats?.due_today ?? 0 },
    { id: 'overdue', label: 'Overdue', icon: AlertCircle, count: stats?.overdue ?? 0, danger: true },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: stats?.completed ?? 0 }
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
        gap: '24px',
        flexShrink: 0,
        height: 'calc(100vh - 56px)',
        overflowY: 'auto'
      }}
    >
      {/* New Task Button */}
      <button
        onClick={onOpenNewTask}
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'space-between' }}
        id="btn-new-task"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> New Task
        </span>
        <kbd
          style={{
            fontSize: '0.6875rem',
            padding: '2px 6px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px'
          }}
        >
          N
        </kbd>
      </button>

      {/* Main Nav Filters */}
      <div>
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            paddingLeft: '8px'
          }}
        >
          Views
        </span>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id && !selectedCategory;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveFilter(item.id);
                  setSelectedCategory(null);
                }}
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                  color: isActive ? 'var(--primary-text)' : 'inherit',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon
                    size={16}
                    style={{
                      color: item.danger && item.count > 0 ? 'var(--danger-text)' : 'inherit'
                    }}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: item.danger && item.count > 0 ? 'var(--danger-text)' : 'var(--text-tertiary)',
                      fontWeight: 600
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '8px',
            paddingRight: '4px',
            marginBottom: '8px'
          }}
        >
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Categories
          </span>
          <button
            onClick={() => setIsAddingCat(!isAddingCat)}
            className="btn btn-ghost"
            style={{ padding: '2px 6px', height: 'auto', fontSize: '0.75rem' }}
            title="Add Category"
            aria-label="Add Category"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Inline Add Category Form */}
        {isAddingCat && (
          <form
            onSubmit={handleCreateCategory}
            style={{
              padding: '10px',
              backgroundColor: 'var(--bg-muted)',
              borderRadius: '8px',
              marginBottom: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Category name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="input"
              style={{ height: '30px', fontSize: '0.75rem' }}
              autoFocus
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCatColor(c)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: catColor === c ? '2px solid var(--text-primary)' : 'none',
                    cursor: 'pointer'
                  }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAddingCat(false)}
                className="btn btn-ghost"
                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Categories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {categories.length === 0 ? (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '8px' }}>
              No categories yet
            </p>
          ) : (
            categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--primary-subtle)' : 'transparent'
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedCategory(isSelected ? null : cat.id);
                      setActiveFilter('all');
                    }}
                    className="btn btn-ghost"
                    style={{
                      flex: 1,
                      justifyContent: 'flex-start',
                      padding: '6px 12px',
                      color: isSelected ? 'var(--primary-text)' : 'inherit',
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: cat.color || '#6366f1'
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem' }}>{cat.name}</span>
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="btn btn-ghost"
                    style={{ padding: '6px', color: 'var(--text-muted)' }}
                    title={`Delete category ${cat.name}`}
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}

