import { ROUTES } from '@/config/routes';
import { withFallback } from '@/services/api/request';
import { contentApi } from '@/services/api/api';
import type { NewsItem } from '@/types/content';
import { CDN } from '@/constants/media';

/**
 * Static fallback content for `/news` and `/news/[slug]`.
 *
 * Ported from the legacy `news.html` list and `news-detail.html`. Only the
 * Japan/UK expansion release carried a full body on the old site - it is
 * reproduced verbatim below, including its two executive quotes. The other
 * eight items only ever existed as a headline + lede on the legacy list page,
 * so their `content` is assembled from that same real lede plus the site's
 * own "About Clovity" boilerplate (lifted verbatim from the Japan release) -
 * not new copy written for this port.
 *
 * NOTE: `NEWS_ITEMS` is kept in the legacy list's display order (Japan/UK
 * expansion first) rather than resorted by `publishedAt`, because that is the
 * order `/news` renders the featured story in - mirroring how
 * `getBlogPosts()` relies on `BLOG_POSTS` already being in the order the blog
 * list wants. `getAllNewsItems()` below is the date-sorted view used by the
 * sidebar and "Related News" rail, where most-recent-first is what matters.
 */

const ABOUT_CLOVITY =
  'Clovity, headquartered in San Francisco, is a leader in AI-powered Process Transformation and crafting smart use cases for businesses across various sectors. With a commitment to innovation, Clovity has become a trusted partner for top Fortune 500 companies and the public sector.';

export const NEWS_ITEMS: NewsItem[] = [
  {
    kind: 'news',
    id: 'clovity-launches-in-japan',
    slug: 'clovity-launches-in-japan-and-drives-uk-growth',
    title:
      'Clovity Launches in Japan and Drives UK Growth with AI-Powered Process Transformation & Intelligent Business Cases',
    excerpt:
      'SAN FRANCISCO, July 9, 2024 /PRNewswire-PRWeb/ - Clovity, a leading process and digital transformation technology leader, is set to redefine the global business landscape with a strategic expansion into Japan and APAC.',
    publishedAt: '2026-06-02',
    image: {
      src: `${CDN.s3}tlqr1t294t70q8vumf5ogd94_8749e912ae_1_c74b2d2d73.png`,
      alt: 'Clovity Launches in Japan and Drives UK Growth with AI-Powered Process Transformation & Intelligent Business Cases',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-launches-in-japan-and-drives-uk-growth`,
    content: [
      {
        type: 'paragraph',
        text: "SAN FRANCISCO, July 9, 2024 /PRNewswire-PRWeb/ - Clovity, a leading process and digital transformation technology leader, is set to redefine the global business landscape with a strategic expansion into Japan and APAC. This announcement comes shortly after the expansion of its United Kingdom services offering, both complementing Clovity's ongoing growth across multiple global regions. This initiative marks the latest chapter in Clovity's application of emerging technology, this time leveraging AI to enhance everyday business operations for companies, cities, and governments worldwide.",
      },
      {
        type: 'paragraph',
        text: 'Specializing in mission-critical services - including Enterprise Service Management (ESM), Enterprise Workforce Management (EWM), Project Portfolio Management (PPM), DevOps/DevSecOps, Cloud solutions, and AI/ML-driven Data strategies - Clovity aims to usher in an era of heightened efficiency and technical sophistication in the Japanese and UK markets.',
      },
      { type: 'heading', text: 'Transformative AI-Driven Use Cases' },
      {
        type: 'paragraph',
        text: "Clovity's use cases, powered by expertise in AI and data analytics, deliver advanced technological solutions tailored to specific business challenges. Examples include deploying machine learning models for predictive maintenance in manufacturing, and using AI-driven analytics to optimize retail supply chain efficiencies. Each use case is crafted to maximize ROI, reduce downtime and cost, and foster innovation.",
      },
      { type: 'heading', text: 'Leadership Perspective' },
      {
        type: 'quote',
        text: "The launch in Japan represents far more than geographic diversification. It's an opportunity to apply AI towards transforming business operations within an already technologically forward environment.",
        cite: 'Anuj Sachdeva, Founder and CEO of Clovity',
      },
      {
        type: 'paragraph',
        text: 'By blending AI with cloud computing, data analytics, and digital platforms, Clovity is set to deliver impactful solutions that streamline operations and enable new business models.',
      },
      {
        type: 'quote',
        text: 'Our expansion into Japan, along with our growth in the UK, is a reflection of our commitment to revolutionize global AI-driven transformation, merging our extensive ESM, DevOps/DevSecOps, Cloud, Data, and digital expertise with advanced AI capabilities to make a meaningful impact on businesses globally.',
        cite: 'Anuj Sachdeva',
      },
      { type: 'heading', text: 'Trusted Atlassian Solution Partner' },
      {
        type: 'paragraph',
        text: 'As a proud Atlassian Solution Partner, Clovity serves customers such as the United States Treasury, NASA, United States Coast Guard, Maryland Judiciary, UC Davis, and the State of MA. Clovity brings a wealth of experience and an impressive track record of delivering comprehensive, high-impact Enterprise Process Transformation solutions.',
      },
      { type: 'heading', text: 'About Clovity' },
      {
        type: 'paragraph',
        text: ABOUT_CLOVITY,
      },
      { type: 'paragraph', text: 'Recent accolades include:' },
      {
        type: 'list',
        items: [
          '2023 Inc. 5000 list and top quarter placement in 2021 and 2022',
          'Fast American Asian Business Award from USPAACC (2022–2024)',
          'Global IoT Innovation Vendor of the Year (IoT Vendor Breakthrough Awards, 2021)',
          'Emerging Company of the Year for the Enterprise Market (2020)',
          'Top 50 IoT Enterprise Growth Companies (CIO Review Magazine, 2018 & 2019)',
        ],
      },
    ],
  },
  {
    kind: 'news',
    id: 'platinum-solution-partner',
    slug: 'clovity-achieves-platinum-solution-partner-status',
    title:
      'Clovity Achieves Platinum Solution Partner Status in Atlassian Solution Partner Program',
    excerpt:
      'SAN FRANCISCO, Dec. 12, 2023 /PRNewswire/ - Clovity, a leading digital transformation solutions provider, is proud to announce its designation as a Platinum Solution Partner as part of the Atlassian Solution Partner program.',
    publishedAt: '2026-06-03',
    image: {
      src: `${CDN.s3}Untitled_2_47b76d16cd.png`,
      alt: 'Clovity Achieves Platinum Solution Partner Status in Atlassian Solution Partner Program',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-achieves-platinum-solution-partner-status`,
    content: [
      {
        type: 'paragraph',
        text: 'SAN FRANCISCO, Dec. 12, 2023 /PRNewswire/ - Clovity, a leading digital transformation solutions provider, is proud to announce its designation as a Platinum Solution Partner as part of the Atlassian Solution Partner program.',
      },
      { type: 'heading', text: 'About Clovity' },
      { type: 'paragraph', text: ABOUT_CLOVITY },
    ],
  },
  {
    kind: 'news',
    id: 'mahesh-shah-advisor',
    slug: 'clovity-adds-mahesh-shah-as-operating-advisor',
    title:
      'Clovity Adds Former CoreTrust CEO Mahesh Shah as Operating Advisor to Accelerate AI-Powered Atlassian Growth in Regulated Sectors',
    excerpt:
      'San Francisco, January 14, 2026 – Clovity, a Platinum Atlassian Solution Partner recognized for enterprise-grade service modernization, today announced that Mahesh Shah, former CEO of CoreTrust and seasoned global technology executive, has joined the company as an Operating Advisor.',
    publishedAt: '2026-06-02',
    image: {
      src: `${CDN.s3}1_3_d878c074cb_6ae870af8f.png`,
      alt: 'Clovity Adds Former CoreTrust CEO Mahesh Shah as Operating Advisor to Accelerate AI-Powered Atlassian Growth in Regulated Sectors',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-adds-mahesh-shah-as-operating-advisor`,
    content: [
      {
        type: 'paragraph',
        text: 'San Francisco, January 14, 2026 – Clovity, a Platinum Atlassian Solution Partner recognized for enterprise-grade service modernization, today announced that Mahesh Shah, former CEO of CoreTrust and seasoned global technology executive, has joined the company as an Operating Advisor.',
      },
      { type: 'heading', text: 'About Clovity' },
      { type: 'paragraph', text: ABOUT_CLOVITY },
    ],
  },
  {
    kind: 'news',
    id: 'inc-5000-fifth-year',
    slug: 'clovity-earns-inc-5000-fifth-consecutive-year',
    title: 'Clovity Earns Its Spot on the Inc. 5000 List for the Fifth Consecutive Year',
    excerpt:
      'SAN FRANCISCO, Aug. 13, 2025 - Clovity, a leader in AI-powered digital and process transformation and Atlassian solutions, is thrilled to announce its inclusion in the prestigious Inc. 5000 list for the fifth consecutive year.',
    publishedAt: '2026-06-02',
    image: {
      src: `${CDN.s3}Untitled_1_4168610645_1063bc371f_d47e31249c.png`,
      alt: 'Clovity Earns Its Spot on the Inc. 5000 List for the Fifth Consecutive Year',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-earns-inc-5000-fifth-consecutive-year`,
    content: [
      {
        type: 'paragraph',
        text: 'SAN FRANCISCO, Aug. 13, 2025 - Clovity, a leader in AI-powered digital and process transformation and Atlassian solutions, is thrilled to announce its inclusion in the prestigious Inc. 5000 list for the fifth consecutive year.',
      },
      { type: 'heading', text: 'About Clovity' },
      { type: 'paragraph', text: ABOUT_CLOVITY },
    ],
  },
  {
    kind: 'news',
    id: 'sap-partnership',
    slug: 'clovity-and-sap-strategic-partnership',
    title: 'Clovity and SAP Announce Strategic Partnership to Drive Cloud-Enabled Transformations',
    excerpt:
      "SAN FRANCISCO, Oct. 3, 2023 - Clovity, a leading provider of digital transformation solutions, announced today its strategic partnership with SAP, the world's leading provider of business software solutions.",
    publishedAt: '2026-06-02',
    image: {
      src: `${CDN.s3}ib6iw2siztridyc017ea3rt3_28b98348ea_d1b36f6c56.png`,
      alt: 'Clovity and SAP Announce Strategic Partnership to Drive Cloud-Enabled Transformations',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-and-sap-strategic-partnership`,
    content: [
      {
        type: 'paragraph',
        text: "SAN FRANCISCO, Oct. 3, 2023 - Clovity, a leading provider of digital transformation solutions, announced today its strategic partnership with SAP, the world's leading provider of business software solutions.",
      },
      { type: 'heading', text: 'About Clovity' },
      { type: 'paragraph', text: ABOUT_CLOVITY },
    ],
  },
  {
    kind: 'news',
    id: 'uspaacc-fast-100',
    slug: 'clovity-awarded-uspaacc-fast-100-2023',
    title: "Clovity awarded USPAACC's Fast 100 Asian American Business Winner for 2023",
    excerpt:
      'SAN FRANCISCO (PRWEB) MAY 30, 2023 - Clovity, a leading provider of IT & IoT enterprise technology solutions and digital transformation services, announced today that they have been named a winner of the Fast 100 Asian American Business Awards 2023.',
    publishedAt: '2026-06-02',
    image: {
      src: `${CDN.s3}wuuav5mzpucbtq1msy3h3ktl_162c19e1f3.png`,
      alt: "Clovity awarded USPAACC's Fast 100 Asian American Business Winner for 2023",
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-awarded-uspaacc-fast-100-2023`,
    content: [
      {
        type: 'paragraph',
        text: 'SAN FRANCISCO (PRWEB) MAY 30, 2023 - Clovity, a leading provider of IT & IoT enterprise technology solutions and digital transformation services, announced today that they have been named a winner of the Fast 100 Asian American Business Awards 2023.',
      },
      { type: 'heading', text: 'About Clovity' },
      { type: 'paragraph', text: ABOUT_CLOVITY },
    ],
  },
  {
    kind: 'news',
    id: 'third-inc-5000-win',
    slug: 'clovity-third-inc-5000-win-in-3-years',
    title:
      'Clovity Continues Their Winning Streak With Its Third Inc. 5000 Win In 3 Years for Providing Unmatched Performance in IT & IoT Services',
    excerpt:
      'SAN FRANCISCO, Aug. 22, 2023 - Clovity, the versatile and multi-faceted IT and IoT services firm, has once again emerged victorious by winning the Inc. 5000 award for the third year in a row, starting in 2021.',
    publishedAt: '2026-05-29',
    image: {
      src: `${CDN.s3}i12p6ihpqhw7t6cq2304wypf_570f666d8b_c5b5623cdb.png`,
      alt: 'Clovity Continues Their Winning Streak With Its Third Inc. 5000 Win In 3 Years for Providing Unmatched Performance in IT & IoT Services',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-third-inc-5000-win-in-3-years`,
    content: [
      {
        type: 'paragraph',
        text: 'SAN FRANCISCO, Aug. 22, 2023 - Clovity, the versatile and multi-faceted IT and IoT services firm, has once again emerged victorious by winning the Inc. 5000 award for the third year in a row, starting in 2021.',
      },
      { type: 'heading', text: 'About Clovity' },
      { type: 'paragraph', text: ABOUT_CLOVITY },
    ],
  },
  {
    kind: 'news',
    id: 'iot-city-smart-pole',
    slug: 'clovity-debuts-iot-city-smart-pole',
    title:
      'Clovity Debuts Its Multiple IoT Solution Infused City Smart Pole to Catapult Cities and Towns Into a Connected Future',
    excerpt:
      'SAN FRANCISCO (PRWEB) MAY 17, 2023 - Today Clovity announced that it has expanded its Smart City reach with the launch of their own City Smart Pole product.',
    publishedAt: '2026-05-29',
    image: {
      src: `${CDN.s3}mufo8ocp1x37zwu83rxiqfgs_cb62442bc8_d7e3108449.png`,
      alt: 'Clovity Debuts Its Multiple IoT Solution Infused City Smart Pole to Catapult Cities and Towns Into a Connected Future',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-debuts-iot-city-smart-pole`,
    content: [
      {
        type: 'paragraph',
        text: 'SAN FRANCISCO (PRWEB) MAY 17, 2023 - Today Clovity announced that it has expanded its Smart City reach with the launch of their own City Smart Pole product.',
      },
      { type: 'heading', text: 'About Clovity' },
      { type: 'paragraph', text: ABOUT_CLOVITY },
    ],
  },
  {
    kind: 'news',
    id: 'noida-office-expansion',
    slug: 'clovity-new-office-location-in-noida',
    title:
      "Clovity Readies Itself for Further Expansion This Year With a Big New Office Location in Noida's Main Tech Hub",
    excerpt:
      "NOIDA, INDIA (PRWEB) MAY 16, 2023 - Clovity, a leading provider of digital transformation solutions, announced today its relocation to a new, state-of-the-art facility in Noida, India.",
    publishedAt: '2025-08-02',
    image: {
      src: `${CDN.s3}fiao3z53ktzs9hyny4tuxupq_f426bac64f.png`,
      alt: "Clovity Readies Itself for Further Expansion This Year With a Big New Office Location in Noida's Main Tech Hub",
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.news}/clovity-new-office-location-in-noida`,
    content: [
      {
        type: 'paragraph',
        text: 'NOIDA, INDIA (PRWEB) MAY 16, 2023 - Clovity, a leading provider of digital transformation solutions, announced today its relocation to a new, state-of-the-art facility in Noida, India.',
      },
      { type: 'heading', text: 'About Clovity' },
      { type: 'paragraph', text: ABOUT_CLOVITY },
    ],
  },
];

/** All news items, most recent first - used by the sidebar and related rail. */
export function getAllNewsItems(): NewsItem[] {
  return [...NEWS_ITEMS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/**
 * Every item for the `/news` index - revealed in batches by `<LoadMoreGrid>`.
 *
 * Falls back to `NEWS_ITEMS` (not the date-sorted `getAllNewsItems()`)
 * because the list page takes its featured story as the first element of
 * this array, and the legacy site's featured release is not the most
 * recently dated item.
 */
export async function getNewsItems(): Promise<NewsItem[]> {
  return withFallback(async () => {
    const result = await contentApi.news({ pageSize: 100 });
    return result.success
      ? { success: true as const, data: result.data.items }
      : result;
  }, NEWS_ITEMS);
}

export async function getNewsItemBySlug(slug: string): Promise<NewsItem | undefined> {
  const fallback = NEWS_ITEMS.find((item) => item.slug === slug);
  return withFallback(async () => {
    const result = await contentApi.newsItem(slug);
    return result.success ? { success: true as const, data: result.data } : result;
  }, fallback);
}

export function getNewsSlugs(): string[] {
  return NEWS_ITEMS.map((item) => item.slug);
}
