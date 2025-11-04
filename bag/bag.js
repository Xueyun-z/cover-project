const video = document.getElementById("webcam");
const canvas = document.getElementById("filtered");
const ctx = canvas.getContext("2d");
const continueBtn = document.getElementById("continueBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((stream) => {
    video.srcObject = stream;
    animate();
  })
  .catch((err) => console.error("Webcam access denied:", err));

function animate() {
  // draw current frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // heavy pixelation
  const step = 40; // bigger step = more abstraction
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const i = (y * canvas.width + x) * 4;
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      ctx.fillStyle = `rgba(${r},${g},${b},0.9)`; // more opaque
      ctx.fillRect(x, y, step, step);
    }
  }

  // add gentle breathing blur veil
  const t = Date.now() * 0.001;
  const pulse = 0.25 + Math.sin(t) * 0.1;
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.8
  );
  gradient.addColorStop(0, `rgba(0,0,0,${0.25 + pulse})`);
  gradient.addColorStop(1, `rgba(0,0,0,${0.5 + pulse})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(animate);
}

// fade out and move to instructions
continueBtn.addEventListener("click", () => {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "#000";
  overlay.style.opacity = 0;
  overlay.style.transition = "opacity 1.5s ease-in-out";
  document.body.appendChild(overlay);
  setTimeout(() => (overlay.style.opacity = 1), 50);
  setTimeout(() => {
  window.location.href = "../instruction.html";
}, 1600);

});
