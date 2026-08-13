import type { ContentBlock } from '@/types/content';

/** Renders a detail page's `ContentBlock[]` body as Tailwind utilities per block type, instead of a `dangerouslySetInnerHTML` blob. */
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
           * A raw `<img>`, not `next/image`, deliberately: these src URLs are
           * pasted into the CMS by editors from arbitrary hosts, and
           * `next/image` throws on any host not allow-listed in
           * `next.config.ts` - an editor pasting from a new domain would take
           * down the whole article page. Curated images elsewhere still use
           * `next/image`.
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
                className="mb-6 h-auto max-w-full rounded-[10px]"
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
