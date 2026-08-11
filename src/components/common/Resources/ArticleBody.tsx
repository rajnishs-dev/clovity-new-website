import type { ContentBlock } from '@/types/content';

/**
 * Renders a detail page's `ContentBlock[]` body - the legacy `.post-prose`
 * article typography, expressed as Tailwind utilities per block type instead
 * of a `dangerouslySetInnerHTML` blob.
 */
export function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="text-[16.5px] leading-[1.7] text-black">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={index}
                className={
                  index === 0
                    ? 'mb-8 text-[16px] leading-[1.7] text-black'
                    : 'mb-5'
                }
              >
                {block.text}
              </p>
            );
          case 'heading': {
            const Tag = block.level === 3 ? 'h3' : 'h2';
            return (
              <Tag
                key={index}
                className={
                  block.level === 3
                    ? 'mb-3 mt-8 text-[19px] font-500 leading-[1.35] tracking-[-0.005em] text-title'
                    : 'mb-4 mt-10 text-[24px] font-500 leading-[1.3] tracking-[-0.01em] text-title first:mt-0 sm:text-[26px]'
                }
              >
                {block.text}
              </Tag>
            );
          }
          case 'list':
            return (
              <ul key={index} className="mb-6 list-disc space-y-2.5 pl-5">
                {block.items.map((item) => (
                  <li key={item} className="pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            );
          /**
           * A RAW `<img>`, NOT `next/image`, and this is deliberate.
           *
           * These URLs are pasted into the CMS by editors, and the live bodies prove how
           * uncontrolled that is: six distinct hosts across the published posts
           * (`clovity-website.s3…`, `ww1.prweb.com`, two Giphy CDNs, `cioreview.com`,
           * `globalspec.com`), some served over `http`, and eleven tags with no
           * dimensions at all. `next/image` THROWS on a host that is not in
           * `next.config.ts`, so routing these through it would mean an editor pasting
           * from a new domain takes the whole article page down - and no allow-list can
           * be kept ahead of that.
           *
           * The trade is losing optimization on body images only. Every curated image on
           * the site - heroes, cards, badges - still goes through `next/image`.
           */
          case 'image':
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={block.src}
                alt={block.alt}
                {...(block.width ? { width: block.width } : {})}
                {...(block.height ? { height: block.height } : {})}
                loading="lazy"
                decoding="async"
                className="mb-6 h-auto max-w-full rounded-[8px]"
              />
            );
          case 'quote':
            return (
              <blockquote
                key={index}
                className="mb-6 rounded-r-xl border-l-[3px] border-brand-600 bg-brand-50/40 py-4 pl-6 pr-5 text-[17px] italic leading-[1.6] text-title"
              >
                <p className="m-0">&ldquo;{block.text}&rdquo;</p>
                {block.cite ? (
                  <footer className="mt-2 text-[13.5px] font-700 not-italic text-faint">
                    {block.cite}
                  </footer>
                ) : null}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
