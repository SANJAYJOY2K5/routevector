export interface ClientMetadata {
  device: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot' | 'Unknown';
  browser: string;
  os: string;
}

export function parseUserAgent(uaString: string | null | undefined): ClientMetadata {
  if (!uaString) {
    return {
      device: 'Unknown',
      browser: 'Direct / Unknown',
      os: 'Unknown',
    };
  }

  const ua = uaString.toLowerCase();

  // 1. Detect Bots/Crawlers
  if (
    ua.includes('bot') ||
    ua.includes('spider') ||
    ua.includes('crawl') ||
    ua.includes('slurp') ||
    ua.includes('facebookexternalhit') ||
    ua.includes('whatsapp') ||
    ua.includes('telegrambot') ||
    ua.includes('twitterbot') ||
    ua.includes('preview')
  ) {
    return {
      device: 'Bot',
      browser: 'Automated Bot / Crawler',
      os: 'Server',
    };
  }

  // 2. Detect Device
  let device: ClientMetadata['device'] = 'Desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'Mobile';
  }

  // 3. Detect OS
  let os = 'Other';
  if (ua.includes('windows nt 10.0') || ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'iOS';
  } else if (ua.includes('macintosh') || ua.includes('mac os x')) {
    os = 'macOS';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('cros')) {
    os = 'Chrome OS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  // 4. Detect Browser
  let browser = 'Other';
  if (ua.includes('edg/')) {
    browser = 'Microsoft Edge';
  } else if (ua.includes('opr/') || ua.includes('opera')) {
    browser = 'Opera';
  } else if (ua.includes('chrome/') || ua.includes('crios/')) {
    browser = 'Google Chrome';
  } else if (ua.includes('firefox/') || ua.includes('fxios/')) {
    browser = 'Mozilla Firefox';
  } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
    browser = 'Apple Safari';
  } else if (ua.includes('trident/') || ua.includes('msie')) {
    browser = 'Internet Explorer';
  }

  return { device, browser, os };
}

export function parseReferrer(rawReferer: string | null | undefined): string {
  if (!rawReferer || rawReferer.trim() === '') {
    return 'Direct';
  }

  try {
    const parsed = new URL(rawReferer);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (host.includes('twitter.com') || host.includes('x.com') || host.includes('t.co')) {
      return 'X / Twitter';
    }
    if (host.includes('linkedin.com') || host.includes('lnkd.in')) {
      return 'LinkedIn';
    }
    if (host.includes('github.com')) {
      return 'GitHub';
    }
    if (host.includes('google.')) {
      return 'Google';
    }
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return 'YouTube';
    }
    if (host.includes('reddit.com')) {
      return 'Reddit';
    }
    if (host.includes('facebook.com') || host.includes('fb.com')) {
      return 'Facebook';
    }
    if (host.includes('instagram.com')) {
      return 'Instagram';
    }
    if (host.includes('threads.net')) {
      return 'Threads';
    }
    if (host.includes('news.ycombinator.com')) {
      return 'Hacker News';
    }

    return host;
  } catch {
    return 'Direct';
  }
}
