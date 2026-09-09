/**
 * One-off content correction:
 *   1. Removes the now-unused `priceEstimate` field from every service document
 *      (pricing is no longer published anywhere on the site).
 *   2. Sets the "years in the trade" stat to 5+ (it was incorrectly 25+).
 *
 * Run: node scripts/fix-pricing-years.mjs
 *      node scripts/fix-pricing-years.mjs --dry-run
 */
import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry-run');

for (const file of ['.env.local', '.env']) {
  try {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
if (!uri) { console.error('No MONGODB_URI found.'); process.exit(1); }

await mongoose.connect(uri);
const db = mongoose.connection.db;
console.log(`Connected to "${db.databaseName}"${DRY ? ' (DRY RUN — no writes)' : ''}\n`);

const services = db.collection('services');
const withPrice = await services.countDocuments({ priceEstimate: { $exists: true } });
console.log(`services with priceEstimate: ${withPrice}`);

const settings = db.collection('settings');
const current = await settings.findOne({});
console.log(`current stats.yearsExperience: ${current?.stats?.yearsExperience}`);

if (!DRY) {
  const r1 = await services.updateMany({}, { $unset: { priceEstimate: '' } });
  console.log(`\nservices updated: ${r1.modifiedCount}`);
  const r2 = await settings.updateMany({}, { $set: { 'stats.yearsExperience': '5+' } });
  console.log(`settings updated: ${r2.modifiedCount}`);

  const after = await settings.findOne({});
  console.log(`\nverify — yearsExperience: ${after?.stats?.yearsExperience}`);
  console.log(`verify — services still carrying a price: ${await services.countDocuments({ priceEstimate: { $exists: true } })}`);
}

await mongoose.disconnect();
