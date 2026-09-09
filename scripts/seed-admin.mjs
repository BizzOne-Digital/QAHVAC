#!/usr/bin/env node
/**
 * Seeds the initial QP HVAC administrator account into data/db.json.
 *
 * Usage:  npm run seed:admin
 *
 * Credentials come from the environment (see .env.example):
 *   ADMIN_NAME      default "Administrator"
 *   ADMIN_EMAIL     default "admin@example.com"
 *   ADMIN_PASSWORD  required — no default is invented for you
 *
 * Running it repeatedly is safe: an existing account with the same email is
 * updated in place (password refreshed) rather than duplicated.
 *
 * The digest format `scrypt$<N>$<saltHex>$<hashHex>` must stay in step with
 * lib/password.ts, which verifies it at login.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomBytes, scryptSync } from 'node:crypto';

const SCRYPT_COST = 16384;
const KEY_LENGTH = 64;

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, 'utf-8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  }
}

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LENGTH, { N: SCRYPT_COST });
  return `scrypt$${SCRYPT_COST}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function readDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    console.error(
      `No database found at ${DB_FILE}.\n` +
        'Start the app once (npm run dev) so the initial data file is created, then re-run this script.'
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function main() {
  loadEnvFiles();

  const name = (process.env.ADMIN_NAME || 'Administrator').trim();
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.trim().length < 4) {
    console.error('ADMIN_PASSWORD is not set (or is shorter than 4 characters). Set it in .env.local and retry.');
    process.exit(1);
  }

  const db = readDatabase();
  if (!Array.isArray(db.admins)) db.admins = [];

  const now = new Date().toISOString();
  const existing = db.admins.find((admin) => admin.email?.toLowerCase() === email);

  if (existing) {
    existing.name = name;
    existing.role = 'admin';
    existing.passwordHash = hashPassword(password);
    existing.updatedAt = now;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`Admin already present — refreshed credentials for ${email} (id: ${existing.id}).`);
    console.log(`Total admin accounts: ${db.admins.length}`);
    return;
  }

  const admin = {
    id: `adm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    role: 'admin',
    passwordHash: hashPassword(password),
    createdAt: now,
    updatedAt: now,
  };

  db.admins.push(admin);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');

  console.log(`Created administrator ${email} (id: ${admin.id}).`);
  console.log(`Total admin accounts: ${db.admins.length}`);
}

main();
