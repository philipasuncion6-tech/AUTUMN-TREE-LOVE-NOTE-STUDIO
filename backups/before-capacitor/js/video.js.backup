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

  const recipient = document.getElementById("recipient").value.trim() || "Someone Special";
  const message = document.getElementById("message").value.trim() ||
    "May your days be filled with warmth, love, and beautiful memories. ❤️";

  const leaves = Array.from({length: 32}, () => ({
    x: Math.random() * 540,
    y: Math.random() * 960,
    speed: .8 + Math.random() * 2,
    size: 15 + Math.random() * 15,
    angle: Math.random() * 6,
    spin: (Math.random() - .5) * .04,
    drift: Math.random() * 1.5,
    symbol: ["🍁", "🍂", "🍃"][Math.floor(Math.random() * 3)]
  }));

  function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
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
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawTree(seconds) {
    // Ground
    ctx.fillStyle = "#59452e";
    ctx.beginPath();
    ctx.ellipse(270, 570, 260, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tree trunk and branches
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "#68402a";
    ctx.lineWidth = 43;
    ctx.beginPath();
    ctx.moveTo(270, 575);
    ctx.bezierCurveTo(260, 460, 280, 350, 265, 240);
    ctx.stroke();

    ctx.lineWidth = 22;
    const branches = [
      [267, 365, 170, 260],
      [270, 330, 365, 220],
      [260, 285, 205, 170],
      [275, 300, 330, 150],
      [270, 420, 130, 350],
      [275, 400, 405, 320]
    ];
    for (const b of branches) {
      ctx.beginPath();
      ctx.moveTo(b[0], b[1]);
      ctx.quadraticCurveTo((b[0]+b[2])/2, b[3]-20, b[2], b[3]);
      ctx.stroke();
    }
    ctx.restore();

    // Autumn canopy clusters
    const clusters = [
      [125,205,100,"#b94e26"], [210,130,110,"#d87927"],
      [315,120,115,"#e69a32"], [420,210,100,"#bd4825"],
      [165,285,90,"#d66a25"], [360,285,100,"#a83c24"],
      [270,205,105,"#e7a33a"], [270,330,70,"#bd5727"]
    ];
    clusters.forEach((c, i) => {
      ctx.fillStyle = c[3];
      ctx.beginPath();
      ctx.arc(c[0] + Math.sin(seconds * .5 + i) * 2, c[1], c[2], 0, Math.PI * 2);
      ctx.fill();
    });

    // Small golden highlights
    for (let i = 0; i < 28; i++) {
      const x = 100 + ((i * 73) % 340);
      const y = 100 + ((i * 47) % 260);
      ctx.fillStyle = i % 2 ? "#f4bd52" : "#e98b31";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wooden bench
    ctx.save();
    ctx.strokeStyle = "#493020";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(170, 500); ctx.lineTo(370, 500);
    ctx.moveTo(170, 525); ctx.lineTo(370, 525);
    ctx.moveTo(190, 540); ctx.lineTo(180, 590);
    ctx.moveTo(350, 540); ctx.lineTo(360, 590);
    ctx.stroke();
    ctx.fillStyle = "#9a6035";
    ctx.fillRect(165, 475, 210, 18);
    ctx.fillRect(165, 500, 210, 15);
    ctx.restore();
  }

  function draw(elapsed) {
    const seconds = elapsed / 1000;
    const bg = ctx.createLinearGradient(0, 0, 540, 960);
    bg.addColorStop(0, "#f7c77e");
    bg.addColorStop(.48, "#e99a58");
    bg.addColorStop(1, "#553d35");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 540, 960);

    const glow = ctx.createRadialGradient(270, 260, 20, 270, 260, 360);
    glow.addColorStop(0, "rgba(255,230,170,.8)");
    glow.addColorStop(1, "rgba(255,230,170,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 540, 650);

    drawTree(seconds);

    // Falling leaves in front of tree
    leaves.forEach(leaf => {
      leaf.y += leaf.speed;
      leaf.x += Math.sin(seconds + leaf.angle) * 1.2 + leaf.drift * .15;
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

    // Studio title
    ctx.textAlign = "center";
    ctx.shadowColor = "#5b301c";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#fff1cf";
    ctx.font = "bold 27px Georgia";
    ctx.fillText("AUTUMN TREE", 270, 65);
    ctx.font = "italic 18px Georgia";
    ctx.fillText("A LOVE NOTE UNDER THE TREE", 270, 98);
    ctx.shadowBlur = 0;

    // Message card
    ctx.save();
    ctx.shadowColor = "rgba(30,15,8,.35)";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "rgba(255,245,220,.94)";
    ctx.strokeStyle = "#d6a65c";
    ctx.lineWidth = 3;
    roundedRect(45, 650, 450, 235, 24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#87502c";
    ctx.font = "bold 18px Georgia";
    ctx.fillText("A LITTLE NOTE FOR YOU", 270, 690);

    ctx.fillStyle = "#633b27";
    ctx.font = "bold 25px Georgia";
    ctx.fillText(recipient.slice(0, 28), 270, 735);

    ctx.font = "19px Georgia";
    const lines = wrapText(message, 365).slice(0, 4);
    lines.forEach((line, i) => ctx.fillText(line, 270, 780 + i * 26));

    ctx.fillStyle = "#9b572d";
    ctx.font = "italic 18px Georgia";
    ctx.fillText("With love, always ♥", 270, 860);

    ctx.fillStyle = "#fff0cf";
    ctx.font = "italic 17px Georgia";
    ctx.fillText("Created with love by Asuncion", 270, 930);
  }

  const stream = canvas.captureStream(30);
  let recorder;

  try {
    const types = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    const supported = types.find(type => MediaRecorder.isTypeSupported(type));
    recorder = supported ? new MediaRecorder(stream, {mimeType:supported}) : new MediaRecorder(stream);
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

  recorder.onerror = () => {
    status.textContent = "Recording error. Please try again.";
  };

  recorder.onstop = async () => {
    try {
      if (!chunks.length) throw new Error("No video data was recorded.");
      const webmBlob = new Blob(chunks, {type:recorder.mimeType || "video/webm"});

      if (!window.FFmpegWASM || !window.FFmpegUtil) {
        throw new Error("FFmpeg library did not load. Check your internet connection.");
      }

      status.textContent = "⏳ Loading MP4 conversion engine...";
      const {FFmpeg} = window.FFmpegWASM;
      const {fetchFile} = window.FFmpegUtil;
      const ffmpeg = new FFmpeg();

      ffmpeg.on("progress", ({progress}) => {
        status.textContent = "🎬 MP4 conversion: " + Math.round(progress * 100) + "%";
      });

      const base = new URL("assets/", window.location.href);
      await ffmpeg.load({
        coreURL: new URL("ffmpeg-core-esm.js", base).href,
        wasmURL: new URL("ffmpeg-core-esm.wasm", base).href,
        classWorkerURL: new URL("814.ffmpeg.js", base).href
      });

      status.textContent = "🎬 Encoding your Autumn Tree video...";
      await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));
      await ffmpeg.exec([
        "-i", "input.webm",
        "-c:v", "mpeg4",
        "-q:v", "5",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        "Autumn-Tree-Love-Note.mp4"
      ]);

      const data = await ffmpeg.readFile("Autumn-Tree-Love-Note.mp4");
      const mp4Blob = new Blob([data], {type:"video/mp4"});
      const url = URL.createObjectURL(mp4Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Autumn-Tree-Love-Note.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);

      status.textContent = "❤️ Autumn Tree MP4 is ready! Check your Downloads folder.";

      try {
        await ffmpeg.deleteFile("input.webm");
        await ffmpeg.deleteFile("Autumn-Tree-Love-Note.mp4");
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
    } else if (recorder.state === "recording") recorder.stop();
  }

  try {
    status.textContent = "🎬 Recording your 12-second Autumn Tree Love Note...";
    recorder.start(250);
    requestAnimationFrame(animate);
  } catch (error) {
    stream.getTracks().forEach(track => track.stop());
    status.textContent = "Unable to start recording: " + error.message;
    button.disabled = false;
    videoBusy = false;
  }
}
