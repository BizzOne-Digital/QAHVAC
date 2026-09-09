import { NextRequest, NextResponse } from 'next/server';

/**
 * Reads a JSON request body without letting a malformed one look like a server
 * fault. `req.json()` throws on an empty or unparseable body; left inside a
 * route's try/catch that surfaces as a 500 blaming the server for what is
 * really a bad request.
 *
 * Returns either the parsed object or a ready-to-return 400 response.
 */
/**
 * Parsed request payload. Loosely typed, exactly as `req.json()` was: every
 * route validates the fields it reads at runtime before using them.
 */
export type JsonBody = Record<string, any>;

export async function readJsonBody(
  req: NextRequest
): Promise<{ ok: true; body: JsonBody } | { ok: false; response: NextResponse }> {
  let parsed: unknown;

  try {
    parsed = await req.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Request body must be valid JSON.' },
        { status: 400 }
      ),
    };
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Request body must be a JSON object.' },
        { status: 400 }
      ),
    };
  }

  return { ok: true, body: parsed as JsonBody };
}
