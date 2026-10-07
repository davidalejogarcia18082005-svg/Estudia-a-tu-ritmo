"use strict";

// Primero obtenemos los elementos de la página que vamos a usar.
const form = document.querySelector("#study-form");
const subjectInput = document.querySelector("#subject");
const minutesInput = document.querySelector("#minutes");
const startTimeInput = document.querySelector("#start-time");
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

// Convierte HH:mm en minutos desde medianoche. Rechaza horas incompletas.
function parseStartTime(value) {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return NaN;
  }
  const parts = value.split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  if (hours > 23 || minutes > 59) {
    return NaN;
  }
  return hours * 60 + minutes;
}

// Suma estudio y pausas a la hora de inicio. No suma el tiempo libre.
function calculateFinishTime(startMinutes, usedMinutes) {
  const totalMinutes = startMinutes + usedMinutes;
  const minutesInDay = totalMinutes % (24 * 60);
  const hours = Math.floor(minutesInDay / 60);
  const minutes = minutesInDay % 60;
  return {
    time: String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0"),
    nextDay: totalMinutes >= 24 * 60
  };
}

function setCurrentStartTime() {
  const now = new Date();
  const value = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  // defaultValue también actualiza la hora que usará el reinicio del formulario.
  startTimeInput.defaultValue = value;
  startTimeInput.value = value;
}

function clearResult() {
  result.hidden = true;
  emptyState.hidden = false;
  timeline.replaceChildren();
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  minutesInput.removeAttribute("aria-invalid");
  startTimeInput.removeAttribute("aria-invalid");
}

function showError(message, input = minutesInput) {
  clearResult();
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  input.setAttribute("aria-invalid", "true");
  input.focus();
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

function showPlan(plan, subject, availableMinutes, startMinutes) {
  clearResult();
  document.querySelector("#plan-subject").textContent = subject;
  document.querySelector("#block-count").textContent = plan.blocks + (plan.blocks === 1 ? " bloque" : " bloques");
  document.querySelector("#study-total").textContent = plan.studyMinutes;
  document.querySelector("#break-total").textContent = plan.breakMinutes;
  document.querySelector("#free-total").textContent = plan.freeMinutes;
  document.querySelector("#summary").textContent = "Tu sesión ocupa " + plan.usedMinutes + " de tus " + availableMinutes + " minutos disponibles.";
  const finish = calculateFinishTime(startMinutes, plan.usedMinutes);
  document.querySelector("#end-time").textContent = finish.time;
  document.querySelector("#end-day").hidden = !finish.nextDay;
  document.querySelector("#finish-context").textContent = "Inicio: " + startTimeInput.value + " · " + plan.usedMinutes + " minutos de sesión";

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

  const startMinutes = parseStartTime(startTimeInput.value);
  if (!Number.isFinite(startMinutes)) {
    showError("Selecciona una hora de inicio válida.", startTimeInput);
    return;
  }

  const plan = calculatePlan(minutes);
  showPlan(plan, subjectInput.value, minutes, startMinutes);
});

// Al cambiar una entrada, ocultamos el plan anterior para evitar confusiones.
minutesInput.addEventListener("input", clearResult);
subjectInput.addEventListener("change", clearResult);
startTimeInput.addEventListener("input", clearResult);
startTimeInput.addEventListener("change", clearResult);
form.addEventListener("reset", function () {
  clearResult();
  setCurrentStartTime();
  minutesInput.focus();
});

setCurrentStartTime();
