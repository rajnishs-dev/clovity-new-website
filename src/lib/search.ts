/**
 * True when every one of `fields` is searched and `query` matches at least
 * one, case- and whitespace-insensitively. An empty (or all-whitespace)
 * query matches everything, so a cleared search box shows the full list
 * again rather than an empty one.
 */
export function matchesQuery(query: string, ...fields: Array<string | undefined>): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => (field ?? '').toLowerCase().includes(q));
}
