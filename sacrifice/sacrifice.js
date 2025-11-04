const canvas = document.getElementById("sacrificeCanvas");
const ctx = canvas.getContext("2d");
const instruction = document.getElementById("instructionOverlay");
const lingerToggle = document.getElementById("linger");
const consentLabel = document.getElementById("consentLabel");
const saveNotice = document.getElementById("saveNotice");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let marks = [];
let lingerData = [];
let firstTouch = false;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// --- User draws marks ---
canvas.addEventListener("mousedown", (e) => {
  if (!firstTouch) {
    firstTouch = true;
    instruction.style.opacity = 0.4; // fade instruction
    setTimeout(() => {
      consentLabel.style.opacity = 1; // reveal consent slowly
    }, 3000);
  }
  createMark(e.clientX, e.clientY);
});

canvas.addEventListener("mousemove", (e) => {
  if (e.buttons === 1) createMark(e.clientX, e.clientY);
});



function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#57395f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  marks.forEach((m) => {
    ctx.globalAlpha = m.alpha;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
    ctx.fillStyle = m.color;
    ctx.fill();
    if (!lingerToggle.checked) m.alpha -= 0.01; // fade out when not linger
  });
ctx.globalAlpha = 1;
  marks = marks.filter((m) => m.alpha > 0);
  requestAnimationFrame(draw);
}

draw();

const toolPanel = document.getElementById("toolPanel");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const userText = document.getElementById("userText");
const sendText = document.getElementById("sendText");

let currentColor = "#d4d6d7";
let currentSize = 30;

lingerToggle.addEventListener("change", () => {
  const checked = lingerToggle.checked;
  console.log("Checkbox status:", checked); // optional debug

  if (checked) {
    saveNotice.classList.remove("hidden");
    saveNotice.style.opacity = 1;
    saveNotice.textContent = "Your traces will remain.";

    toolPanel.classList.add("visible");
  } else {
    saveNotice.style.opacity = 0;
    setTimeout(() => saveNotice.classList.add("hidden"), 800);
    toolPanel.classList.remove("visible");
  }
});



// update brush settings
colorPicker.addEventListener("input", e => currentColor = e.target.value);
brushSize.addEventListener("input", e => currentSize = e.target.value);

// modify your createMark() to use selected color/size
function createMark(x, y) {
  const radius = Number(currentSize);
  const color = hexToRgba(currentColor, 0.4);
  marks.push({ x, y, radius, alpha: 1, color });
  if (lingerToggle.checked) lingerData.push({ x, y, radius, color });
}

// small helper to convert hex → rgba
function hexToRgba(hex, alpha=0.4) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// handle text messages
sendText.addEventListener("click", () => {
  const text = userText.value.trim();
  if (!text) return;

  const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
  const y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;

  ctx.font = "18px Helvetica Neue";
  ctx.fillStyle = currentColor;
  ctx.globalAlpha = 0.8;
  ctx.fillText(text, x, y);
  ctx.globalAlpha = 1;

  if (lingerToggle.checked) lingerData.push({ text, x, y, color: currentColor });
  userText.value = "";
});


// --- Save lingerData before leaving ---
window.addEventListener("beforeunload", () => {
  if (lingerData.length > 0) {
    localStorage.setItem("traces", JSON.stringify(lingerData));
  }
});


// --- Transition + Hint ---

// get both overlay and hint elements
const transitionOverlay = document.getElementById("transitionOverlay");
const transitionHint = document.getElementById("transitionHint");

// show the hint after user draws for the first time
let hintShown = false;
canvas.addEventListener("mouseup", () => {
  if (!hintShown) {
    setTimeout(() => {
      transitionHint.classList.add("visible"); // fade it in
    }, 4000); // 4s after drawing ends
    hintShown = true;
  }
});

// handle Enter key to trigger fade and redirect
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startTransition();
  }
});

function startTransition() {
  transitionOverlay.classList.add("active"); // start fade
  setTimeout(() => {
    window.location.href = "../souvenir/souvenir.html"; // redirect safely
  }, 1800);
}
