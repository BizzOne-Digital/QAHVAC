import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/config';

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin(req);

  return NextResponse.json({
    success: true,
    authenticated: Boolean(admin),
    user: admin ? { ...admin, company: APP_CONFIG.businessName } : null,
  });
}
