// Spring Boot API Configuration
// const API_BASE_URL = 'http://localhost:8081/api/v1';
const API_BASE_URL =    'http://13.247.159.172:8080/api/v1';

// Token management
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// ============== Types ==============
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Session {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string | null;
  target: number;
  type: string;
  sessionId: string | null;
  session?: Session;
}

export interface Subscription {
  id: string;
  userId: string;
  challengeId: string;
  target: number;
  name: string | null;
  description: string | null;
  type: string | null;
  challenge?: Challenge;
}

export interface ChallengeReport {
  id: string;
  subscriptionId: string;
  numberEvangelizedTo: number;
  numberOfNewConverts: number;
  numberFollowedUp: number;
  difficulties: string | null;
  remark: string | null;
  reportDate: string;
  subscription?: Subscription;
}

// ============== Auth API ==============
export const authApi = {
  signUp: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    setAuthToken(response.token);
    return response;
  },

  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/authenticate', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  signOut: (): void => {
    removeAuthToken();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      return await apiRequest<User>('/auth/me');
    } catch {
      removeAuthToken();
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// ============== Profile API ==============
export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    return apiRequest<Profile>('/profiles/me');
  },

  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    return apiRequest<Profile>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getAllProfiles: async (): Promise<Profile[]> => {
    return apiRequest<Profile[]>('/profiles');
  },

  deleteProfile: async (id: string): Promise<void> => {
    return apiRequest<void>(`/profiles/${id}`, { method: 'DELETE' });
  },
};

// ============== Session API ==============
export const sessionApi = {
  getAll: async (): Promise<Session[]> => {
    return apiRequest<Session[]>('/sessions');
  },

  getById: async (id: string): Promise<Session> => {
    return apiRequest<Session>(`/sessions/${id}`);
  },

  create: async (data: Omit<Session, 'id'>): Promise<Session> => {
    return apiRequest<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Session>): Promise<Session> => {
    return apiRequest<Session>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/sessions/${id}`, { method: 'DELETE' });
  },
};

// ============== Challenge API ==============
export const challengeApi = {
  getAll: async (): Promise<Challenge[]> => {
    return apiRequest<Challenge[]>('/challenges');
  },

  getById: async (id: string): Promise<Challenge> => {
    return apiRequest<Challenge>(`/challenges/${id}`);
  },

  getBySessionId: async (sessionId: string): Promise<Challenge[]> => {
    return apiRequest<Challenge[]>(`/challenges?sessionId=${sessionId}`);
  },

  create: async (data: Omit<Challenge, 'id'>): Promise<Challenge> => {
    return apiRequest<Challenge>('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Challenge>): Promise<Challenge> => {
    return apiRequest<Challenge>(`/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/challenges/${id}`, { method: 'DELETE' });
  },
};

// ============== Subscription API ==============
export const subscriptionApi = {
  getAll: async (): Promise<Subscription[]> => {
    return apiRequest<Subscription[]>('/subscriptions');
  },

  getMine: async (): Promise<Subscription[]> => {
    return apiRequest<Subscription[]>('/subscriptions/me');
  },

  getById: async (id: string): Promise<Subscription> => {
    return apiRequest<Subscription>(`/subscriptions/${id}`);
  },

  create: async (data: {
    challengeId: string;
    target: number;
    name?: string;
    description?: string;
    type?: string;
  }): Promise<Subscription> => {
    return apiRequest<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/subscriptions/${id}`, { method: 'DELETE' });
  },

  checkExists: async (challengeId: string): Promise<boolean> => {
    try {
      const subs = await apiRequest<Subscription[]>(`/subscriptions/me?challengeId=${challengeId}`);
      return subs.length > 0;
    } catch {
      return false;
    }
  },
};

// ============== Challenge Report API ==============
export const reportApi = {
  getAll: async (): Promise<ChallengeReport[]> => {
    return apiRequest<ChallengeReport[]>('/reports');
  },

  getMine: async (): Promise<ChallengeReport[]> => {
    return apiRequest<ChallengeReport[]>('/reports/me');
  },

  getById: async (id: string): Promise<ChallengeReport> => {
    return apiRequest<ChallengeReport>(`/reports/${id}`);
  },

  getBySubscriptionId: async (subscriptionId: string): Promise<ChallengeReport[]> => {
    return apiRequest<ChallengeReport[]>(`/reports?subscriptionId=${subscriptionId}`);
  },

  create: async (data: {
    subscriptionId: string;
    numberEvangelizedTo: number;
    numberOfNewConverts: number;
    numberFollowedUp: number;
    difficulties?: string;
    remark?: string;
    reportDate: string;
  }): Promise<ChallengeReport> => {
    return apiRequest<ChallengeReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<ChallengeReport>
  ): Promise<ChallengeReport> => {
    return apiRequest<ChallengeReport>(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/reports/${id}`, { method: 'DELETE' });
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };
