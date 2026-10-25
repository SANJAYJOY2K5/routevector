import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedAnalytics } from '@/lib/supabase/service';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const analytics = await getAggregatedAnalytics();
    return NextResponse.json({
      success: true,
      data: analytics,
      meta: {
        databaseConnected: isSupabaseConfigured(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error fetching aggregated analytics' },
      { status: 500 }
    );
  }
}
