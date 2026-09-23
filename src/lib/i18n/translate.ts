export type Dictionary = Record<string, unknown>;

/**
 * Resolves a dot-notation key against a dictionary and interpolates {placeholders}.
 * Falls back to returning the path itself when the key is missing or not a string,
 * which is the contract the UI relies on to surface missing translations.
 */
export function resolveTranslation(
  dictionary: Dictionary,
  path: string,
  variables?: Record<string, string | number>,
): string {
  let result: unknown = dictionary;

  for (const key of path.split(".")) {
    if (result === null || typeof result !== "object") return path;
    const next = (result as Record<string, unknown>)[key];
    if (next === undefined) return path;
    result = next;
  }

  if (typeof result !== "string") return path;

  if (variables) {
    return Object.entries(variables).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
      result,
    );
  }

  return result;
}

/** Every leaf path in a dictionary, e.g. "home.spendingTrend". */
export function collectLeafPaths(dictionary: Dictionary): string[] {
  const paths: string[] = [];

  const walk = (node: unknown, prefix: string) => {
    if (node === null || typeof node !== "object") {
      paths.push(prefix);
      return;
    }
    for (const [key, value] of Object.entries(node as Dictionary)) {
      walk(value, prefix ? `${prefix}.${key}` : key);
    }
  };

  walk(dictionary, "");
  return paths;
}
