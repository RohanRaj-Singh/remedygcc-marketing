// ---- Employee Access Types ----

export interface Tenant {
  id: string;
  name: string;
  slug: string;
}

export interface EmployeeAuth {
  id: string;
  tenantId: string;
  employeeCode: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  pinHash: string;
  failedLoginAttempts: number;
  lockedUntil: string | null; // ISO-8601
  lastAccessAt: string | null; // ISO-8601
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

export interface EmployeeSession {
  employeeCode: string;
  employeeName: string;
  tenantId: string;
  tenantName: string;
  expiresAt: string; // ISO-8601
}

export interface LoginRequest {
  tenantSlug: string;
  employeeCode: string;
  pin: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
  errorCode?:
    | "TENANT_NOT_FOUND"
    | "EMPLOYEE_NOT_FOUND"
    | "EMPLOYEE_INACTIVE"
    | "EMPLOYEE_LOCKED"
    | "INVALID_PIN"
    | "INVALID_CREDENTIALS";
  lockedUntil?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  session?: EmployeeSession;
}
