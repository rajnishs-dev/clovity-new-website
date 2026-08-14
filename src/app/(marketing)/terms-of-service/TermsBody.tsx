import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/constants/site';
import { SmartLink } from '@/components/ui/Link';

/** `support@clovity.com`, wired up as a `mailto:` link. */
function SupportEmailLink() {
  return (
    <SmartLink
      href={`mailto:${siteConfig.contact.supportEmail}`}
      className="text-brand-600 hover:underline"
    >
      {siteConfig.contact.supportEmail}
    </SmartLink>
  );
}

/** Links back to the Privacy Policy page. */
function PrivacyPolicyLink() {
  return (
    <SmartLink
      href={ROUTES.legal.privacy}
      className="text-brand-600 hover:underline"
    >
      Privacy Policy
    </SmartLink>
  );
}

const H2 = 'mb-4 mt-10 text-[24px] font-500 leading-[1.3] tracking-[-0.01em] text-title first:mt-0 sm:text-[26px]';
const P = 'mb-5';

/**
 * Original terms, written for Clovity - not copied from any other Atlassian
 * partner's site. Hand-rolled JSX rather than the `ContentBlock`/`ArticleBody`
 * pipeline, matching `PrivacyBody`, since the contact and cross-reference
 * sections need real inline links.
 */
export function TermsBody() {
  return (
    <div className="text-[16px] leading-[1.7] text-black">
      <p className={P}>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of the {siteConfig.legalName} (&ldquo;Clovity,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) website
        located at clovity.com (the &ldquo;Site&rdquo;). By accessing or
        using the Site, you agree to be bound by these Terms. If you do not
        agree, please do not use the Site.
      </p>

      <h2 className={H2}>Use of This Site</h2>
      <p className={P}>
        The Site and its content are provided for general informational
        purposes about Clovity&rsquo;s services, expertise, and insights. You
        may view, download, and print pages from the Site for your own
        personal or internal business use, provided you do not modify the
        content and keep all copyright and other proprietary notices intact.
      </p>
      <p className={P}>
        You agree not to use the Site in any way that could damage, disable,
        overburden, or impair it, or interfere with anyone else&rsquo;s use of
        the Site, including through scraping, automated data collection, or
        attempts to gain unauthorized access to any part of the Site or the
        systems behind it.
      </p>

      <h2 className={H2}>Intellectual Property</h2>
      <p className={P}>
        Unless otherwise noted, the Site and everything on it - including
        text, graphics, logos, and images - is owned by or licensed to
        Clovity and is protected by copyright, trademark, and other
        intellectual property laws. The Clovity name and logo are trademarks
        of {siteConfig.legalName}. Atlassian, Jira, Confluence, Bitbucket,
        and related marks are trademarks of Atlassian Pty Ltd, referenced on
        this Site solely to describe our partnership and services. Nothing on
        this Site grants you any license or right to use any of these marks
        without our prior written permission.
      </p>

      <h2 className={H2}>No Offer or Contract for Services</h2>
      <p className={P}>
        Descriptions of Clovity&rsquo;s services, case studies, and results on
        this Site are for illustration only and do not constitute an offer,
        guarantee, or contract to provide services. Any engagement for
        consulting, implementation, managed services, or other work is
        governed exclusively by a separate, signed agreement or statement of
        work between you and Clovity, the terms of which take precedence over
        anything described on this Site.
      </p>

      <h2 className={H2}>Third-Party Links</h2>
      <p className={P}>
        The Site may link to third-party sites, such as the Atlassian
        Marketplace or our support portal, for your convenience. Clovity does
        not control and is not responsible for the content, policies, or
        practices of any third-party site. Visiting a linked site is at your
        own risk and subject to that site&rsquo;s own terms.
      </p>

      <h2 className={H2}>Disclaimer of Warranties</h2>
      <p className={P}>
        The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis, without warranties of any kind, whether
        express or implied. Clovity does not warrant that the Site will be
        uninterrupted, error-free, or completely secure, or that any
        information on it is accurate, complete, or current.
      </p>

      <h2 className={H2}>Limitation of Liability</h2>
      <p className={P}>
        To the maximum extent permitted by law, Clovity will not be liable
        for any indirect, incidental, special, or consequential damages
        arising out of or related to your use of, or inability to use, the
        Site, even if we have been advised of the possibility of such
        damages.
      </p>

      <h2 className={H2}>Indemnification</h2>
      <p className={P}>
        You agree to indemnify and hold Clovity harmless from any claims,
        losses, or expenses (including reasonable legal fees) arising from
        your misuse of the Site or your violation of these Terms.
      </p>

      <h2 className={H2}>Governing Law</h2>
      <p className={P}>
        These Terms are governed by the laws of the State of California,
        without regard to its conflict-of-laws principles. Any dispute
        arising from these Terms or your use of the Site will be subject to
        the exclusive jurisdiction of the state and federal courts located in
        California.
      </p>

      <h2 className={H2}>Changes to These Terms</h2>
      <p className={P}>
        We may update these Terms from time to time. Changes take effect as
        soon as they are posted on this page. Your continued use of the Site
        after a change is posted means you accept the updated Terms. See our{' '}
        <PrivacyPolicyLink /> for how we handle information you share with
        us.
      </p>

      <h2 className={H2}>Contact Us</h2>
      <p className={P}>
        If you have any questions about these Terms, email us at{' '}
        <SupportEmailLink />.
      </p>
    </div>
  );
}
