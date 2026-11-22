const $ = id => document.getElementById(id);
let recorder = null;
let chunks = [];
let voiceBlob = null;
let meterFrame = null;
let audioContext = null;

$("consent").addEventListener("change", e => {
  $("recordBtn").disabled = !e.target.checked;
  $("recordStatus").textContent = e.target.checked ? "Ready when you are" : "Waiting for permission";
});

$("recordBtn").addEventListener("click", async () => {
  if (recorder && recorder.state === "recording") {
    recorder.stop();
    $("recordBtn").textContent = "● Record again";
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    chunks = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      voiceBlob = new Blob(chunks, {type: recorder.mimeType || "audio/webm"});
      $("voicePlayback").src = URL.createObjectURL(voiceBlob);
      $("voicePlayback").hidden = false;
      $("analyzeBtn").disabled = false;
      $("recordStatus").textContent = "Voice sample captured — ready to analyze";
      stream.getTracks().forEach(track => track.stop());
      if (audioContext) audioContext.close().catch(()=>{});
      cancelAnimationFrame(meterFrame);
      $("meterFill").style.width = "0%";
    };
    recorder.start();
    $("recordBtn").textContent = "■ Stop recording";
    $("recordStatus").textContent = "Recording… speak naturally for 10–20 seconds";
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const meter = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const v of data) sum += (v - 128) ** 2;
      const rms = Math.sqrt(sum / data.length);
      $("meterFill").style.width = Math.min(100, rms * 1.8) + "%";
      if (recorder && recorder.state === "recording") meterFrame = requestAnimationFrame(meter);
    };
    meter();
  } catch (err) {
    $("recordStatus").textContent = "Microphone unavailable. Check browser permission and try again.";
  }
});

$("analyzeBtn").addEventListener("click", async () => {
  if (!voiceBlob) return;
  $("analysis").textContent = "Analyzing the recording in this browser…";
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = await ctx.decodeAudioData(await voiceBlob.arrayBuffer());
    const samples = buffer.getChannelData(0);
    const duration = buffer.duration;
    const windowSize = Math.min(4096, samples.length);
    let crossings = 0;
    for (let i = 1; i < windowSize; i++) if (samples[i - 1] <= 0 && samples[i] > 0) crossings++;
    const roughPitch = Math.round((crossings * buffer.sampleRate) / (2 * windowSize));
    const rms = Math.sqrt(samples.reduce((sum, v) => sum + v * v, 0) / samples.length);
    $("analysisResult").textContent = `Sample duration: ${duration.toFixed(1)} seconds · Average level: ${rms.toFixed(3)} · Rough speech pitch indicator: ${roughPitch} Hz (very approximate)`;
    $("analysis").textContent = "Basic audio measurements complete. These are not a trained voice identity profile or a singing-range assessment.";
    await ctx.close();
  } catch (err) {
    $("analysis").textContent = "This browser could not decode the recording for analysis. You can still replay your sample.";
  }
});

$("generateBtn").addEventListener("click", () => {
  $("generationNote").textContent = "AI singing generation is not connected. No singing audio has been created yet.";
});