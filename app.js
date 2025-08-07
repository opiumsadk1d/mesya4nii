let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let cycleData = {};
let symptomsData = JSON.parse(localStorage.getItem("symptomsData")) || {};

const moodsList = [
  "Радость", "Тревога", "Раздражение", "Грусть", "Спокойствие",
  "Усталость", "Вдохновение", "Апатия", "Стресс", "Уверенность"
];

const symptomsList = [
  "Боль", "Вздутие", "Головная боль", "Усталость", "Тошнота",
  "Чувствительность груди", "Акне", "Перепады настроения", "Бессонница", "Тяга к сладкому"
];

const facts = [
  "Средняя длина менструального цикла — 28 дней.",
  "Овуляция обычно происходит за 14 дней до начала месячных.",
  "Фертильное окно длится около 5 дней.",
  "Сильные боли могут быть признаком эндометриоза.",
  "Гормоны влияют на настроение в течение цикла.",
  "Физическая активность может облегчить симптомы ПМС.",
  "Питание влияет на гормональный баланс.",
  "Цикл может меняться из-за стресса и сна.",
  "Менструация — естественный процесс, а не болезнь.",
  "У некоторых женщин цикл может быть 21 или 35 дней — это тоже норма."
];

function showRandomFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("factText").textContent = fact;
}

function calculateCycle() {
  const startDate = new Date(document.getElementById("startDate").value);
  const cycleLength = parseInt(document.getElementById("cycleLength").value);

  if (isNaN(startDate.getTime()) || isNaN(cycleLength)) {
    alert("Введите корректные данные.");
    return;
  }

  cycleData = {
    startDate,
    cycleLength,
    ovulationDate: new Date(startDate.getTime() + (cycleLength - 14) * 86400000),
    nextPeriod: new Date(startDate.getTime() + cycleLength * 86400000),
  };

  renderCalendar(currentYear, currentMonth);
}

function renderCalendar(year, month) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 



