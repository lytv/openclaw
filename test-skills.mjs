
import { loadSkillsFromDir } from "@mariozechner/pi-coding-agent";
import path from "node:path";

const skillsDir = "/Users/mac/tools/openclaw/skills";
const loaded = loadSkillsFromDir({
    dir: skillsDir,
    source: "test"
});

let skills = [];
if (Array.isArray(loaded)) {
    skills = loaded;
} else if (loaded && typeof loaded === "object" && "skills" in loaded) {
    skills = loaded.skills;
}

console.log("Loaded skills count:", skills.length);
const names = skills.map(s => s.name);
console.log("Skill names:", names.sort().join(", "));
console.log("Is last30days in list?", names.includes("last30days"));

const last30 = skills.find(s => s.name === "last30days");
if (last30) {
    console.log("last30days filePath:", last30.filePath);
} else {
    console.log("last30days NOT found among:", names.length, "skills");
}
