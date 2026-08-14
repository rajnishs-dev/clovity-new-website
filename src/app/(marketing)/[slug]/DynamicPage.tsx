'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDynamicPageBySlug, getInTouch } from '@/api/cms';
import type { ContactFormConfig } from '@/types/content';
import { ROUTES } from '@/constants/routes';

/**
 * Renders whatever a CMS editor authored for `slug`, the same lookup and iframe
 * rendering `website-t/src/app/[slug]/component.tsx` does:
 *
 *   1. `dynamic-page` row for the slug exists  -> its `website` HTML, in an iframe.
 *   2. no `dynamic-page`, but a `get-in-touch` row for the slug exists -> that page's
 *      contact form (the same fallback `website-t` shows).
 *   3. neither exists -> nothing to render for this slug, back to the home page.
 */
export function DynamicPage({ slug }: { slug: string }) {
  const decoded = decodeURIComponent(slug);
  const router = useRouter();

  const [phase, setPhase] = useState<'loading' | 'html' | 'contact'>(
    'loading',
  );
  const [html, setHtml] = useState<string>();
  const [contactConfig, setContactConfig] = useState<ContactFormConfig>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setPhase('loading');

      try {
        const website = await getDynamicPageBySlug(decoded);
        if (cancelled) return;
        if (website) {
          setHtml(website);
          setPhase('html');
          return;
        }

        const config = await getInTouch(decoded);
        if (cancelled) return;
        if (config) {
          setContactConfig(config);
          setPhase('contact');
          return;
        }

        router.replace(ROUTES.home);
      } catch {
        if (!cancelled) router.replace(ROUTES.home);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [decoded, router]);

  /** Iframe height tracks its own content - a fixed height would clip or leave a gap. */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || phase !== 'html') return;

    const updateHeight = () => {
      try {
        const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
        if (doc?.body?.scrollHeight) {
          iframe.style.height = `${doc.body.scrollHeight}px`;
        }
      } catch {
        // Cross-origin content can't be measured - the iframe keeps its last height.
      }
    };

    iframe.addEventListener('load', updateHeight);

    let observer: ResizeObserver | null = null;
    try {
      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (doc?.body) {
        observer = new ResizeObserver(updateHeight);
        observer.observe(doc.body);
      }
    } catch {
      // Same cross-origin case - `load` above is the fallback.
    }

    return () => {
      iframe.removeEventListener('load', updateHeight);
      observer?.disconnect();
    };
  }, [phase, html]);

  /** A "Contact us" button inside the CMS HTML asks the parent page to scroll down to it. */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === 'scrollToContact') {
        document
          .getElementById('dynamic-page-contact')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);


  if (phase === 'loading') {
    return (
      <div className="relative h-[90vh] w-full animate-pulse overflow-hidden rounded-lg bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </div>
    );
  }

  return (
    <div>
      <iframe
        ref={iframeRef}
        srcDoc={html}
        className="w-full border-0"
        style={{ overflow: 'hidden' }}
        scrolling="no"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
