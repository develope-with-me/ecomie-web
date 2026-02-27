// Spring Boot API Configuration
// const API_BASE_URL = 'http://localhost:8081/api/v1';
// const API_BASE_URL =    'http://13.247.159.172:8080/api/v1';
import {string} from "zod";

const API_BASE_URL =    'http://localhost:8081/api/v1';

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

const getAuthHeaders = (contentType: string): HeadersInit => {
  const token = getAuthToken();
  if (contentType) {
      return {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      };
  }
  return {
    // 'Content-Type':  !contentType ? 'application/json' : contentType,
    'Content-Type':  'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper
const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {},
    contentType?: string | undefined | null,
): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
        ...options,
        headers: {
            ...getAuthHeaders(contentType),
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error: EcomieError = await response.json().catch(() => ({ message: 'An error occurred' }));
        console.log(error);
        // throw new Error(error.detail || `HTTP error! status: ${response.status}`);
        throw error;
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export class UserRole {
    static SUPER_ADMIN = 'SUPER_ADMIN';
    static ADMIN = 'ADMIN';
    static ECOMIEST = 'ECOMIEST';
    static USER = 'USER';
    static COACH = 'COACH';

    static isValid(role) {
        return [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.ECOMIEST, UserRole.COACH].includes(role);
    }
};

export class SessionStatus {
    static INACTIVE = 'INACTIVE';
    static ONGOING = 'ONGOING';
    static UPCOMING = 'UPCOMING';
    static PAUSED = 'PAUSED';
    static ENDED = 'ENDED';

    static isValid(status) {
        return [SessionStatus.INACTIVE, SessionStatus.ONGOING,  SessionStatus.UPCOMING, SessionStatus.PAUSED, SessionStatus.ENDED].includes(status);
    }
};

export class ChallengeType {
    static NORMAL = 'NORMAL';
    static EVENT = 'EVENT';
    static INDIVIDUAL = 'INDIVIDUAL';

    static isValid(type) {
        return [ChallengeType.NORMAL, ChallengeType.EVENT, ChallengeType.INDIVIDUAL].includes(type);
    }
};


// ============== Types ==============
export interface ProblemError {
    name: string | null | undefined;
    reason: string | null | undefined;
}

export interface EcomieError extends Error {
    type: string | null;
    title: string | null;
    status: number;
    errorCode: string | null;
    detail: string | null;
    instance: string | null;
    invalidParams: ProblemError[] | null;
}

export interface User {
  id: string | null | undefined;
  email: string | null | undefined;
  firstName: string;
  lastName: string;
  role?:  UserRole | null;
  phoneNumber: string;
  country: string;
  region: string;
  city: string;
  language: string;
  profilePictureFileName: string;
  accountEnabled: boolean | null | undefined;
  accountBlocked: boolean | null | undefined;
  accountSoftDeleted: boolean | null | undefined;
  createdOn: string | null | undefined;
  updatedOn: string | null | undefined;
  createdBy: string | null | undefined;
  updatedBy: string | null | undefined;
}

export interface AuthResponse {
  token: string;
  message: string;
  success: boolean;
  user?: User;
}

export interface GenericResponse {
    success: boolean;
    description: string;
    data: User | Session | Challenge | Subscription | ChallengeReport | null;
}

export interface ConfirmAccountResponse {
    token: string;
    responseMessage: GenericResponse;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SubscriptionBody {
    target: number;
    challengeId: string;
}

export interface ReportRequestBody {
    numberEvangelizedTo: number;
    numberOfNewConverts: number;
    numberFollowedUp: number;
    difficulties?: string;
    remark?: string;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Session {
  id: string | null | undefined;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: SessionStatus | null;
  challenges?: Challenge[] | null;
  createdOn: string | null | undefined;
  updatedOn: string | null | undefined;
  createdBy: string | null | undefined;
  updatedBy: string | null | undefined;
}


export interface Challenge {
  id: string | null | undefined;
  name: string;
  description: string | null;
  target: number;
  type: ChallengeType | null;
  sessions?: Session[] | null;
  createdOn: string | null | undefined;
  updatedOn: string | null | undefined;
  createdBy: string | null | undefined;
  updatedBy: string | null | undefined;
}

export interface Subscription {
  id: string | null | undefined;
  userId: string;
  challengeId: string;
  target: number;
  name: string | null;
  description: string | null;
  type: string | null;
  challenge?: Challenge | null;
  createdOn: string | null | undefined;
  updatedOn: string | null | undefined;
  createdBy: string | null | undefined;
  updatedBy: string | null | undefined;
}

export interface ChallengeReport {
  id: string | null | undefined;
  subscriptionId: string;
  numberEvangelizedTo: number;
  numberOfNewConverts: number;
  numberFollowedUp: number;
  difficulties: string | null;
  remark: string | null;
  reportDate: string;
  subscription?: Subscription | null;
  createdOn: string | null | undefined;
  updatedOn: string | null | undefined;
  createdBy: string | null | undefined;
  updatedBy: string | null | undefined;
}

// ============== Auth API ==============
export const authApi = {
  signUp: async ( data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
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

  resendConfirmationLink: async (email: string): Promise<GenericResponse> => {
      return await apiRequest<GenericResponse>('/auth/resend-link', {
          method: 'POST',
          body: JSON.stringify({email}),
      });
  },

  sendPasswordResetLink: async (email: string): Promise<GenericResponse> => {
      return await apiRequest<GenericResponse>('/auth/reset-password/link', {
        method: 'POST',
        body: JSON.stringify({email}),
    });
  },

  resetPassword: async (email: string, token: string, oldPassword: string, password: string, confirmPassword: string): Promise<GenericResponse> => {
      return await apiRequest<GenericResponse>(`/auth/reset-password?email=${email}&token=${token}`, {
        method: 'POST',
        body: JSON.stringify({ oldPassword, password, confirmPassword }),
    });
  },

  confirmAccount: async (email: string, token: string): Promise<ConfirmAccountResponse> => {
      return await apiRequest<ConfirmAccountResponse>(`/auth/confirm-account?email=${email}&token=${token}`, {
        method: 'POST'
    });
  },

  signOut: (): void => {
    removeAuthToken();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      return await apiRequest<User>('/secure/user/me');
    } catch {
      removeAuthToken();
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// ============== User API ==============
export const userApi = {

    create: async (data: RegisterRequest): Promise<AuthResponse> => {
        return apiRequest<AuthResponse>('/secure/admin/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

  getMyUserProfile: async (): Promise<User> => {
    return apiRequest<User>('/secure/user/me');
  },

  getMyPix: async (): Promise<string> => {
    return apiRequest<string>('/secure/user/my-pix');
  },

  getUserProfile: async (id: string): Promise<User> => {
    return apiRequest<User>(`/secure/admin/users/${id}`);
  },

  toggleBlock: async (id: string): Promise<GenericResponse> => {
      return apiRequest<GenericResponse>(`/secure/admin/block/users/${id}`, {
          method: 'PUT'
      });
  },

  enableUser: async (id: string): Promise<GenericResponse> => {
      return apiRequest<GenericResponse>(`/secure/admin/enable/users/${id}`, {
          method: 'PUT'
      });
  },

  getUserPix: async (id: string): Promise<string> => {
    return apiRequest<string>(`/secure/admin/user-pix/${id}`);
  },

  getSessionUsers: async (sessionId: string): Promise<User> => {
    return apiRequest<User>(`/secure/admin/sessions/${sessionId}/users`);
  },

    requestRoleChange: async (role: string): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>(`/secure/user/request-to-become/${role}`, {
            method: 'POST'
        });
    },

    assignNewRole: async (email: string, role: string): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>('/secure/admin/update-user-role', {
            method: 'PUT',
            body: JSON.stringify({email, role}),
        });
    },

    softDeleteUser: async (id: string): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>(`/secure/admin/soft-del/users/${id}`, {
            method: 'PUT'
        });
    },

    // updateUserProfile: async (id: string, data: Partial<User>): Promise<GenericResponse> => {
    //     return apiRequest<GenericResponse>(`/secure/admin/update/users/${id}`, {
    //         method: 'PUT',
    //         body: JSON.stringify(data),
    //     });
    // },

    updateUserProfile: async (id: string, data: Partial<User> & { avatar?: File | null }): Promise<GenericResponse> => {
        // Build FormData and append only provided fields
        const form = new FormData();

        // if (data.firstName !== undefined && data.firstName !== null) {
        //     form.append('firstName', String(data.firstName));
        // }
        // if (data.lastName !== undefined && data.lastName !== null) {
        //     form.append('lastName', String(data.lastName));
        // }
        // if (data.phoneNumber !== undefined && data.phoneNumber !== null) {
        //     form.append('phoneNumber', String(data.phoneNumber));
        // }
        // if (data.country !== undefined && data.country !== null) {
        //     form.append('country', String(data.country));
        // }
        // if (data.region !== undefined && data.region !== null) {
        //     form.append('region', String(data.region));
        // }
        // if (data.city !== undefined && data.city !== null) {
        //     form.append('city', String(data.city));
        // }

        const { avatar, ...newData } = data;

        form.append('json', JSON.stringify(newData));
        // If caller provided an avatar File, append it. Accept null to explicitly clear avatar if backend supports it.
        if (data.avatar instanceof File) {
            form.append('file', data.avatar, data.avatar.name);
        }
        else if (data.avatar === null) {
            // Some backends expect an explicit empty value to clear files; use an empty string field named avatar-clear (adjust if your API differs)
            form.append('file', '');
        }

        // Do not set Content-Type header; let the browser add the correct multipart boundary.
        return apiRequest<GenericResponse>(`/secure/admin/update/users/${id}`, {
            method: 'PUT',
            body: form,
            // If your apiRequest helper automatically sets JSON headers for all requests,
            // you may need to pass an option to prevent that behavior or call fetch directly:
            // return fetch(`/secure/admin/update/users/${id}`, { method: 'PUT', body: form, credentials: 'include' }).then(res => res.json());
        }, 'multipart/form-data');
    },

    updateMyProfile: async (data: Partial<User>): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>('/secure/user/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getAllUsers: async (): Promise<User[]> => {
    return apiRequest<User[]>('/secure/admin/users');
  },

  deleteUserPix: async (id: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/user-pix/${id}/del`, { method: 'DELETE' });
  },

  deleteUser: async (id: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/del/users/${id}`, { method: 'DELETE' });
  },
};

// ============== Session API ==============
export const sessionApi = {
    create: async (data: Omit<Session, 'id' | 'challenges' | 'createdOn' | 'updatedOn' | 'createdBy' | 'updatedBy'>): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>('/secure/admin/sessions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

  getAll: async (): Promise<Session[]> => {
    return apiRequest<Session[]>('/sessions');
  },


  getAllUserSessions: async (userId: string): Promise<Session[]> => {
    return apiRequest<Session[]>(`/secure/admin/users/${userId}/sessions`);
  },


  getAllSecurely: async (): Promise<Session[]> => {
    return apiRequest<Session[]>('/secure/user/sessions');
  },

  getById: async (id: string): Promise<Session> => {
    return apiRequest<Session>(`/secure/user/sessions/${id}`);
  },

  update: async (id: string, data: Partial<Session>): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/sessions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({status}),
    });
  },

  removeChallenges: async (id: string, ids: string[]): Promise<Session> => {
    return apiRequest<Session>(`/secure/admin/sessions/${id}/remove/challenges`, {
      method: 'PUT',
      body: JSON.stringify({ids}),
    });
  },

  removeChallenge: async (id: string, challengeId: string): Promise<Session> => {
    return apiRequest<Session>(`/secure/admin/sessions/${id}/remove/challenges/${challengeId}`, {
      method: 'PUT'
    });
  },

  addChallenges: async (id: string, ids: string[]): Promise<Session> => {
    return apiRequest<Session>(`/secure/admin/sessions/${id}/assign/challenges`, {
      method: 'PUT',
      body: JSON.stringify({ids}),
    });
  },

  addChallenge: async (id: string, challengeId: string): Promise<Session> => {
    return apiRequest<Session>(`/secure/admin/sessions/${id}/assign/challenges/${challengeId}`, {
      method: 'PUT'
    });
  },


  delete: async (id: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/sessions/${id}`, { method: 'DELETE' });
  },
};

// ============== Challenge API ==============
export const challengeApi = {

    create: async (data: Omit<Challenge, 'id' | 'sessions' | 'createdOn' | 'updatedOn' | 'createdBy' | 'updatedBy' >): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>('/secure/admin/challenges', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

  getAll: async (): Promise<Challenge[]> => {
    return apiRequest<Challenge[]>('/challenges');
  },

  getById: async (id: string): Promise<Challenge> => {
    return apiRequest<Challenge>(`/secure/user/challenges/${id}`);
  },

  update: async (id: string, data: Partial<Challenge>): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateType: async (id: string, type: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/challenges/${id}/type`, {
      method: 'PUT',
      body: JSON.stringify({type}),
    });
  },

  delete: async (id: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/challenges/${id}`, { method: 'DELETE' });
  },
};

// ============== Subscription API ==============
export const subscriptionApi = {


    create: async (data: SubscriptionBody): Promise<Subscription> => {
        return apiRequest<Subscription>('/secure/ecomiest/subscriptions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    createForUser: async (userId:string, data: SubscriptionBody): Promise<Subscription> => {
        return apiRequest<Subscription>(`/secure/admin/subscriptions/user/${userId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getAll: async (): Promise<Subscription[]> => {
    return apiRequest<Subscription[]>('/secure/ecomiest/subscriptions');
  },

  getMine: async (): Promise<Subscription[]> => {
    return apiRequest<Subscription[]>('/secure/ecomiest/subscriptions');
  },

  getById: async (id: string): Promise<Subscription> => {
    return apiRequest<Subscription>(`/secure/ecomiest/subscriptions/${id}`);
  },

  getBySessionId: async (sessionId: string): Promise<Subscription[]> => {
    return apiRequest<Subscription[]>(`/secure/ecomiest/subscriptions/sessions/${sessionId}`);
  },

  update: async (id:string, data: SubscriptionBody): Promise<Subscription> => {
    return apiRequest<Subscription>(`/secure/admin/subscriptions/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  unsubscribeUser: async (sessionId: string, userId: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/subscriptions/${sessionId}/unsubscribe/user/${userId}`, { method: 'DELETE' });
  },

    delete: async (id: string): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>(`/secure/admin/subscriptions/${id}`, { method: 'DELETE' });
    },

    checkExists: async (challengeId: string): Promise<boolean> => {
    try {
      const subs = await apiRequest<Subscription[]>(`/subscriptions/me?challengeId=${challengeId}`);
      return subs.length > 0;
    } catch {
      return false;
    }
  },

    toggleBlock: async (id: string): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>(`/secure/admin/subscriptions/${id}/block`, {
            method: 'PUT'
        });
    },
    //
    //
    // getBySessionId: async (sessionId: string): Promise<Challenge[]> => {
    //     return apiRequest<Challenge[]>(`/challenges?sessionId=${sessionId}`);
    // },
};

// ============== Challenge Report API ==============
export const reportApi = {
    create: async (sessionId: string, data: ReportRequestBody): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>(`/secure/ecomiest/reports/session/${sessionId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    createForUser: async (userId: string, sessionId: string, data: ReportRequestBody): Promise<GenericResponse> => {
        return apiRequest<GenericResponse>(`/secure/admin/reports/user/${userId}/session/${sessionId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getAll: async (sessionId?: string, challengeId?: string): Promise<ChallengeReport[]> => {
        if (sessionId && challengeId) {
            return apiRequest<ChallengeReport[]>(`/secure/ecomiest/reports?sessionId=${sessionId}&challengeId=${challengeId}`);
        }
        if (sessionId) {
            return apiRequest<ChallengeReport[]>(`/secure/ecomiest/reports?sessionId=${sessionId}`);
        }
        if (challengeId) {
            return apiRequest<ChallengeReport[]>(`/secure/ecomiest/reports?challengeId=${challengeId}`);
        }

    return apiRequest<ChallengeReport[]>('/secure/ecomiest/reports');
  },

  getMine: async (sessionId?: string, challengeId?: string): Promise<ChallengeReport[]> => {
      if (sessionId && challengeId) {
          return apiRequest<ChallengeReport[]>(`/secure/ecomiest/reports?sessionId=${sessionId}&challengeId=${challengeId}`);
      }
      if (sessionId) {
          return apiRequest<ChallengeReport[]>(`/secure/ecomiest/reports?sessionId=${sessionId}`);
      }
      if (challengeId) {
          return apiRequest<ChallengeReport[]>(`/secure/ecomiest/reports?challengeId=${challengeId}`);
      }

      return apiRequest<ChallengeReport[]>('/secure/ecomiest/reports');  },

  getById: async (id: string): Promise<ChallengeReport> => {
    return apiRequest<ChallengeReport>(`/secure/ecomiest/reports/${id}`);
  },

  //
  // getBySubscriptionId: async (subscriptionId: string): Promise<ChallengeReport[]> => {
  //   return apiRequest<ChallengeReport[]>(`/reports?subscriptionId=${subscriptionId}`);
  // },

  update: async (
    id: string,
    data: Partial<ReportRequestBody>
  ): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/ecomiest/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateForUser: async (
    id: string,
    data: Partial<ReportRequestBody>
  ): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/admin/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>(`/secure/ecomiest/reports/${id}`, { method: 'DELETE' });
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };
