/**
 * WCAG contrast helper for the OKLCH tokens used in src/app/globals.css.
 *
 *   node scripts/color-contrast.mjs "oklch(0.46 0.14 145)" "#ffffff"
 *
 * Converts OKLCH -> OKLab -> linear sRGB -> sRGB and reports the WCAG 2.1
 * contrast ratio, so token values can be chosen from measurements instead of
 * eyeballing them.
 */

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function oklchToLinearRgb(lightness, chroma, hueDeg) {
  const hue = (hueDeg * Math.PI) / 180;
  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);

  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;

  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return [
    clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function hexToLinearRgb(hex) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) =>
    parseInt(value.slice(offset, offset + 2), 16) / 255,
  );
  return channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
}

function parseColor(input) {
  const oklch = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(input);
  if (oklch) {
    return {
      linear: oklchToLinearRgb(Number(oklch[1]), Number(oklch[2]), Number(oklch[3])),
      label: input,
    };
  }
  if (/^#[0-9a-f]{6}$/i.test(input)) {
    return { linear: hexToLinearRgb(input), label: input };
  }
  throw new Error(`Unsupported colour: ${input}`);
}

function relativeLuminance(linearRgb) {
  const [r, g, b] = linearRgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a, b) {
  const la = relativeLuminance(a.linear);
  const lb = relativeLuminance(b.linear);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function toHex(linearRgb) {
  const encode = (channel) =>
    Math.round(
      255 *
        (channel <= 0.0031308
          ? 12.92 * channel
          : 1.055 * channel ** (1 / 2.4) - 0.055),
    );
  return `#${linearRgb.map((c) => encode(c).toString(16).padStart(2, "0")).join("")}`;
}

const [foreground, background] = process.argv.slice(2);
const fg = parseColor(foreground ?? "#ffffff");
const bg = parseColor(background ?? "oklch(0.46 0.14 145)");

const ratio = contrastRatio(fg, bg);
const verdict = ratio >= 4.5 ? "PASS (AA normal text)" : ratio >= 3 ? "PASS (AA large text only)" : "FAIL";

console.log(
  `${fg.label} on ${bg.label}\n  sRGB:  ${toHex(fg.linear)} on ${toHex(bg.linear)}\n  ratio: ${ratio.toFixed(2)}:1 -> ${verdict}`,
);
