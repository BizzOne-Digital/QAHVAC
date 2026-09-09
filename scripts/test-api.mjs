#!/usr/bin/env node
/**
 * End-to-end API checks against a running server.
 *
 *   npm run dev          # in one terminal
 *   npm run test:api     # in another
 *
 * Override the target with BASE_URL=http://localhost:3000 npm run test:api
 * Admin credentials come from ADMIN_EMAIL / ADMIN_PASSWORD (see .env.example).
 */
import fs from 'node:fs';
import path from 'node:path';

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

loadEnvFiles();

const BASE = (process.env.BASE_URL || 'http://localhost:3111').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

let adminCookie = '';
const results = [];

async function call(method, route, { body, admin = false, raw = false, headers = {} } = {}) {
  const init = { method, headers: { ...headers }, redirect: 'manual' };

  if (body instanceof FormData) {
    init.body = body;
  } else if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  if (admin && adminCookie) init.headers.Cookie = adminCookie;

  const res = await fetch(`${BASE}${route}`, init);
  const setCookie = res.headers.get('set-cookie');
  let payload = null;
  if (!raw) {
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
  }
  return { status: res.status, payload, setCookie, location: res.headers.get('location') };
}

function record(name, method, route, scope, expected, actual, extra = '') {
  const pass = Array.isArray(expected) ? expected.includes(actual) : actual === expected;
  results.push({ name, method, route, scope, expected: String(expected), actual, pass, extra });
  const tag = pass ? 'PASS' : 'FAIL';
  console.log(`${tag}  ${method.padEnd(6)} ${route.padEnd(42)} expected ${String(expected).padEnd(8)} got ${actual}  ${extra}`);
  return pass;
}

async function check(name, method, route, scope, expected, opts = {}) {
  const res = await call(method, route, opts);
  record(name, method, route, scope, expected, res.status, opts.note || '');
  return res;
}

async function main() {
  console.log(`Testing ${BASE}\n`);

  /* ---------------------------------------------------------- public reads */
  await check('Site settings (public)', 'GET', '/api/settings', 'public', 200);
  const servicesRes = await check('Service catalogue (public)', 'GET', '/api/services', 'public', 200);
  await check('Active services filter', 'GET', '/api/services?active=true', 'public', 200);

  const firstService = servicesRes.payload?.data?.[0];
  if (firstService) {
    await check('Service by id', 'GET', `/api/services/${firstService.id}`, 'public', 200);
    await check('Service by slug', 'GET', `/api/services/${firstService.slug}`, 'public', 200);
  }
  await check('Unknown service', 'GET', '/api/services/does-not-exist', 'public', 404);

  /* ------------------------------------------------------ auth enforcement */
  await check('Bookings without session', 'GET', '/api/bookings', 'public', 401);
  await check('Inquiries without session', 'GET', '/api/inquiries', 'public', 401);
  await check('Media list without session', 'GET', '/api/upload', 'public', 401);
  await check('Settings write without session', 'PATCH', '/api/settings', 'public', 401, { body: { businessName: 'Hacked' } });
  await check('Service create without session', 'POST', '/api/services', 'public', 401, { body: { title: 'x', shortDesc: 'x' } });
  await check('Service delete without session', 'DELETE', '/api/services/srv-furnace', 'public', 401);
  await check('Media delete without session', 'DELETE', '/api/upload?url=/api/uploads/products/1700000000000-deadbeef.png', 'public', 401);
  await check('Auth check without session', 'GET', '/api/auth/check', 'public', 200);
  await check('Forged session token rejected', 'GET', '/api/bookings', 'public', 401, {
    headers: { Cookie: 'qp_hvac_admin_token=forged.token' },
  });

  /* ------------------------------------------------- public writes (forms) */
  await check('Booking missing name', 'POST', '/api/bookings', 'public', 400, {
    body: { phone: '2265550000', serviceName: 'x', preferredDate: '2026-10-01', address: { street: 'a', city: 'b' } },
  });
  await check('Booking unknown service id', 'POST', '/api/bookings', 'public', 400, {
    body: {
      customerName: 'Test User',
      phone: '2265550000',
      serviceId: 'srv-not-real',
      preferredDate: '2026-10-01',
      address: { street: '1 Test St', city: 'London' },
    },
  });

  const bookingRes = await check('Booking created', 'POST', '/api/bookings', 'public', 201, {
    body: {
      customerName: 'API Test Customer',
      email: 'api-test@example.com',
      phone: '2265550123',
      propertyType: 'residential',
      serviceId: firstService?.id,
      serviceName: firstService?.title,
      preferredDate: '2026-10-01',
      preferredTimeSlot: 'Morning (8:00 AM - 12:00 PM)',
      urgency: 'standard',
      address: { street: '1 Test Street', city: 'London', postalCode: 'N6A 1A1' },
      equipmentAge: '5-10 years',
      issueDescription: 'Automated end-to-end API verification booking.',
    },
  });
  const bookingId = bookingRes.payload?.data?.id;

  await check('Inquiry missing message', 'POST', '/api/inquiries', 'public', 400, {
    body: { name: 'Test', email: 'test@example.com' },
  });

  const inquiryRes = await check('Inquiry created', 'POST', '/api/inquiries', 'public', 201, {
    body: {
      name: 'API Test Enquirer',
      email: 'api-test@example.com',
      phone: '2265550124',
      propertyType: 'residential',
      subject: 'Automated test inquiry',
      message: 'Automated end-to-end API verification inquiry.',
    },
  });
  const inquiryId = inquiryRes.payload?.data?.id;

  /* ---------------------------------------------------------------- login */
  await check('Login without password', 'POST', '/api/auth/login', 'admin', 400, { body: {} });
  await check('Login wrong password', 'POST', '/api/auth/login', 'admin', 401, {
    body: { email: ADMIN_EMAIL || undefined, password: 'definitely-not-the-password' },
  });

  const login = await call('POST', '/api/auth/login', {
    body: { email: ADMIN_EMAIL || undefined, password: ADMIN_PASSWORD },
  });
  record('Login with valid credentials', 'POST', '/api/auth/login', 'admin', 200, login.status);

  if (login.setCookie) {
    adminCookie = login.setCookie.split(';')[0];
  }

  if (!adminCookie) {
    console.error('\nCould not obtain an admin session — the remaining admin checks are skipped.');
  } else {
    const authed = await check('Auth check with session', 'GET', '/api/auth/check', 'admin', 200, { admin: true });
    if (authed.payload?.authenticated !== true) {
      record('Session reports authenticated', 'GET', '/api/auth/check', 'admin', 'authenticated', 'not authenticated');
    } else {
      record('Session reports authenticated', 'GET', '/api/auth/check', 'admin', 'authenticated', 'authenticated');
    }

    /* ------------------------------------------------------ admin reads */
    await check('Bookings list', 'GET', '/api/bookings', 'admin', 200, { admin: true });
    await check('Bookings filtered', 'GET', '/api/bookings?status=pending', 'admin', 200, { admin: true });
    await check('Bookings search', 'GET', '/api/bookings?search=API%20Test', 'admin', 200, { admin: true });
    await check('Inquiries list', 'GET', '/api/inquiries', 'admin', 200, { admin: true });
    await check('Media list', 'GET', '/api/upload', 'admin', 200, { admin: true });

    /* --------------------------------------------------- booking CRUD */
    if (bookingId) {
      await check('Booking detail', 'GET', `/api/bookings/${bookingId}`, 'admin', 200, { admin: true });
      await check('Booking status update', 'PATCH', `/api/bookings/${bookingId}`, 'admin', 200, {
        admin: true,
        body: { status: 'confirmed', technicianNotes: 'Confirmed by automated test.' },
      });
    }
    await check('Booking detail missing', 'GET', '/api/bookings/bkg-does-not-exist', 'admin', 404, { admin: true });
    await check('Booking delete missing', 'DELETE', '/api/bookings/bkg-does-not-exist', 'admin', 404, { admin: true });

    /* --------------------------------------------------- inquiry CRUD */
    if (inquiryId) {
      await check('Inquiry status update', 'PATCH', `/api/inquiries/${inquiryId}`, 'admin', 200, {
        admin: true,
        body: { status: 'contacted', adminNotes: 'Handled by automated test.' },
      });
    }
    await check('Inquiry update missing', 'PATCH', '/api/inquiries/inq-does-not-exist', 'admin', 404, {
      admin: true,
      body: { status: 'contacted' },
    });

    /* --------------------------------------------------- service CRUD */
    await check('Service create validation', 'POST', '/api/services', 'admin', 400, { admin: true, body: { title: '' } });

    const created = await check('Service created', 'POST', '/api/services', 'admin', 201, {
      admin: true,
      body: {
        title: 'Automated Test Service',
        category: 'maintenance',
        shortDesc: 'Temporary service created by the API test suite.',
        fullDesc: 'Temporary service created by the API test suite.',
        features: ['Check one', 'Check two'],
        priceEstimate: '$1',
        durationEstimate: '1 hour',
        active: false,
      },
    });
    const createdId = created.payload?.data?.id;

    if (createdId) {
      await check('Service updated', 'PATCH', `/api/services/${createdId}`, 'admin', 200, {
        admin: true,
        body: { shortDesc: 'Updated by the API test suite.' },
      });
      await check('Service deleted', 'DELETE', `/api/services/${createdId}`, 'admin', 200, { admin: true });
      await check('Service gone after delete', 'GET', `/api/services/${createdId}`, 'public', 404);
    }
    await check('Service update missing', 'PATCH', '/api/services/srv-does-not-exist', 'admin', 404, {
      admin: true,
      body: { title: 'x' },
    });

    /* -------------------------------------------------------- settings */
    const settingsBefore = await call('GET', '/api/settings');
    await check('Settings updated', 'PATCH', '/api/settings', 'admin', 200, {
      admin: true,
      body: { serviceArea: 'Automated Test Coverage Area' },
    });
    await check('Settings restored', 'PATCH', '/api/settings', 'admin', 200, {
      admin: true,
      body: { serviceArea: settingsBefore.payload?.data?.serviceArea || 'Greater Region & Surrounding Communities' },
    });

    /* ----------------------------------------------------------- media */
    // 1x1 transparent PNG
    const pngBytes = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );

    const badType = new FormData();
    badType.append('file', new Blob(['not an image'], { type: 'text/plain' }), 'note.txt');
    badType.append('folder', 'products');
    await check('Upload rejects wrong type', 'POST', '/api/upload', 'admin', 415, { admin: true, body: badType });

    const badFolder = new FormData();
    badFolder.append('file', new Blob([pngBytes], { type: 'image/png' }), 'pixel.png');
    badFolder.append('folder', 'services');
    await check('Upload rejects bad folder', 'POST', '/api/upload', 'admin', 400, { admin: true, body: badFolder });

    const noFile = new FormData();
    noFile.append('folder', 'products');
    await check('Upload requires a file', 'POST', '/api/upload', 'admin', 400, { admin: true, body: noFile });

    const oversize = new FormData();
    oversize.append('file', new Blob([Buffer.alloc(9 * 1024 * 1024)], { type: 'image/png' }), 'big.png');
    oversize.append('folder', 'products');
    await check('Upload rejects oversize file', 'POST', '/api/upload', 'admin', 413, { admin: true, body: oversize });

    const goodForm = new FormData();
    goodForm.append('file', new Blob([pngBytes], { type: 'image/png' }), 'pixel.png');
    goodForm.append('folder', 'products');
    const upload = await check('Upload accepted', 'POST', '/api/upload', 'admin', 201, { admin: true, body: goodForm });

    const storedUrl = upload.payload?.url;

    if (storedUrl) {
      const served = await call('GET', storedUrl, { raw: true });
      record('Stored image served from MongoDB', 'GET', storedUrl, 'public', 200, served.status);

      const headRes = await fetch(`${BASE}${storedUrl}`);
      const contentType = headRes.headers.get('content-type');
      const cacheControl = headRes.headers.get('cache-control');
      const contentLength = headRes.headers.get('content-length');
      record('Served with image/png content type', 'GET', storedUrl, 'public', 'image/png', contentType || 'missing');
      record(
        'Served immutable cache header',
        'GET',
        storedUrl,
        'public',
        'public, max-age=31536000, immutable',
        cacheControl || 'missing'
      );
      record('Served with content length', 'GET', storedUrl, 'public', String(pngBytes.length), contentLength || 'missing');
    }

    await check('Missing image', 'GET', '/api/uploads/products/1700000000000-deadbeef.png', 'public', 404, { raw: true });
    await check('Bad filename shape rejected', 'GET', '/api/uploads/products/secret.png', 'public', 404, { raw: true });
    await check('Traversal rejected', 'GET', '/api/uploads/products/..%2Fsecret.png', 'public', 404, { raw: true });
    await check('Legacy folder rejected', 'GET', '/api/uploads/services/1700000000000-deadbeef.png', 'public', 404, { raw: true });

    await check('Media list', 'GET', '/api/upload', 'admin', 200, { admin: true });
    await check('Media delete needs a reference', 'DELETE', '/api/upload', 'admin', 400, { admin: true });
    await check(
      'Media delete rejects foreign url',
      'DELETE',
      '/api/upload?url=/uploads/legacy.jpg',
      'admin',
      400,
      { admin: true }
    );
    await check(
      'Media delete missing record',
      'DELETE',
      '/api/upload?url=/api/uploads/products/1700000000000-deadbeef.png',
      'admin',
      404,
      { admin: true }
    );

    if (storedUrl) {
      await check('Media deleted', 'DELETE', `/api/upload?url=${encodeURIComponent(storedUrl)}`, 'admin', 200, {
        admin: true,
      });
      await check('Deleted image no longer served', 'GET', storedUrl, 'public', 404, { raw: true });
    }

    /* --------------------------------------------------- admin cleanup */
    if (bookingId) {
      await check('Booking deleted', 'DELETE', `/api/bookings/${bookingId}`, 'admin', 200, { admin: true });
    }
    if (inquiryId) {
      await check('Inquiry deleted', 'DELETE', `/api/inquiries/${inquiryId}`, 'admin', 200, { admin: true });
    }

    /* ------------------------------------------------- route protection */
    const guarded = await call('GET', '/admin', { raw: true });
    record('Admin page redirects when signed out', 'GET', '/admin', 'public', 307, guarded.status, guarded.location || '');

    const guardedIn = await call('GET', '/admin', { raw: true, admin: true });
    record('Admin page reachable when signed in', 'GET', '/admin', 'admin', 200, guardedIn.status);

    /* ------------------------------------------------------------ logout */
    await check('Logout', 'POST', '/api/auth/logout', 'admin', 200, { admin: true });
  }

  const failed = results.filter(r => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log('\nFailures:');
    for (const f of failed) console.log(`  ${f.method} ${f.route} — expected ${f.expected}, got ${f.actual}`);
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
