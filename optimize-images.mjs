import sharp from "sharp";
import fs from "fs";

const images = [
  {
    input:
      "public/uploads/products/f783bf79-2b4f-4b12-9499-69a6a196281f.png",
    output:
      "public/uploads/products/optimized/f783bf79-2b4f-4b12-9499-69a6a196281f.png",
    width: 1200,
  },
  {
    input:
      "public/uploads/products/04adadab-68ce-45b4-a958-96cdf6d69e1d.jpg",
    output:
      "public/uploads/products/optimized/04adadab-68ce-45b4-a958-96cdf6d69e1d.jpg",
    width: 1200,
  },
  {
    input:
      "public/uploads/products/fedd9144-6515-48bc-b33e-4931a0186338.png",
    output:
      "public/uploads/products/optimized/fedd9144-6515-48bc-b33e-4931a0186338.png",
    width: 1200,
  },
];

async function optimizeImages() {
  fs.mkdirSync("public/uploads/products/optimized", {
    recursive: true,
  });

  for (const image of images) {
    const pipeline = sharp(image.input).resize({
      width: image.width,
      withoutEnlargement: true,
    });

    if (image.output.endsWith(".png")) {
      await pipeline
        .png({
          compressionLevel: 9,
          palette: true,
        })
        .toFile(image.output);
    } else {
      await pipeline
        .jpeg({
          quality: 82,
          mozjpeg: true,
        })
        .toFile(image.output);
    }

    console.log(`Optimized: ${image.output}`);
  }
}

optimizeImages().catch(console.error);