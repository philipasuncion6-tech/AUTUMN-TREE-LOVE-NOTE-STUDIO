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

  const familyImage = new Image();
  familyImage.src = "assets/mother-daughter-autumn.jpg";

  try {
    status.textContent = "🍁 Preparing your Autumn Family scene...";

    await new Promise((resolve, reject) => {
      familyImage.onload = resolve;
      familyImage.onerror = () => reject(
        new Error("Family artwork could not be loaded.")
      );
    });

    const leaves = Array.from({length: 42}, () => ({
      x: Math.random() * 540,
      y: Math.random() * 960,
      speed: 35 + Math.random() * 75,
      size: 9 + Math.random() * 13,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 2,
      drift: 12 + Math.random() * 28,
      color: ["#e83c19", "#ff8b20", "#f6c34c", "#b83b21"][
        Math.floor(Math.random() * 4)
      ]
    }));

    function roundedRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    }

    function drawMapleLeaf(x, y, size, angle, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(size / 24, size / 24);
      ctx.fillStyle = color;
      ctx.strokeStyle = "rgba(91,35,15,.45)";
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(5, -11);
      ctx.lineTo(15, -17);
      ctx.lineTo(12, -5);
      ctx.lineTo(23, 0);
      ctx.lineTo(11, 5);
      ctx.lineTo(15, 17);
      ctx.lineTo(4, 12);
      ctx.lineTo(0, 23);
      ctx.lineTo(-4, 12);
      ctx.lineTo(-15, 17);
      ctx.lineTo(-11, 5);
      ctx.lineTo(-23, 0);
      ctx.lineTo(-12, -5);
      ctx.lineTo(-15, -17);
      ctx.lineTo(-5, -11);
      ctx.closePath();
      ctx.fill();
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

    function draw(elapsed) {
      const seconds = elapsed / 1000;

      // Warm autumn sunset background
      const bg = ctx.createLinearGradient(0, 0, 0, 960);
      bg.addColorStop(0, "#512b24");
      bg.addColorStop(.48, "#a44e29");
      bg.addColorStop(1, "#251d20");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 540, 960);

      // Golden sunset glow
      const glow = ctx.createRadialGradient(
        270, 420, 30, 270, 420, 440
      );
      glow.addColorStop(0, "rgba(255,190,85,.35)");
      glow.addColorStop(1, "rgba(255,190,85,0)");
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
        leaf.x += Math.sin(seconds * 1.3 + leaf.angle) *
          leaf.drift / 30;
        leaf.angle += leaf.spin / 30;

        if (leaf.y > 980) {
          leaf.y = -25;
          leaf.x = Math.random() * 540;
        }

        drawMapleLeaf(
          leaf.x, leaf.y, leaf.size, leaf.angle, leaf.color
        );
      });

      // Title
      ctx.textAlign = "center";
      ctx.shadowColor = "#1e0d08";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffe2ad";
      ctx.font = "bold 27px Georgia";
      ctx.fillText("AUTUMN TREE", 270, 53);

      ctx.font = "italic 17px Georgia";
      ctx.fillText("A FAMILY MOMENT", 270, 83);
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
          "-pix_fmt", "yuv420p",
          "-movflags", "+faststart",
          "-an",
          "Autumn-Tree-Family-Love.mp4"
        ]);

        const data = await ffmpeg.readFile(
          "Autumn-Tree-Family-Love.mp4"
        );

        const mp4Blob = new Blob([data], {type: "video/mp4"});
        const url = URL.createObjectURL(mp4Blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "Autumn-Tree-Family-Love.mp4";
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 60000);

        status.textContent =
          "❤️ Your Autumn Tree Family MP4 is ready! Check Downloads.";

        try {
          await ffmpeg.deleteFile("input.webm");
          await ffmpeg.deleteFile("Autumn-Tree-Family-Love.mp4");
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
      "🍁 Recording your 15-second Autumn Family Love Video...";

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
