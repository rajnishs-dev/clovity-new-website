/**
 * The icon vocabulary.
 *
 * This union is the contract, and it lives in `types/` rather than next to the
 * registry on purpose. Content types (`NavLink.icon`, `ServiceCard.icon`) need to
 * name an icon, and a type in `types/` must not import from `components/` - that
 * would point the dependency arrow the wrong way and make the data layer aware of
 * the render layer, which is exactly what phase 2's CMS split has to avoid.
 *
 * So the union is declared here and `components/ui/Icon/registry.ts` asserts
 * `satisfies Record<IconName, Glyph>` against it. That direction buys an extra
 * guarantee over deriving the union from the registry's keys: adding a name here
 * without wiring up a glyph is a compile error in the registry, so the two can
 * never drift.
 *
 * Names are semantic, not transliterated from whichever icon set is currently
 * installed - `mail` not `envelope`, `close` not `xmark`. The site has already
 * changed icon sets once (Font Awesome 6.5.1 -> Lucide); this vocabulary is meant
 * to survive the next change without touching a single content file.
 */
export type IconName =
  // Arrows and chevrons
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'external-link'
  | 'trending-up'
  // Status and feedback
  | 'check'
  | 'circle-check'
  | 'alert-circle'
  | 'alert-triangle'
  | 'info'
  | 'close'
  | 'inbox'
  | 'star'
  | 'compass'
  | 'grip'
  // Actions
  | 'search'
  | 'send'
  // Platform and infrastructure
  | 'cloud'
  | 'cloud-upload'
  | 'server'
  | 'database'
  | 'git-branch'
  | 'zap'
  | 'flame'
  // Service and operations
  | 'store'
  | 'headset'
  | 'settings'
  | 'cogs'
  | 'sliders'
  | 'clipboard-list'
  | 'list-check'
  | 'life-ring'
  // Security
  | 'shield'
  | 'shield-half'
  | 'lock'
  // People
  | 'users'
  | 'users-cog'
  | 'people-group'
  // Content and communication
  | 'brain'
  | 'pen-nib'
  | 'chart-line'
  | 'calendar-days'
  | 'video'
  | 'newspaper'
  | 'comments'
  | 'mail'
  // Company
  | 'building'
  | 'briefcase'
  // Location and resource metadata
  | 'map-pin'
  | 'link'
  | 'landmark'
  | 'handshake'
  // Brand marks - inline SVG, since Lucide ships no brand icons.
  | 'atlassian'
  | 'jira'
  | 'confluence'
  | 'slack'
  | 'linkedin'
  | 'x'
  | 'youtube'
  | 'github'
  | 'cherwell';
