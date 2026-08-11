import { EXTERNAL_LINKS, ROUTES } from '@/constants/routes';
import type { ContentCollection } from '@/types/content';
import {
  cardDsh,
  cardForcepoint,
  cardGovMeetUsAt,
  cardHashgraph,
  cardPartnerAward,
  cardTeam26,
  CDN,
} from './media';

/**
 * The five content collections behind the home page's "What We Learn in the
 * Field" tab module.
 *
 * The legacy page held these in a `HI_DATA` object inside an inline script and
 * rendered the cards with `innerHTML` + a hand-rolled `escapeHtml()`. Moving the
 * data here means:
 *   • the cards are server-rendered, so they are indexable (they previously did
 *     not exist until JavaScript ran)
 *   • escaping is React's job, so the manual escape helper - and the injection
 *     risk it was guarding against - is gone
 *   • dates are ISO and formatted at render time, instead of being hard-coded
 *     display strings that a CMS could not supply
 *
 * Titles, excerpts, images and destinations are unchanged.
 */

export const CONTENT_COLLECTIONS: ContentCollection[] = [
  {
    kind: 'blog',
    label: 'Blog',
    icon: 'pen-nib',
    columnTitle: 'Expert Insights',
    columnSubtitle: 'Field notes from our Atlassian and AI delivery teams.',
    moreHref: EXTERNAL_LINKS.legacyBlog,
    moreExternal: true,
    items: [
      {
        kind: 'blog',
        id: 'team-26-takeaways',
        slug: 'team-26-key-takeaways-from-clovity',
        title: "Team '26 Key Takeaways from Clovity",
        excerpt:
          "Atlassian Team '26 was more than a product event. It felt like a major shift in how teams collaborate at scale.",
        publishedAt: '2026-05-29',
        image: { src: cardTeam26, alt: "Team '26 Key Takeaways from Clovity" },
        href: '#',
      },
      {
        kind: 'blog',
        id: 'atlassian-partner-of-the-year',
        slug: 'clovity-named-atlassian-partner-of-the-year',
        title: 'Clovity Named Atlassian Partner of the Year',
        excerpt:
          'We are excited to announce that Clovity has been named Atlassian Partner of the Year for Government Americas.',
        publishedAt: '2026-05-13',
        image: {
          src: cardPartnerAward,
          alt: 'Clovity Named Atlassian Partner of the Year',
        },
        href: '#',
      },
      {
        kind: 'blog',
        id: 'cloud-migration-challenges',
        slug: 'common-atlassian-cloud-migration-challenges',
        title: 'Common Atlassian Cloud Migration Challenges',
        excerpt:
          "Atlassian Cloud migration is a strategic move for organizations looking to modernize - here's what trips teams up.",
        publishedAt: '2026-02-25',
        image: {
          src: `${CDN.s3}Artboard_1_copy_Calender_2_2e8e6307af.jpg`,
          alt: 'Common Atlassian Cloud Migration Challenges',
          width: 620,
          height: 255,
        },
        href: '#',
      },
      {
        kind: 'blog',
        id: 'standardising-it-service-requests',
        slug: 'standardising-it-service-requests-in-government',
        title: 'Standardising IT Service Requests in Government',
        excerpt:
          'A consistent intake process across agencies cuts response time and closes the gaps citizens notice most.',
        publishedAt: '2026-01-10',
        image: {
          src: `${CDN.s3}Standardising_IT_Service_Requests_in_Government_1_07f02e287d.jpg`,
          alt: 'Standardising IT Service Requests in Government',
          width: 620,
          height: 255,
        },
        href: '#',
      },
    ],
  },

  {
    kind: 'events',
    label: 'Events',
    icon: 'calendar-days',
    columnTitle: 'Event Highlights',
    columnSubtitle:
      "Conferences, summits, and gov-focused tours we've taken part in.",
    moreHref: EXTERNAL_LINKS.legacyEvents,
    moreExternal: true,
    items: [
      {
        kind: 'events',
        id: 'team-on-tour-government',
        slug: 'atlassian-team-on-tour-government',
        title: 'Atlassian Team on Tour - Government',
        excerpt:
          "Meet the Clovity team in Washington, D.C. for a government-focused look at Atlassian's latest.",
        publishedAt: '2026-02-10',
        image: {
          src: `${CDN.s3}small_Building_bdd27730bf.png`,
          alt: 'Atlassian Team on Tour - Government',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}events/atlassian-team-on-tour-government`,
        external: true,
      },
      {
        kind: 'events',
        id: 'atlassian-team-26',
        slug: 'team-26',
        title: "Atlassian Team '26",
        excerpt:
          "Clovity joins Atlassian Team '26 in Anaheim to share what's next for enterprise collaboration.",
        publishedAt: '2025-05-04',
        image: {
          src: `${CDN.s3}small_tour_25_europe_0fe8d621a6.png`,
          alt: "Atlassian Team '26",
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}events/team-26`,
        external: true,
      },
      {
        kind: 'events',
        id: 'team-on-tour-government-2025',
        slug: 'atlassian-team-on-tour-government-2025',
        title: 'Atlassian Team on Tour - Government: 2025',
        excerpt:
          'Clovity met government IT leaders in Arlington, VA to talk Atlassian modernization.',
        publishedAt: '2025-03-11',
        image: {
          src: cardGovMeetUsAt,
          alt: 'Atlassian Team on Tour - Government: 2025',
        },
        href: `${CDN.clovityWww}events/atlassian-team-on-tour-government-2025`,
        external: true,
      },
      {
        kind: 'events',
        id: 'procurecon-contingent-staffing',
        slug: 'procurecon-contingent-staffing',
        title: 'ProcureCon Contingent Staffing',
        excerpt:
          'Clovity connected with workforce and staffing leaders at JW Marriott LA LIVE, Los Angeles.',
        publishedAt: '2024-04-03',
        image: {
          src: `${CDN.s3}small_17103328922_4_0e6d949e9a.png`,
          alt: 'ProcureCon Contingent Staffing',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}events/procurecon-contingent-staffing`,
        external: true,
      },
    ],
  },

  {
    kind: 'webinars',
    label: 'Webinars',
    icon: 'video',
    columnTitle: 'Webinars',
    columnSubtitle:
      'Live sessions with Atlassian and Clovity experts on public sector modernization.',
    moreHref: EXTERNAL_LINKS.legacyWebinars,
    moreExternal: true,
    items: [
      {
        kind: 'webinars',
        id: 'ascend-to-cloud',
        slug: 'ascend-to-cloud-from-data-center-eol-to-ai-ready-modernization',
        title:
          'Ascend to Cloud: From Data Center EOL to AI-Ready Modernization',
        excerpt:
          'How SLED and Federal agencies modernize mission-critical systems without disrupting operations.',
        publishedAt: '2026-01-28',
        image: {
          src: `${CDN.s3}small_22_8_d4630bb124.png`,
          alt: 'Ascend to Cloud: From Data Center EOL to AI-Ready Modernization',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}webinars/ascend-to-cloud-from-data-center-eol-to-ai-ready-modernization`,
        external: true,
      },
      {
        kind: 'webinars',
        id: 'agencies-saving-big',
        slug: 'how-agencies-are-saving-big-and-serving-better',
        title: 'How Agencies Are Saving Big and Serving Better',
        excerpt:
          'How public sector teams use Jira Service Management to cut costs and speed up service delivery.',
        publishedAt: '2025-10-14',
        image: {
          src: `${CDN.s3}small_Clovity_Carahsoft_Webinartr_4x_100_3f4d228c3e.jpg`,
          alt: 'How Agencies Are Saving Big and Serving Better',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}webinars/how-agencies-are-saving-big-and-serving-better`,
        external: true,
      },
      {
        kind: 'webinars',
        id: 'streamline-campus-operations',
        slug: 'streamline-campus-operations-with-smarter-tools',
        title: 'Streamline Campus Operations with Smarter Tools',
        excerpt:
          'How Atlassian and Carahsoft help higher-ed teams simplify workflows and IT requests.',
        publishedAt: '2025-02-06',
        image: {
          src: `${CDN.s3}small_r779qcrt4y6jntvb7w0sxtxi_350f729e8a.png`,
          alt: 'Streamline Campus Operations with Smarter Tools',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}webinars/streamline-campus-operations-with-smarter-tools`,
        external: true,
      },
    ],
  },

  {
    kind: 'case-study',
    label: 'Case Study',
    icon: 'chart-line',
    columnTitle: 'Case Studies',
    columnSubtitle:
      'Real client challenges, the solutions we built, and the results that followed.',
    moreHref: ROUTES.resources.caseStudy,
    moreExternal: false,
    items: [
      {
        kind: 'case-study',
        id: 'forcepoint-cloud-transformation',
        slug: 'forcepoint-s-cloud-transformation-a-seamless-migration-with-clovity',
        title:
          "Forcepoint's Cloud Transformation: A Seamless Migration with Clovity",
        excerpt:
          'Forcepoint moved its on-prem Jira Data Center to Atlassian Cloud, cutting infrastructure costs by 50% with zero downtime.',
        publishedAt: '2026-06-04',
        image: {
          src: cardForcepoint,
          alt: "Forcepoint's Cloud Transformation: A Seamless Migration with Clovity",
        },
        href: `${CDN.clovityWww}case-study/forcepoint-s-cloud-transformation-a-seamless-migration-with-clovity`,
        external: true,
        client: 'Forcepoint',
      },
      {
        kind: 'case-study',
        id: 'hashgraph-it-ecosystem',
        slug: 'leveraging-atlassian-solutions-to-transform-hashgraph-s',
        title:
          "Leveraging Atlassian Solutions to Transform Hashgraph's IT Ecosystem",
        excerpt:
          "Clovity unified Hashgraph's service desk, asset management, and project workflows on Jira Service Management, cutting ticket resolution time by 50%.",
        publishedAt: '2026-06-08',
        image: {
          src: cardHashgraph,
          alt: "Leveraging Atlassian Solutions to Transform Hashgraph's IT Ecosystem",
        },
        href: `${CDN.clovityWww}case-study/leveraging-atlassian-solutions-to-transform-hashgraph-s`,
        external: true,
        client: 'Hashgraph',
      },
      {
        kind: 'case-study',
        id: 'dsh-service-solution',
        slug: 'customer-success-story-empowering-dsh-with-an-efficient-service-solution',
        title:
          'Customer Success Story: Empowering DSH with an Efficient Service Solution',
        excerpt:
          'A tailored Jira Core rollout gave the Department of State Hospitals customizable workflows, real-time dashboards, and fewer missed deadlines.',
        publishedAt: '2026-06-08',
        image: {
          src: cardDsh,
          alt: 'Customer Success Story: Empowering DSH with an Efficient Service Solution',
        },
        href: `${CDN.clovityWww}case-study/customer-success-story-empowering-dsh-with-an-efficient-service-solution`,
        external: true,
        client: 'Department of State Hospitals',
      },
    ],
  },

  {
    kind: 'news',
    label: 'News',
    icon: 'newspaper',
    columnTitle: 'News',
    columnSubtitle:
      'Announcements, recognitions, and press coverage from our team.',
    moreHref: EXTERNAL_LINKS.legacyNews,
    moreExternal: true,
    items: [
      {
        kind: 'news',
        id: 'cloud-capabilities',
        slug: 'clovity-boosts-its-cloud-capabilities',
        title: 'Clovity Boosts Its Cloud Capabilities',
        excerpt:
          'Clovity expands cloud capabilities to help organizations scale connected devices, big data, and AI.',
        publishedAt: '2025-08-22',
        image: {
          src: `${CDN.s3}small_jz0scjs6eoevpf1atoskjfu4_6f47f19063.png`,
          alt: 'Clovity Boosts Its Cloud Capabilities',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}news/clovity-boosts-its-cloud-capabilities-to-spur-connected-devices-big-data-and-artificial-intelligence-lead-innovations`,
        external: true,
      },
      {
        kind: 'news',
        id: 'iot-supply-chain',
        slug: 'clovity-expands-iot-cloud-footprint-in-supply-chain',
        title: 'Clovity Expands IoT & Cloud Footprint in Supply Chain',
        excerpt:
          'Clovity delivers a nextGen platform for a key supply chain solutions company across retail and healthcare.',
        publishedAt: '2025-08-22',
        image: {
          src: `${CDN.s3}small_kjcs9o9hl2qrdgncmsrmfltm_3fa9db1abb.png`,
          alt: 'Clovity Expands IoT & Cloud Footprint in Supply Chain',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}news/clovity-significantly-expands-footprint-in-delivering-iot-and-cloud-enabled-solutions-for-one-of-the-key-supply-chain-solution-companies`,
        external: true,
      },
      {
        kind: 'news',
        id: 'iot-banking-platform',
        slug: 'clovity-completes-its-first-iot-banking-platform',
        title: 'Clovity Completes Its First IoT Banking Platform',
        excerpt:
          "Clovity's CSensorNet IoT platform expands its Banking and Finance practice with next-gen technology.",
        publishedAt: '2025-08-22',
        image: {
          src: `${CDN.s3}small_heivlxtpz1om1j2tle6sd6zt_1fcad57d18.png`,
          alt: 'Clovity Completes Its First IoT Banking Platform',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}news/clovity-successfully-completes-its-first-iot-banking-platform-and-expands-its-banking-and-finance-practice-to-meet-the-sectors-nextgen-technology-demands-prweb`,
        external: true,
      },
      {
        kind: 'news',
        id: 'smart-cities',
        slug: 'clovity-lays-the-foundation-for-smart-cities',
        title: 'Clovity Lays the Foundation for Smart Cities',
        excerpt:
          'Clovity leverages IoT, 5G networks, and smart grid technology to build the smart cities of the future.',
        publishedAt: '2025-08-22',
        image: {
          src: `${CDN.s3}small_xjrlucvovjjwm268bb11ss0p_bd437154fd.png`,
          alt: 'Clovity Lays the Foundation for Smart Cities',
          width: 620,
          height: 255,
        },
        href: `${CDN.clovityWww}news/clovity-laying-the-foundation-for-the-smart-cities-through-proliferation-of-iot-connected-devices-5g-networks-and-integrated-smart-grid-and-mesh-technologies-in-yahoo-news`,
        external: true,
      },
    ],
  },
];
