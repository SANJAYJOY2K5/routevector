export interface Link {
  id: string;
  code: string;
  destination_url: string;
  title: string | null;
  description?: string | null;
  channel?: 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'tiktok' | 'other' | string | null;
  campaign?: string | null;
  clicks_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Click {
  id: string;
  link_id: string;
  short_code: string;
  referer: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  created_at: string;
}

export interface AnalyticsSummary {
  totalLinks: number;
  totalClicks: number;
  clicksToday: number;
  topPerforming: Link[];
  clicksTrend: { date: string; count: number }[];
  referrers: { source: string; count: number; percentage: number }[];
  devices: { device: string; count: number; percentage: number }[];
  browsers: { browser: string; count: number; percentage: number }[];
  operatingSystems: { os: string; count: number; percentage: number }[];
}

export interface CreateLinkInput {
  destination_url: string;
  custom_code?: string;
  title?: string;
  channel?: string;
  campaign?: string;
}

export interface BatchCampaignInput {
  destination_url: string;
  campaign_name: string;
  base_slug?: string;
  channels: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  warning?: string;
}
