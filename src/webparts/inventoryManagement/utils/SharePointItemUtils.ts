// Pure helpers for reading raw SharePoint REST items whose column names are
// not known up front. No SharePoint or localization imports (unit-testable).

/**
 * OData metadata keys that sit alongside real columns, e.g.
 * "Employee@odata.navigationLinkUrl" (value: "Web/Lists(guid'…')/Items(4)/Employee"),
 * "odata.type", "odata.etag" or verbose-mode "__metadata".
 */
export const isODataAnnotationKey = (key: string): boolean =>
  key.indexOf('@') >= 0 || key.toLowerCase().indexOf('odata.') === 0 || key.indexOf('__') === 0;

/** True for REST references such as "Web/Lists(guid'…')/Items(4)/Employee" that must never be shown as a name. */
export const looksLikeODataReference = (value: string): boolean =>
  /lists\(guid'/i.test(value) || /^web\//i.test(value) || /\/_api\//i.test(value);

const normalizeColumnKey = (key: string): string => key.toLowerCase().replace(/_x0020_/g, '');

/**
 * Finds the item key whose name contains `searchStr` (lower-case, "_x0020_" ignored),
 * preferring keys that do not end in "id" (so "Employee" wins over "EmployeeId").
 * OData annotation keys are never returned.
 */
export const findItemKey = (item: Record<string, unknown>, searchStr: string): string | undefined => {
  const keys = Object.keys(item || {}).filter(k => !isODataAnnotationKey(k));
  const nonIdMatch = keys.find(k => {
    const kl = normalizeColumnKey(k);
    return kl.indexOf(searchStr) >= 0 && !kl.endsWith('id');
  });
  return nonIdMatch || keys.find(k => normalizeColumnKey(k).indexOf(searchStr) >= 0);
};

/**
 * Reduces a Person/Group column value to a display name. Handles plain strings,
 * expanded user objects ({ Title }), multi-person arrays and verbose
 * `{ results: [...] }` wrappers. Returns '' for anything that is not a name
 * (unexpanded `__deferred` links, bare IDs, REST reference URLs).
 */
export const getPersonDisplayName = (value: unknown): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return looksLikeODataReference(trimmed) ? '' : trimmed;
  }
  if (Array.isArray(value)) {
    return value.map(getPersonDisplayName).filter(Boolean).join(', ');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (Array.isArray(obj.results)) return getPersonDisplayName(obj.results);
    return getPersonDisplayName(obj.Title || obj.Name || obj.DisplayName || obj.EMail || obj.Email);
  }
  return '';
};

/** First candidate that yields a usable display name, else `fallback`. */
export const firstPersonName = (candidates: unknown[], fallback: string): string => {
  for (const candidate of candidates) {
    const name = getPersonDisplayName(candidate);
    if (name) return name;
  }
  return fallback;
};
