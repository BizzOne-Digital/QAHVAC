import { NextRequest, NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http';
import { storage } from '@/lib/storage';
import { verifyAdminAuth } from '@/lib/auth';
import { ServiceItem } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get('active') === 'true';

  const services = await storage.getServices(activeOnly);
  return NextResponse.json({ success: true, data: services });
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const { title, category, shortDesc, fullDesc, priceEstimate, durationEstimate, features, image } = body;

    if (!title || !shortDesc) {
      return NextResponse.json({ success: false, error: 'Title and short description are required.' }, { status: 400 });
    }

    const slug = (body.slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = `srv-${Date.now()}`;
    const allServices = await storage.getServices();

    const newService: ServiceItem = {
      id,
      slug,
      title: title.trim(),
      category: category || 'heating',
      shortDesc: shortDesc.trim(),
      fullDesc: (fullDesc || shortDesc).trim(),
      features: Array.isArray(features) ? features : [],
      priceEstimate: priceEstimate || 'Custom Quote',
      durationEstimate: durationEstimate || '1-2 hours',
      emergencyAvailable: !!body.emergencyAvailable,
      image: image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
      active: body.active !== false,
      order: allServices.length + 1,
    };

    const saved = await storage.saveService(newService);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ success: false, error: 'Failed to create service.' }, { status: 500 });
  }
}
