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
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  document.getElementById("calendarTitle").textContent =
    firstDay.toLocaleString("ru-RU", { month: "long", year: "numeric" });

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateStr = date.toISOString().split("T")[0];

    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.textContent = i;

    if (cycleData.startDate) {
      const cycleDay = Math.floor((date - cycleData.startDate) / 86400000);
      const dayInCycle = (cycleDay % cycleData.cycleLength + cycleData.cycleLength) % cycleData.cycleLength;

      if (dayInCycle === 0) dayDiv.classList.add("period");
      if (dayInCycle === cycleData.cycleLength - 14) dayDiv.classList.add("ovulation");
      if (dayInCycle >= cycleData.cycleLength - 18 && dayInCycle <= cycleData.cycleLength - 13)
        dayDiv.classList.add("fertile");

      if (dateStr === selectedDate) dayDiv.classList.add("selected");

      if (dateStr === new Date().toISOString().split("T")[0]) {
        document.getElementById("cycleInfo").textContent =
          `Сегодня ${dayInCycle + 1}-й день цикла`;
      }
    }

    dayDiv.onclick = () => {
      selectedDate = dateStr;
      document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
      dayDiv.classList.add("selected");
      showSymptoms(dateStr);
    };

    calendar.appendChild(dayDiv);
  }
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);
}

function showSymptoms(dateStr) {
  const data = symptomsData[dateStr] || { moods: [], symptoms: [] };
  document.getElementById("selectedDateInfo").textContent = `Дата: ${dateStr}`;

  renderCheckboxes("moods", moodsList, data.moods);
  renderCheckboxes("symptoms", symptomsList, data.symptoms);
}

function renderCheckboxes(containerId, items, selectedItems) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(item => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `${containerId}-${item}`;
    input.value = item;
    input.checked = selectedItems.includes(item);

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = item;

    container.appendChild(input);
    container.appendChild(label);
  });
}

function saveSymptoms() {
  if (!selectedDate) {
    alert("Выберите день в календаре.");
    return;
  }

  const moods = Array.from(document.querySelectorAll("#moods input:checked")).map(i => i.value);
  const symptoms = Array.from(document.querySelectorAll("#symptoms input:checked")).map(i => i.value);

  symptomsData[selectedDate] = { moods, symptoms };
  localStorage.setItem("symptomsData", JSON.stringify(symptomsData));
  showSymptoms(selectedDate);
}

// Инициализация при загрузке
window.onload = () => {
  showRandomFact();
  renderCheckboxes("moods", moodsList, []);
  renderCheckboxes("symptoms", symptomsList, []);
  renderCalendar(currentYear, currentMonth);
};



