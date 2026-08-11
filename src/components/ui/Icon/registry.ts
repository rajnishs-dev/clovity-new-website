import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Brain,
  Briefcase,
  Building2,
  CalendarDays,
  ChartLine,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  ClipboardList,
  Cloud,
  CloudUpload,
  Code,
  Cog,
  Copy,
  Compass,
  Database,
  DoorOpen,
  Ellipsis,
  ExternalLink,
  FileSignature,
  Flag,
  Flame,
  GitBranch,
  Globe,
  GraduationCap,
  Grip,
  Handshake,
  Headset,
  HeartPulse,
  Inbox,
  Info,
  Landmark,
  Laptop,
  LifeBuoy,
  Link2,
  ListChecks,
  Lock,
  Mail,
  MapPin,
  MessagesSquare,
  Newspaper,
  PenTool,
  Phone,
  PhoneCall,
  Plus,
  Quote,
  RefreshCw,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  ShieldHalf,
  SlidersHorizontal,
  Star,
  Store,
  TrendingUp,
  TriangleAlert,
  UserCog,
  Users,
  UsersRound,
  Video,
  X,
  Zap,
} from 'lucide-react';

import type { IconName } from '@/types/icon';
import {
  AtlassianGlyph,
  CherwellGlyph,
  ConfluenceGlyph,
  type Glyph,
  GitHubGlyph,
  JiraGlyph,
  LinkedInGlyph,
  SlackGlyph,
  XGlyph,
  YouTubeGlyph,
} from './brands';

export type { IconName };

/**
 * The icon registry: one semantic name per glyph.
 *
 * WHY A NAME REGISTRY AND NOT COMPONENT IMPORTS IN THE DATA FILES -
 * the icon for a nav link or a service card is *content*, and in phase 2 that
 * content comes out of Postgres via the CMS. A database can store the string
 * `"cloud-upload"`; it cannot store a React component. So the data layer keeps
 * naming icons with strings, exactly as it did with Font Awesome classes, and this
 * map is the single place that turns a name into something renderable.
 *
 * The difference from the Font Awesome strings it replaces is that `IconName` is a
 * closed union. `"fa-solid fa-clod-arrow-up"` was a silent no-op - a typo rendered
 * an empty box and nothing complained. A bad `IconName` is a compile error, and
 * `resolveIcon` handles the runtime case where a CMS sends a name this build does
 * not know about.
 *
 * The `satisfies Record<IconName, Glyph>` below is load-bearing: it makes this map
 * exhaustive over the union in `types/icon.ts`, so a name can never be declared
 * without a glyph behind it.
 */
export const ICONS = {
  // Arrows and chevrons
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'arrow-up-right': ArrowUpRight,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'external-link': ExternalLink,
  'trending-up': TrendingUp,

  // Status and feedback
  check: Check,
  'circle-check': CircleCheck,
  'alert-circle': CircleAlert,
  'alert-triangle': TriangleAlert,
  info: Info,
  close: X,
  inbox: Inbox,
  star: Star,
  compass: Compass,
  grip: Grip,

  // Actions
  search: Search,
  send: Send,

  // Platform and infrastructure
  cloud: Cloud,
  'cloud-upload': CloudUpload,
  server: Server,
  database: Database,
  'git-branch': GitBranch,
  zap: Zap,
  flame: Flame,

  // Service and operations
  store: Store,
  headset: Headset,
  settings: Settings,
  cogs: Cog,
  sliders: SlidersHorizontal,
  'clipboard-list': ClipboardList,
  'list-check': ListChecks,
  'life-ring': LifeBuoy,

  // Security
  shield: Shield,
  'shield-half': ShieldHalf,
  lock: Lock,

  // People
  users: Users,
  'users-cog': UserCog,
  'people-group': UsersRound,

  // Content and communication
  brain: Brain,
  'pen-nib': PenTool,
  'chart-line': ChartLine,
  'calendar-days': CalendarDays,
  video: Video,
  newspaper: Newspaper,
  comments: MessagesSquare,
  mail: Mail,
  phone: Phone,
  'phone-call': PhoneCall,
  quote: Quote,

  // Company
  building: Building2,
  briefcase: Briefcase,
  landmark: Landmark,
  flag: Flag,
  globe: Globe,
  // Lucide ships one globe, not a per-continent set. The published markup used
  // Font Awesome's `earth-europe` and `earth-asia` to mark the EMEA and APAC
  // offices; both resolve to the same glyph here, and the office label is what
  // actually names the region.
  'earth-asia': Globe,
  'map-pin': MapPin,
  handshake: Handshake,

  // AI and delivery
  robot: Bot,
  code: Code,

  // Hiring and people development
  'graduation-cap': GraduationCap,
  // "Flexible & remote-friendly" — a laptop, which is what Font Awesome's
  // `house-laptop` composite conveyed.
  'remote-work': Laptop,
  'heart-pulse': HeartPulse,
  'file-signature': FileSignature,
  'door-open': DoorOpen,

  // Small controls
  plus: Plus,
  refresh: RefreshCw,
  // The role card's overflow menu — the legacy card drew this as a literal "..."
  // text node, which no screen reader could announce as a control.
  ellipsis: Ellipsis,
  copy: Copy,
  link: Link2,

  // Brand marks — see `brands.tsx` for why these are inline SVG, not Lucide.
  atlassian: AtlassianGlyph,
  jira: JiraGlyph,
  confluence: ConfluenceGlyph,
  slack: SlackGlyph,
  linkedin: LinkedInGlyph,
  x: XGlyph,
  youtube: YouTubeGlyph,
  github: GitHubGlyph,
  cherwell: CherwellGlyph,
} satisfies Record<IconName, Glyph>;

/** True when `name` is a registered icon. Narrows an untrusted string. */
export function isIconName(name: string): name is IconName {
  return Object.hasOwn(ICONS, name);
}

/**
 * Look up a glyph by a name that may not be trusted.
 *
 * Returns `undefined` rather than throwing so a stale or misspelled icon name from
 * the CMS degrades to "no icon" instead of blanking the page it appears on.
 */
export function resolveIcon(name: string): Glyph | undefined {
  return isIconName(name) ? ICONS[name] : undefined;
}
