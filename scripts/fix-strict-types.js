const fs = require("fs");
const path = require("path");

const dir = "api";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".php"));

files.forEach((file) => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, "utf8");

  // Check if declare(strict_types=1) exists
  if (content.includes("declare(strict_types=1);")) {
    // Remove it from wherever it is
    content = content.replace(
      /[\n\r]*declare\(strict_types=1\);[\n\r]*/g,
      "\n",
    );

    // Insert it immediately after <?php
    content = content.replace("<?php", "<?php\ndeclare(strict_types=1);");

    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`Fixed ${file}`);
  }
});
