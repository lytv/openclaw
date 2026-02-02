
import fs from "node:fs";
import path from "node:path";

const skillsDir = "/Users/mac/tools/openclaw/skills";
const subdirs = fs.readdirSync(skillsDir).filter(d => fs.statSync(path.join(skillsDir, d)).isDirectory());

for (const subdir of subdirs) {
    const skillMdPath = path.join(skillsDir, subdir, "SKILL.md");
    if (!fs.existsSync(skillMdPath)) continue;

    console.log(`Checking ${subdir}...`);
    let content = fs.readFileSync(skillMdPath, "utf-8");
    if (content.includes("openclaw") && content.includes("metadata")) {
        console.log(`  - Already has openclaw metadata.`);
        continue;
    }

    // Try to find the frontmatter end --- 
    const lines = content.split("\n");
    if (lines[0].trim() !== "---") {
        console.log(`  - NO FRONTMATTER at start? Found: ${lines[0]}`);
        continue;
    }

    let endIdx = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "---") {
            endIdx = i;
            break;
        }
    }

    if (endIdx === -1) {
        console.log(`  - NO FRONTMATTER END found.`);
        continue;
    }

    // Insert metadata block
    const metadataBlock = [
        "metadata:",
        "  {",
        '    "openclaw": { "emoji": "📦" },',
        "  }",
    ];

    lines.splice(endIdx, 0, ...metadataBlock);
    const newContent = lines.join("\n");

    fs.writeFileSync(skillMdPath, newContent, "utf-8");
    console.log(`  - ADDED openclaw metadata.`);
}
