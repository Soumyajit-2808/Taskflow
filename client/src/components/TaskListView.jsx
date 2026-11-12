import React from 'react';
import {
  Check,
  Calendar,
  AlertTriangle,
  MoreVertical,
  Trash2,
  Edit2,
  Clock
} from 'lucide-react';

export default function TaskListView({ tasks, onToggleComplete, onEditTask, onDeleteTask }) {
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const now = new Date();
    const isOverdue = d < now && d.toDateString() !== now.toDateString();
    const isToday = d.toDateString() === now.toDateString();

    const formatted = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });

    return { formatted, isOverdue, isToday };
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map((task, index) => {
          const isDone = task.status === 'completed';
          const due = formatDueDate(task.dueDate);

          return (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: index < tasks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                gap: '12px',
                transition: 'background-color 150ms ease',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => onToggleComplete(task)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: isDone ? 'none' : '2px solid var(--border-strong)',
                  backgroundColor: isDone ? 'var(--status-completed-dot)' : 'transparent',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                aria-label={isDone ? 'Mark task pending' : 'Mark task completed'}
              >
                {isDone && <Check size={12} strokeWidth={3} />}
              </button>

              {/* Title & Description */}
              <div
                style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                onClick={() => onEditTask(task)}
              >
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {task.title}
                </div>
                {task.description && (
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-tertiary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {task.description}
                  </p>
                )}
              </div>

              {/* Category */}
              {task.category && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: task.category.color || '#6366f1'
                    }}
                  />
                  {task.category.name}
                </span>
              )}

              {/* Priority Pill */}
              <span className={`badge badge-priority-${task.priority}`}>
                {task.priority.toUpperCase()}
              </span>

              {/* Status Badge */}
              <span className={`badge badge-status-${task.status}`}>
                {task.status.replace('_', ' ')}
              </span>

              {/* Due Date */}
              {due && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: due.isOverdue && !isDone
                      ? 'var(--danger-bg)'
                      : due.isToday && !isDone
                      ? 'var(--priority-high-bg)'
                      : 'transparent',
                    color: due.isOverdue && !isDone
                      ? 'var(--danger-text)'
                      : due.isToday && !isDone
                      ? 'var(--priority-high-text)'
                      : 'var(--text-tertiary)',
                    fontWeight: due.isOverdue || due.isToday ? 600 : 400
                  }}
                >
                  <Calendar size={12} />
                  {due.formatted}
                </span>
              )}

              {/* Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => onEditTask(task)}
                  className="btn btn-ghost"
                  style={{ padding: '6px', color: 'var(--text-secondary)' }}
                  title="Edit task"
                  aria-label="Edit task"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="btn btn-ghost"
                  style={{ padding: '6px', color: 'var(--danger-text)' }}
                  title="Delete task"
                  aria-label="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

