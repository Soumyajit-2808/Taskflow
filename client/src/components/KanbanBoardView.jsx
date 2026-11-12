import React from 'react';
import { ArrowRight, ArrowLeft, Calendar, Plus, Check } from 'lucide-react';

export default function KanbanBoardView({
  tasks,
  onEditTask,
  onUpdateStatus,
  onOpenNewTaskWithStatus
}) {
  const columns = [
    { id: 'pending', title: 'To Do', dotColor: 'var(--status-pending-dot)' },
    { id: 'in_progress', title: 'In Progress', dotColor: 'var(--status-inprogress-dot)' },
    { id: 'completed', title: 'Completed', dotColor: 'var(--status-completed-dot)' }
  ];

  const getNextStatus = (current) => {
    if (current === 'pending') return 'in_progress';
    if (current === 'in_progress') return 'completed';
    return null;
  };

  const getPrevStatus = (current) => {
    if (current === 'completed') return 'in_progress';
    if (current === 'in_progress') return 'pending';
    return null;
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        alignItems: 'start'
      }}
    >
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minHeight: '400px'
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: col.dotColor
                  }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {col.title}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={() => onOpenNewTaskWithStatus(col.id)}
                className="btn btn-ghost"
                style={{ padding: '4px', height: 'auto' }}
                title={`Add task to ${col.title}`}
                aria-label={`Add task to ${col.title}`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Task Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {colTasks.map((task) => {
                const next = getNextStatus(task.status);
                const prev = getPrevStatus(task.status);

                return (
                  <div
                    key={task.id}
                    className="card"
                    style={{
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      transition: 'transform 150ms ease, box-shadow 150ms ease'
                    }}
                    onClick={() => onEditTask(task)}
                  >
                    {/* Tags row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {task.category ? (
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
                      ) : (
                        <span />
                      )}

                      <span className={`badge badge-priority-${task.priority}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>

                    {/* Task Title */}
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1.3
                      }}
                    >
                      {task.title}
                    </div>

                    {task.description && (
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-tertiary)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Footer Row: Due Date & Transitions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '4px',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--border-subtle)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {task.dueDate ? (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            color: 'var(--text-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Calendar size={12} />
                          {new Date(task.dueDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      ) : (
                        <span />
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {prev && (
                          <button
                            onClick={() => onUpdateStatus(task.id, prev)}
                            className="btn btn-ghost"
                            style={{ padding: '4px 6px', height: '24px' }}
                            title={`Move to ${prev.replace('_', ' ')}`}
                            aria-label={`Move to ${prev.replace('_', ' ')}`}
                          >
                            <ArrowLeft size={12} />
                          </button>
                        )}
                        {next && (
                          <button
                            onClick={() => onUpdateStatus(task.id, next)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', height: '24px', fontSize: '0.6875rem' }}
                            title={`Move to ${next.replace('_', ' ')}`}
                            aria-label={`Move to ${next.replace('_', ' ')}`}
                          >
                            <span>Advance</span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

