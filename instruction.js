const instructionText = document.getElementById("instructionText");

// Your list of instructions (you can tweak wording later)
const instructions = [
  "Close your eyes for three seconds.",
  "Breathe until the word disappears.",
  "Think of someone you love and imagine light passing through them.",
  "Listen to the silence between your thoughts.",
  "Imagine peace."
];

let index = 0;

// Fade-in overlay disappears smoothly at load
window.addEventListener("load", () => {
  const overlay = document.getElementById("fadeOverlay");
  overlay.style.animation = "fadeOut 2s ease forwards";
  setTimeout(showInstruction, 1500);
});

function showInstruction() {
  instructionText.textContent = instructions[index];
  fadeIn(instructionText);
}

// Cycle through each instruction
window.addEventListener("click", () => {
  fadeOut(instructionText, () => {
    index++;
    if (index < instructions.length) {
      instructionText.textContent = instructions[index];
      fadeIn(instructionText);
    } else {
      // Transition to sacrifice page after last instruction
      fadeOut(instructionText, () => {
        window.location.href = "sacrifice/sacrifice.html";
      });
    }
  });
});

// Helper fade functions
function fadeIn(element) {
  element.style.opacity = 0;
  element.style.transition = "opacity 2s ease";
  requestAnimationFrame(() => {
    element.style.opacity = 1;
  });
}

function fadeOut(element, callback) {
  element.style.opacity = 1;
  element.style.transition = "opacity 1.5s ease";
  element.style.opacity = 0;
  setTimeout(callback, 1500);
}

