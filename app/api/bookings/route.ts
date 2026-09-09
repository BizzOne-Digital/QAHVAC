import { NextRequest, NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http';
import { storage } from '@/lib/storage';
import { verifyAdminAuth } from '@/lib/auth';
import { BookingUrgency, PropertyType, ServiceItem } from '@/types';

export async function GET(req: NextRequest) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');
  const search = searchParams.get('search')?.toLowerCase();

  let bookings = await storage.getBookings();

  if (statusFilter && statusFilter !== 'all') {
    bookings = bookings.filter(b => b.status === statusFilter);
  }

  if (search) {
    bookings = bookings.filter(
      b =>
        b.customerName.toLowerCase().includes(search) ||
        b.phone.includes(search) ||
        b.email.toLowerCase().includes(search) ||
        b.referenceNumber.toLowerCase().includes(search) ||
        b.address.city.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    success: true,
    data: bookings,
    meta: {
      total: bookings.length,
      pendingCount: bookings.filter(b => b.status === 'pending').length,
      confirmedCount: bookings.filter(b => b.status === 'confirmed').length,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const {
      customerName,
      email,
      phone,
      propertyType,
      serviceId,
      serviceName,
      preferredDate,
      preferredTimeSlot,
      urgency,
      address,
      equipmentAge,
      issueDescription,
    } = body;

    // Server-side validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Please provide a valid full name.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return NextResponse.json({ success: false, error: 'Please provide a valid direct phone number.' }, { status: 400 });
    }

    if (!serviceId && !serviceName) {
      return NextResponse.json({ success: false, error: 'Please select a service category.' }, { status: 400 });
    }

    // Resolve against the catalogue so the stored booking always points at a
    // real service rather than a free-text label.
    const service =
      (serviceId && (await storage.getServiceById(serviceId) || await storage.getServiceBySlug(serviceId))) ||
      (typeof serviceName === 'string'
        ? (await storage.getServices()).find(
            (s: ServiceItem) => s.title.toLowerCase() === serviceName.trim().toLowerCase()
          )
        : undefined);

    if (serviceId && !service) {
      return NextResponse.json({ success: false, error: 'The selected service no longer exists.' }, { status: 400 });
    }

    if (!service && (!serviceName || typeof serviceName !== 'string')) {
      return NextResponse.json({ success: false, error: 'Please select a service category.' }, { status: 400 });
    }

    if (!preferredDate) {
      return NextResponse.json({ success: false, error: 'Please select your preferred appointment date.' }, { status: 400 });
    }

    if (!address || !address.street || !address.city) {
      return NextResponse.json({ success: false, error: 'Please provide the street address and city for service.' }, { status: 400 });
    }

    const newBooking = await storage.createBooking({
      customerName: customerName.trim(),
      email: (email || '').trim(),
      phone: phone.trim(),
      propertyType: (propertyType as PropertyType) || 'residential',
      serviceId: service?.id || 'srv-general',
      serviceName: service?.title || String(serviceName).trim(),
      preferredDate: preferredDate,
      preferredTimeSlot: preferredTimeSlot || 'Morning (8:00 AM - 12:00 PM)',
      urgency: (urgency as BookingUrgency) || 'standard',
      address: {
        street: address.street.trim(),
        city: address.city.trim(),
        postalCode: (address.postalCode || '').trim(),
      },
      equipmentAge: (equipmentAge || '').trim(),
      issueDescription: (issueDescription || '').trim(),
      status: urgency === 'emergency_today' ? 'pending' : 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        data: newBooking,
        message: 'Your appointment request has been received. Jayson will review and reach out directly to confirm your dispatch.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to process appointment request.' }, { status: 500 });
  }
}
