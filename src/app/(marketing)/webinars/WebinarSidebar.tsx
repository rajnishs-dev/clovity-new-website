import type { WebinarItem } from '@/types/content';
import { RegisterForm } from './RegisterForm';

/**
 * The webinar detail sidebar - carries either the recording or the way to request it,
 * instead of the blog/event search-and-top-list treatment (webinars have neither).
 *
 * One or the other, never both: a session with an embedded recording has nothing left
 * to request, so the form only appears where `videoUrl` is absent.
 *
 * Replaces a `mailto:sales@clovity.com` button that produced no record; this writes to
 * the same Strapi `recordings` collection the published site's form uses.
 */
export function WebinarSidebar({ webinar }: { webinar: WebinarItem }) {
  if (webinar.videoUrl) {
    return (
      <div className="rounded-[10px] border border-line-soft bg-white p-4 shadow-xs">
        <h3 className="mb-3 text-[19px] font-500 text-title">Watch Webinar</h3>
        <div className="relative aspect-video overflow-hidden rounded-[10px]">
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
    <RegisterForm
      title={webinar.title}
      /* `id` is the Strapi `documentId` for a CMS-sourced session - what the `recording`
         row records so a request can be traced back to its webinar. */
      docId={webinar.id}
      {...(webinar.whenLabel ? { whenLabel: webinar.whenLabel } : {})}
    />
  );
}
