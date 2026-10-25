'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AlertCircle, ArrowLeft, ExternalLink, Compass } from 'lucide-react';

function NotFoundContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <div className="notfound-icon-wrap">
          <AlertCircle size={32} className="notfound-icon" />
        </div>

        <span className="notfound-badge">404 • Resource Not Found</span>
        <h1 className="notfound-title">Short link not found</h1>

        <p className="notfound-desc">
          The link you tried to access {code ? <code className="code-pill">/go/{code}</code> : ''} does not exist, has expired, or was removed by its owner.
        </p>

        <div className="notfound-actions">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Dashboard
          </Link>
          <a
            href="https://github.com/dubinc/dub"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <ExternalLink size={16} /> Learn About Short Links
          </a>
        </div>

        <div className="notfound-hint">
          <Compass size={14} /> Tip: Verify that the short code is spelled correctly or ask the sender for an updated link.
        </div>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="loading-state">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
