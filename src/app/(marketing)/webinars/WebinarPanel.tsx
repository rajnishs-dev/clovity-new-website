import type { WebinarItem, WebinarPerson } from '@/types/content';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';

/**
 * The webinar detail page's panel: who is on it, who moderates, and when. It sits
 * directly under the title in place of the 16:9 banner other detail pages show - the
 * banner already does its job as card art on `/webinars` and as the OG image.
 *
 * Every value comes from the CMS, and each row disappears when its column is empty: of
 * the four published webinars, one has no moderator, one stores it as an empty string,
 * and one carries an `eventHeader` the others leave null.
 */

const LABEL_CLASS =
  'text-[15px] font-700 leading-[1.7] text-title whitespace-nowrap';

/** `name` and `role` are stored as one string; rejoin them the way the CMS wrote it. */
function fullName(person: WebinarPerson): string {
  return person.role ? `${person.name} - ${person.role}` : person.name;
}

function PeopleList({ people }: { people: WebinarPerson[] }) {
  return (
    <ul className="m-0 list-none space-y-1 p-0">
      {people.map((person) => (
        <li key={person.name} className="text-[15px] leading-[1.7]">
          {person.link ? (
            <SmartLink
              href={person.link}
              className="font-600 text-orange underline-offset-4 transition-colors hover:text-accent-600 hover:underline"
            >
              {fullName(person)}
            </SmartLink>
          ) : (
            <span className="font-600 text-orange">{fullName(person)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function WebinarPanel({ webinar }: { webinar: WebinarItem }) {
  const {
    coHostedBy,
    presenterImages = [],
    presenters = [],
    moderators = [],
    whenLabel,
    content,
  } = webinar;

  return (
    <div className="mt-1">
      {coHostedBy ? (
        <p className="mb-6 text-[19px] font-700 leading-[1.35] text-brand-600 sm:text-[21px]">
          {coHostedBy}
        </p>
      ) : null}

      {presenterImages.length ? (
        <div className="mb-7 flex flex-wrap gap-3.5">
          {presenterImages.map((image) => (
            <AppImage
              key={typeof image.src === 'string' ? image.src : image.alt}
              src={image.src}
              alt={image.alt}
              width={image.width ?? 400}
              height={image.height ?? 400}
              sizes="(min-width: 640px) 170px, 40vw"
              /* Fixed box, cropped: the uploads are square-ish but not uniform - 713×692
                 alongside 801×801 and 400×400 - and a row of headshots that each ended
                 up a different height would read as a mistake. */
              className="h-[150px] w-[150px] rounded-[10px] object-cover sm:h-[170px] sm:w-[170px]"
            />
          ))}
        </div>
      ) : null}

      {/*
        A definition list, because that is what these are: four labelled values. The
        two-column grid keeps every value on the same left edge, including the wrapped
        lines of a multi-person list.
      */}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3">
        {presenters.length ? (
          <>
            <dt className={LABEL_CLASS}>The Who:</dt>
            <dd className="m-0">
              <PeopleList people={presenters} />
            </dd>
          </>
        ) : null}

        {moderators.length ? (
          <>
            <dt className={LABEL_CLASS}>Moderator:</dt>
            <dd className="m-0">
              <PeopleList people={moderators} />
            </dd>
          </>
        ) : null}

        {whenLabel ? (
          <>
            <dt className={LABEL_CLASS}>The When:</dt>
            <dd className="m-0 text-[15px] leading-[1.7] text-black">
              {whenLabel}
            </dd>
          </>
        ) : null}

        {content?.length ? (
          <>
            {/* Labels the body that `ArticleBody` renders immediately below. */}
            <dt className={`${LABEL_CLASS} pt-0.5`}>The Why:</dt>
            <dd className="m-0" />
          </>
        ) : null}
      </dl>
    </div>
  );
}
