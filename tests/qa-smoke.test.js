"use strict";
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const read = p => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
const exists = p => fs.existsSync(path.join(__dirname, "..", p));
const results = [];
function check(name, fn) {
  try { fn(); results.push({name, ok:true}); }
  catch (error) { results.push({name, ok:false, reason:error.message}); }
}

const html = read("index.html");
const app = read("js/app.js");
const video = read("js/video.js");
const css = read("css/style.css");
const themes = ["autumn", "winter", "flowers", "garden"];

check("Main page contains all four theme selectors", () => {
  for (const theme of themes) assert.match(html, new RegExp(`data-theme=["']${theme}["']`));
});
check("Message editor and preview controls exist", () => {
  for (const id of ["recipient","message","previewBtn","createMessageBtn","studio","previewMessage"]) {
    assert.ok(html.includes('id="' + id + '"'), "Missing #" + id);
  }
});
check("Browser animation initializes on page load", () => {
  assert.match(app, /animateParticles\(\);/);
  assert.match(app, /requestAnimationFrame\(animateParticles\)/);
});
check("Every theme has a dedicated WEBP particle asset", () => {
  const files = fs.readdirSync(path.join(__dirname, "..", "assets"));
  for (const theme of themes) {
    assert.ok(files.some(f => f.toLowerCase().includes(theme) && f.toLowerCase().endsWith(".webp")),
      "No " + theme + " WEBP particle asset found");
  }
});
check("Browser particle renderer draws image assets (not emoji text)", () => {
  assert.match(app, /drawImage\(/, "No image-based particle drawing found in app.js");
  assert.doesNotMatch(app, /fillText\(particle\.symbol/, "Browser still draws particle emojis");
});
check("MP4 renderer draws image-based particles", () => {
  assert.match(video, /drawImage\([^\n]*(particle|leaf|flake|petal)/i,
    "MP4 particle renderer does not draw image assets");
  assert.doesNotMatch(video, /fillText\(symbol/, "MP4 still draws particle symbols");
});
check("MP4 capture and 15-second recording flow exist", () => {
  assert.match(video, /captureStream\(30\)/);
  assert.match(video, /elapsed < 15000/);
  assert.match(video, /MediaRecorder/);
});
check("Root and Capacitor www sources are synchronized", () => {
  for (const p of ["index.html","css/style.css","js/app.js","js/video.js","sw.js"]) {
    assert.ok(exists("www/" + p), "Missing www/" + p);
    assert.equal(read(p), read("www/" + p), p + " differs from www/" + p);
  }
});

for (const r of results) {
  console.log((r.ok ? "PASS " : "FAIL ") + r.name + (r.reason ? " — " + r.reason : ""));
}
const failed = results.filter(r => !r.ok).length;
console.log("\nQA RESULT: " + (results.length - failed) + "/" + results.length + " passed; " + failed + " failed.");
if (failed) process.exitCode = 1;
