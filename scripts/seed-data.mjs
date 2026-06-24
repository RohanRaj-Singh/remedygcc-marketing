/**
 * Seed script — generates data/employees.json with pre-hashed PINs.
 *
 * Usage: node scripts/seed-data.mjs
 *
 * This script uses Node's built-in crypto (scrypt) so it needs NO dependencies
 * and runs outside of Next.js / TypeScript.
 */

import { scryptSync, randomBytes } from "node:crypto";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

// ── Pin hashing (must match src/lib/employee-access/pin-hash.ts) ────────────

function hashPin(pin) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// ── Seed data ──────────────────────────────────────────────────────────────

const EMPLOYEES = [
  {
    tenantSlug: "omantel",
    employeeCode: "OMT-001",
    employeeId: "OMT-001",
    name: "Ahmed Al Balushi",
    email: "ahmed.balushi@omantel.om",
    pin: "1234",
  },
  {
    tenantSlug: "omantel",
    employeeCode: "OMT-002",
    employeeId: "OMT-002",
    name: "Mariam Al Siyabi",
    email: "mariam.siyabi@omantel.om",
    pin: "1234",
  },
  {
    tenantSlug: "oq",
    employeeCode: "OQ-001",
    employeeId: "OQ-001",
    name: "Said Al Hinai",
    email: "said.hinai@oq.com",
    pin: "1234",
  },
  {
    tenantSlug: "oq",
    employeeCode: "OQ-002",
    employeeId: "OQ-002",
    name: "Noor Al Zadjali",
    email: "noor.zadjali@oq.com",
    pin: "1234",
  },
  {
    tenantSlug: "pdo",
    employeeCode: "PDO-001",
    employeeId: "PDO-001",
    name: "Fatma Al Riyami",
    email: "fatma.riyami@pdo.co.om",
    pin: "1234",
  },
  {
    tenantSlug: "pdo",
    employeeCode: "PDO-002",
    employeeId: "PDO-002",
    name: "Hamed Al Busaidi",
    email: "hamed.busaidi@pdo.co.om",
    pin: "1234",
  },
];

const TENANT_IDS = {
  omantel: "tenant-omantel",
  oq: "tenant-oq",
  pdo: "tenant-pdo",
};

// ── Generate output ────────────────────────────────────────────────────────

const now = new Date().toISOString();

const employees = EMPLOYEES.map((emp) => ({
  id: `emp-${emp.employeeCode.toLowerCase()}`,
  tenantId: TENANT_IDS[emp.tenantSlug],
  employeeCode: emp.employeeCode,
  employeeId: emp.employeeId,
  name: emp.name,
  email: emp.email,
  status: "active",
  pinHash: hashPin(emp.pin),
  failedLoginAttempts: 0,
  lockedUntil: null,
  lastAccessAt: null,
  createdAt: now,
  updatedAt: now,
}));

// ── Write ──────────────────────────────────────────────────────────────────

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

writeFileSync(join(DATA_DIR, "employees.json"), JSON.stringify(employees, null, 2));
console.log(`✅  Seeded ${employees.length} employees → data/employees.json`);
