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

/** `clovity.com`, linking back to the site's home page. */
function ClovityLink() {
  return (
    <SmartLink
      href={ROUTES.home}
      className="text-brand-600 hover:underline"
    >
      clovity.com
    </SmartLink>
  );
}

/**
 * Verbatim copy of clovity.com/privacy-statement, with the two kinds of
 * inline mention (`support@clovity.com`, `clovity.com`) wired up as real
 * links. Hardcoded JSX rather than the generic `ContentBlock`/`ArticleBody`
 * pipeline - that pipeline only carries plain strings, and this is the one
 * page on the site whose legal text needs inline links.
 */
export function PrivacyBody() {
  return (
    <div className="text-[16px] leading-[1.7] text-black">
      <p className="mb-8 text-center text-[19px] font-700 leading-[1.5] text-title">
        Clovity is committed to protecting the privacy of <ClovityLink />{' '}
        users and has created this Privacy Statement to outline{' '}
        <ClovityLink /> information collection practices. If you have any
        questions or concerns about this Privacy Statement, please contact us
        at <SupportEmailLink />.
      </p>

      <p className="mb-5">
        Clovity ensures that all data captured on the website or through
        in-person interactions will be kept confidential and only held
        internally within Clovity for the purpose of follow up. No Data will
        be shared with Advertisers or Partners unless specifically delineated
        during data collection or Clovity will alert parties prior to sharing
        any pre-collected data with any 3rd party.
      </p>

      <p className="mb-5">
        Clovity is the sole owners of the information collected on this site
        and through other avenues such as email campaigns, conferences or
        webinars. We only have access to/collect information that you
        voluntarily give us via email or other direct contact from you. We
        will not sell or rent this information to anyone at any time.
      </p>

      <p className="mb-5">
        Unless you ask us not to, we may contact you via email or phone in the
        future to tell you about new products or services or changes to this
        privacy policy.
      </p>

      <p className="mb-5">
        You may opt out of any future contacts from us at any time. You can do
        the following at any time by contacting a representative of our firm
        or via emailing <SupportEmailLink /> to opt out.
      </p>

      <p className="mb-5">
        If you are located in the US or the European Union, you may reach out
        at any time to <SupportEmailLink /> to receive access to the
        information we have collected on you and submit a request that data
        be deleted.
      </p>

      <p className="mb-5">
        We partner with a few parties to provide specific services. We will
        share names or other contact information only when it is necessary
        for the third party to provide these services. These parties are not
        allowed to use personally identifiable information except for the
        purpose of providing these services.
      </p>

      <p>
        If you have any questions about our privacy or data storage policies,
        please reach out to your Clovity representative or email{' '}
        <SupportEmailLink /> .
      </p>
    </div>
  );
}
