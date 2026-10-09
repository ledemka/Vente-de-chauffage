const fs = require("fs");
const path = require("path");
const { exiftool } = require("exiftool-vendored");

const TARGET_VAL =
  "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia";
const SRC_DIR = path.resolve(__dirname, "../assets/images/products");
const DIST_DIR = path.resolve(
  __dirname,
  "../dist-production/assets/images/products",
);

async function main() {
  const isCheck = process.argv.includes("--check");

  try {
    if (isCheck) {
      console.log("--- CHECK MODE ---");
      const dirs = [SRC_DIR, DIST_DIR];
      let allOk = true;

      for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
          console.error(`Directory not found: ${dir}`);
          allOk = false;
          continue;
        }
        const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg"));
        if (files.length === 0) {
          console.log(`No JPG files found in ${dir}`);
          continue;
        }
        let withTag = 0;
        let withoutTag = 0;

        for (const file of files) {
          const filePath = path.join(dir, file);
          const tags = await exiftool.read(filePath);
          const currentVal = tags["DigitalSourceType"];

          if (currentVal === TARGET_VAL) {
            withTag++;
          } else {
            withoutTag++;
            allOk = false;
            console.error(`Missing tag in: ${filePath} (found: ${currentVal})`);
          }
        }
        console.log(
          `Directory ${path.basename(path.dirname(dir))}/${path.basename(dir)}: ${withTag}/${files.length} with tag, ${withoutTag} without tag.`,
        );
      }

      if (!allOk) {
        console.error("Check failed: Some files are missing the AI tag.");
        process.exit(1);
      } else {
        console.log("Check passed: All files have the AI tag.");
      }
    } else {
      console.log("--- MARK MODE ---");
      if (!fs.existsSync(SRC_DIR)) {
        console.error(`Source directory not found: ${SRC_DIR}`);
        process.exit(1);
      }
      const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".jpg"));
      let marked = 0;
      let ignored = 0;

      for (const file of files) {
        const filePath = path.join(SRC_DIR, file);
        const tags = await exiftool.read(filePath);

        if (tags["DigitalSourceType"] === TARGET_VAL) {
          ignored++;
        } else {
          await exiftool.write(
            filePath,
            { "XMP-iptcExt:DigitalSourceType": TARGET_VAL },
            ["-overwrite_original"],
          );
          marked++;
        }
      }
      console.log(
        `Marking complete. Marked: ${marked}, Ignored (already had tag): ${ignored}`,
      );
    }
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await exiftool.end();
  }
}

main();
