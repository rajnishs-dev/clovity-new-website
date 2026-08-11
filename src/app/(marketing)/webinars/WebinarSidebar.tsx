import type { WebinarItem } from '@/types/content';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';

/**
 * The webinar detail sidebar - the legacy `.post-aside` slot, but carrying a
 * recording embed (or a "request the recording" CTA) instead of the blog/event
 * search-and-top-list treatment, since webinars have neither a search index nor
 * a "top webinars" rail worth surfacing.
 */
export function WebinarSidebar({ webinar }: { webinar: WebinarItem }) {
  if (webinar.videoUrl) {
    return (
      <div className="rounded-[8px] border border-line-soft bg-white p-4 shadow-xs">
        <h3 className="mb-3 text-[19px] font-500 text-title">Watch Webinar</h3>
        <div className="relative aspect-video overflow-hidden rounded-[8px]">
          <iframe
            src={webinar.videoUrl}
            title={`${webinar.title} recording`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-line-soft bg-white p-4 shadow-xs">
      <h3 className="mb-3 text-[19px] font-500 text-title">Get the Recording</h3>
      <p className="mb-4 text-[14px] leading-[1.65] text-body">
        This session&apos;s recording is available on request.
      </p>
      <SmartLink
        href="mailto:sales@clovity.com"
        className={buttonClass('primary', 'md', 'w-full justify-center')}
      >
        Request the Recording
      </SmartLink>
    </div>
  );
}
