const sharp = require("sharp");

const files = [
  "public/uploads/products/f783bf79-2b4f-4b12-9499-69a6a196281f.png",
  "public/uploads/products/04adadab-68ce-45b4-a958-96cdf6d69e1d.jpg",
  "public/uploads/products/fedd9144-6515-48bc-b33e-4931a0186338.png",
];

async function checkImages() {
  for (const file of files) {
    const metadata = await sharp(file).metadata();

    console.log(
      `${file} | ${metadata.width}x${metadata.height} | ${metadata.format}`
    );
  }
}

checkImages().catch(console.error);