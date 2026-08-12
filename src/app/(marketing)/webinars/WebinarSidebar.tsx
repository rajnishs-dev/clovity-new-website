import type { WebinarItem } from '@/types/content';
import { RegisterForm } from './RegisterForm';

/**
 * The webinar detail sidebar - the legacy `.post-aside` slot, but carrying either the
 * recording or the way to ask for it, instead of the blog/event search-and-top-list
 * treatment, since webinars have neither a search index nor a "top webinars" rail worth
 * surfacing.
 *
 * ONE OR THE OTHER, NEVER BOTH: a session whose recording is already embedded has nothing
 * left to request, and asking someone to fill in four fields for something playing above
 * the form is a worse page. So the form appears only where `videoUrl` is absent - which
 * is also the only case its own copy makes sense in ("sign up anyway and we'll send you
 * the recording").
 *
 * The form replaced a `mailto:sales@clovity.com` button. That button asked a visitor to
 * compose an email and produced no record anywhere; this writes a row to the Strapi
 * `recordings` collection, the same one the published site's form writes to.
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
    <RegisterForm
      title={webinar.title}
      /* `id` is the Strapi `documentId` for a CMS-sourced session - what the `recording`
         row records so a request can be traced back to its webinar. */
      docId={webinar.id}
      {...(webinar.whenLabel ? { whenLabel: webinar.whenLabel } : {})}
    />
  );
}
