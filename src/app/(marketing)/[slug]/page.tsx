import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RevealScope } from '@/components/common/Resources';
import { DynamicPage } from './DynamicPage';

/**
 * Catch-all for editor-authored microsite pages.
 *
 * Every static route in `(marketing)` (`/blog`, `/contact`, …) is a literal folder,
 * so Next matches those first - this only ever receives a slug none of them own.
 * The slug itself decides what renders; see `DynamicPage` for the CMS lookup.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      {/*
        DynamicPage's ContactSection and bottom CTA both use `reveal()`, which
        renders at `opacity-0` until something flips `data-shown="true"` - see
        `RevealScope`. Without this mounted they stay invisible forever.
      */}
      <RevealScope />
      <Header variant="pill" />
      <main id="main-content">
        <DynamicPage slug={slug} />
      </main>
      <Footer overlap />
    </>
  );
}
