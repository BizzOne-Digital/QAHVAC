#!/usr/bin/env node
/**
 * Seeds the initial QP HVAC administrator account into MongoDB.
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
import mongoose from 'mongoose';

const SCRYPT_COST = 16384;
const KEY_LENGTH = 64;

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

async function main() {
  loadEnvFiles();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Add it to .env.local (or your host env) and retry.');
    process.exit(1);
  }

  const name = (process.env.ADMIN_NAME || 'Administrator').trim();
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.trim().length < 4) {
    console.error('ADMIN_PASSWORD is not set (or is shorter than 4 characters). Set it and retry.');
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  const admins = mongoose.connection.db.collection('admins');
  await admins.createIndex({ email: 1 }, { unique: true });

  const now = new Date().toISOString();
  const existing = await admins.findOne({ email });

  if (existing) {
    await admins.updateOne(
      { email },
      { $set: { name, role: 'admin', passwordHash: hashPassword(password), updatedAt: now } }
    );
    console.log(`Admin already present — refreshed credentials for ${email} (id: ${existing.id}).`);
  } else {
    const id = `adm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await admins.insertOne({
      id,
      name,
      email,
      role: 'admin',
      passwordHash: hashPassword(password),
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Created administrator ${email} (id: ${id}).`);
  }

  console.log(`Total admin accounts: ${await admins.countDocuments()}`);
  console.log(`Database: ${mongoose.connection.name}`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
});
