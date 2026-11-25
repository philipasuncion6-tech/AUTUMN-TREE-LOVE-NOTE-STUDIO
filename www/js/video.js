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

    const leaves = Array.from({length: 38}, () => ({
      x: Math.random() * 540,
      y: Math.random() * 960,
      size: 10 + Math.random() * 15,
      speed: 30 + Math.random() * 60,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.8,
      drift: 18 + Math.random() * 24,
      symbol: leafSymbols[Math.floor(Math.random() * leafSymbols.length)]
    }));

    function roundedRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    }

    function drawFallingLeaf(x, y, size, symbol, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font =
        String(size * 1.7) + 'px "Noto Color Emoji","Apple Color Emoji",sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(symbol, 0, 0);
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

    function draw(elapsed) {
      const seconds = elapsed / 1000;

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

      // Family artwork with gentle cinematic camera movement
      const zoom = 1.015 + Math.sin(seconds * .45) * .012;
      const w = 504 * zoom;
      const h = 504 * zoom;
      const x = (540 - w) / 2 + Math.sin(seconds * .3) * 2;
      const y = 142 + (504 - h) / 2;

      ctx.save();
      roundedRect(13, 135, 514, 518, 20);
      ctx.clip();
      ctx.drawImage(familyImage, x, y, w, h);
      ctx.restore();

      // Golden frame
      ctx.save();
      ctx.strokeStyle = "#e9bd78";
      ctx.lineWidth = 3;
      roundedRect(13, 135, 514, 518, 20);
      ctx.stroke();
      ctx.restore();

      // Animated foreground maple leaves
      leaves.forEach(leaf => {
        leaf.y += leaf.speed / 30;
        leaf.x += Math.sin(seconds + leaf.angle) * leaf.drift / 30;
        leaf.angle += leaf.spin / 30;

        if (leaf.y > 980) {
          leaf.y = -30;
          leaf.x = Math.random() * 540;
        }

        drawFallingLeaf(
          leaf.x, leaf.y, leaf.size, leaf.symbol, leaf.angle
        );
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

    const stream = canvas.captureStream(30);
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
        const fileName = themeConfig.filename + ".mp4";

        // Native Android APK: save through MediaStore so the file appears
        // in the public Downloads collection and is visible to Files/Gallery.
        if (
          window.AndroidDownloader &&
          typeof window.AndroidDownloader.saveBase64 === "function"
        ) {
          status.textContent = "⏳ Saving MP4 to Android Downloads...";

          const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
              const result = String(reader.result || "");
              const comma = result.indexOf(",");

              if (comma < 0) {
                reject(new Error("Could not prepare MP4 for Android save."));
                return;
              }

              resolve(result.slice(comma + 1));
            };

            reader.onerror = () =>
              reject(new Error("Could not read the generated MP4."));
            reader.readAsDataURL(mp4Blob);
          });

          const saveResult =
            window.AndroidDownloader.saveBase64(fileName, base64Data);

          if (saveResult !== "OK") {
            throw new Error(
              saveResult || "Android could not save the MP4 to Downloads."
            );
          }

          status.textContent =
            "❤️ Your " + themeConfig.label + " MP4 is saved to Downloads!";
        } else {
          // Standard browser/web download fallback.
          const url = URL.createObjectURL(mp4Blob);
          const a = document.createElement("a");

          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();

          setTimeout(() => URL.revokeObjectURL(url), 60000);

          status.textContent =
            "❤️ Your " + themeConfig.label + " MP4 download has started.";
        }

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
