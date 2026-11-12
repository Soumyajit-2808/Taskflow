import React, { useState, useEffect } from 'react';
import { X, Calendar, Trash2, Check, AlertCircle } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task = null,
  categories = [],
  defaultStatus = 'pending'
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setCategoryId(task.category?.id || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'pending');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setCategoryId('');
      setPriority('medium');
      setStatus(defaultStatus);
      setDueDate('');
    }
    setConfirmDelete(false);
    setError('');
  }, [task, defaultStatus, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      categoryId: categoryId || null,
      priority,
      status,
      dueDate: dueDate ? new Date(`${dueDate}T23:59:59Z`).toISOString() : null
    };

    onSave(payload);
  };

  const setPresetDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDueDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '24px', gap: '20px' }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '4px' }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            role="alert"
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label className="label" htmlFor="task-title">
              Title <span style={{ color: 'var(--danger-text)' }}>*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Implement authentication middleware"
              className="input"
              autoFocus
              required
            />
          </div>

          {/* Grid: Category, Priority, Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {/* Category */}
            <div>
              <label className="label" htmlFor="task-category">Category</label>
              <select
                id="task-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="select"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="label" htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="label" htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="select"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Due Date & Quick Presets */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="label" htmlFor="task-due-date">Due Date</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setPresetDate(0)}
                  className="btn btn-ghost"
                  style={{ padding: '2px 6px', fontSize: '0.6875rem' }}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(1)}
                  className="btn btn-ghost"
                  style={{ padding: '2px 6px', fontSize: '0.6875rem' }}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(7)}
                  className="btn btn-ghost"
                  style={{ padding: '2px 6px', fontSize: '0.6875rem' }}
                >
                  Next Week
                </button>
              </div>
            </div>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="label" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional context or task notes..."
              rows={4}
              className="textarea"
            />
          </div>

          {/* Modal Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '8px'
            }}
          >
            {task ? (
              confirmDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--danger-text)' }}>
                    Delete task?
                  </span>
                  <button
                    type="button"
                    onClick={() => onDelete(task.id)}
                    className="btn btn-danger"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="btn btn-ghost"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="btn btn-ghost"
                  style={{ color: 'var(--danger-text)', padding: '6px 8px' }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              )
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" id="btn-save-task">
                {task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

