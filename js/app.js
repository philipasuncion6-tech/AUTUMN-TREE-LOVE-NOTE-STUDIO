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
const themeArtwork = {
  autumn: {src:"assets/mother-daughter-autumn.jpg",alt:"A mother and daughter sharing a warm autumn moment beneath a maple tree",caption:"A precious moment to treasure forever"},
  winter: {src:"assets/winter-snow-bear-preview.jpg",alt:"A fluffy white polar bear cub sitting in a snowy pine forest",caption:"A cozy winter wish beneath the snow"},
  flowers: {src:"assets/flowers-studio.svg",alt:"A colorful garden of blooming flowers",caption:"Let every beautiful thought blossom"},
  garden: {src:"assets/romantic-garden.svg",alt:"A romantic rose garden with roses and a glowing arch",caption:"A lovely place for heartfelt memories"}
};
const sceneCopy = {
  autumn: {eyebrow:"AN AUTUMN MOMENT",title:"Meet Me Beneath the Tree",description:"Where golden leaves fall and beautiful memories begin.",art:""},
  winter: {eyebrow:"A WINTER WISH",title:"A Cozy Moment in the Snow",description:"A little polar bear, a glowing cabin, and a forest dressed in snow.",art:""},
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
  const depth = .45 + Math.random() * .75;
  return {
    x: Math.random() * innerWidth,
    y: randomY ? Math.random() * innerHeight : -45,
    size: (activeTheme === "autumn" ? 13 : 13 + Math.random() * 18) * depth,
    speed: (activeTheme === "winter" ? 26 + Math.random() * 48 : 34 + Math.random() * 54) * depth,
    drift: (Math.random() * 22 - 11) * depth,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - .5) * 1.1,
    phase: Math.random() * Math.PI * 2,
    depth,
    palette: ["#b94325", "#d66a25", "#e59b32", "#b8792e", "#8d3828"][Math.floor(Math.random() * 5)],
    symbol: symbols[Math.floor(Math.random() * symbols.length)]
  };
}
function resetParticles() {
  particles = [];
  const count = activeTheme === "autumn"
    ? (window.innerWidth < 600 ? 22 : 36)
    : (window.innerWidth < 600 ? 15 : 24);
  for (let i = 0; i < count; i++) particles.push(newParticle());
}
function drawRealisticMapleLeaf(particle, time) {
  const size = particle.size;
  const breeze = Math.sin(time * .00042 + particle.phase) * 1.0;
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.angle);
  ctx.scale(size / 22, size / 22);
  ctx.globalAlpha = .72 + particle.depth * .22;
  const gradient = ctx.createLinearGradient(-12, -14, 10, 15);
  gradient.addColorStop(0, "#f2bd55");
  gradient.addColorStop(.42, particle.palette);
  gradient.addColorStop(1, "#713020");
  ctx.fillStyle = gradient;
  ctx.shadowColor = "rgba(65,25,10,.28)";
  ctx.shadowBlur = 3;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.quadraticCurveTo(-3, 7, -10, 4);
  ctx.lineTo(-14, 1);
  ctx.lineTo(-8, -2);
  ctx.lineTo(-11, -10);
  ctx.lineTo(-3, -7);
  ctx.lineTo(0, -16);
  ctx.lineTo(3, -7);
  ctx.lineTo(11, -10);
  ctx.lineTo(8, -2);
  ctx.lineTo(14, 1);
  ctx.lineTo(7, 5);
  ctx.quadraticCurveTo(3, 9, 0, 14);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,218,143,.72)";
  ctx.lineWidth = .8;
  ctx.beginPath();
  ctx.moveTo(0, 13);
  ctx.lineTo(0, -13);
  ctx.moveTo(0, 3); ctx.lineTo(-9, -2);
  ctx.moveTo(0, 0); ctx.lineTo(9, -4);
  ctx.moveTo(0, -5); ctx.lineTo(-5, -8);
  ctx.moveTo(0, -7); ctx.lineTo(5, -9);
  ctx.stroke();
  ctx.restore();
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
  const sceneElement = $("scene");
  if (sceneElement) sceneElement.dataset.sceneArt = copy.art;
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
  const selectedLabel = document.querySelector('[data-theme="' + theme + '"] strong');
  if ($("themeStatus")) $("themeStatus").textContent = (selectedLabel ? selectedLabel.textContent : theme) + " selected";
  const videoButton = $("videoBtn");
  if (videoButton) videoButton.textContent = "Create " + (theme === "autumn" ? "Autumn Love" : theme === "winter" ? "Winter Snow Bear" : theme === "flowers" ? "Flowers Studio" : "Romantic Garden") + " MP4";
  // Keep the message/preview flow identical for every selected theme.
  // The default Autumn Love flow remains the master behavior.
  updatePreview();
  if (save) {
    try { localStorage.setItem("autumnTreeTheme", theme); } catch (error) {}
  }
  resetParticles();
}
document.querySelectorAll(".theme-card").forEach(button => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
    const messageSection = $("studio");
    if (messageSection) {
      setTimeout(() => {
        messageSection.scrollIntoView({ behavior: "smooth", block: "start" });
        const recipient = $("recipient");
        if (recipient) recipient.focus({ preventScroll: true });
      }, 120);
    }
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
function animateParticles(now) {
  const time = now || performance.now();
  const dt = Math.min(.04, Math.max(.001, (time - (animateParticles.lastTime || time)) / 1000));
  animateParticles.lastTime = time;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const breeze = Math.sin(time * .00032) * 13 + Math.sin(time * .00071) * 5;
  for (const particle of particles) {
    particle.y += particle.speed * dt;
    particle.x += (particle.drift + breeze * particle.depth) * dt
      + Math.sin(time * .0011 + particle.phase) * 7 * dt;
    particle.angle += particle.spin * dt;
    if (activeTheme === "autumn") {
      drawRealisticMapleLeaf(particle, time);
    } else {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.angle);
      ctx.globalAlpha = activeTheme === "winter" ? .68 : .86;
      if (activeTheme === "winter") {
        const radius = Math.max(1.2, particle.size * .105);
        ctx.fillStyle = "#f4fbff";
        ctx.shadowColor = "#d9f2ff";
        ctx.shadowBlur = particle.size * .42;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.font = particle.size + 'px "Noto Color Emoji","Apple Color Emoji",sans-serif';
        ctx.fillText(particle.symbol, 0, 0);
      }
      ctx.restore();
    }
    if (particle.y > innerHeight + 48 || particle.x < -55 || particle.x > innerWidth + 55) {
      Object.assign(particle, newParticle(false));
      if (particle.x < -55 || particle.x > innerWidth + 55) particle.x = Math.random() * innerWidth;
    }
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
