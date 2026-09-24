/**
 * Lightweight sprintf-style formatter for localized resource strings.
 * Replaces positional placeholders like {0}, {1} with the given values, e.g.
 * formatString(strings.Hero.WelcomeBack, userName) => "Welcome back, Jane!"
 */
export function formatString(template: string, ...values: Array<string | number>): string {
  if (!template) return '';
  return template.replace(/\{(\d+)\}/g, (match, index: string) => {
    const value = values[Number(index)];
    return value === undefined || value === null ? match : String(value);
  });
}
