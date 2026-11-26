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
let particles = [];
let activeTheme = "autumn";
const particleSets = {
  autumn: ["🍁","🍂","🍃"],
  winter: ["❄️","❅","❆"],
  flowers: ["🌸","🌷","🌼","🌺"],
  garden: ["🌹","💗","🌿","🌸"]
};

// Reliable visible falling-effect layer.
// Uses normal DOM text instead of canvas emoji rendering so it remains visible in desktop Chrome.
let fallingLayer = null;
let fallingTimer = null;
function buildFallingLayer(theme) {
  if (!fallingLayer) {
    fallingLayer = document.createElement("div");
    fallingLayer.id = "fallingEffectsLayer";
    fallingLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(fallingLayer);
  }
  if (fallingTimer) clearTimeout(fallingTimer);
  fallingLayer.innerHTML = "";
  const symbols = particleSets[theme] || particleSets.autumn;
  const count = window.innerWidth < 700 ? 48 : 88;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("span");
    item.className = "falling-item";
    item.textContent = symbols[i % symbols.length];
    item.style.left = (Math.random() * 100) + "vw";
    item.style.animationDelay = (-Math.random() * 8) + "s";
    item.style.animationDuration = (7 + Math.random() * 7) + "s";
    item.style.fontSize = (18 + Math.random() * 30) + "px";
    item.style.setProperty("--drift", ((Math.random() * 120) - 60) + "px");
    item.style.setProperty("--spin", ((Math.random() * 360) - 180) + "deg");
    fallingLayer.appendChild(item);
  }
}
function refreshFallingLayer(theme) {
  buildFallingLayer(theme);
}

const themeArtwork = {
  autumn: {src:"assets/mother-daughter-autumn.jpg",alt:"A mother and daughter sharing a warm autumn moment beneath a maple tree",caption:"A precious moment to treasure forever"},
  winter: {src:"assets/winter-snow-bear.svg",alt:"A cuddly white snow bear beneath falling snow",caption:"A cozy winter wish beneath the snow"},
  flowers: {src:"assets/flowers-studio.svg",alt:"A colorful garden of blooming flowers",caption:"Let every beautiful thought blossom"},
  garden: {src:"assets/romantic-garden.svg",alt:"A romantic rose garden with roses and a glowing arch",caption:"A lovely place for heartfelt memories"}
};
const sceneCopy = {
  autumn: {eyebrow:"AN AUTUMN MOMENT",title:"Meet Me Beneath the Tree",description:"Where golden leaves fall and beautiful memories begin.",art:""},
  winter: {eyebrow:"A WINTER WISH",title:"A Cozy Moment in the Snow",description:"Let gentle snowflakes make your message feel magical.",art:"❄️ 🐻 ❄️"},
  flowers: {eyebrow:"A GARDEN IN BLOOM",title:"Let Your Love Blossom",description:"Surround your heartfelt words with beautiful flowers.",art:"🌷 🌸 🌼"},
  garden: {eyebrow:"A ROMANTIC ESCAPE",title:"A Rose Garden for Two",description:"A lovely place for messages filled with warmth and affection.",art:"🌹 💗 🌿"}
};
const familyCopy = {
  autumn: {eyebrow:"A SPECIAL FAMILY MOMENT",title:"Love Grows Beneath the Autumn Tree",description:"Some of life's most beautiful memories are made with the people closest to our hearts.",signature:"Together is a beautiful place to be. ❤️"},
  winter: {eyebrow:"A COZY WINTER MOMENT",title:"Warm Hearts Beneath the Snow",description:"Even in the coldest season, love keeps every beautiful memory warm.",signature:"Together feels like home. ❄️❤️"},
  flowers: {eyebrow:"A BEAUTIFUL MOMENT",title:"Let Love Bloom Around You",description:"Some memories grow gently, like flowers cared for with love.",signature:"May every moment blossom beautifully. 🌸❤️"},
  garden: {eyebrow:"A ROMANTIC MOMENT",title:"A Garden Made for Two",description:"Where roses bloom and heartfelt memories find a beautiful place to stay.",signature:"Love makes every garden brighter. 🌹❤️"}
};
function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function newParticle(randomY = true) {
  const symbols = particleSets[activeTheme];
  return {
    x: Math.random() * innerWidth,
    y: randomY ? Math.random() * innerHeight : -35,
    size: 17 + Math.random() * 25,
    speed: activeTheme === "winter" ? .55 + Math.random() * 1.25 : .7 + Math.random() * 1.45,
    drift: Math.random() * 2.4 - 1.2,
    angle: Math.random() * 6.28,
    spin: (Math.random() - .5) * .025,
    symbol: symbols[Math.floor(Math.random() * symbols.length)]
  };
}
function resetParticles() {
  particles = [];
  const count = window.innerWidth < 600 ? 42 : 76;
  for (let i = 0; i < count; i++) particles.push(newParticle());
}
function applyTheme(theme, save = true) {
  if (!particleSets[theme]) return;
  activeTheme = theme;
  // Single-selection mode: only the chosen world is active at any time.
  document.querySelectorAll(".theme-card").forEach(button => {
    const selected = button.dataset.theme === theme;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.body.classList.remove("theme-autumn","theme-winter","theme-flowers","theme-garden");
  document.body.classList.add("theme-" + theme);
  document.body.dataset.activeTheme = theme;
  const copy = sceneCopy[theme];
  $("sceneEyebrow").textContent = copy.eyebrow;
  $("sceneTitle").textContent = copy.title;
  $("sceneDescription").textContent = copy.description;
  $("scene").dataset.sceneArt = copy.art;
  const artwork = themeArtwork[theme];
  const previewSymbols = {autumn:"🍁",winter:"❄️",flowers:"🌸",garden:"🌹"};
  const previewSymbol = $("previewSymbol");
  if (previewSymbol) previewSymbol.textContent = previewSymbols[theme] || "❤️";
  const artworkImage = $("themeArtworkImage");
  const artworkCaption = document.querySelector(".family-photo figcaption");
  if (artworkImage && artwork) { artworkImage.src = artwork.src; artworkImage.alt = artwork.alt; }
  if (artworkCaption && artwork) artworkCaption.textContent = artwork.caption;
  const family = familyCopy[theme];
  if (family) {
    const familyEyebrow = document.querySelector(".family-copy .eyebrow");
    const familyTitle = document.querySelector(".family-copy h2");
    const familyDescription = document.querySelector(".family-copy p");
    const familySignature = document.querySelector(".family-signature");
    if (familyEyebrow) familyEyebrow.textContent = family.eyebrow;
    if (familyTitle) familyTitle.textContent = family.title;
    if (familyDescription) familyDescription.textContent = family.description;
    if (familySignature) familySignature.textContent = family.signature;
  }
  $("themeStatus").textContent = document.querySelector('[data-theme="' + theme + '"] strong').textContent + " selected";
  // Keep the message/preview flow identical for every selected theme.
  // The default Autumn Love flow remains the master behavior.
  updatePreview();
  if (save) {
    try { localStorage.setItem("autumnTreeTheme", theme); } catch (error) {}
  }
  resetParticles();
  refreshFallingLayer(theme);
}
document.querySelectorAll(".theme-card").forEach(button => {
  button.addEventListener("click", () => {
    // Change the selected world and start its falling effect immediately.
    // Stay on the selection screen so the animation is visible before opening the note editor.
    applyTheme(button.dataset.theme);
  });
});

const createMessageBtn = $("createMessageBtn");
if (createMessageBtn) {
  createMessageBtn.addEventListener("click", () => {
    const messageSection = $("studio");
    if (messageSection) {
      messageSection.scrollIntoView({ behavior: "smooth", block: "start" });
      const recipient = $("recipient");
      if (recipient) setTimeout(() => recipient.focus({ preventScroll: true }), 350);
    }
  });
}
function animateParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const particle of particles) {
    particle.y += particle.speed;
    particle.x += Math.sin(particle.y * .012) * .7 + particle.drift;
    particle.angle += particle.spin;
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle);
    ctx.globalAlpha = activeTheme === "winter" ? .88 : .92;
    ctx.font = particle.size + 'px "Noto Color Emoji","Apple Color Emoji",sans-serif';
    ctx.fillText(particle.symbol, 0, 0);
    ctx.restore();
    if (particle.y > innerHeight + 35) Object.assign(particle, newParticle(false));
  }
  requestAnimationFrame(animateParticles);
}
window.addEventListener("resize", resize);
resize();
let savedTheme = "autumn";
try { savedTheme = localStorage.getItem("autumnTreeTheme") || "autumn"; } catch (error) {}
applyTheme(particleSets[savedTheme] ? savedTheme : "autumn", false);
animateParticles();
updatePreview();
