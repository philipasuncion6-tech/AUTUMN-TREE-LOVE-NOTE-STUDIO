const $ = id => document.getElementById(id);

const templates = {
  love: "May your day be filled with warmth, beautiful memories, and endless love. ❤️",
  birthday: "Wishing you a birthday filled with happiness, blessings, and beautiful moments. 🎂",
  anniversary: "Every season is more beautiful with you in my life. Happy anniversary! ❤️",
  thankyou: "Thank you for being a wonderful part of my life. May happiness always find you. 🍁",
  missyou: "Even when we are apart, you are always close to my heart. Sending warm hugs. 💗",
  friendship: "A true friend makes every season brighter. Thank you for being there. 🍂"
};

function updatePreview() {
  const name = $("recipient").value.trim() || "Someone Special";
  const message = $("message").value.trim() || templates[$("occasion").value];
  $("previewTo").textContent = "To " + name;
  $("previewMessage").textContent = message;
  $("count").textContent = $("message").value.length + " / 500";
}

function completeMessage() {
  const name = $("recipient").value.trim() || "Someone Special";
  const message = $("message").value.trim() || templates[$("occasion").value];
  return `To ${name}\n\n${message}\n\nWith love, always ❤️`;
}

$("occasion").addEventListener("change", () => {
  if (!$("message").value.trim()) updatePreview();
});
$("message").addEventListener("input", updatePreview);
$("recipient").addEventListener("input", updatePreview);
$("previewBtn").addEventListener("click", updatePreview);

$("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(completeMessage());
  } catch (e) {
    const box = document.createElement("textarea");
    box.value = completeMessage();
    document.body.appendChild(box);
    box.select();
    document.execCommand("copy");
    box.remove();
  }
  $("copyBtn").textContent = "✓ Copied!";
  setTimeout(() => $("copyBtn").textContent = "📋 Copy Message", 1800);
});

$("downloadBtn").addEventListener("click", () => {
  const blob = new Blob([completeMessage()], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Autumn-Tree-Love-Note.txt";
  a.click();
  URL.revokeObjectURL(url);
});

const canvas = $("autumnLeaves");
const ctx = canvas.getContext("2d");
let leaves = [];
const symbols = ["🍁", "🍂", "🍃"];

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function newLeaf(randomY = true) {
  return {
    x: Math.random() * innerWidth,
    y: randomY ? Math.random() * innerHeight : -30,
    size: 14 + Math.random() * 17,
    speed: .7 + Math.random() * 1.5,
    drift: Math.random() * 1.2 - .6,
    angle: Math.random() * 6.28,
    spin: (Math.random() - .5) * .025,
    symbol: symbols[Math.floor(Math.random() * symbols.length)]
  };
}

function animateLeaves() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const leaf of leaves) {
    leaf.y += leaf.speed;
    leaf.x += Math.sin(leaf.y * .012) * .7 + leaf.drift;
    leaf.angle += leaf.spin;
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.angle);
    ctx.globalAlpha = .85;
    ctx.font = `${leaf.size}px serif`;
    ctx.fillText(leaf.symbol, 0, 0);
    ctx.restore();
    if (leaf.y > innerHeight + 30) Object.assign(leaf, newLeaf(false));
  }
  requestAnimationFrame(animateLeaves);
}

window.addEventListener("resize", resize);
resize();
for (let i = 0; i < 22; i++) leaves.push(newLeaf());
animateLeaves();
updatePreview();
