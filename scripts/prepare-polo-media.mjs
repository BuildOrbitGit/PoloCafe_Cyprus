import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = "C:/Users/Harsh/OneDrive/BUILDORBIT/POLO CAFE - SUJIT MAMA";
const publicMedia = path.join(root, "public", "media");

const source = {
  logo: "706900415_18094905970957920_3317698170031350801_n.jpg",
  brandPoster: "Logo.jpg",
  brandedCup: "SaveInta.com_733630236_122117871897346520_6540428748409108103_n.jpg",
  espressoPourTall: "SaveInta.com_740611573_122120629611346520_4897765330752898574_n_1080 (1).jpg",
  espressoPourSquare: "SaveInta.com_740611573_122120629611346520_4897765330752898574_n_1080.jpg",
  storyCup: "SaveInta.com_740797830_122120048997346520_7200833217237871358_n.jpg",
  heroVideo: "SaveInta.com_AQMU09WJuZxBLSF-98uMeUy87-c6kcHePSmARy6PzwutYd4ZNL7JFwAjloECbg1aoJUfsbiVxGTPKaQ6Rny-a0oYOwLtGLR-h6kY7Io.mp4",
  galleryVideo: "SaveInta.com_AQODITy2csiS1-2c78YLzD7ZQz8qSUm6UBBVqM9yeA0isRylqWYVxqu0gY3CwvQUzt1bEnIXx4HCfOk1K-FrXxNSYbzr1qje0ToMSzo.mp4",
  detailVideo: "SaveInta.com_AQPHWozFm6WMhYjgbZqAHzdvZtcN4fcVEDdMY0jF55GIOLdCQ4YndDpt9vExntgPXeFXCWSvTjR6sn68Jwy_dFhqmzgV7dzOkqlgZZU.mp4",
};

const cropJobs = [
  {
    input: source.brandedCup,
    output: "hero/hero-poster.webp",
    extract: { left: 48, top: 420, width: 984, height: 553 },
    resize: { width: 1800, height: 1012 },
  },
  {
    input: source.brandedCup,
    output: "gallery/branded-latte-crop.webp",
    extract: { left: 42, top: 510, width: 996, height: 747 },
    resize: { width: 1320, height: 990 },
  },
  {
    input: source.espressoPourTall,
    output: "gallery/espresso-pour-crop.webp",
    extract: { left: 0, top: 318, width: 1080, height: 770 },
    resize: { width: 1180, height: 842 },
  },
  {
    input: source.espressoPourTall,
    output: "gallery/espresso-pour-mobile.webp",
    extract: { left: 86, top: 404, width: 884, height: 884 },
    resize: { width: 980, height: 980 },
  },
  {
    input: source.espressoPourSquare,
    output: "gallery/coffee-beans-cup-crop.webp",
    extract: { left: 0, top: 362, width: 1080, height: 640 },
    resize: { width: 1280, height: 758 },
  },
  {
    input: source.storyCup,
    output: "gallery/coffee-story-crop.webp",
    extract: { left: 56, top: 430, width: 968, height: 706 },
    resize: { width: 1200, height: 875 },
  },
  {
    input: source.storyCup,
    output: "gallery/coffee-story-mobile.webp",
    extract: { left: 158, top: 408, width: 760, height: 860 },
    resize: { width: 820, height: 928 },
  },
  {
    input: source.brandPoster,
    output: "location/beans-and-cup-texture.webp",
    extract: { left: 0, top: 820, width: 1080, height: 430 },
    resize: { width: 1600, height: 637 },
  },
];

async function ensureDirs() {
  for (const dir of ["logo", "hero", "gallery", "menu", "location", "video"]) {
    await fs.mkdir(path.join(publicMedia, dir), { recursive: true });
  }
}

async function copyAsset(fromName, toRelative) {
  await fs.copyFile(path.join(sourceDir, fromName), path.join(publicMedia, toRelative));
}

async function cropAsset(job) {
  await sharp(path.join(sourceDir, job.input))
    .extract(job.extract)
    .resize(job.resize)
    .modulate({ saturation: 1.04, brightness: 0.98 })
    .linear(1.06, -4)
    .sharpen({ sigma: 0.65, m1: 0.45, m2: 0.55 })
    .webp({ quality: 84 })
    .toFile(path.join(publicMedia, job.output));
}

await ensureDirs();
await copyAsset(source.logo, "logo/polo-logo.jpg");
await copyAsset(source.heroVideo, "video/coffee-preparation.mp4");
await copyAsset(source.galleryVideo, "video/gallery-atmosphere.mp4");
await copyAsset(source.detailVideo, "video/espresso-details.mp4");

for (const job of cropJobs) {
  await cropAsset(job);
}

console.log("Prepared Caffe Polo Venezia media assets.");
