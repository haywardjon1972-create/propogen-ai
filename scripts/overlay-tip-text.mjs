import sharp from "sharp";
import path from "path";

const src = process.argv[2];
const outFrame = process.argv[3];
const outCover = process.argv[4];
const tipNum = process.argv[5] || "4";
const tipLine = process.argv[6] || "Price after value is clear";
const url = process.argv[7] || "propogen-ai.vercel.app";

if (!src || !outFrame) {
  console.error(
    "Usage: node overlay-tip-text.mjs <src> <outFrame> [outCover] [tipNum] [tipLine] [url]",
  );
  process.exit(1);
}

const meta = await sharp(src).metadata();
const w = meta.width;
const h = meta.height;
console.log("size", w, h);

const svg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="botFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${Math.round(h * 0.22)}" fill="url(#topFade)"/>
  <rect y="${Math.round(h * 0.72)}" width="${w}" height="${Math.round(h * 0.28)}" fill="url(#botFade)"/>
  <text x="50%" y="${Math.round(h * 0.07)}" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.055)}"
    font-weight="700" fill="#FFFFFF" letter-spacing="2">PROPOSAL TIP ${tipNum}</text>
  <text x="50%" y="${Math.round(h * 0.115)}" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.046)}"
    font-weight="600" fill="#E8ECF4">${escapeXml(tipLine)}</text>
  <rect x="${Math.round(w * 0.1)}" y="${Math.round(h * 0.875)}"
    rx="${Math.round(w * 0.03)}" ry="${Math.round(w * 0.03)}"
    width="${Math.round(w * 0.8)}" height="${Math.round(h * 0.07)}"
    fill="#0f172a" fill-opacity="0.85"/>
  <text x="50%" y="${Math.round(h * 0.922)}" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.042)}"
    font-weight="600" fill="#FFFFFF">${escapeXml(url)}</text>
</svg>`);

await sharp(src)
  .composite([{ input: svg, top: 0, left: 0 }])
  .jpeg({ quality: 92 })
  .toFile(outFrame);

if (outCover) {
  const side = Math.min(w, h);
  await sharp(outFrame)
    .extract({
      left: Math.floor((w - side) / 2),
      top: Math.floor((h - side) / 2),
      width: side,
      height: side,
    })
    .resize(1080, 1080)
    .jpeg({ quality: 90 })
    .toFile(outCover);
  console.log("wrote", path.resolve(outFrame), path.resolve(outCover));
} else {
  console.log("wrote", path.resolve(outFrame));
}

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
