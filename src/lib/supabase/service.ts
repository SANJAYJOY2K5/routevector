import { getSupabaseClient, isSupabaseConfigured } from './client';
import { Link, Click, AnalyticsSummary, CreateLinkInput, BatchCampaignInput } from './types';
import { generateShortCode, isValidCustomCode } from '../utils/nanoid';
import { validateAndNormalizeUrl, extractDomain } from '../utils/urlValidator';

import fs from 'fs';
import path from 'path';

export const CHANNEL_CONFIGS: Record<string, { label: string; suffix: string; color: string }> = {
  youtube: { label: 'YouTube', suffix: 'yt', color: '#FF0000' },
  instagram: { label: 'Instagram', suffix: 'ig', color: '#E1306C' },
  facebook: { label: 'Facebook', suffix: 'fb', color: '#1877F2' },
  twitter: { label: 'X (Twitter)', suffix: 'x', color: '#0f172a' },
  whatsapp: { label: 'WhatsApp', suffix: 'wa', color: '#25D366' },
  linkedin: { label: 'LinkedIn', suffix: 'li', color: '#0A66C2' },
  tiktok: { label: 'TikTok', suffix: 'tt', color: '#010101' },
};

interface FallbackStore {
  links: Link[];
  clicks: Click[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_LINKS: Link[] = [
  {
    id: 'link-demo-yt',
    code: 'promo-yt',
    destination_url: 'https://youtube.com',
    title: 'Global Launch · YouTube',
    channel: 'youtube',
    campaign: 'Global Launch',
    clicks_count: 142,
    is_active: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'link-demo-ig',
    code: 'promo-ig',
    destination_url: 'https://instagram.com',
    title: 'Global Launch · Instagram',
    channel: 'instagram',
    campaign: 'Global Launch',
    clicks_count: 218,
    is_active: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'link-demo-fb',
    code: 'promo-fb',
    destination_url: 'https://facebook.com',
    title: 'Global Launch · Facebook',
    channel: 'facebook',
    campaign: 'Global Launch',
    clicks_count: 76,
    is_active: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_CLICKS: Click[] = [
  {
    id: 'click-1',
    link_id: 'link-demo-1',
    short_code: 'docs',
    referer: 'Google',
    device: 'Desktop',
    browser: 'Google Chrome',
    os: 'macOS',
    country: 'United States',
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: 'click-2',
    link_id: 'link-demo-1',
    short_code: 'docs',
    referer: 'X / Twitter',
    device: 'Mobile',
    browser: 'Apple Safari',
    os: 'iOS',
    country: 'United Kingdom',
    created_at: new Date(Date.now() - 7200 * 1000).toISOString(),
  },
  {
    id: 'click-3',
    link_id: 'link-demo-2',
    short_code: 'github',
    referer: 'LinkedIn',
    device: 'Desktop',
    browser: 'Microsoft Edge',
    os: 'Windows',
    country: 'India',
    created_at: new Date(Date.now() - 14400 * 1000).toISOString(),
  },
  {
    id: 'click-4',
    link_id: 'link-demo-2',
    short_code: 'github',
    referer: 'Direct',
    device: 'Desktop',
    browser: 'Mozilla Firefox',
    os: 'Linux',
    country: 'Germany',
    created_at: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
];

function getStore(): FallbackStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed?.links) && Array.isArray(parsed?.clicks)) {
        (globalThis as any).__routeVectorStore = parsed;
        return parsed;
      }
    }
  } catch (err) {
    // Fall back to memory
  }

  const g = globalThis as any;
  if (!g.__routeVectorStore) {
    g.__routeVectorStore = {
      links: [...INITIAL_LINKS],
      clicks: [...INITIAL_CLICKS],
    };
    saveStore(g.__routeVectorStore);
  }
  return g.__routeVectorStore;
}

function saveStore(store: FallbackStore) {
  (globalThis as any).__routeVectorStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Failed to write fallback store to disk:', err);
  }
}

export function inferChannelAndCampaign(link: Link): Link {
  let channel = (link.channel || '').toLowerCase();
  let campaign = link.campaign;

  const recognizedChannels = ['youtube', 'instagram', 'facebook', 'twitter', 'whatsapp', 'linkedin', 'tiktok'];

  if (!recognizedChannels.includes(channel)) {
    const code = (link.code || '').toLowerCase();
    const title = (link.title || '').toLowerCase();

    let utmSource = '';
    try {
      if (link.destination_url) {
        const u = new URL(link.destination_url);
        utmSource = (u.searchParams.get('utm_source') || '').toLowerCase();
      }
    } catch {}

    if (utmSource === 'instagram' || utmSource === 'ig') {
      channel = 'instagram';
    } else if (utmSource === 'youtube' || utmSource === 'yt') {
      channel = 'youtube';
    } else if (utmSource === 'facebook' || utmSource === 'fb') {
      channel = 'facebook';
    } else if (utmSource === 'twitter' || utmSource === 'x') {
      channel = 'twitter';
    } else if (utmSource === 'whatsapp' || utmSource === 'wa') {
      channel = 'whatsapp';
    } else if (utmSource === 'linkedin' || utmSource === 'li') {
      channel = 'linkedin';
    } else if (utmSource === 'tiktok' || utmSource === 'tt') {
      channel = 'tiktok';
    } else if (
      code.endsWith('-ig') ||
      code.endsWith('_ig') ||
      code.includes('instagram') ||
      code.includes('insta') ||
      code === 'ig'
    ) {
      channel = 'instagram';
    } else if (
      code.endsWith('-fb') ||
      code.endsWith('_fb') ||
      code.includes('facebook') ||
      code === 'fb'
    ) {
      channel = 'facebook';
    } else if (
      code.endsWith('-wa') ||
      code.endsWith('_wa') ||
      code.includes('whatsapp') ||
      code === 'wa'
    ) {
      channel = 'whatsapp';
    } else if (
      code.endsWith('-x') ||
      code.endsWith('_x') ||
      code.includes('twitter') ||
      code === 'x'
    ) {
      channel = 'twitter';
    } else if (
      code.endsWith('-li') ||
      code.endsWith('_li') ||
      code.includes('linkedin') ||
      code === 'li'
    ) {
      channel = 'linkedin';
    } else if (
      code.endsWith('-tt') ||
      code.endsWith('_tt') ||
      code.includes('tiktok') ||
      code === 'tt'
    ) {
      channel = 'tiktok';
    } else if (
      code.endsWith('-yt') ||
      code.endsWith('_yt') ||
      code.includes('youtube') ||
      code === 'yt' ||
      code.startsWith('yt-') ||
      code.startsWith('yt_')
    ) {
      channel = 'youtube';
    } else if (title.includes('· instagram') || title.includes('| instagram') || title.includes('instagram')) {
      channel = 'instagram';
    } else if (title.includes('· facebook') || title.includes('| facebook') || title.includes('facebook')) {
      channel = 'facebook';
    } else if (title.includes('· whatsapp') || title.includes('| whatsapp') || title.includes('whatsapp')) {
      channel = 'whatsapp';
    } else if (title.includes('· twitter') || title.includes('| twitter') || title.includes('twitter') || title.includes('· x')) {
      channel = 'twitter';
    } else if (title.includes('· linkedin') || title.includes('| linkedin') || title.includes('linkedin')) {
      channel = 'linkedin';
    } else if (title.includes('· tiktok') || title.includes('| tiktok') || title.includes('tiktok')) {
      channel = 'tiktok';
    } else if (title.includes('· youtube') || title.includes('| youtube')) {
      channel = 'youtube';
    } else {
      channel = 'direct';
    }
  }

  if (!campaign) {
    if (link.title && link.title.includes(' · ')) {
      campaign = link.title.split(' · ')[0].trim();
    } else if (link.title && link.title.includes(' | ')) {
      campaign = link.title.split(' | ')[0].trim();
    } else {
      campaign = link.title || `${link.code} Campaign`;
    }
  }

  return { ...link, channel, campaign };
}

/**
 * Retrieve all links, ordered newest first
 */
export async function getAllLinks(): Promise<{ links: Link[]; source: 'supabase' | 'mock' }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase getAllLinks error]:', error.message);
        throw error;
      }
      const inferred = (data as Link[]).map(inferChannelAndCampaign);
      return { links: inferred, source: 'supabase' };
    } catch (err: any) {
      console.warn('[Database Fallback] Failed fetching from Supabase, serving fallback store:', err.message);
    }
  }

  const store = getStore();
  const sorted = [...store.links]
    .map(inferChannelAndCampaign)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return {
    links: sorted,
    source: 'mock',
  };
}

/**
 * Retrieve a link by its unique short code
 */
export async function getLinkByCode(code: string): Promise<Link | null> {
  const cleanCode = code.trim();
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('links')
        .select('*')
        .ilike('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('[Supabase getLinkByCode error]:', error.message);
        throw error;
      }
      if (data) return inferChannelAndCampaign(data as Link);
    } catch (err: any) {
      console.warn('[Database Fallback] Failed querying by code from Supabase:', err.message);
    }
  }

  const store = getStore();
  const found = store.links.find(
    (l) => l.code.toLowerCase() === cleanCode.toLowerCase() && l.is_active
  );
  return found ? inferChannelAndCampaign(found) : null;
}

/**
 * Create a new short link
 */
export async function createShortLink(
  input: CreateLinkInput,
  currentHost?: string
): Promise<{ success: boolean; link?: Link; error?: string }> {
  // 1. Validate destination URL
  const validation = validateAndNormalizeUrl(input.destination_url, currentHost);
  if (!validation.valid || !validation.normalizedUrl) {
    return { success: false, error: validation.error || 'Invalid URL' };
  }

  // 2. Determine short code
  let finalCode = '';
  if (input.custom_code && input.custom_code.trim()) {
    const codeCheck = isValidCustomCode(input.custom_code);
    if (!codeCheck.valid) {
      return { success: false, error: codeCheck.reason };
    }
    finalCode = input.custom_code.trim();
  } else {
    // Generate unique short code
    finalCode = generateShortCode(6);
  }

  const title = input.title?.trim() || `${validation.domain} Shortlink`;

  const client = getSupabaseClient();
  if (client) {
    try {
      // Check collision
      const { data: existing } = await client
        .from('links')
        .select('id')
        .ilike('code', finalCode)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          error: `Short code "${finalCode}" is already taken. Please choose a unique custom code.`,
        };
      }

      const newRecord: any = {
        code: finalCode,
        destination_url: validation.normalizedUrl,
        title,
        clicks_count: 0,
        is_active: true,
      };
      if (input.channel) newRecord.channel = input.channel;
      if (input.campaign) newRecord.campaign = input.campaign;

      let insertRes = await client
        .from('links')
        .insert(newRecord)
        .select()
        .single();

      if (insertRes.error && insertRes.error.message.includes('column')) {
        delete newRecord.channel;
        delete newRecord.campaign;
        insertRes = await client.from('links').insert(newRecord).select().single();
      }

      if (insertRes.error) {
        console.error('[Supabase createShortLink error]:', insertRes.error.message);
        return { success: false, error: insertRes.error.message };
      }

      const created = inferChannelAndCampaign({
        ...(insertRes.data as Link),
        channel: input.channel || undefined,
        campaign: input.campaign || undefined,
      });

      return { success: true, link: created };
    } catch (err: any) {
      console.warn('[Database Fallback] Failed creating in Supabase, using mock store:', err.message);
    }
  }

  // Mock store handling
  const store = getStore();
  const collision = store.links.some((l) => l.code.toLowerCase() === finalCode.toLowerCase());
  if (collision) {
    return {
      success: false,
      error: `Short code "${finalCode}" is already in use. Please select a different code.`,
    };
  }

  const newMockLink: Link = inferChannelAndCampaign({
    id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    code: finalCode,
    destination_url: validation.normalizedUrl,
    title,
    channel: input.channel || undefined,
    campaign: input.campaign || undefined,
    clicks_count: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  store.links.unshift(newMockLink);
  saveStore(store);
  return { success: true, link: newMockLink };
}

/**
 * Batch generate campaign links across selected social channels
 */
export async function createCampaignBatch(
  input: BatchCampaignInput,
  currentHost?: string
): Promise<{ success: boolean; links?: Link[]; error?: string }> {
  if (!input.destination_url || !input.campaign_name || !input.channels || input.channels.length === 0) {
    return { success: false, error: 'Destination URL, campaign name, and at least one channel are required.' };
  }

  const baseValidation = validateAndNormalizeUrl(input.destination_url, currentHost);
  if (!baseValidation.valid || !baseValidation.normalizedUrl) {
    return { success: false, error: baseValidation.error || 'Invalid URL' };
  }

  const baseSlug = (input.base_slug && input.base_slug.trim())
    ? input.base_slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    : generateShortCode(4);

  const createdLinks: Link[] = [];

  for (const ch of input.channels) {
    const config = CHANNEL_CONFIGS[ch] || { label: ch, suffix: ch, color: '#3b82f6' };
    const customCode = `${baseSlug}-${config.suffix}`;
    const title = `${input.campaign_name.trim()} · ${config.label}`;

    let taggedUrl = baseValidation.normalizedUrl;
    try {
      const u = new URL(taggedUrl);
      u.searchParams.set('utm_source', ch);
      u.searchParams.set('utm_medium', 'social');
      u.searchParams.set('utm_campaign', input.campaign_name.trim());
      taggedUrl = u.toString();
    } catch {
      // Keep original
    }

    const res = await createShortLink(
      {
        destination_url: taggedUrl,
        custom_code: customCode,
        title,
        channel: ch,
        campaign: input.campaign_name.trim(),
      },
      currentHost
    );

    if (res.success && res.link) {
      createdLinks.push(res.link);
    } else {
      const fallbackCode = `${baseSlug}-${config.suffix}-${generateShortCode(2)}`;
      const retryRes = await createShortLink(
        {
          destination_url: taggedUrl,
          custom_code: fallbackCode,
          title,
          channel: ch,
          campaign: input.campaign_name.trim(),
        },
        currentHost
      );
      if (retryRes.success && retryRes.link) {
        createdLinks.push(retryRes.link);
      }
    }
  }

  if (createdLinks.length === 0) {
    return { success: false, error: 'Failed to create campaign links' };
  }

  return { success: true, links: createdLinks };
}

/**
 * Delete a link by ID
 */
export async function deleteLinkById(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('links').delete().eq('id', id);
      if (error) {
        console.error('[Supabase deleteLink error]:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.warn('[Database Fallback] Failed deleting in Supabase:', err.message);
    }
  }

  const store = getStore();
  const initialLen = store.links.length;
  store.links = store.links.filter((l) => l.id !== id);
  store.clicks = store.clicks.filter((c) => c.link_id !== id);

  if (store.links.length === initialLen) {
    return { success: false, error: 'Link not found' };
  }
  saveStore(store);
  return { success: true };
}

/**
 * Record click event in database
 */
export async function recordClickEvent(params: {
  linkId: string;
  shortCode: string;
  referer: string;
  device: string;
  browser: string;
  os: string;
  country?: string;
}): Promise<{ recorded: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      // 1. Insert click event
      const { error: clickError } = await client.from('clicks').insert({
        link_id: params.linkId,
        short_code: params.shortCode,
        referer: params.referer || 'Direct',
        device: params.device || 'Desktop',
        browser: params.browser || 'Other',
        os: params.os || 'Other',
        country: params.country || 'Direct / Local',
      });

      if (clickError) {
        console.error('[Supabase recordClickEvent error]:', clickError.message);
        return { recorded: false, error: clickError.message };
      }

      // The PostgreSQL trigger on_click_increment_counter automatically increments
      // public.links.clicks_count upon insertion into public.clicks.
      return { recorded: true };
    } catch (err: any) {
      console.error('[Supabase recordClickEvent exception]:', err.message);
      return { recorded: false, error: err.message };
    }
  }

  // Fallback in-memory click registration
  const store = getStore();
  const link = store.links.find((l) => l.id === params.linkId);
  if (link) {
    link.clicks_count = (link.clicks_count || 0) + 1;
    link.updated_at = new Date().toISOString();
  }

  store.clicks.unshift({
    id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    link_id: params.linkId,
    short_code: params.shortCode,
    referer: params.referer || 'Direct',
    device: params.device || 'Desktop',
    browser: params.browser || 'Other',
    os: params.os || 'Other',
    country: params.country || 'Direct / Local',
    created_at: new Date().toISOString(),
  });

  saveStore(store);
  return { recorded: true };
}

/**
 * Retrieve detailed info & click logs for a specific link
 */
export async function getLinkDetailsWithClicks(
  id: string
): Promise<{ link: Link | null; clicks: Click[]; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: link, error: linkErr } = await client
        .from('links')
        .select('*')
        .eq('id', id)
        .single();

      if (linkErr || !link) {
        return { link: null, clicks: [], error: linkErr?.message || 'Link not found' };
      }

      const { data: clicks, error: clicksErr } = await client
        .from('clicks')
        .select('*')
        .eq('link_id', id)
        .order('created_at', { ascending: false })
        .limit(100);

      return {
        link: link as Link,
        clicks: (clicks as Click[]) || [],
        error: clicksErr?.message,
      };
    } catch (err: any) {
      console.warn('[Database Fallback] Failed fetching details from Supabase:', err.message);
    }
  }

  const store = getStore();
  const link = store.links.find((l) => l.id === id) || null;
  const clicks = store.clicks.filter((c) => c.link_id === id);
  return { link, clicks };
}

/**
 * Calculate accurate, aggregated analytics across all links
 */
export async function getAggregatedAnalytics(): Promise<AnalyticsSummary> {
  let allLinks: Link[] = [];
  let allClicks: Click[] = [];

  const client = getSupabaseClient();
  if (client) {
    try {
      const [linksRes, clicksRes] = await Promise.all([
        client.from('links').select('*').order('clicks_count', { ascending: false }),
        client.from('clicks').select('*').order('created_at', { ascending: false }).limit(1000),
      ]);

      if (!linksRes.error && linksRes.data) {
        allLinks = linksRes.data as Link[];
      }
      if (!clicksRes.error && clicksRes.data) {
        allClicks = clicksRes.data as Click[];
      }
    } catch (err: any) {
      console.warn('[Database Fallback] Supabase analytics query failed, using mock data:', err.message);
      const store = getStore();
      allLinks = store.links;
      allClicks = store.clicks;
    }
  } else {
    const store = getStore();
    allLinks = store.links;
    allClicks = store.clicks;
  }

  const totalLinks = allLinks.length;
  const totalClicks = allLinks.reduce((sum, l) => sum + (l.clicks_count || 0), 0);

  // Clicks in last 24 hours
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const clicksToday = allClicks.filter((c) => new Date(c.created_at) >= dayAgo).length;

  // Top 5 performing links
  const topPerforming = [...allLinks]
    .sort((a, b) => (b.clicks_count || 0) - (a.clicks_count || 0))
    .slice(0, 5);

  // 7-day trend
  const trendDays: { [key: string]: number } = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0];
    trendDays[key] = 0;
  }

  allClicks.forEach((c) => {
    const day = c.created_at.split('T')[0];
    if (trendDays[day] !== undefined) {
      trendDays[day]++;
    }
  });

  const clicksTrend = Object.keys(trendDays).map((date) => ({
    date,
    count: trendDays[date],
  }));

  // Referrers breakdown
  const refMap: { [key: string]: number } = {};
  allClicks.forEach((c) => {
    const r = c.referer || 'Direct';
    refMap[r] = (refMap[r] || 0) + 1;
  });

  const totalRecordedClicks = allClicks.length || 1;
  const referrers = Object.entries(refMap)
    .map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / totalRecordedClicks) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Devices breakdown
  const devMap: { [key: string]: number } = {};
  allClicks.forEach((c) => {
    const d = c.device || 'Desktop';
    devMap[d] = (devMap[d] || 0) + 1;
  });

  const devices = Object.entries(devMap)
    .map(([device, count]) => ({
      device,
      count,
      percentage: Math.round((count / totalRecordedClicks) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Browsers breakdown
  const browserMap: { [key: string]: number } = {};
  allClicks.forEach((c) => {
    const b = c.browser || 'Other';
    browserMap[b] = (browserMap[b] || 0) + 1;
  });

  const browsers = Object.entries(browserMap)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: Math.round((count / totalRecordedClicks) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // OS breakdown
  const osMap: { [key: string]: number } = {};
  allClicks.forEach((c) => {
    const o = c.os || 'Other';
    osMap[o] = (osMap[o] || 0) + 1;
  });

  const operatingSystems = Object.entries(osMap)
    .map(([os, count]) => ({
      os,
      count,
      percentage: Math.round((count / totalRecordedClicks) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalLinks,
    totalClicks,
    clicksToday,
    topPerforming,
    clicksTrend,
    referrers,
    devices,
    browsers,
    operatingSystems,
  };
}
