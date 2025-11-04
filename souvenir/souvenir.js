const canvas = document.getElementById("souvenirCanvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clear");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// pull data saved in Sacrifice
const saved = JSON.parse(localStorage.getItem("traces") || "[]");

let particles = [];
let texts = [];

saved.forEach(t => {
  if (t.text) {
    // text entry
    texts.push({
      text: t.text,
      x: t.x,
      y: t.y,
      color: t.color || "#d4d6d7",
      alpha: 0.9 + Math.random() * 0.1
    });
  } else {
    // mark entry
    particles.push({
      x: t.x,
      y: t.y,
      r: t.radius || 10,
      color: t.color || "rgba(212,214,215,0.6)",
      alpha: 1,
      pulse: Math.random() * Math.PI * 2
    });
  }
});

// gentle pulsing animation
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#10071c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw marks as glowing circles
  particles.forEach(p => {
    p.pulse += 0.02;
    const glow = 0.4 + Math.sin(p.pulse) * 0.3;
    ctx.beginPath();
    ctx.globalAlpha = p.alpha * glow;
    ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });

  // draw text as floating, slowly drifting
  texts.forEach(t => {
    ctx.globalAlpha = t.alpha;
    ctx.font = "18px Helvetica Neue";
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, t.x, t.y);
    t.y -= 0.05; // slight upward drift
    if (t.y < -20) t.y = canvas.height + 20; // loop back
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

draw();


// Redraw (loop back to Sacrifice)
const redrawBtn = document.getElementById("redraw");
redrawBtn.addEventListener("click", () => {
  localStorage.removeItem("traces"); // optional: reset saved data
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "#10071c";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 1.5s ease-in-out";
  document.body.appendChild(overlay);
  setTimeout(() => (overlay.style.opacity = "1"), 50);

  // after fade, redirect back
  setTimeout(() => {
    window.location.href = "../sacrifice/sacrifice.html";
  }, 1600);
});
