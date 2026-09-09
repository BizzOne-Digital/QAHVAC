#!/usr/bin/env node
/**
 * One-time import of data/db.json into MongoDB.
 *
 *   npm run migrate:mongo            # import
 *   npm run migrate:mongo -- --dry   # report what would be imported
 *
 * The JSON file is only read, never modified, so it stays available as a
 * backup. Re-running is safe: documents are matched on their existing string
 * id (or email for admins, `key` for settings) and updated in place rather
 * than duplicated.
 */
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';

const DRY_RUN = process.argv.includes('--dry');

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

/** Collections are written through the driver directly, so no model imports. */
const PLAN = [
  { key: 'services', collection: 'services', match: doc => ({ id: doc.id }) },
  { key: 'bookings', collection: 'bookings', match: doc => ({ id: doc.id }) },
  { key: 'inquiries', collection: 'inquiries', match: doc => ({ id: doc.id }) },
  { key: 'admins', collection: 'admins', match: doc => ({ email: String(doc.email).toLowerCase() }) },
];

async function main() {
  loadEnvFiles();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Add it to .env.local and retry.');
    process.exit(1);
  }

  const dbFile = path.join(process.cwd(), 'data', 'db.json');
  if (!fs.existsSync(dbFile)) {
    console.error(`No data/db.json found at ${dbFile}. Nothing to import.`);
    process.exit(1);
  }

  const source = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  const db = mongoose.connection.db;
  console.log(`Connected to "${mongoose.connection.name}"${DRY_RUN ? ' (dry run)' : ''}\n`);

  // Settings: a single pinned document.
  if (source.settings) {
    if (DRY_RUN) {
      console.log('settings   would upsert 1 document');
    } else {
      const { _id, key, ...settings } = source.settings;
      await db
        .collection('settings')
        .updateOne({ key: 'site' }, { $set: { key: 'site', ...settings } }, { upsert: true });
      console.log('settings   upserted 1 document');
    }
  }

  for (const { key, collection, match } of PLAN) {
    const rows = Array.isArray(source[key]) ? source[key] : [];

    if (rows.length === 0) {
      console.log(`${collection.padEnd(10)} nothing to import`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`${collection.padEnd(10)} would upsert ${rows.length} document(s)`);
      continue;
    }

    let written = 0;
    for (const row of rows) {
      const { _id, ...doc } = row;
      const result = await db
        .collection(collection)
        .updateOne(match(doc), { $set: doc }, { upsert: true });
      if (result.upsertedCount || result.modifiedCount || result.matchedCount) written++;
    }
    console.log(`${collection.padEnd(10)} upserted ${written} document(s)`);
  }

  console.log('\nCounts now in MongoDB:');
  for (const name of ['settings', 'services', 'bookings', 'inquiries', 'admins', 'storeduploads']) {
    console.log(`  ${name.padEnd(14)} ${await db.collection(name).countDocuments()}`);
  }

  await mongoose.disconnect();
  console.log(
    DRY_RUN
      ? '\nDry run only — nothing was written.'
      : '\nImport complete. data/db.json was not modified; keep it as a backup.'
  );
}

main().catch(err => {
  console.error('Migration failed:', err.message);
  process.exitCode = 1;
});
