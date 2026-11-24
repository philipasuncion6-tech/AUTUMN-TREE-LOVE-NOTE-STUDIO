let videoBusy = false;

async function createAutumnTreeVideo() {
  if (videoBusy) return;

  const button = document.getElementById("videoBtn");
  const status = document.getElementById("videoStatus");

  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
    status.textContent = "Your browser does not support video recording.";
    return;
  }

  videoBusy = true;
  button.disabled = true;

  const canvas = document.createElement("canvas");
  canvas.width = 540;
  canvas.height = 960;
  const ctx = canvas.getContext("2d");

  const recipient =
    document.getElementById("recipient").value.trim() || "Someone Special";
  const message =
    document.getElementById("message").value.trim() ||
    "May your days be filled with warmth, love, and beautiful memories. ❤️";
  const theme = (() => { try { return document.body.dataset.activeTheme || localStorage.getItem("autumnTreeTheme") || "autumn"; } catch (e) { return "autumn"; } })();
  const themes = {
    autumn: {label:"Autumn Love", title:"AUTUMN TREE", subtitle:"A FAMILY MOMENT", colors:["#512b24","#a44e29","#251d20"], glow:"255,190,85", particles:["🍁","🍂","🍃"], filename:"Autumn-Love-Note",image:"assets/mother-daughter-autumn.jpg"},
    winter: {label:"Winter & Snow Bear", title:"WINTER WISHES", subtitle:"A COZY SNOWY MOMENT", colors:["#102b49","#4f83b5","#14243b"], glow:"185,225,255", particles:["❄️","❅","❆"], filename:"Winter-Snow-Bear-Love-Note",image:"assets/winter-snow-bear-mp4.jpg"},
    flowers: {label:"Flowers Studio", title:"FLOWERS STUDIO", subtitle:"LET YOUR LOVE BLOSSOM", colors:["#54294c","#c66d91","#38233f"], glow:"255,190,220", particles:["🌷","🌸","🌼","🌺"], filename:"Flowers-Studio-Love-Note",image:"assets/flowers-studio.svg"},
    garden: {label:"Romantic Garden", title:"ROMANTIC GARDEN", subtitle:"A ROSE GARDEN FOR TWO", colors:["#321d32","#8d3e61","#241b2c"], glow:"255,150,190", particles:["🌹","💗","🌿","🌸"], filename:"Romantic-Garden-Love-Note",image:"assets/romantic-garden.svg"}
  };
  const themeConfig = themes[theme] || themes.autumn;

  const familyImage = new Image();

  try {
    status.textContent = "Preparing your " + themeConfig.label + " video scene...";

    await new Promise((resolve, reject) => {
      let settled = false;
      const done = () => { if (!settled) { settled = true; resolve(); } };
      familyImage.onload = done;
      familyImage.onerror = () => { if (!settled) { settled = true; reject(new Error("Selected theme artwork could not be loaded.")); } };
      familyImage.src = themeConfig.image;
      if (familyImage.complete && familyImage.naturalWidth) done();
    });

    // Falling leaves — same visual style as MY-CYBER-LAB:
    // real autumn leaf symbols plus fresh green leaves.
    const leafSymbols = themeConfig.particles;

    const leaves = Array.from({length: theme === "autumn" ? 46 : 38}, () => ({
      x: Math.random() * 540,
      y: Math.random() * 960,
      size: (theme === "autumn" ? 9 + Math.random() * 15 : 10 + Math.random() * 15) * (.5 + Math.random() * .7),
      speed: 34 + Math.random() * 58,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * 1.25,
      drift: 10 + Math.random() * 28,
      phase: Math.random() * Math.PI * 2,
      palette: ["#b94325", "#d66a25", "#e59b32", "#b8792e", "#8d3828"][Math.floor(Math.random() * 5)],
      symbol: leafSymbols[Math.floor(Math.random() * leafSymbols.length)]
    }));

    function roundedRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    }

    function drawThemeArtwork() {
      const frame = {x:13, y:128, w:514, h:540, radius:20};
      ctx.save();
      roundedRect(frame.x, frame.y, frame.w, frame.h, frame.radius);
      ctx.clip();
      ctx.fillStyle = themeConfig.colors[0];
      ctx.fillRect(frame.x, frame.y, frame.w, frame.h);
      const imageRatio = familyImage.naturalWidth / familyImage.naturalHeight;
      if (theme === "winter" && imageRatio < 0.8) {
        const drawHeight = frame.h;
        const drawWidth = drawHeight * imageRatio;
        ctx.drawImage(familyImage, frame.x + (frame.w - drawWidth) / 2, frame.y, drawWidth, drawHeight);
      } else {
        const scale = Math.max(frame.w / familyImage.naturalWidth, frame.h / familyImage.naturalHeight);
        const drawWidth = familyImage.naturalWidth * scale;
        const drawHeight = familyImage.naturalHeight * scale;
        ctx.drawImage(familyImage, frame.x + (frame.w - drawWidth) / 2, frame.y + (frame.h - drawHeight) / 2, drawWidth, drawHeight);
      }
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = theme === "winter" ? "#d8efff" : "#e9bd78";
      ctx.lineWidth = 3;
      roundedRect(frame.x, frame.y, frame.w, frame.h, frame.radius);
      ctx.stroke();
      ctx.restore();
    }

    function drawFallingLeaf(x, y, size, symbol, angle, palette, depth, time) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      if (theme !== "autumn") {
        ctx.font = String(size * 1.7) + 'px "Noto Color Emoji","Apple Color Emoji",sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol, 0, 0);
        ctx.restore();
        return;
      }
      const scale = size / 22;
      ctx.scale(scale, scale);
      ctx.globalAlpha = .74 + depth * .2;
      const gradient = ctx.createLinearGradient(-12, -14, 10, 15);
      gradient.addColorStop(0, "#f2bd55");
      gradient.addColorStop(.42, palette);
      gradient.addColorStop(1, "#713020");
      ctx.fillStyle = gradient;
      ctx.shadowColor = "rgba(65,25,10,.3)";
      ctx.shadowBlur = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.quadraticCurveTo(-3, 7, -10, 4);
      ctx.lineTo(-14, 1); ctx.lineTo(-8, -2);
      ctx.lineTo(-11, -10); ctx.lineTo(-3, -7);
      ctx.lineTo(0, -16); ctx.lineTo(3, -7);
      ctx.lineTo(11, -10); ctx.lineTo(8, -2);
      ctx.lineTo(14, 1); ctx.lineTo(7, 5);
      ctx.quadraticCurveTo(3, 9, 0, 14);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255,218,143,.76)";
      ctx.lineWidth = .8;
      ctx.beginPath();
      ctx.moveTo(0, 13); ctx.lineTo(0, -13);
      ctx.moveTo(0, 3); ctx.lineTo(-9, -2);
      ctx.moveTo(0, 0); ctx.lineTo(9, -4);
      ctx.moveTo(0, -5); ctx.lineTo(-5, -8);
      ctx.moveTo(0, -7); ctx.lineTo(5, -9);
      ctx.stroke();
      ctx.restore();
    }

    function wrapText(text, maxWidth) {
      const words = text.split(/\s+/);
      const lines = [];
      let line = "";

      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }

      if (line) lines.push(line);
      return lines;
    }

    let previousSeconds = 0;
    function draw(elapsed) {
      const seconds = elapsed / 1000;
      const dt = Math.min(.05, Math.max(0, seconds - previousSeconds));
      previousSeconds = seconds;
      const breeze = Math.sin(seconds * .72) * 22 + Math.sin(seconds * 1.37) * 8;

      // Warm autumn sunset background
      const bg = ctx.createLinearGradient(0, 0, 0, 960);
      bg.addColorStop(0, themeConfig.colors[0]);
      bg.addColorStop(.48, themeConfig.colors[1]);
      bg.addColorStop(1, themeConfig.colors[2]);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 540, 960);

      // Golden sunset glow
      const glow = ctx.createRadialGradient(
        270, 420, 30, 270, 420, 440
      );
      glow.addColorStop(0, "rgba(" + themeConfig.glow + ",.35)");
      glow.addColorStop(1, "rgba(" + themeConfig.glow + ",0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 100, 540, 650);

      // Theme artwork: preserve the full portrait polar-bear image in Winter.
      drawThemeArtwork();

      // Natural, layered autumn leaves with gentle wind and individual spin.
      leaves.forEach(leaf => {
        leaf.y += leaf.speed * dt;
        leaf.x += (leaf.drift + breeze * (.45 + leaf.size / 32)) * dt;
        leaf.x += Math.sin(seconds * 1.6 + leaf.phase) * 7 * dt;
        leaf.angle += leaf.spin * dt;

        if (leaf.y > 990 || leaf.x < -60 || leaf.x > 600) {
          leaf.y = -25 - Math.random() * 100;
          leaf.x = Math.random() * 540;
        }

        if (theme === "winter") {
          ctx.save();
          ctx.globalAlpha = .55 + (leaf.size / 50);
          ctx.fillStyle = "#f4fbff";
          ctx.shadowColor = "#d9f2ff";
          ctx.shadowBlur = leaf.size * .65;
          ctx.beginPath();
          ctx.arc(leaf.x, leaf.y, Math.max(1.5, leaf.size * .12), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          drawFallingLeaf(leaf.x, leaf.y, leaf.size, leaf.symbol, leaf.angle, leaf.palette, .6 + leaf.size / 38, seconds);
        }
      });

      // Title
      ctx.textAlign = "center";
      ctx.shadowColor = "#1e0d08";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffe2ad";
      ctx.font = "bold 27px Georgia";
      ctx.fillText(themeConfig.title, 270, 53);

      ctx.font = "italic 17px Georgia";
      ctx.fillText(themeConfig.subtitle, 270, 83);
      ctx.shadowBlur = 0;

      // Love note appears gradually during the final scene
      const alpha = Math.min(1, Math.max(0, (seconds - 5) / 1.5));

      if (alpha > 0) {
        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.shadowColor = "rgba(20,10,5,.4)";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "rgba(255,242,217,.96)";
        ctx.strokeStyle = "#d7a65f";
        ctx.lineWidth = 2.5;
        roundedRect(28, 690, 484, 224, 20);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#92572e";
        ctx.font = "bold 15px Georgia";
        ctx.fillText("A LITTLE NOTE FOR YOU", 270, 721);

        ctx.fillStyle = "#633b27";
        ctx.font = "bold 23px Georgia";
        ctx.fillText(recipient.slice(0, 30), 270, 755);

        ctx.font = "17px Georgia";
        const lines = wrapText(message, 420).slice(0, 4);
        lines.forEach((line, i) => {
          ctx.fillText(line, 270, 790 + i * 25);
        });

        ctx.fillStyle = "#a45b31";
        ctx.font = "italic 16px Georgia";
        ctx.fillText("With love, always ♥", 270, 885);

        ctx.restore();
      }

      ctx.fillStyle = "#ffe3b6";
      ctx.font = "italic 14px Georgia";
      ctx.textAlign = "center";
      ctx.fillText("Created with love by Asuncion", 270, 946);
    }

    const stream = canvas.captureStream(24);
    let recorder;

    try {
      const types = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm"
      ];

      const supported = types.find(type =>
        MediaRecorder.isTypeSupported(type)
      );

      recorder = supported
        ? new MediaRecorder(stream, {mimeType: supported})
        : new MediaRecorder(stream);
    } catch (error) {
      stream.getTracks().forEach(track => track.stop());
      throw error;
    }

    const chunks = [];

    recorder.ondataavailable = event => {
      if (event.data && event.data.size) chunks.push(event.data);
    };

    recorder.onerror = () => {
      status.textContent = "Recording error. Please try again.";
    };

    recorder.onstop = async () => {
      try {
        if (!chunks.length) {
          throw new Error("No video data was recorded.");
        }

        const webmBlob = new Blob(chunks, {
          type: recorder.mimeType || "video/webm"
        });

        if (!window.FFmpegWASM || !window.FFmpegUtil) {
          throw new Error("FFmpeg library did not load. Check internet.");
        }

        status.textContent = "⏳ Loading MP4 conversion engine...";

        const {FFmpeg} = window.FFmpegWASM;
        const {fetchFile} = window.FFmpegUtil;
        const ffmpeg = new FFmpeg();

        ffmpeg.on("progress", ({progress}) => {
  if (!Number.isFinite(progress) || progress < 0) return;

  const percent = Math.min(99, Math.round(progress * 100));
  status.textContent = "🎬 MP4 conversion: " + percent + "%";
});


        const base = new URL("assets/", window.location.href);

        await ffmpeg.load({
          coreURL: new URL("ffmpeg-core-esm.js", base).href,
          wasmURL: new URL("ffmpeg-core-esm.wasm", base).href,
          classWorkerURL: new URL("814.ffmpeg.js", base).href
        });

        status.textContent = "✅ FFmpeg loaded. Starting conversion setup...";

ffmpeg.on("log", ({ message }) => {
  console.log("[FFmpeg]", message);

  if (message && message.trim()) {
    status.textContent = "FFmpeg: " + message;
  }
});

status.textContent = "⏳ Writing WebM file...";

await ffmpeg.writeFile(
  "input.webm",
  await fetchFile(webmBlob)
);

status.textContent = "⏳ FFmpeg conversion started...";

await ffmpeg.exec([
          "-i", "input.webm",
          "-c:v", "mpeg4",
          "-q:v", "5",
          "-threads", "1",
          "-r", "30",
          "-pix_fmt", "yuv420p",
          "-movflags", "+faststart",
          "-an",
          themeConfig.filename + ".mp4"
        ]);

        const data = await ffmpeg.readFile(
          themeConfig.filename + ".mp4"
        );

        const mp4Blob = new Blob([data], {type: "video/mp4"});
        const url = URL.createObjectURL(mp4Blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = themeConfig.filename + ".mp4";
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 60000);

        status.textContent =
          "❤️ Your " + themeConfig.label + " MP4 is ready! Check Downloads.";

        try {
          await ffmpeg.deleteFile("input.webm");
          await ffmpeg.deleteFile(themeConfig.filename + ".mp4");
          ffmpeg.terminate();
        } catch (e) {}
      } catch (error) {
        console.error(error);
        status.textContent =
          "❌ MP4 ERROR: " + (error.message || String(error));
      } finally {
        stream.getTracks().forEach(track => track.stop());
        button.disabled = false;
        videoBusy = false;
      }
    };

    let startTime;

    function animate(now) {
      if (!startTime) startTime = now;

      const elapsed = now - startTime;
      draw(elapsed);

      if (elapsed < 15000 && recorder.state === "recording") {
        requestAnimationFrame(animate);
      } else if (recorder.state === "recording") {
        recorder.stop();
      }
    }

    status.textContent =
      "Recording your 15-second " + themeConfig.label + " video...";

    recorder.start(250);
    requestAnimationFrame(animate);

  } catch (error) {
    console.error(error);
    status.textContent =
      "❌ VIDEO ERROR: " + (error.message || String(error));
    button.disabled = false;
    videoBusy = false;
  }
}
