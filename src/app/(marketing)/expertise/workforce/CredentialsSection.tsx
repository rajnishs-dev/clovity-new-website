import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { AppImage } from '@/components/ui/Image';
import { Chip, GradientText, Section, SectionHeader } from '@/components/ui';
import {
  WF_CREDENTIALS_CONTENT,
  WF_CREDENTIAL_BADGES,
  WF_CREDENTIAL_FACTS,
  WF_INDUSTRIES,
  WF_INDUSTRIES_LABEL,
} from '@/constants/workforce';

/**
 * "Certifications That Clear Procurement" - the supplier-diversity credentials.
 *
 * ── WHY THIS IS ON A STAFFING PAGE AND NOT ONLY ON `/about-us` ──
 * On enterprise and public-sector staffing bids the supplier-diversity question is scored
 * before anyone reads a résumé, and it is asked of the STAFFING vendor specifically. A
 * reader evaluating this page is the reader who needs the answer, and making them find it
 * on the About page is making them guess.
 *
 * ── THE ACRONYMS ARE EXPANDED, BECAUSE THEY HAVE TO BE ──
 * Three logos in a row tell a procurement specialist everything and tell everyone else
 * nothing. So each badge is paired with what the programme actually is - the same content
 * a capability statement would carry. `WF_CREDENTIAL_FACTS` and `WF_CREDENTIAL_BADGES` are
 * separate arrays rather than one, because the badges are laid out as a strip and the
 * facts as a list; joining them would force one of the two into the other's shape.
 *
 * ── WHAT THIS SECTION MUST NOT BE READ AS ──
 * No contract vehicle is named anywhere on it. This is precisely the context where a reader
 * looks for SEWP, 2GIT or a Carahsoft listing, and Clovity's own published material names
 * none of them - so the footnote states plainly that vehicle status varies by solicitation
 * and has to be confirmed in writing. A stale procurement claim is a serious problem in a
 * bid, which is why the disclaimer is in the same visual block as the badges rather than in
 * small print at the foot of the page.
 *
 * Badge art is served from `www.clovity.com` at the same paths the About page uses - see
 * the note on `WF_CREDENTIAL_BADGES`. `sizes` is fixed rather than viewport-relative because
 * these render at a constant 74px height.
 */
export function CredentialsSection() {
  return (
    <Section
      padding="tight"
      className="border-b border-line-faint bg-[#eaf8ff]"
    >
      <div className="grid items-start gap-x-16 gap-y-10 ml:grid-cols-[minmax(0,440px)_1fr]">
        <div className="h-full content-center">
          <SectionHeader
            heading={
              <>
                {WF_CREDENTIALS_CONTENT.headingLead}
                <GradientText>
                  {WF_CREDENTIALS_CONTENT.headingHighlight}
                </GradientText>
              </>
            }
            subheading={WF_CREDENTIALS_CONTENT.subheading}
            subheadingClassName="mt-4"
            align="left"
            className="mb-7"
          />

          <div
            className={cn(reveal('up', 150), 'md:text-left')}
            {...revealAttrs()}
          >
            <SmartLink
              href={WF_CREDENTIALS_CONTENT.ctaHref}
              className={buttonClass('primary')}
            >
              {WF_CREDENTIALS_CONTENT.ctaLabel} <ArrowIcon />
            </SmartLink>
          </div>
        </div>

        <div
          className={cn(
            'overflow-hidden rounded-[14px] border border-line-soft bg-white',
            revealAligned('left'),
          )}
          {...revealAttrs()}
        >
          <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-6 border-b border-line-faint bg-soft px-7 py-7">
            {WF_CREDENTIAL_BADGES.map((badge) => (
              <li key={badge.id} className="flex items-center">
                {/* No `sizes`: these render at a fixed 74px height, and passing one
                    makes next/image emit a candidate per configured device width
                    instead of the 1x/2x pair a fixed box actually needs. Same
                    treatment as the About page's copy of these three badges. */}
                <AppImage
                  src={badge.image.src}
                  alt={badge.image.alt}
                  className="h-[74px] w-auto max-w-full object-contain"
                  {...(badge.image.width && badge.image.height
                    ? { width: badge.image.width, height: badge.image.height }
                    : {})}
                />
              </li>
            ))}
          </ul>

          <dl className="m-0">
            {WF_CREDENTIAL_FACTS.map((fact, index) => (
              <div
                key={fact.id}
                className={cn(
                  'px-7 py-5',
                  index > 0 && 'border-t border-line-faint',
                )}
              >
                <dt className="mb-1 flex items-center gap-2.5 text-[15px] font-600 leading-[1.35] tracking-[-.01em] text-title">
                  <Icon
                    name="circle-check"
                    size={16}
                    aria-hidden
                    className="shrink-0 text-brand-600"
                  />
                  {fact.title}
                </dt>
                <dd className="m-0 pl-[26px] text-[13.5px] leading-[1.6] text-[#64748b]">
                  {fact.description}
                </dd>
              </div>
            ))}
          </dl>

          <p className="m-0 border-t border-line-faint bg-soft px-7 py-4 text-[12px] leading-[1.6] text-faint">
            {WF_CREDENTIALS_CONTENT.footnote}
          </p>
        </div>
      </div>

      <div
        className={cn('mt-12 text-center', reveal('up', 150), 'md:text-center')}
        {...revealAttrs()}
      >
        <p className="m-0 mb-5 text-[12px] font-800 uppercase tracking-[.14em] text-faint">
          {WF_INDUSTRIES_LABEL}
        </p>
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-3">
          {WF_INDUSTRIES.map((industry) => (
            <li key={industry.id}>
              <Chip
                variant="cloud"
                icon={<Icon name={industry.icon} size={14} aria-hidden />}
              >
                {industry.label}
              </Chip>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
