import type { ImageSource } from '@/types/content';

/**
 * Resolve an `ImageSource` down to a plain URL string.
 *
 * A static import (`StaticImageData`) and a remote CMS string are both valid
 * `next/image` sources, but anything that needs a bare URL - Open Graph tags,
 * Article JSON-LD - needs the string out of the static import's `.src` field.
 */
export function resolveImageSrc(source: ImageSource): string {
  return typeof source === 'string' ? source : source.src;
}
