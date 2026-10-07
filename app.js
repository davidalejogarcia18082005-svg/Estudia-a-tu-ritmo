"use strict";

// Primero obtenemos los elementos de la página que vamos a usar.
const form = document.querySelector("#study-form");
const subjectInput = document.querySelector("#subject");
const minutesInput = document.querySelector("#minutes");
const errorMessage = document.querySelector("#error");
const emptyState = document.querySelector("#empty-state");
const result = document.querySelector("#result");
const timeline = document.querySelector("#timeline");

const STUDY_MINUTES = 25;
const BREAK_MINUTES = 5;

// Contamos sólo los bloques completos que caben en el tiempo disponible.
// El primero necesita 25 minutos; cada siguiente necesita 5 + 25.
function calculatePlan(availableMinutes) {
  let blocks = 0;
  let usedMinutes = 0;

  while (true) {
    const nextCost = STUDY_MINUTES + (blocks > 0 ? BREAK_MINUTES : 0);
    if (usedMinutes + nextCost > availableMinutes) {
      break;
    }
    usedMinutes += nextCost;
    blocks += 1;
  }

  return {
    blocks: blocks,
    studyMinutes: blocks * STUDY_MINUTES,
    breakMinutes: Math.max(0, blocks - 1) * BREAK_MINUTES,
    freeMinutes: availableMinutes - usedMinutes,
    usedMinutes: usedMinutes
  };
}

function clearResult() {
  result.hidden = true;
  emptyState.hidden = false;
  timeline.replaceChildren();
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  minutesInput.removeAttribute("aria-invalid");
}

function showError(message) {
  clearResult();
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  minutesInput.setAttribute("aria-invalid", "true");
  minutesInput.focus();
}

function addTimelineItem(label, duration, isBreak) {
  const item = document.createElement("li");
  const title = document.createElement("strong");
  const time = document.createElement("span");
  title.textContent = label;
  time.textContent = duration + " min";
  if (isBreak) {
    item.classList.add("break");
  }
  item.append(title, time);
  timeline.append(item);
}

function showPlan(plan, subject, availableMinutes) {
  clearResult();
  document.querySelector("#plan-subject").textContent = subject;
  document.querySelector("#block-count").textContent = plan.blocks + (plan.blocks === 1 ? " bloque" : " bloques");
  document.querySelector("#study-total").textContent = plan.studyMinutes;
  document.querySelector("#break-total").textContent = plan.breakMinutes;
  document.querySelector("#free-total").textContent = plan.freeMinutes;
  document.querySelector("#summary").textContent = "Tu sesión ocupa " + plan.usedMinutes + " de tus " + availableMinutes + " minutos disponibles.";

  for (let block = 1; block <= plan.blocks; block += 1) {
    // La pausa se agrega antes del siguiente bloque, nunca al terminar.
    if (block > 1) {
      addTimelineItem("Descanso", BREAK_MINUTES, true);
    }
    addTimelineItem("Bloque " + block + " · Estudio", STUDY_MINUTES, false);
  }

  emptyState.hidden = true;
  result.hidden = false;
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que el formulario recargue la página.
  const rawMinutes = minutesInput.value.trim();
  const minutes = Number(rawMinutes);

  if (rawMinutes === "") {
    showError("Escribe cuántos minutos tienes disponibles.");
    return;
  }
  if (!Number.isInteger(minutes)) {
    showError("Usa un número entero de minutos, sin decimales.");
    return;
  }
  if (minutes < 25) {
    showError("Necesitas al menos 25 minutos para un bloque completo.");
    return;
  }
  if (minutes > 240) {
    showError("Elige hasta 240 minutos para esta sesión.");
    return;
  }

  const plan = calculatePlan(minutes);
  showPlan(plan, subjectInput.value, minutes);
});

// Al cambiar una entrada, ocultamos el plan anterior para evitar confusiones.
minutesInput.addEventListener("input", clearResult);
subjectInput.addEventListener("change", clearResult);
form.addEventListener("reset", function () {
  clearResult();
  minutesInput.focus();
});
