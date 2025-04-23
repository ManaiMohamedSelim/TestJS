const canvas = document.getElementById("canvas");

let startX = 0;
let startY = 0;
let isDrawing = false;
let currentRect = null;

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;

    // Récupère les coordonnées relatives au canvas
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    currentRect = document.createElement("div");
    currentRect.classList.add("rectangle");
    currentRect.style.left = `${startX}px`;
    currentRect.style.top = `${startY}px`;
    currentRect.style.backgroundColor = getRandomColor();

    canvas.appendChild(currentRect);
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing || !currentRect) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = Math.abs(mouseX - startX);
    const height = Math.abs(mouseY - startY);
    const left = Math.min(mouseX, startX);
    const top = Math.min(mouseY, startY);

    currentRect.style.left = `${left}px`;
    currentRect.style.top = `${top}px`;
    currentRect.style.width = `${width}px`;
    currentRect.style.height = `${height}px`;
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    if (currentRect) {
        const width = currentRect.offsetWidth;
        const height = currentRect.offsetHeight;
    
        // Si le rectangle est trop petit, on le retire
        if (width < 5 || height < 5) {
          currentRect.remove();
        }
    
        currentRect = null;
      }
});

// Utilitaire pour générer une couleur aléatoire
function getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}

canvas.addEventListener("dblclick", (e) => {
    const target = e.target;
    if (target.classList.contains("rectangle") && !target.classList.contains("rotating")) {
        target.classList.add("rotating");

        // On attend la fin de l'animation pour supprimer
        target.addEventListener("animationend", () => {
            target.remove();
        }, { once: true }); // { once: true } évite que le listener se déclenche plusieurs fois
    }
});

const repaintBtn = document.getElementById("repaint-btn");

repaintBtn.addEventListener("click", () => {
  const rectangles = Array.from(document.querySelectorAll(".rectangle"));
  if (rectangles.length < 2) return;

  let minDiff = Infinity;
  let bestPair = null;

  // Parcours de toutes les paires
  for (let i = 0; i < rectangles.length - 1; i++) {
    const rect1 = rectangles[i];
    const area1 = rect1.offsetWidth * rect1.offsetHeight;

    for (let j = i + 1; j < rectangles.length; j++) {
      const rect2 = rectangles[j];
      const area2 = rect2.offsetWidth * rect2.offsetHeight;

      const diff = Math.abs(area1 - area2);

      if (diff < minDiff) {
        minDiff = diff;
        bestPair = [rect1, rect2];
      }
    }
  }

  if (bestPair) {
    const newColor = getRandomColor();
    bestPair[0].style.backgroundColor = newColor;
    bestPair[1].style.backgroundColor = newColor;
  }
});
