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
  phoneNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

/** Public / individual sign-up — no organisation, no employee code (FR-079). */
export interface IndividualRegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

export interface IndividualRegisterResponse {
  success: boolean;
  employee?: {
    employeeId: string;
    employeeCode: string;
    email: string;
    name: string;
    status: string;
    tenantId: string;
    phoneNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;
  };
  error?: string;
  errorCode?: string;
}

export interface RegisterResponse {
  success: boolean;
  employee?: {
    employeeId: string;
    employeeCode: string;
    email: string;
    name: string;
    status: string;
    phoneNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;
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

export interface ForgotPasswordRequest {
  tenantSlug: string;
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  error?: string;
  errorCode?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  session?: EmployeeSession;
}
