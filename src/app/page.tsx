'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Link as LinkIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  BarChart3,
  TrendingUp,
  Globe,
  Smartphone,
  Laptop,
  Layers,
  ArrowRight,
  Database,
  Search,
  Route,
  HelpCircle,
  X,
  RefreshCw,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  PieChart,
  Sliders,
  Share2,
} from 'lucide-react';
import { Link as LinkItem, AnalyticsSummary, Click } from '@/lib/supabase/types';

// ==============================================================================
// AUTHENTIC BRAND SVG LOGOS
// ==============================================================================

const YouTubeLogo = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <rect width="24" height="24" rx="6" fill="#FF0000" />
    <path d="M9.5 8.5L16 12L9.5 15.5V8.5Z" fill="#FFFFFF" />
  </svg>
);

const InstagramLogo = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <defs>
      <radialGradient id="ig-grad-main" cx="0.2" cy="1" r="1">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="10%" stopColor="#fdf497" />
        <stop offset="50%" stopColor="#fd5949" />
        <stop offset="68%" stopColor="#d6249f" />
        <stop offset="100%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-grad-main)" />
    <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#ffffff" strokeWidth="1.8" fill="none" />
    <circle cx="12" cy="12" r="3.2" stroke="#ffffff" strokeWidth="1.8" fill="none" />
    <circle cx="15.8" cy="8.2" r="0.9" fill="#ffffff" />
  </svg>
);

const FacebookLogo = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <rect width="24" height="24" rx="6" fill="#1877F2" />
    <path
      d="M14.5 12.5H12.5V20H9.5V12.5H8V9.5H9.5V7.7C9.5 6.2 10.4 5 12.8 5C13.8 5 14.5 5.2 14.5 5.2V7.7H13.4C12.7 7.7 12.5 8.1 12.5 8.7V9.5H14.7L14.5 12.5Z"
      fill="#ffffff"
    />
  </svg>
);

const TwitterLogo = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <rect width="24" height="24" rx="6" fill="#0f172a" />
    <path
      d="M7 6L11.5 12.2L7 17.5H8.2L12.1 12.9L15.3 17.5H18L13.2 10.8L17.4 6H16.2L12.6 10.1L9.7 6H7Z"
      fill="#ffffff"
    />
  </svg>
);

const WhatsAppLogo = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <rect width="24" height="24" rx="6" fill="#25D366" />
    <path
      d="M12 5.5C8.4 5.5 5.5 8.4 5.5 12C5.5 13.3 5.9 14.5 6.6 15.5L5.7 18.5L8.8 17.6C9.8 18.2 10.9 18.5 12 18.5C15.6 18.5 18.5 15.6 18.5 12C18.5 8.4 15.6 5.5 12 5.5ZM15.2 14.3C15 14.8 14.3 15.2 13.8 15.2C13.5 15.2 13.1 15.1 12 14.6C10.1 13.8 8.9 11.9 8.8 11.7C8.7 11.6 8 10.6 8 9.7C8 8.7 8.5 8.3 8.7 8.1C8.9 7.9 9.1 7.9 9.3 7.9C9.4 7.9 9.6 7.9 9.7 7.9C9.9 7.9 10 7.8 10.2 8.2C10.4 8.6 10.8 9.6 10.8 9.7C10.9 9.8 10.9 9.9 10.8 10C10.7 10.1 10.7 10.2 10.6 10.3C10.5 10.4 10.4 10.5 10.3 10.6C10.2 10.7 10.1 10.8 10.2 11C10.4 11.3 11 12.3 11.8 13C12.4 13.5 12.9 13.7 13.2 13.8C13.4 13.9 13.5 13.9 13.6 13.7C13.8 13.5 14.1 13.1 14.3 12.8C14.4 12.6 14.6 12.6 14.8 12.7C15 12.8 16 13.3 16.2 13.4C16.4 13.5 16.5 13.6 16.5 13.7C16.5 13.8 16.4 14.1 15.2 14.3Z"
      fill="#ffffff"
    />
  </svg>
);

const LinkedInLogo = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <rect width="24" height="24" rx="6" fill="#0A66C2" />
    <path
      d="M7 9H9.5V17H7V9ZM8.25 7.8C7.45 7.8 6.8 7.15 6.8 6.35C6.8 5.55 7.45 4.9 8.25 4.9C9.05 4.9 9.7 5.55 9.7 6.35C9.7 7.15 9.05 7.8 8.25 7.8ZM11 9H13.4V10.1C13.75 9.4 14.65 8.8 15.95 8.8C18.6 8.8 19.1 10.5 19.1 12.8V17H16.6V13.3C16.6 12.4 16.6 11.2 15.35 11.2C14.1 11.2 13.9 12.2 13.9 13.2V17H11.4V9H11Z"
      fill="#ffffff"
    />
  </svg>
);

const TikTokLogo = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <rect width="24" height="24" rx="6" fill="#010101" />
    <path
      d="M14.5 5C14.7 6.5 15.8 7.6 17.3 7.8V9.8C16.2 9.8 15.2 9.4 14.5 8.7V14.2C14.5 16.3 12.8 18 10.7 18C8.6 18 6.9 16.3 6.9 14.2C6.9 12.1 8.6 10.4 10.7 10.4C11 10.4 11.3 10.4 11.6 10.5V12.6C11.3 12.5 11 12.4 10.7 12.4C9.7 12.4 8.9 13.2 8.9 14.2C8.9 15.2 9.7 16 10.7 16C11.7 16 12.5 15.2 12.5 14.2V5H14.5Z"
      fill="#ffffff"
    />
  </svg>
);

const GenericLogo = ({ size = 20 }: { size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 6,
      background: '#2563eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
    }}
  >
    <Globe size={size * 0.65} />
  </div>
);

// Map of Channel Keys to Component & Branding
const CHANNELS = [
  { key: 'youtube', name: 'YouTube', color: '#FF0000', Component: YouTubeLogo, defaultSelected: true },
  { key: 'instagram', name: 'Instagram', color: '#E1306C', Component: InstagramLogo, defaultSelected: true },
  { key: 'facebook', name: 'Facebook', color: '#1877F2', Component: FacebookLogo, defaultSelected: true },
  { key: 'whatsapp', name: 'WhatsApp', color: '#25D366', Component: WhatsAppLogo, defaultSelected: false },
  { key: 'twitter', name: 'X / Twitter', color: '#0f172a', Component: TwitterLogo, defaultSelected: false },
  { key: 'linkedin', name: 'LinkedIn', color: '#0A66C2', Component: LinkedInLogo, defaultSelected: false },
  { key: 'tiktok', name: 'TikTok', color: '#010101', Component: TikTokLogo, defaultSelected: false },
];

function getChannelBadge(channelKey?: string | null, link?: Partial<LinkItem>) {
  let key = (channelKey || '').toLowerCase();
  const recognizedChannels = ['youtube', 'instagram', 'facebook', 'twitter', 'whatsapp', 'linkedin', 'tiktok'];

  if (!recognizedChannels.includes(key)) {
    if (link) {
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
        key = 'instagram';
      } else if (utmSource === 'youtube' || utmSource === 'yt') {
        key = 'youtube';
      } else if (utmSource === 'facebook' || utmSource === 'fb') {
        key = 'facebook';
      } else if (utmSource === 'twitter' || utmSource === 'x') {
        key = 'twitter';
      } else if (utmSource === 'whatsapp' || utmSource === 'wa') {
        key = 'whatsapp';
      } else if (utmSource === 'linkedin' || utmSource === 'li') {
        key = 'linkedin';
      } else if (utmSource === 'tiktok' || utmSource === 'tt') {
        key = 'tiktok';
      } else if (
        code.endsWith('-ig') ||
        code.endsWith('_ig') ||
        code.includes('instagram') ||
        code.includes('insta') ||
        code === 'ig'
      ) {
        key = 'instagram';
      } else if (
        code.endsWith('-fb') ||
        code.endsWith('_fb') ||
        code.includes('facebook') ||
        code === 'fb'
      ) {
        key = 'facebook';
      } else if (
        code.endsWith('-wa') ||
        code.endsWith('_wa') ||
        code.includes('whatsapp') ||
        code === 'wa'
      ) {
        key = 'whatsapp';
      } else if (
        code.endsWith('-x') ||
        code.endsWith('_x') ||
        code.includes('twitter') ||
        code === 'x'
      ) {
        key = 'twitter';
      } else if (
        code.endsWith('-li') ||
        code.endsWith('_li') ||
        code.includes('linkedin') ||
        code === 'li'
      ) {
        key = 'linkedin';
      } else if (
        code.endsWith('-tt') ||
        code.endsWith('_tt') ||
        code.includes('tiktok') ||
        code === 'tt'
      ) {
        key = 'tiktok';
      } else if (
        code.endsWith('-yt') ||
        code.endsWith('_yt') ||
        code.includes('youtube') ||
        code === 'yt' ||
        code.startsWith('yt-') ||
        code.startsWith('yt_')
      ) {
        key = 'youtube';
      } else if (title.includes('· instagram') || title.includes('| instagram') || title.includes('instagram')) {
        key = 'instagram';
      } else if (title.includes('· facebook') || title.includes('| facebook') || title.includes('facebook')) {
        key = 'facebook';
      } else if (title.includes('· whatsapp') || title.includes('| whatsapp') || title.includes('whatsapp')) {
        key = 'whatsapp';
      } else if (title.includes('· twitter') || title.includes('| twitter') || title.includes('twitter') || title.includes('· x')) {
        key = 'twitter';
      } else if (title.includes('· linkedin') || title.includes('| linkedin') || title.includes('linkedin')) {
        key = 'linkedin';
      } else if (title.includes('· tiktok') || title.includes('| tiktok') || title.includes('tiktok')) {
        key = 'tiktok';
      } else if (title.includes('· youtube') || title.includes('| youtube')) {
        key = 'youtube';
      } else {
        key = 'direct';
      }
    }
  }

  const found = CHANNELS.find((c) => c.key === key);
  if (found) {
    const LogoComp = found.Component;
    return { name: found.name, color: found.color, LogoComp, key: found.key };
  }
  return { name: 'Direct Link', color: '#2563eb', LogoComp: GenericLogo, key: 'direct' };
}

// ==============================================================================
// MAIN COMPONENT
// ==============================================================================

export default function DashboardPage() {
  // State: Data
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [storageSource, setStorageSource] = useState<'supabase' | 'mock'>('mock');

  // State: Campaign Form Inputs
  const [destinationUrl, setDestinationUrl] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [customSlugBase, setCustomSlugBase] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'youtube',
    'instagram',
    'facebook',
  ]);

  // State: UI & Feedback
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBatch, setSuccessBatch] = useState<LinkItem[] | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCampaigns, setExpandedCampaigns] = useState<Record<string, boolean>>({});

  // State: Modals
  const [selectedLinkDetails, setSelectedLinkDetails] = useState<{
    link: LinkItem;
    clicks: Click[];
  } | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Origin for Full URL Display
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Fetch Data
  const loadData = async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      const [linksRes, analyticsRes] = await Promise.all([
        fetch('/api/links'),
        fetch('/api/analytics'),
      ]);

      const linksData = await linksRes.json();
      const analyticsData = await analyticsRes.json();

      if (linksData.success) {
        setLinks(linksData.data || []);
        setDbConnected(Boolean(linksData.meta?.databaseConnected));
        setStorageSource(linksData.meta?.storageSource || 'mock');
      }

      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setErrorMessage('Could not connect to backend server. Retrying...');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Channel Toggle Logic
  const toggleChannel = (chKey: string) => {
    setSelectedChannels((prev) =>
      prev.includes(chKey) ? prev.filter((k) => k !== chKey) : [...prev, chKey]
    );
  };

  const handleSelectAllChannels = () => {
    setSelectedChannels(CHANNELS.map((c) => c.key));
  };

  const handleSelectPopularChannels = () => {
    setSelectedChannels(['youtube', 'instagram', 'facebook']);
  };

  const handleSelectYouTubeOnly = () => {
    setSelectedChannels(['youtube']);
  };

  const handleSelectInstagramOnly = () => {
    setSelectedChannels(['instagram']);
  };

  // Form Submit: Multi-Channel Campaign Generation
  const handleSubmitCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessBatch(null);

    if (!destinationUrl.trim()) {
      setErrorMessage('Please enter a destination URL.');
      return;
    }

    if (!campaignName.trim()) {
      setErrorMessage('Please give your link or campaign a name.');
      return;
    }

    if (selectedChannels.length === 0) {
      setErrorMessage('Please select at least one channel (e.g., YouTube, Instagram).');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_url: destinationUrl.trim(),
          campaign_name: campaignName.trim(),
          base_slug: customSlugBase.trim() || undefined,
          channels: selectedChannels,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || 'Failed to create campaign links');
        return;
      }

      const created: LinkItem[] = Array.isArray(json.data) ? json.data : [json.data];
      setSuccessBatch(created);
      setDestinationUrl('');
      setCampaignName('');
      setCustomSlugBase('');
      await loadData(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error creating campaign links');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Copy Full URL
  const handleCopy = (code: string) => {
    const fullUrl = `${origin}/go/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((curr) => (curr === code ? null : curr));
    }, 2000);
  };

  // Handle Delete Link
  const handleDeleteLink = async (id: string, code: string) => {
    if (!confirm(`Delete short link "/go/${code}"? Click history will also be removed.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (res.ok && json.success) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
        if (selectedLinkDetails?.link.id === id) {
          setSelectedLinkDetails(null);
        }
        await loadData(true);
      } else {
        alert(json.error || 'Failed to delete link');
      }
    } catch (err: any) {
      alert(err.message || 'Network error deleting link');
    } finally {
      setDeletingId(null);
    }
  };

  // Inspect Link Details
  const handleInspectLink = async (link: LinkItem) => {
    setDetailsLoading(true);
    setSelectedLinkDetails({ link, clicks: [] });
    try {
      const res = await fetch(`/api/links/${link.id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedLinkDetails({
          link: json.data.link,
          clicks: json.data.clicks,
        });
      }
    } catch (err) {
      console.error('Error fetching link details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Toggle Campaign Card Expansion
  const toggleCampaignExpansion = (campName: string) => {
    setExpandedCampaigns((prev) => ({
      ...prev,
      [campName]: prev[campName] === undefined ? false : !prev[campName],
    }));
  };

  // Group Links by Campaign
  const campaignGroups = useMemo(() => {
    const map: Record<string, { name: string; destination: string; links: LinkItem[]; totalClicks: number }> = {};

    links.forEach((link) => {
      const cName = link.campaign || (link.title ? link.title.split(' · ')[0] : 'General');
      if (!map[cName]) {
        map[cName] = {
          name: cName,
          destination: link.destination_url.split('?utm_source')[0],
          links: [],
          totalClicks: 0,
        };
      }
      map[cName].links.push(link);
      map[cName].totalClicks += link.clicks_count || 0;
    });

    let groups = Object.values(map);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      groups = groups.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.destination.toLowerCase().includes(q) ||
          g.links.some((l) => l.code.toLowerCase().includes(q))
      );
    }

    return groups.sort((a, b) => b.totalClicks - a.totalClicks);
  }, [links, searchQuery]);

  // Ring Chart Calculations (Channel Breakdown Across All Links)
  const ringChartData = useMemo(() => {
    const channelCounts: Record<string, number> = {};
    let total = 0;

    links.forEach((l) => {
      const badge = getChannelBadge(l.channel, l);
      const ch = badge.key;
      channelCounts[ch] = (channelCounts[ch] || 0) + (l.clicks_count || 0);
      total += l.clicks_count || 0;
    });

    const allPlatforms = [
      ...CHANNELS,
      { key: 'direct', name: 'Direct Link', color: '#2563eb', Component: GenericLogo },
    ];

    const items = allPlatforms.map((ch) => {
      const count = channelCounts[ch.key] || 0;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        key: ch.key,
        name: ch.name,
        color: ch.color,
        count,
        percentage,
      };
    }).filter((i) => i.count > 0 || (total === 0 && i.key !== 'direct'));

    // SVG stroke dash computation
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;

    const segments = items.map((item) => {
      const strokeLength = total > 0 ? (item.count / total) * circumference : 0;
      const strokeOffset = circumference - accumulatedAngle;
      accumulatedAngle += strokeLength;
      return {
        ...item,
        dashArray: `${strokeLength} ${circumference - strokeLength}`,
        dashOffset: strokeOffset,
      };
    });

    return { total, segments };
  }, [links]);

  // Line Chart 7-Day Click Trend
  const trendPoints = useMemo(() => {
    if (!analytics || !analytics.clicksTrend || analytics.clicksTrend.length === 0) {
      return { path: '', area: '', points: [] };
    }

    const data = analytics.clicksTrend;
    const maxVal = Math.max(...data.map((d) => d.count), 4);
    const width = 500;
    const height = 150;
    const padX = 25;
    const padY = 20;

    const usableW = width - padX * 2;
    const usableH = height - padY * 2;

    const coords = data.map((d, i) => {
      const x = padX + (i / (data.length - 1)) * usableW;
      const y = height - padY - (d.count / maxVal) * usableH;
      return { x, y, date: d.date, count: d.count };
    });

    const path = coords.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');
    const area = `${path} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

    return { path, area, points: coords };
  }, [analytics]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Glass Header */}
      <header className="glass-header">
        <div className="container header-content">
          <div className="brand-badge">
            <div className="brand-icon-wrap">
              <Route size={22} />
            </div>
            <div>
              <span>Route</span>
              <span style={{ color: 'var(--brand-primary)' }}>Vector</span>
            </div>
          </div>

          <div className="header-actions">
            <a
              href="#create-campaign"
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Share2 size={14} />
              <span>+ New Campaign</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pill">
            <Share2 size={13} />
            <span>Multi-Channel Social Link Tracking Engine</span>
          </div>
          <h1 className="hero-title">
            One Link. <span className="hero-gradient-text">Instant Tracking</span> for YouTube, Insta & Facebook.
          </h1>
          <p className="hero-desc">
            Paste your destination URL and generate dedicated tracking links for YouTube, Instagram, Facebook, and WhatsApp in one click. 
            Track exact view counts per platform with interactive charts.
          </p>
        </section>

        {/* Multi-Channel Campaign Creator Card */}
        <section id="create-campaign" className="glass-card creator-card">
          <form onSubmit={handleSubmitCampaign}>
            <div className="creator-inputs-grid">
              {/* Destination URL */}
              <div>
                <label className="input-label">
                  Destination URL
                  <span className="input-subtext">(Where should people land?)</span>
                </label>
                <div className="glass-input-wrapper">
                  <Globe size={18} className="input-left-icon" />
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="https://yourwebsite.com/product"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campaign Name & Optional Custom Slug */}
              <div className="creator-inputs-grid-2">
                <div>
                  <label className="input-label">
                    Campaign / Link Name
                    <span className="input-subtext">(e.g., Summer Sale 2026)</span>
                  </label>
                  <div className="glass-input-wrapper">
                    <Layers size={18} className="input-left-icon" />
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="My Product Launch"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">
                    Custom Base Slug
                    <span className="input-subtext">(Optional, e.g., "summer" → /go/summer-yt)</span>
                  </label>
                  <div className="glass-input-wrapper">
                    <span className="input-left-icon" style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      /go/
                    </span>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="myslug (auto if empty)"
                      value={customSlugBase}
                      onChange={(e) => setCustomSlugBase(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Channel Selection Header & Fast Presets */}
            <div className="channel-selector-header">
              <label className="input-label" style={{ marginBottom: 0 }}>
                Select Social Channels to Generate:
                <span className="input-subtext">({selectedChannels.length} selected)</span>
              </label>

              <div className="channel-preset-buttons">
                <button type="button" onClick={handleSelectAllChannels} className="btn-preset">
                  Select All
                </button>
                <button type="button" onClick={handleSelectPopularChannels} className="btn-preset">
                  Popular (YT + Insta + FB)
                </button>
                <button type="button" onClick={handleSelectYouTubeOnly} className="btn-preset">
                  YouTube Only
                </button>
                <button type="button" onClick={handleSelectInstagramOnly} className="btn-preset">
                  Insta Only
                </button>
              </div>
            </div>

            {/* Channel Toggle Buttons with Real Logos */}
            <div className="channel-grid">
              {CHANNELS.map((ch) => {
                const isSelected = selectedChannels.includes(ch.key);
                const Logo = ch.Component;

                return (
                  <div
                    key={ch.key}
                    onClick={() => toggleChannel(ch.key)}
                    className={`channel-toggle-pill ${isSelected ? 'active' : ''}`}
                  >
                    <div className="channel-icon-wrap">
                      <Logo size={20} />
                    </div>
                    <span className="channel-name">{ch.name}</span>
                    <div className="channel-checkbox-dot">
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#991b1b', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                <AlertTriangle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', height: '52px', fontSize: '1rem', gap: '0.65rem' }}
            >
              {submitting ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>Generating Campaign Tracking Links...</span>
                </>
              ) : (
                <>
                  <span>Create {selectedChannels.length} Multi-Channel Tracking Links</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Success Banner: Newly Created Links Quick Copy */}
        {successBatch && (
          <div className="success-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={20} />
              <span>{successBatch.length} Campaign Links Ready!</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {successBatch.map((link) => {
                const badge = getChannelBadge(link.channel, link);
                const LogoComp = badge.LogoComp;
                const fullUrl = `${origin}/go/${link.code}`;
                const isCopied = copiedCode === link.code;

                return (
                  <div
                    key={link.id}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <LogoComp size={22} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857' }}>
                          {badge.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          /go/{link.code}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleCopy(link.code)}
                        className={`btn-copy ${isCopied ? 'copied' : ''}`}
                      >
                        {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                      </button>

                      <a
                        href={`/go/${link.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-copy"
                        title="Test redirect in new tab"
                        onClick={() => setTimeout(() => loadData(true), 1200)}
                      >
                        <ExternalLink size={13} />
                        <span>Test</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Summary Metrics Cards */}
        <section className="metrics-row">
          <div className="glass-card metric-stat-card">
            <div className="metric-stat-top">
              <span>TOTAL CAMPAIGNS</span>
              <Layers size={18} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <div className="metric-stat-number">{campaignGroups.length}</div>
            <div className="metric-stat-sub">Active marketing campaigns</div>
          </div>

          <div className="glass-card metric-stat-card">
            <div className="metric-stat-top">
              <span>TRACKED SHORT LINKS</span>
              <LinkIcon size={18} style={{ color: '#8b5cf6' }} />
            </div>
            <div className="metric-stat-number">{links.length}</div>
            <div className="metric-stat-sub">Across all social platforms</div>
          </div>

          <div className="glass-card metric-stat-card">
            <div className="metric-stat-top">
              <span>TOTAL VIEWS RECORDED</span>
              <TrendingUp size={18} style={{ color: 'var(--emerald)' }} />
            </div>
            <div className="metric-stat-number">{analytics?.totalClicks ?? 0}</div>
            <div className="metric-stat-sub">Atomic logged redirect visits</div>
          </div>

          <div className="glass-card metric-stat-card">
            <div className="metric-stat-top">
              <span>LAST 24 HOURS</span>
              <Clock size={18} style={{ color: 'var(--amber)' }} />
            </div>
            <div className="metric-stat-number">{analytics?.clicksToday ?? 0}</div>
            <div className="metric-stat-sub">Real-time visitor velocity</div>
          </div>
        </section>

        {/* Visual Charts: Line Trend & Ring (Donut) Chart */}
        <section className="glass-card analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-title">
              <BarChart3 size={22} style={{ color: 'var(--brand-primary)' }} />
              <span>Real-Time Traffic & Channel Distribution</span>
            </div>
            <button
              onClick={() => loadData(true)}
              className="btn btn-secondary btn-sm"
              title="Refresh statistics"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="charts-dual-grid">
            {/* 1. Line Chart (7-Day Velocity Trend) */}
            <div>
              <div className="chart-panel-title">
                <TrendingUp size={17} style={{ color: 'var(--brand-primary)' }} />
                <span>7-Day Visitor Velocity (Line Chart)</span>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--glass-border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <svg viewBox="0 0 500 150" className="line-chart-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {trendPoints.area && <path d={trendPoints.area} className="chart-area" />}
                  {trendPoints.path && <path d={trendPoints.path} className="chart-line" />}

                  {trendPoints.points.map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="4" className="chart-circle">
                      <title>{`${pt.date}: ${pt.count} views`}</title>
                    </circle>
                  ))}
                </svg>

                <div className="chart-dates-row">
                  {analytics?.clicksTrend?.map((d) => (
                    <span key={d.date}>{d.date.slice(5)}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Ring Chart (Donut Chart by Platform) */}
            <div>
              <div className="chart-panel-title">
                <PieChart size={17} style={{ color: '#e1306c' }} />
                <span>Views by Platform (Ring Chart)</span>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--glass-border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="ring-chart-wrap">
                  <div className="ring-svg-container">
                    <svg width="190" height="190" viewBox="0 0 190 190">
                      {/* Background Ring Track */}
                      <circle
                        cx="95"
                        cy="95"
                        r="64"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="18"
                      />

                      {/* Segments */}
                      {ringChartData.segments.map((seg) => (
                        <circle
                          key={seg.key}
                          cx="95"
                          cy="95"
                          r="64"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="18"
                          strokeDasharray={seg.dashArray}
                          strokeDashoffset={seg.dashOffset}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}
                        >
                          <title>{`${seg.name}: ${seg.count} views (${seg.percentage}%)`}</title>
                        </circle>
                      ))}
                    </svg>

                    {/* Centered Total Count */}
                    <div className="ring-center-text">
                      <div className="ring-center-count">{ringChartData.total}</div>
                      <div className="ring-center-label">TOTAL VIEWS</div>
                    </div>
                  </div>

                  {/* Ring Chart Legend */}
                  <div className="ring-legend-list">
                    {ringChartData.segments.map((seg) => {
                      const badge = getChannelBadge(seg.key);
                      const Logo = badge.LogoComp;
                      return (
                        <div key={seg.key} className="ring-legend-item">
                          <Logo size={16} />
                          <span>{seg.name}:</span>
                          <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>
                            {seg.count} ({seg.percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaigns & Links Management Section */}
        <section>
          <div className="campaigns-section-header">
            <div>
              <h2 className="campaigns-title">Your Marketing Campaigns & Short Links</h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Grouped by Campaign Name with individual channel view counters
              </span>
            </div>

            {/* Search Filter */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="text"
                className="glass-input"
                style={{ height: '40px', paddingLeft: '2.4rem', fontSize: '0.875rem' }}
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: '0.75rem', color: 'var(--brand-primary)' }} />
              <div>Loading campaigns...</div>
            </div>
          ) : campaignGroups.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Layers size={36} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                No campaigns found
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Use the generator above to create your first multi-channel tracking link.
              </p>
            </div>
          ) : (
            <div>
              {campaignGroups.map((camp) => {
                const isExpanded = expandedCampaigns[camp.name] !== false; // Default expanded

                // Aggregate views per unique channel in this campaign
                const channelMap: Record<string, { name: string; color: string; LogoComp: any; clicks: number }> = {};
                camp.links.forEach((l) => {
                  const badge = getChannelBadge(l.channel, l);
                  const key = badge.name;
                  if (!channelMap[key]) {
                    channelMap[key] = {
                      name: badge.name,
                      color: badge.color,
                      LogoComp: badge.LogoComp,
                      clicks: 0,
                    };
                  }
                  channelMap[key].clicks += l.clicks_count || 0;
                });
                const campChannelSummaries = Object.values(channelMap);

                return (
                  <div key={camp.name} className="glass-card campaign-card">
                    {/* Campaign Header */}
                    <div className="campaign-card-header">
                      <div className="campaign-header-left">
                        <div className="campaign-name-title">{camp.name}</div>
                        <a
                          href={camp.destination}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="campaign-dest-link"
                          title="Original destination website"
                        >
                          <Globe size={13} />
                          <span>{camp.destination}</span>
                        </a>
                      </div>

                      <div className="campaign-header-right">
                        {/* Aggregated Unique Channel Badges */}
                        <div className="campaign-badges-wrap">
                          {campChannelSummaries.map((ch) => {
                            const Logo = ch.LogoComp;
                            return (
                              <div key={ch.name} className="campaign-channel-badge">
                                <Logo size={14} />
                                <span>{ch.name}:</span>
                                <span className="badge-count">
                                  {ch.clicks} {ch.clicks === 1 ? 'view' : 'views'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Total Views Pill */}
                        <div className="campaign-total-pill">
                          {camp.totalClicks} Total {camp.totalClicks === 1 ? 'View' : 'Views'}
                        </div>

                        {/* Expand/Collapse Toggle */}
                        <button
                          onClick={() => toggleCampaignExpansion(camp.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title={isExpanded ? 'Collapse channels' : 'Expand channels'}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Channel Links Subgrid */}
                    {isExpanded && (
                      <div className="channel-links-grid">
                        {camp.links.map((link) => {
                          const badge = getChannelBadge(link.channel, link);
                          const LogoComp = badge.LogoComp;
                          const isCopied = copiedCode === link.code;

                          return (
                            <div key={link.id} className="channel-link-box">
                              {/* Top Row: Brand & View Count + Quick Actions */}
                              <div className="channel-box-header">
                                <div className="channel-brand-info">
                                  <LogoComp size={22} />
                                  <span className="channel-brand-name">{badge.name}</span>
                                </div>

                                <div className="channel-box-meta">
                                  <span className="channel-views-badge">
                                    {link.clicks_count || 0} {link.clicks_count === 1 ? 'view' : 'views'}
                                  </span>

                                  <button
                                    onClick={() => handleInspectLink(link)}
                                    className="channel-icon-btn"
                                    title="View click audit logs (device, referrer, timestamp)"
                                  >
                                    <BarChart3 size={13} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteLink(link.id, link.code)}
                                    disabled={deletingId === link.id}
                                    className="channel-icon-btn delete"
                                    title="Delete this channel link"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>

                              {/* Middle Row: Short Link Code Pill */}
                              <div
                                className="channel-url-pill"
                                onClick={() => handleCopy(link.code)}
                                title="Click to copy short link"
                              >
                                <LinkIcon size={14} className="channel-url-icon" />
                                <span className="channel-url-code">/go/{link.code}</span>
                                <span className="channel-url-copy-hint">
                                  {isCopied ? 'Copied!' : 'Copy'}
                                </span>
                              </div>

                              {/* Bottom Row: Full Action Buttons */}
                              <div className="channel-actions-row">
                                <button
                                  onClick={() => handleCopy(link.code)}
                                  className={`btn-action-primary ${isCopied ? 'copied' : ''}`}
                                  title="Copy short link"
                                >
                                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                  <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                                </button>

                                <a
                                  href={`/go/${link.code}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-action-secondary"
                                  title="Test redirect in new tab"
                                  onClick={() => setTimeout(() => loadData(true), 1200)}
                                >
                                  <ExternalLink size={14} />
                                  <span>Test Redirect ↗</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Individual Link Click Logs Modal */}
      {selectedLinkDetails && (
        <div className="modal-overlay" onClick={() => setSelectedLinkDetails(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Link Analytics & Click Stream</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
                  /go/{selectedLinkDetails.link.code}
                </span>
              </div>
              <button onClick={() => setSelectedLinkDetails(null)} className="modal-close">
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Target Destination:</div>
              <a
                href={selectedLinkDetails.link.destination_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-primary)', fontSize: '0.875rem', wordBreak: 'break-all', textDecoration: 'underline' }}
              >
                {selectedLinkDetails.link.destination_url}
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL CLICKS</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {selectedLinkDetails.link.clicks_count}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CHANNEL TAG</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem', textTransform: 'capitalize' }}>
                  {selectedLinkDetails.link.channel || 'Direct'}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Recent Visitor Logs (Live Audit Trail)
            </h4>

            {detailsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading event logs...</div>
            ) : selectedLinkDetails.clicks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                No clicks logged yet for this short code. Click "Test" on the card to generate your first visit!
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Referrer</th>
                    <th>Device</th>
                    <th>Browser</th>
                    <th>OS</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLinkDetails.clicks.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td>{c.referer || 'Direct'}</td>
                      <td>{c.device || 'Desktop'}</td>
                      <td>{c.browser || 'Chrome'}</td>
                      <td>{c.os || 'Windows'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
