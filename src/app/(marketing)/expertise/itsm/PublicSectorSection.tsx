import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import {
  ITSM_PUBLIC_SECTOR_CONTENT,
  ITSM_PUBLIC_SECTOR_FACTS,
} from '@/constants/itsm';
import { publicSectorBg } from '@/constants/media';

/**
 * "Service Desks That Pass a Federal Audit" - the public-sector proof panel.
 *
 * Reuses the home page's public-sector photo and its frosted-glass panel
 * treatment (`bg-white/[.82]` + `backdrop-blur`), so the two read as the same
 * practice. What it does NOT reuse is that section's rotating two-panel stack -
 * that needs `useAutoRotate` and would make this whole section a Client Component
 * for a single static panel. One panel, server-rendered.
 *
 * The background is set inline because the URL is a build-hashed asset path, which
 * no static Tailwind class can name.
 *
 * ── CLAIMS ──
 * The agencies named here (IRS, U.S. Coast Guard) are the ones the home page and
 * About page already name, and the wording of the audit-trail and least-privilege
 * facts is taken from the home page's own IRS story card. No contract vehicle is
 * referenced: procurement claims live on the home page, where they are already
 * qualified, and repeating them on a service page would put them in front of a
 * reader who has no way to check them.
 */
export function PublicSectorSection() {
  return (
    <section
      className="relative bg-cover bg-left bg-no-repeat"
      style={{ backgroundImage: `url(${publicSectorBg.src})` }}
    >
      <div className="relative z-10 mx-auto flex max-w-shell justify-end px-6 py-12 lg:py-16 to-900:justify-center">
        <div className="w-full max-w-[860px] to-900:max-w-[620px]">
          <div className={cn(reveal(), 'text-left md:text-left')} {...revealAttrs()}>
            <h2 className={HEADING_CLASS}>
              {ITSM_PUBLIC_SECTOR_CONTENT.headingLead}
              <GradientText>
                {ITSM_PUBLIC_SECTOR_CONTENT.headingHighlight}
              </GradientText>
            </h2>
            <p className={cn(SUBHEADING_CLASS, 'mt-3')}>
              {ITSM_PUBLIC_SECTOR_CONTENT.subheading}
            </p>
          </div>

          <div
            className={cn(
              'mt-7 rounded-[10px] border border-white/[.65] bg-white/[.82] p-6 pt-9 shadow-panel backdrop-blur-[18px] backdrop-saturate-[160%]',
              'to-640:px-5 to-640:py-6',
              reveal('up', 100),
              'text-left md:text-left',
            )}
            {...revealAttrs()}
          >
            <p className="mb-5 text-[16px] leading-[1.7] text-black">
              Clovity runs a <strong>U.S.-led federal practice</strong> - secure,
              audit-ready Atlassian for the <strong>IRS</strong>,{' '}
              <strong>U.S. Coast Guard</strong>, and state, county and city
              agencies nationwide. Service management is part of that work, not a
              commercial playbook re-pointed at government.
            </p>

            <div className="grid grid-cols-2 gap-x-7 gap-y-[18px] to-640:grid-cols-1">
              {ITSM_PUBLIC_SECTOR_FACTS.map((fact, index) => (
                <div
                  key={fact.id}
                  className={cn(
                    'border-t border-ink/10 pt-4',
                    // The first row of two needs no rule above it…
                    index < 2 && 'border-t-0 pt-0',
                    // …but in one column only the very first item leads the list,
                    // so every other one gets its rule back.
                    index === 0
                      ? 'to-640:border-t-0 to-640:pt-0'
                      : 'to-640:border-t to-640:pt-4',
                  )}
                >
                  <b className="mb-[5px] flex items-center gap-2 text-[16px] font-800 leading-[1.3] text-black">
                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-brand-600">
                      <Icon name="circle-check" size={17} />
                    </span>
                    {fact.title}
                  </b>
                  <p className="m-0 text-[13.5px] leading-[1.55] text-black">
                    {fact.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <SmartLink
                href={ITSM_PUBLIC_SECTOR_CONTENT.ctaHref}
                className={buttonClass('primary', 'md', 'px-4 py-3 text-[13px]')}
              >
                {ITSM_PUBLIC_SECTOR_CONTENT.ctaLabel} <ArrowIcon />
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
