import type { BlogPost } from '@/types/content';
import { DEVSECOPS_PROOF_CONTENT } from '@/constants/devsecops';
import { getAllBlogPosts, getBlogPosts } from './blog';

/**
 * The DevSecOps page's data layer.
 *
 * One lookup: the featured playbook post. Unlike the ITSM page there are no client
 * logos here - this page's proof is a single long-form article, not a marquee.
 *
 * ── WHY THE BUNDLED COPY IS THE FALLBACK, NOT THE SOURCE ──
 * The DevSecOps post is one of the few bundled posts that carries a full body (see
 * the header comment in `data/blog.ts`), and `constants/devsecops.ts` draws its
 * delivery and toolchain framing from that body. So the page reads correctly with or
 * without Strapi. We still prefer the CMS copy when
 * it is reachable, because an editor who updates the post should see the featured
 * card's title and excerpt follow.
 */
export async function getDevSecOpsPlaybook(): Promise<BlogPost | undefined> {
  const bundled = getAllBlogPosts().find(
    (post) => post.slug === DEVSECOPS_PROOF_CONTENT.featuredSlug,
  );

  // `getBlogPosts` already falls back to the bundled list on a CMS failure, so a
  // failure here is not an error - it just means we keep the bundled row.
  const live = (await getBlogPosts()).find(
    (post) => post.slug === DEVSECOPS_PROOF_CONTENT.featuredSlug,
  );

  return live ?? bundled;
}

/** Everything the DevSecOps page needs. */
export async function getDevSecOpsPageData() {
  const playbook = await getDevSecOpsPlaybook();
  return { playbook };
}
