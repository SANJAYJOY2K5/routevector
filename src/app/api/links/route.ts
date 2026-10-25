import { NextRequest, NextResponse } from 'next/server';
import { getAllLinks, createShortLink, createCampaignBatch } from '@/lib/supabase/service';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { links, source } = await getAllLinks();
    return NextResponse.json({
      success: true,
      data: links,
      meta: {
        databaseConnected: isSupabaseConfigured(),
        storageSource: source,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const host = request.headers.get('host') || undefined;

    // Check if this is a Batch Multi-Channel Campaign request
    if (body.channels && Array.isArray(body.channels) && body.channels.length > 0) {
      const { destination_url, campaign_name, base_slug, channels } = body;
      if (!destination_url) {
        return NextResponse.json({ success: false, error: 'Destination URL is required.' }, { status: 400 });
      }
      if (!campaign_name) {
        return NextResponse.json({ success: false, error: 'Campaign / Link name is required.' }, { status: 400 });
      }

      const batchRes = await createCampaignBatch(
        {
          destination_url,
          campaign_name,
          base_slug,
          channels,
        },
        host
      );

      if (!batchRes.success) {
        return NextResponse.json({ success: false, error: batchRes.error }, { status: 400 });
      }

      return NextResponse.json(
        {
          success: true,
          data: batchRes.links,
          isBatch: true,
          meta: {
            databaseConnected: isSupabaseConfigured(),
          },
        },
        { status: 201 }
      );
    }

    // Standard Single Link Creation
    const { destination_url, custom_code, title, channel, campaign } = body || {};

    if (!destination_url) {
      return NextResponse.json(
        { success: false, error: 'Destination URL is required.' },
        { status: 400 }
      );
    }

    const result = await createShortLink({ destination_url, custom_code, title, channel, campaign }, host);

    if (!result.success) {
      const isConflict = result.error?.includes('already');
      return NextResponse.json(
        { success: false, error: result.error },
        { status: isConflict ? 409 : 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.link,
        meta: {
          databaseConnected: isSupabaseConfigured(),
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error while creating link' },
      { status: 500 }
    );
  }
}
