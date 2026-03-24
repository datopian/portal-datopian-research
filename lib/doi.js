export function generateMockDoi(name) {
  const input = String(name || "");
  let hash = 0;

  for (const char of input) {
    hash = ((hash * 31) + char.codePointAt(0)) >>> 0;
  }

  const suffix = hash.toString(16).padStart(8, "0");
  return `10.5281/portaljs.2026.${suffix}`;
}
