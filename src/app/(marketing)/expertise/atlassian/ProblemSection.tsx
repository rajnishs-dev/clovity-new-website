import { Section } from '@/components/ui/Section';
import { GradientText, HEADING_CLASS } from '@/components/ui/Typography';
import { Icon, type IconProps } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { ATLASSIAN_PROBLEM_CONTENT } from '@/constants/expertise/atlassian';

/** One node in the "connected suite" diagram, positioned on a 360×360 diamond. */
const SUITE_NODES: Array<{
  id: string;
  x: number;
  y: number;
  icon: IconProps['name'];
  color: string;
}> = [
  { id: 'jira', x: 180, y: 40, icon: 'jira', color: '#0052cc' },
  { id: 'confluence', x: 320, y: 180, icon: 'confluence', color: '#026aa7' },
  { id: 'jsm', x: 180, y: 320, icon: 'headset', color: '#2563eb' },
  { id: 'bitbucket', x: 40, y: 180, icon: 'git-branch', color: '#64748b' },
];

/**
 * "Connected suite" diagram - four product nodes on a dashed ring around a
 * central Atlassian glow, hand-built from the same visual grammar as the
 * migration flow diagram (dashed line + icon chip) rather than a stock
 * illustration, so it stays on-brand and needs no external asset.
 */
function ConnectedSuiteDiagram() {
  return (
    <div className="relative mx-auto h-[340px] w-[340px] sm:h-[360px] sm:w-[360px]">
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,.14),transparent_70%)]"
      />
      <svg
        viewBox="0 0 360 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle
          cx="180"
          cy="180"
          r="140"
          fill="none"
          stroke="#dbe7ff"
          strokeWidth="1.5"
          strokeDasharray="4 7"
        />
        {SUITE_NODES.map((node) => (
          <line
            key={node.id}
            x1="180"
            y1="180"
            x2={node.x}
            y2={node.y}
            stroke="#c7d9fb"
            strokeWidth="2"
            strokeDasharray="1 6"
            strokeLinecap="round"
          />
        ))}
      </svg>

      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-grad-brand-orange text-white shadow-[0_12px_30px_-4px_rgba(37,99,235,.4)]">
        <Icon name="atlassian" size={28} />
      </span>

      {SUITE_NODES.map((node) => (
        <span
          key={node.id}
          className="absolute flex h-[72px] w-[72px] items-center justify-center rounded-[18px] border border-line-soft bg-white shadow-[0_16px_32px_-10px_rgba(15,23,42,.2)]"
          style={{
            left: node.x,
            top: node.y,
            transform: 'translate(-50%,-50%)',
            color: node.color,
          }}
        >
          <Icon name={node.icon} size={30} />
        </span>
      ))}
    </div>
  );
}

export function ProblemSection() {
  return (
    <Section className="bg-white">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div
          className={cn(reveal('left'), 'md:text-center lg:text-left')}
          {...revealAttrs()}
        >
          <h2 className={HEADING_CLASS}>
            {ATLASSIAN_PROBLEM_CONTENT.headingLead}
            <GradientText>
              {ATLASSIAN_PROBLEM_CONTENT.headingHighlight}
            </GradientText>
          </h2>
          <div className="mt-5 space-y-4">
            {ATLASSIAN_PROBLEM_CONTENT.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[16px] leading-[1.75] text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className={reveal('right')} {...revealAttrs()}>
          <ConnectedSuiteDiagram />
        </div>
      </div>
    </Section>
  );
}
