import { NextRequest, NextResponse } from 'next/server';
import { getLinkDetailsWithClicks, deleteLinkById } from '@/lib/supabase/service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Link ID is required' }, { status: 400 });
    }

    const { link, clicks, error } = await getLinkDetailsWithClicks(id);
    if (!link) {
      return NextResponse.json(
        { success: false, error: error || 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        link,
        clicks,
        totalClicks: link.clicks_count || clicks.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error retrieving link details' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Link ID is required' }, { status: 400 });
    }

    const result = await deleteLinkById(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to delete link' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Link successfully removed.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error deleting link' },
      { status: 500 }
    );
  }
}
