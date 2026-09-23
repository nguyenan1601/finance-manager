export interface ApiKeySource {
  DEEPSEEK_API_KEYS?: string;
}

export function parseApiKeys(raw: string | undefined | null): string[] {
  return (raw || "").split(",").filter(Boolean);
}

/**
 * Picks one key from the comma-separated list. `random` is injectable so tests
 * can be deterministic. Throws when nothing is configured instead of silently
 * calling the model with an undefined key.
 */
export function pickApiKey(
  raw: string | undefined | null,
  random: () => number = Math.random,
): string {
  const keys = parseApiKeys(raw);

  if (keys.length === 0) {
    throw new Error(
      "No DeepSeek API key configured. Set DEEPSEEK_API_KEYS to one or more comma-separated keys.",
    );
  }

  const index = Math.min(Math.floor(random() * keys.length), keys.length - 1);
  return keys[index];
}
