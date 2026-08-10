'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/**
 * The share row at the end of every detail article - the legacy
 * `.post-share-row`: LinkedIn + X share intents, plus a copy-link button.
 * A client component only for the clipboard write and the brief check-mark
 * confirmation; the links themselves work with JS disabled.
 */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  const buttonClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-line-soft bg-white text-[13px] text-body transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-600 hover:bg-brand-600 hover:text-white';

  const copyLink = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };

  return (
    <div className="mt-6 flex items-center gap-3">
      <span className="text-[12.5px] font-800 uppercase tracking-[.06em] text-faint">
        Share
      </span>
      <a
        href={linkedInHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={buttonClass}
      >
        <Icon name="linkedin" />
      </a>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={buttonClass}
      >
        <Icon name="x" />
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className={buttonClass}
      >
        <Icon name={copied ? 'check' : 'link'} />
      </button>
    </div>
  );
}
