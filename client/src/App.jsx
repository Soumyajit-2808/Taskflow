import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutList,
  Kanban,
  Filter,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MetricsSummary from './components/MetricsSummary';
import TaskListView from './components/TaskListView';
import KanbanBoardView from './components/KanbanBoardView';
import TaskModal from './components/TaskModal';
import AuthView from './components/AuthView';
import EmptyState from './components/EmptyState';

export default function App() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // State
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Views
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
  const [search, setSearch] = useState('');
  const [activeNavFilter, setActiveNavFilter] = useState('all'); // 'all', 'today', 'overdue', 'completed'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskDefaultStatus, setNewTaskDefaultStatus] = useState('pending');

  // Load Categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Load Stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getTaskStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Load Tasks
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.categoryId = selectedCategory;
      if (priorityFilter) params.priority = priorityFilter;

      // Handle Nav Filter vs Status Filter
      if (activeNavFilter === 'completed') {
        params.status = 'completed';
      } else if (activeNavFilter === 'today') {
        // Filter in client or status
      } else if (activeNavFilter === 'overdue') {
        // Handled in client or query
      } else if (statusFilter) {
        params.status = statusFilter;
      }

      const res = await api.getTasks(params);
      let list = res.tasks;

      // In-memory filter for today / overdue if selected in sidebar
      if (activeNavFilter === 'today') {
        const todayStr = new Date().toDateString();
        list = list.filter(
          (t) => t.dueDate && new Date(t.dueDate).toDateString() === todayStr
        );
      } else if (activeNavFilter === 'overdue') {
        const now = new Date();
        list = list.filter(
          (t) =>
            t.dueDate &&
            new Date(t.dueDate) < now &&
            t.status !== 'completed' &&
            t.status !== 'archived'
        );
      }

      setTasks(list);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, search, selectedCategory, priorityFilter, statusFilter, activeNavFilter]);

  // Initial & Filter Data Load
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchStats();
      fetchTasks();
    }
  }, [isAuthenticated, fetchCategories, fetchStats, fetchTasks]);

  // Global Keyboard Shortcuts (Ctrl+K, N, Esc)
  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      // Ignore if user is inside an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) searchInput.focus();
      } else if (e.key.toLowerCase() === 'n' && !isTaskModalOpen) {
        e.preventDefault();
        handleOpenCreateTask();
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [isTaskModalOpen]);

  // Task Handlers
  const handleOpenCreateTask = (status = 'pending') => {
    setEditingTask(null);
    setNewTaskDefaultStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.updateTask(editingTask.id, taskData);
      } else {
        await api.createTask(taskData);
      }
      setIsTaskModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert(`Error saving task: ${err.message}`);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setIsTaskModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };

  const handleToggleComplete = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.patchTask(task.id, { status: nextStatus });
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert(`Error updating task: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await api.patchTask(id, { status: nextStatus });
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Category Handlers
  const handleAddCategory = async (catData) => {
    try {
      await api.createCategory(catData);
      fetchCategories();
    } catch (err) {
      alert(`Error creating category: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      if (selectedCategory === id) setSelectedCategory(null);
      fetchCategories();
      fetchTasks();
    } catch (err) {
      alert(`Error deleting category: ${err.message}`);
    }
  };

  const handleSelectMetric = (metricId) => {
    if (metricId === 'all') {
      setActiveNavFilter('all');
      setStatusFilter('');
    } else if (metricId === 'overdue') {
      setActiveNavFilter('overdue');
      setStatusFilter('');
    } else {
      setActiveNavFilter('all');
      setStatusFilter(metricId);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setActiveNavFilter('all');
    setSelectedCategory(null);
    setPriorityFilter('');
    setStatusFilter('');
  };

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-app)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '3px solid var(--border-default)',
              borderTopColor: 'var(--primary-500)',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Loading TaskFlow workspace...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

  const isFiltered = Boolean(
    search || selectedCategory || priorityFilter || statusFilter || activeNavFilter !== 'all'
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header
        search={search}
        setSearch={setSearch}
        onOpenNewTask={() => handleOpenCreateTask()}
      />

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar */}
        <Sidebar
          activeFilter={activeNavFilter}
          setActiveFilter={setActiveNavFilter}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onOpenNewTask={() => handleOpenCreateTask()}
          stats={stats}
        />

        {/* Content Canvas */}
        <main
          style={{
            flex: 1,
            padding: '28px 32px',
            backgroundColor: 'var(--bg-app)',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 56px)'
          }}
        >
          {/* Metrics Summary Strip */}
          <MetricsSummary
            stats={stats}
            onSelectMetric={handleSelectMetric}
            activeMetric={statusFilter || activeNavFilter}
          />

          {/* Action & Filter Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            {/* Filters Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select"
                style={{ width: 'auto', height: '36px', fontSize: '0.8125rem' }}
                aria-label="Filter by status"
              >
                <option value="">Status: All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="select"
                style={{ width: 'auto', height: '36px', fontSize: '0.8125rem' }}
                aria-label="Filter by priority"
              >
                <option value="">Priority: All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* View Switcher: List vs Kanban Board */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                padding: '2px'
              }}
              role="radiogroup"
              aria-label="View mode toggle"
            >
              <button
                onClick={() => setViewMode('list')}
                className="btn btn-ghost"
                style={{
                  padding: '6px 10px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: viewMode === 'list' ? 'var(--primary-subtle)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--primary-text)' : 'var(--text-secondary)',
                  fontWeight: viewMode === 'list' ? 600 : 400
                }}
                aria-pressed={viewMode === 'list'}
                title="List View"
              >
                <LayoutList size={16} /> List
              </button>
              <button
                onClick={() => setViewMode('board')}
                className="btn btn-ghost"
                style={{
                  padding: '6px 10px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: viewMode === 'board' ? 'var(--primary-subtle)' : 'transparent',
                  color: viewMode === 'board' ? 'var(--primary-text)' : 'var(--text-secondary)',
                  fontWeight: viewMode === 'board' ? 600 : 400
                }}
                aria-pressed={viewMode === 'board'}
                title="Kanban Board View"
              >
                <Kanban size={16} /> Board
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger-text)',
                marginBottom: '16px',
                fontSize: '0.875rem'
              }}
            >
              {error}
            </div>
          )}

          {/* Main Tasks Content */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton" style={{ height: '48px', width: '100%' }} />
              <div className="skeleton" style={{ height: '48px', width: '100%' }} />
              <div className="skeleton" style={{ height: '48px', width: '100%' }} />
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState isFiltered={isFiltered} onAction={isFiltered ? resetFilters : () => handleOpenCreateTask()} />
          ) : viewMode === 'list' ? (
            <TaskListView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleOpenEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <KanbanBoardView
              tasks={tasks}
              onEditTask={handleOpenEditTask}
              onUpdateStatus={handleUpdateStatus}
              onOpenNewTaskWithStatus={(status) => handleOpenCreateTask(status)}
            />
          )}
        </main>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={editingTask}
        categories={categories}
        defaultStatus={newTaskDefaultStatus}
      />
    </div>
  );
}

