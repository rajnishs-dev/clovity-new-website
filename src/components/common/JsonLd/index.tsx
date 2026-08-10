import type { JsonLdObject } from '@/lib/schema';

/**
 * Renders one or more schema.org graphs as a JSON-LD script tag.
 *
 * Two safety details:
 *  • `JSON.stringify` output has `<` escaped to `<`, which is what stops a
 *    string inside the data from closing the script tag early - the standard
 *    JSON-LD injection vector.
 *  • The tag is emitted from a Server Component, so the structured data is in
 *    the initial HTML where crawlers actually read it. Injecting it on the
 *    client would leave it invisible to most parsers.
 */
export interface JsonLdProps {
  /** A single graph or several - several are wrapped in an @graph array. */
  schema: JsonLdObject | JsonLdObject[];
  id?: string;
}

function serialize(schema: JsonLdObject | JsonLdObject[]): string {
  const payload = Array.isArray(schema)
    ? { '@context': 'https://schema.org', '@graph': schema.map(stripContext) }
    : schema;

  return JSON.stringify(payload).replace(/</g, '\\u003c');
}

/** Drop per-node @context when nesting inside an @graph. */
function stripContext(node: JsonLdObject): JsonLdObject {
  const { '@context': _context, ...rest } = node;
  return rest;
}

export function JsonLd({ schema, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // Required: JSON-LD must be raw text inside the script element.
      dangerouslySetInnerHTML={{ __html: serialize(schema) }}
    />
  );
}
