
// Массив с названиями месяцев
const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

// Массив с названиями дней недели
const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Экспортируем переменные, чтобы можно было их использовать в main.js
export { monthNames, dayNames };  // dayNames ? 

// Генерация календаря по году и месяцу
export function generateCalendar(year, month) {
    // Если не передали год/месяц, используем текущие
    const now = new Date(); // Создаём объект now, который содержит текущую дату и время
    if (year === undefined) year = now.getFullYear();// Если параметр year не передан (то есть undefined), устанавливаем его равным текущему году из now
    if (month === undefined) month = now.getMonth();

    const firstDay = new Date(year, month, 1); // Первый день месяца
    const lastDay = new Date(year, month + 1, 0); // Последний день месяца
    const startDay = (firstDay.getDay() + 6) % 7; // Понедельник = 0

    // Создаем заголовок с месяцем и годом, добавляем стрелки для переключения
    let html = `
    <div class="month">
      <button id="prev-month" aria-label="Предыдущий месяц">⬅</button> 
      <h2>${monthNames[month]} ${year}</h2>
      <button id="next-month" aria-label="Следующий месяц">➡</button>
    </div>
    `;

    html += `<table border="0"><tr class="weekdays">`;

    // Заголовки дней недели
    for (let dayName of dayNames) {
        html += `<th>${dayName}</th>`;
    }
    html += `</tr><tr class="dates" data-month="${monthNames[month]}" data-year="${year}">`;

    // Пустые ячейки до первого дня месяца
    for (let i = 0; i < startDay; i++) {
        html += `<td></td>`;
    }

    // Заполняем дни месяца
    for (let date = 1; date <= lastDay.getDate(); date++) {
        const currentDay = (startDay + date - 1) % 7;
        html += `<td>${date}</td>`;
        if (currentDay === 6 && date !== lastDay.getDate()) {
            html += `</tr><tr class="dates" data-month="${monthNames[month]}" data-year="${year}">`;
        }
    }

    html += `</tr></table>`;

    // Вставляем сгенерированный календарь в контейнер
    document.getElementById("calendar").innerHTML = html;

    // Возвращаем текущий год и месяц для дальнейшего использования
    return { year, month };
}
