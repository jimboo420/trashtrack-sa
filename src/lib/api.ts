import {
  User,
  PickupSchedule,
  EducationalContent,
  Report,
  ReportSchedule
} from '@/data';

// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Generic API functions
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error responses from the backend
      if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    }

    return data;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
    }
    throw error;
  }
}

// Users API
export const usersApi = {
  getAll: (): Promise<User[]> => apiRequest('/users'),
  getById: (id: number): Promise<User> => apiRequest(`/users/${id}`),
  login: (email: string, password: string): Promise<User> =>
    apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  create: (user: Omit<User, 'user_id'>): Promise<{ user_id: number; message: string }> =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
  update: (id: number, user: Partial<User>): Promise<{ message: string }> =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),
  delete: (id: number): Promise<{ message: string }> =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Pickup Schedules API
export const pickupSchedulesApi = {
  getAll: (): Promise<PickupSchedule[]> => apiRequest('/pickup-schedules'),
  getById: (id: number): Promise<PickupSchedule> => apiRequest(`/pickup-schedules/${id}`),
  create: (schedule: Omit<PickupSchedule, 'schedule_id'>): Promise<{ schedule_id: number; message: string }> =>
    apiRequest('/pickup-schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    }),
  update: (id: number, schedule: Partial<PickupSchedule>): Promise<{ message: string }> =>
    apiRequest(`/pickup-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schedule),
    }),
  delete: (id: number): Promise<{ message: string }> =>
    apiRequest(`/pickup-schedules/${id}`, {
      method: 'DELETE',
    }),
};

// Educational Content API
export const educationalContentApi = {
  getAll: (): Promise<EducationalContent[]> => apiRequest('/educational-content'),
  getById: (id: number): Promise<EducationalContent> => apiRequest(`/educational-content/${id}`),
  create: (content: Omit<EducationalContent, 'content_id'>): Promise<{ content_id: number; message: string }> =>
    apiRequest('/educational-content', {
      method: 'POST',
      body: JSON.stringify(content),
    }),
  update: (id: number, content: Partial<EducationalContent>): Promise<{ message: string }> =>
    apiRequest(`/educational-content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    }),
  delete: (id: number): Promise<{ message: string }> =>
    apiRequest(`/educational-content/${id}`, {
      method: 'DELETE',
    }),
};

// Reports API
export const reportsApi = {
  getAll: (): Promise<Report[]> => apiRequest('/reports'),
  getById: (id: number): Promise<Report> => apiRequest(`/reports/${id}`),
  create: (report: Omit<Report, 'report_id'>): Promise<{ report_id: number; message: string }> =>
    apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    }),
  update: (id: number, report: Partial<Report>): Promise<{ message: string }> =>
    apiRequest(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(report),
    }),
  delete: (id: number): Promise<{ message: string }> =>
    apiRequest(`/reports/${id}`, {
      method: 'DELETE',
    }),
};

// Report Schedules API
export const reportSchedulesApi = {
  getAll: (): Promise<ReportSchedule[]> => apiRequest('/report-schedules'),
  getById: (id: number): Promise<ReportSchedule> => apiRequest(`/report-schedules/${id}`),
  create: (schedule: Omit<ReportSchedule, 'report_schedule_id'>): Promise<{ report_schedule_id: number; message: string }> =>
    apiRequest('/report-schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    }),
  update: (id: number, schedule: Partial<ReportSchedule>): Promise<{ message: string }> =>
    apiRequest(`/report-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schedule),
    }),
  delete: (id: number): Promise<{ message: string }> =>
    apiRequest(`/report-schedules/${id}`, {
      method: 'DELETE',
    }),
};

// Re-export for backward compatibility (lowercase API)
export const usersAPI = usersApi;
export const pickupSchedulesAPI = pickupSchedulesApi;
export const educationalContentAPI = educationalContentApi;
export const reportsAPI = reportsApi;
export const reportSchedulesAPI = reportSchedulesApi;
