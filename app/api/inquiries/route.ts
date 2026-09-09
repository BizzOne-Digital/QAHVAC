import { NextRequest, NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http';
import { storage } from '@/lib/storage';
import { verifyAdminAuth } from '@/lib/auth';
import { PropertyType } from '@/types';

export async function GET(req: NextRequest) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const inquiries = storage.getInquiries();
  return NextResponse.json({
    success: true,
    data: inquiries,
    meta: {
      total: inquiries.length,
      newCount: inquiries.filter(i => i.status === 'new').length,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const { name, email, phone, propertyType, subject, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Please provide your name.' }, { status: 400 });
    }

    if (!phone && !email) {
      return NextResponse.json({ success: false, error: 'Please provide at least a phone number or email address.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Please describe how we can assist your heating or cooling system.' }, { status: 400 });
    }

    const newInquiry = storage.createInquiry({
      name: name.trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      propertyType: (propertyType as PropertyType) || 'residential',
      subject: (subject || 'General Inquiry / Quote Request').trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        data: newInquiry,
        message: 'Thank you for reaching out to QP HVAC. Jayson will review your message and respond promptly.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit inquiry.' }, { status: 500 });
  }
}
