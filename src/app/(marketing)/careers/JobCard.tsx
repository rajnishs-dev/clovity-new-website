'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { richTextToPlainText, truncate } from '@/lib/format';
import type { JobOpening } from '@/types/content';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { RichText } from '@/components/ui/RichText';
import {
  CAREERS_JOB_ABOUT_PARAGRAPHS,
  CAREERS_JOB_BENEFITS_PARAGRAPH,
  CAREERS_JOB_MENU,
  CAREERS_JOB_PANELS,
  type CareersJobPanelId,
} from '@/constants/careers';

/**
 * One open-position card, with two features carried over from the legacy `/talent`
 * card: three expandable panels (About Us / Job Description / Our Benefits - only the
 * middle is per-role, the other two are the same copy on every posting) and an
 * overflow menu.
 *
 * Each card owns its own open/closed state rather than the parent: there are 173 of
 * these, and shared state would re-render the whole list on every toggle. Panel bodies
 * mount only when open, since 173 postings' worth of headings and bullet lists is tens
 * of thousands of DOM nodes nothing is looking at.
 *
 * The check/cross toggle icon (tick collapsed, cross expanded) reads as "toggle" rather
 * than "done" - unusual, but matches the card being copied; `aria-expanded` carries the
 * real state.
 */

/** A run of text in the boilerplate panels, optionally linked. */
interface CopySegment {
  readonly text: string;
  readonly href?: string;
  readonly external?: boolean;
}

function Segments({ segments }: { segments: readonly CopySegment[] }) {
  return (
    <>
      {segments.map((segment) =>
        segment.href ? (
          <SmartLink
            key={segment.text}
            href={segment.href}
            {...(segment.external ? { forceExternal: true } : {})}
            className="text-brand-600 underline decoration-brand-200 underline-offset-2 transition-colors hover:text-brand-700 hover:decoration-brand-600"
          >
            {segment.text}
          </SmartLink>
        ) : (
          <span key={segment.text.slice(0, 24)}>{segment.text}</span>
        ),
      )}
    </>
  );
}

/** Character budget for the collapsed teaser, before the three-line clamp. */
const TEASER_LENGTH = 200;

export interface JobCardProps {
  job: JobOpening;
}

export function JobCard({ job }: JobCardProps) {
  const baseId = useId();
  const [openPanels, setOpenPanels] = useState<Set<CareersJobPanelId>>(
    () => new Set(),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const togglePanel = (id: CareersJobPanelId) => {
    setOpenPanels((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* Close the menu on an outside click or Escape - the legacy card did the first. */
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  /* Reset the "Copied" label after the legacy card's two seconds. */
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const anchorId = `job-${job.slug}`;

  /**
   * Copy a deep link to this card.
   *
   * The URL is read here rather than held in state: this section is prerendered, so
   * `window` does not exist at render time, and reading it in an effect would mean a
   * cascading render per card - 173 of them - for a value only ever needed on click.
   */
  const handleCopy = async () => {
    try {
      const { origin, pathname } = window.location;
      await navigator.clipboard.writeText(`${origin}${pathname}#${anchorId}`);
      setCopied(true);
    } catch {
      // A denied clipboard permission is not worth an alert; the menu stays open
      // and the label simply does not change.
    }
  };

  const handleViewDetails = () => {
    setOpenPanels(new Set(CAREERS_JOB_PANELS.map((panel) => panel.id)));
    setMenuOpen(false);
    document.getElementById(anchorId)?.scrollIntoView({ block: 'start' });
  };

  const panelBody = (id: CareersJobPanelId): ReactNode => {
    if (id === 'about') {
      return (
        <div className="text-[15px] leading-[1.7] text-muted">
          {CAREERS_JOB_ABOUT_PARAGRAPHS.map((paragraph, index) => (
            <p key={index} className="mb-3 last:mb-0">
              <Segments segments={paragraph} />
            </p>
          ))}
        </div>
      );
    }
    if (id === 'benefits') {
      return (
        <p className="m-0 text-[15px] leading-[1.7] text-muted">
          <Segments segments={CAREERS_JOB_BENEFITS_PARAGRAPH} />
        </p>
      );
    }
    return <RichText source={job.description} />;
  };

  return (
    <article
      id={anchorId}
      className={cn(
        'scroll-mt-28 rounded-[10px] border border-line-soft bg-white px-7 py-[26px]',
        '[transition:transform_.25s,box-shadow_.25s,border-color_.25s]',
        'hover:-translate-y-[3px] hover:border-brand-200 hover:shadow-[0_16px_36px_rgba(15,23,42,.08)]',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-6 to-900:justify-start">
        <div className="min-w-[260px] flex-[1_1_380px]">
          <span
            className={cn(
              'mb-2.5 inline-flex items-center rounded-pill px-[11px] py-1 text-[11.5px] font-800 tracking-[.03em]',
              job.trackTagClass,
            )}
          >
            {job.trackLabel}
          </span>
          <h3 className="mb-2 text-[18px] font-500 tracking-[-.01em] text-title">
            {job.title}
          </h3>

          <div className="mb-2.5 flex flex-wrap gap-3.5 text-[13px] font-600 text-[#64748b]">
            {/* Guarded: one live opening has an empty `location`, and an
                unguarded chip renders as a lone pin icon with no label. */}
            {job.location ? (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="map-pin" className="text-[12px] text-faint" />
                {job.location}
              </span>
            ) : null}
            {job.employmentType ? (
              <span className="inline-flex items-center gap-1.5">
                <Icon
                  name={job.employmentType.icon}
                  className="text-[12px] text-faint"
                />
                {job.employmentType.label}
              </span>
            ) : null}
            {job.experience ? (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="briefcase" className="text-[12px] text-faint" />
                {job.experience} Years
              </span>
            ) : null}
            {job.practice ? (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="users" className="text-[12px] text-faint" />
                {job.practice}
              </span>
            ) : null}
          </div>

          {/* The teaser is hidden once the description panel is open, so the same
              opening sentences are not shown twice, one above the other. */}
          {openPanels.has('job-description') ? null : (
            <p className="m-0 line-clamp-3 max-w-[640px] text-[14.5px] leading-[1.6] text-body">
              {truncate(richTextToPlainText(job.description), TEASER_LENGTH)}
            </p>
          )}
        </div>

        {/* ── Overflow menu ── */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label={`More options for ${job.title}`}
            className={cn(
              'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[18px] text-faint',
              'transition-colors hover:bg-soft hover:text-body',
            )}
          >
            <Icon name="ellipsis" />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              aria-label={`Options for ${job.title}`}
              className="absolute right-0 top-10 z-20 w-[210px] overflow-hidden rounded-lg border border-line bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,.14)]"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleCopy}
                className="flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-3 py-2 text-left text-[14px] text-muted transition-colors hover:bg-soft"
              >
                <Icon
                  name={copied ? 'check' : 'copy'}
                  className="text-[15px] text-faint"
                />
                {copied
                  ? CAREERS_JOB_MENU.copiedLabel
                  : CAREERS_JOB_MENU.copyLabel}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleViewDetails}
                className="flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-3 py-2 text-left text-[14px] text-muted transition-colors hover:bg-soft"
              >
                <Icon name="chevron-down" className="text-[15px] text-faint" />
                {CAREERS_JOB_MENU.detailsLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── The three panels ── */}
      <div className="my-6 flex flex-col gap-4">
        {CAREERS_JOB_PANELS.map((panel) => {
          const open = openPanels.has(panel.id);
          const panelId = `${baseId}-${panel.id}`;

          return (
            <div key={panel.id}>
              <button
                type="button"
                onClick={() => togglePanel(panel.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-center gap-3 rounded border-0 bg-[#e8eefb] px-4 py-3 text-left text-[16px] font-700 text-black transition-colors hover:bg-[#dde6f8]"
              >
                <span
                  aria-hidden
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black text-[13px] text-black"
                >
                  <Icon name={open ? 'close' : 'check'} />
                </span>
                {panel.label}
              </button>

              {open ? (
                <div id={panelId} className="px-4 pt-4">
                  {panelBody(panel.id)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <ButtonLink
        href={job.applyHref}
        className="px-[22px] py-[11px] text-[13.5px] to-900:justify-center"
        trailingIcon={<ArrowIcon />}
        aria-label={`Apply for ${job.title}`}
      >
        Apply Now
      </ButtonLink>
    </article>
  );
}
