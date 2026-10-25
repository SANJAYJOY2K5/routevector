import { NextRequest, NextResponse } from 'next/server';
import { getLinkByCode, recordClickEvent } from '@/lib/supabase/service';
import { parseUserAgent, parseReferrer } from '@/lib/utils/uaParser';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.trim();

  if (!code) {
    return new NextResponse('Bad Request: Missing short link code.', { status: 400 });
  }

  try {
    // 1. Look up destination link in database
    const link = await getLinkByCode(code);

    if (!link || !link.is_active) {
      // Return 404 Not Found Page for invalid or expired code
      const notFoundUrl = new URL(`/not-found?code=${encodeURIComponent(code)}`, request.url);
      return NextResponse.redirect(notFoundUrl, 303);
    }

    // 2. Extract privacy-conscious visitor metadata
    const userAgentHeader = request.headers.get('user-agent') || '';
    const refererHeader = request.headers.get('referer') || '';
    const countryHeader =
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('x-country') ||
      'Direct / Local';

    const { device, browser, os } = parseUserAgent(userAgentHeader);
    const refererSource = parseReferrer(refererHeader);

    // 3. Deliberately record the click event in Supabase
    let trackingStatus = 'recorded';
    const clickResult = await recordClickEvent({
      linkId: link.id,
      shortCode: link.code,
      referer: refererSource,
      device,
      browser,
      os,
      country: countryHeader,
    });

    if (!clickResult.recorded) {
      trackingStatus = 'persistence-failed';
      console.error(
        `[Tracking Error] Failed to persist click for link "${link.code}":`,
        clickResult.error
      );
    }

    // 4. Perform HTTP 307 Temporary Redirect to validated destination URL
    let targetUrl = link.destination_url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    const response = NextResponse.redirect(targetUrl, 307);

    // Ensure browsers do not cache the redirect, guaranteeing every click is logged
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Shortlink-Code', link.code);
    response.headers.set('X-Tracking-Status', trackingStatus);

    return response;
  } catch (err: any) {
    console.error(`[Redirect Exception] Unexpected error redirecting code "${code}":`, err);
    return new NextResponse(
      `An error occurred while processing your redirect: ${err.message || 'Unknown error'}`,
      { status: 500 }
    );
  }
}
