import { NextRequest, NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http';
import { storage } from '@/lib/storage';
import { verifyAdminAuth } from '@/lib/auth';
import { EMPTY_BUSINESS_CARD, normalizeBusinessCard } from '@/lib/businessCard';
import { deleteStoredUpload } from '@/lib/uploads/deleteStoredUpload';
import { parseUploadUrl } from '@/lib/uploads/validation';

/**
 * The business card shown on the home page.
 *
 * The card is a slice of the site settings singleton, but it gets its own
 * endpoint so the admin screen can save it without round-tripping the entire
 * settings document — and so a future surface (a print sheet, a QR landing
 * page) has one obvious place to read it from.
 *
 *   GET    — public. Returns the card, or the empty card when none is set.
 *   PUT    — admin. Partial update; unmentioned fields keep their value.
 *   DELETE — admin. Clears the card and removes the stored image.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await storage.getSettings();
  return NextResponse.json({
    success: true,
    data: settings.businessCard ?? EMPTY_BUSINESS_CARD,
  });
}

export async function PUT(req: NextRequest) {
  if (!(await verifyAdminAuth(req))) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;

    const settings = await storage.getSettings();
    const previous = settings.businessCard ?? EMPTY_BUSINESS_CARD;
    const businessCard = normalizeBusinessCard(parsed.body, previous);

    // Reject rather than silently ignore: the admin asked for an image and
    // would otherwise see a saved card with no art and no explanation.
    if ('imageUrl' in (parsed.body as object) && (parsed.body as { imageUrl?: unknown }).imageUrl && !businessCard.imageUrl) {
      return NextResponse.json(
        { success: false, error: 'That image URL is not a valid image reference.' },
        { status: 400 }
      );
    }

    const updated = await storage.updateSettings({ businessCard });

    // Sweep the replaced binary only once the new card is safely stored.
    if (previous.imageUrl && previous.imageUrl !== businessCard.imageUrl) {
      const stale = parseUploadUrl(previous.imageUrl);
      if (stale) {
        await deleteStoredUpload(stale.folder, stale.filename).catch(err =>
          console.error('Could not remove the replaced business card image:', err)
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: updated.businessCard ?? EMPTY_BUSINESS_CARD,
      message: 'Business card saved.',
    });
  } catch (error) {
    console.error('Error saving the business card:', error);
    return NextResponse.json(
      { success: false, error: 'The business card could not be saved.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAdminAuth(req))) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const settings = await storage.getSettings();
    const previous = settings.businessCard ?? EMPTY_BUSINESS_CARD;

    await storage.updateSettings({ businessCard: EMPTY_BUSINESS_CARD });

    if (previous.imageUrl) {
      const stale = parseUploadUrl(previous.imageUrl);
      if (stale) {
        await deleteStoredUpload(stale.folder, stale.filename).catch(err =>
          console.error('Could not remove the business card image:', err)
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: EMPTY_BUSINESS_CARD,
      message: 'Business card removed.',
    });
  } catch (error) {
    console.error('Error removing the business card:', error);
    return NextResponse.json(
      { success: false, error: 'The business card could not be removed.' },
      { status: 500 }
    );
  }
}
