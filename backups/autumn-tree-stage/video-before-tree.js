let videoBusy = false;

async function createTulipsVideo() {
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

  const recipient = document.getElementById("recipient").value.trim()
    || "Someone Special";
  const message = document.getElementById("message").value.trim()
    || "May your day bloom with happiness, warmth and beautiful moments. Sending you love, wrapped in tulips. ❤️";

  const leaves = Array.from({length: 28}, () => ({
    x: Math.random() * 540,
    y: Math.random() * 960,
    speed: 1 + Math.random() * 2,
    size: 14 + Math.random() * 14,
    angle: Math.random() * 6,
    spin: (Math.random() - .5) * .04,
    symbol: ["🍁","🍂","🍃"][Math.floor(Math.random() * 3)]
  }));

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

  function draw(now) {
    const seconds = now / 1000;

    const bg = ctx.createLinearGradient(0, 0, 540, 960);
    bg.addColorStop(0, "#e9d8ef");
    bg.addColorStop(.5, "#f8dce8");
    bg.addColorStop(1, "#cbb8df");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 540, 960);

    // Soft magical background glow
    const glow = ctx.createRadialGradient(270, 340, 20, 270, 340, 390);
    glow.addColorStop(0, "rgba(255,255,255,.9)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 540, 760);

    // Falling autumn leaves
    leaves.forEach(leaf => {
      leaf.y += leaf.speed;
      leaf.x += Math.sin(seconds + leaf.angle) * 1.2;
      leaf.angle += leaf.spin;
      if (leaf.y > 980) {
        leaf.y = -25;
        leaf.x = Math.random() * 540;
      }
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.angle);
      ctx.font = `${leaf.size}px serif`;
      ctx.fillText(leaf.symbol, 0, 0);
      ctx.restore();
    });

    // Title
    ctx.textAlign = "center";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#875b83";
    ctx.font = "bold 29px Georgia";
    ctx.fillText("LOVE NOTE TULIPS", 270, 95);
    ctx.shadowBlur = 0;

    // Glass case dome
    ctx.save();
    ctx.shadowColor = "rgba(112,75,130,.3)";
    ctx.shadowBlur = 28;
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.strokeStyle = "rgba(255,255,255,.95)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(105, 475);
    ctx.lineTo(105, 280);
    ctx.bezierCurveTo(105, 65, 435, 65, 435, 280);
    ctx.lineTo(435, 475);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Flower stems
    ctx.strokeStyle = "#56865c";
    ctx.lineWidth = 7;
    [[190, 340, 210, 465], [270, 310, 270, 465], [350, 340, 330, 465]].forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s[0], s[1]);
      ctx.quadraticCurveTo(s[0] + 25, 400, s[2], s[3]);
      ctx.stroke();
    });

    // Tulip heads
    ctx.textAlign = "center";
    ctx.font = "76px serif";
    ctx.shadowColor = "#d69bc4";
    ctx.shadowBlur = 12;
    ctx.fillText("🌷", 190, 350);
    ctx.fillText("🌷", 270, 320);
    ctx.fillText("🌷", 350, 350);
    ctx.shadowBlur = 0;

    // Glass case base
    ctx.fillStyle = "#c9a8c6";
    ctx.fillRect(105, 468, 330, 17);
    ctx.fillStyle = "#f9e5ef";
    ctx.fillRect(115, 485, 310, 8);

    // Glass reflection
    ctx.strokeStyle = "rgba(255,255,255,.8)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(137, 210);
    ctx.quadraticCurveTo(130, 290, 145, 370);
    ctx.stroke();

    // Message card
    ctx.fillStyle = "rgba(255,250,255,.88)";
    ctx.strokeStyle = "#d5b3d2";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(55, 550, 430, 270, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a16c98";
    ctx.font = "bold 19px Georgia";
    ctx.fillText("A LITTLE NOTE FOR YOU", 270, 590);

    ctx.fillStyle = "#8e6287";
    ctx.font = "bold 25px Georgia";
    ctx.fillText(recipient.slice(0, 28), 270, 635);

    ctx.fillStyle = "#624d68";
    ctx.font = "20px Georgia";
    const lines = wrapText(message, 360).slice(0, 6);
    lines.forEach((line, i) => {
      ctx.fillText(line, 270, 690 + i * 29);
    });

    ctx.fillStyle = "#a66c98";
    ctx.font = "italic 19px Georgia";
    ctx.fillText("With love, always ♥", 270, 790);

    // Footer
    ctx.fillStyle = "#805a7d";
    ctx.font = "italic 20px Georgia";
    ctx.fillText("Created with love by Asuncion", 270, 900);
  }

  const stream = canvas.captureStream(30);
  let recorder;

  try {
    const types = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ];
    const supported = types.find(type => MediaRecorder.isTypeSupported(type));
    recorder = supported
      ? new MediaRecorder(stream, {mimeType: supported})
      : new MediaRecorder(stream);
  } catch (error) {
    stream.getTracks().forEach(track => track.stop());
    status.textContent = "Recording error: " + error.message;
    button.disabled = false;
    videoBusy = false;
    return;
  }

  const chunks = [];
  recorder.ondataavailable = event => {
    if (event.data && event.data.size) chunks.push(event.data);
  };

  recorder.onerror = event => {
    status.textContent = "Recording error. Please try again.";
  };

  recorder.onstop = async () => {
    try {
      if (!chunks.length) throw new Error("No video data was recorded.");

      const webmBlob = new Blob(chunks, {type: recorder.mimeType || "video/webm"});

      if (!window.FFmpegWASM || !window.FFmpegUtil) {
        throw new Error("FFmpeg library did not load. Check your internet connection.");
      }

      status.textContent = "⏳ Loading MP4 conversion engine...";

      const {FFmpeg} = window.FFmpegWASM;
      const {fetchFile} = window.FFmpegUtil;
      const ffmpeg = new FFmpeg();

      ffmpeg.on("progress", ({progress}) => {
        status.textContent = "🎬 MP4 conversion: " +
          Math.round(progress * 100) + "%";
      });

      const base = new URL("assets/", window.location.href);
      await ffmpeg.load({
        coreURL: new URL("ffmpeg-core-esm.js", base).href,
        wasmURL: new URL("ffmpeg-core-esm.wasm", base).href,
        classWorkerURL: new URL("814.ffmpeg.js", base).href
      });

      status.textContent = "🎬 Encoding your Tulips video...";

      await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));

      await ffmpeg.exec([
        "-i", "input.webm",
        "-c:v", "mpeg4",
        "-q:v", "5",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        "Love-Note-Tulips-Autumn.mp4"
      ]);

      const data = await ffmpeg.readFile("Love-Note-Tulips-Autumn.mp4");
      const mp4Blob = new Blob([data], {type: "video/mp4"});
      const url = URL.createObjectURL(mp4Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Love-Note-Tulips-Autumn.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);

      status.textContent = "❤️ MP4 video is ready! Check your Downloads folder.";

      try {
        await ffmpeg.deleteFile("input.webm");
        await ffmpeg.deleteFile("Love-Note-Tulips-Autumn.mp4");
        ffmpeg.terminate();
      } catch (e) {}
    } catch (error) {
      console.error(error);
      status.textContent = "❌ MP4 ERROR: " + (error.message || String(error));
    } finally {
      stream.getTracks().forEach(track => track.stop());
      button.disabled = false;
      videoBusy = false;
    }
  };

  let startTime;

  function animate(now) {
    if (!startTime) startTime = now;
    draw(now - startTime);

    if (now - startTime < 12000 && recorder.state === "recording") {
      requestAnimationFrame(animate);
    } else if (recorder.state === "recording") {
      recorder.stop();
    }
  }

  try {
    status.textContent = "🎬 Recording your 12-second Tulips Love Note...";
    recorder.start(250);
    requestAnimationFrame(animate);
  } catch (error) {
    stream.getTracks().forEach(track => track.stop());
    status.textContent = "Unable to start recording: " + error.message;
    button.disabled = false;
    videoBusy = false;
  }
}
