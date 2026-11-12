const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('taskflow_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('taskflow_token', token);
    } else {
      localStorage.removeItem('taskflow_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('taskflow_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const detailedMsg = result?.error?.details?.[0]?.message;
      const errorMsg =
        detailedMsg ||
        result?.error?.message ||
        `Request failed with status ${response.status}: ${response.statusText}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.code = result?.error?.code || 'UNKNOWN_ERROR';
      err.details = result?.error?.details || null;
      throw err;
    }

    return result;
  }

  // Authentication
  async register(data) {
    const res = await this.request('/auth/register', { method: 'POST', body: data });
    if (res?.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async login(credentials) {
    const res = await this.request('/auth/login', { method: 'POST', body: credentials });
    if (res?.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async getMe() {
    const res = await this.request('/auth/me', { method: 'GET' });
    return res.data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  // Categories
  async getCategories() {
    const res = await this.request('/categories', { method: 'GET' });
    return res.data || [];
  }

  async createCategory(data) {
    const res = await this.request('/categories', { method: 'POST', body: data });
    return res.data;
  }

  async updateCategory(id, data) {
    const res = await this.request(`/categories/${id}`, { method: 'PUT', body: data });
    return res.data;
  }

  async deleteCategory(id) {
    const res = await this.request(`/categories/${id}`, { method: 'DELETE' });
    return res.data;
  }

  // Tasks
  async getTasks(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await this.request(`/tasks${queryString}`, { method: 'GET' });
    return {
      tasks: res.data || [],
      meta: res.meta || { page: 1, limit: 20, total: 0, totalPages: 1 }
    };
  }

  async getTaskById(id) {
    const res = await this.request(`/tasks/${id}`, { method: 'GET' });
    return res.data;
  }

  async createTask(data) {
    const res = await this.request('/tasks', { method: 'POST', body: data });
    return res.data;
  }

  async updateTask(id, data) {
    const res = await this.request(`/tasks/${id}`, { method: 'PUT', body: data });
    return res.data;
  }

  async patchTask(id, data) {
    const res = await this.request(`/tasks/${id}`, { method: 'PATCH', body: data });
    return res.data;
  }

  async deleteTask(id) {
    const res = await this.request(`/tasks/${id}`, { method: 'DELETE' });
    return res.data;
  }

  async getTaskStats() {
    const res = await this.request('/tasks/stats/summary', { method: 'GET' });
    return res.data || {};
  }
}

export const api = new ApiService();

