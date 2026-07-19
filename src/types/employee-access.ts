// ---- Employee Access Types ----

export interface Tenant {
  id: string;
  name: string;
  slug: string;
}

export interface EmployeeSession {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  tenantId: string;
  tenantName: string;
  expiresAt: string; // ISO-8601, 24h from creation
}

export interface LoginRequest {
  tenantSlug: string; // required
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  employee?: {
    employeeId: string;
    employeeCode: string;
    email: string;
    name: string;
    status: string;
    mustChangePassword?: boolean;
    lastAccessAt?: string;
  };
  mustChangePassword?: boolean;
  error?: string;
  errorCode?: string;
}

export interface RegisterRequest {
  tenantSlug: string;
  employeeCode: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface RegisterResponse {
  success: boolean;
  employee?: {
    employeeId: string;
    employeeCode: string;
    email: string;
    name: string;
    status: string;
  };
  error?: string;
  errorCode?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  employee?: Record<string, unknown>;
  error?: string;
  errorCode?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  session?: EmployeeSession;
}
