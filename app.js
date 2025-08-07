let selectedDate = null;
let cycleData = {};
let symptomsData = JSON.parse(localStorage.getItem("symptomsData")) || {};

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

  renderCalendar(startDate.getFullYear(), startDate.getMonth());
}

function renderCalendar(year, month) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.textContent = i;

    const dateStr = date.toISOString().split("T")[0];

    // Подсветка
    if (isSameDate(date, cycleData.startDate)) {
      dayDiv.classList.add("period");
    }
    if (isSameDate(date, cycleData.nextPeriod)) {
      dayDiv.classList.add("period");
    }
    if (isSameDate(date, cycleData.ovulationDate)) {
      dayDiv.classList.add("ovulation");
    }

    const fertileStart = new Date(cycleData.ovulationDate.getTime() - 4 * 86400000);
    const fertileEnd = new Date(cycleData.ovulationDate.getTime() + 1 * 86400000);
    if (date >= fertileStart && date <= fertileEnd) {
      dayDiv.classList.add("fertile");
    }

    // Выбор дня
    dayDiv.onclick = () => {
      selectedDate = dateStr;
      document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
      dayDiv.classList.add("selected");
      showSymptoms(dateStr);
    };

    calendar.appendChild(dayDiv);
  }
}

function isSameDate(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function saveSymptoms() {
  if (!selectedDate) {
    alert("Выберите дату в календаре.");
    return;
  }

  const mood = document.getElementById("mood").value;
  const symptom = document.getElementById("symptom").value;

  symptomsData[selectedDate] = { mood, symptom };
  localStorage.setItem("symptomsData", JSON.stringify(symptomsData));
  showSymptoms(selectedDate);
}

function showSymptoms(dateStr) {
  const data = symptomsData[dateStr];
  const info = document.getElementById("selectedDateInfo");

  if (data) {
    info.textContent = `Дата: ${dateStr} — Настроение: ${data.mood}, Симптомы: ${data.symptom}`;
  } else {
    info.textContent = `Дата: ${dateStr} — Нет данных`;
  }
}


