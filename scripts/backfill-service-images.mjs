/**
 * Backfills the `images` gallery array on service documents written before the
 * field existed. Purely additive: sets `images: []` where it is absent and
 * touches nothing else.
 *
 * Run: node scripts/backfill-service-images.mjs [--dry-run] [--db <name>]
 */
import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry-run');
const dbFlag = process.argv.indexOf('--db');
const dbOverride = dbFlag > -1 ? process.argv[dbFlag + 1] : null;

for (const file of ['.env.local', '.env']) {
  try {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}

let uri = process.env.MONGODB_URI;
if (!uri) { console.error('No MONGODB_URI found.'); process.exit(1); }
if (dbOverride) uri = uri.replace(/\/[^/?]+(\?|$)/, `/${dbOverride}$1`);

await mongoose.connect(uri);
const db = mongoose.connection.db;
const services = db.collection('services');

const missing = await services.countDocuments({ images: { $exists: false } });
console.log(`Database "${db.databaseName}"${DRY ? ' (DRY RUN)' : ''}`);
console.log(`services missing an images array: ${missing}`);

if (!DRY && missing > 0) {
  const r = await services.updateMany({ images: { $exists: false } }, { $set: { images: [] } });
  console.log(`backfilled: ${r.modifiedCount}`);
  console.log(`still missing: ${await services.countDocuments({ images: { $exists: false } })}`);
}

await mongoose.disconnect();
