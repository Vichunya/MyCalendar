
export function generateCalendar() {
    const now = new Date(); //вернет текущую дату, встроенная ф-я 
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 - это январь 

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const firstDay = new Date(year, month, 1); // первый день текущего месяца 
    const lastDay = new Date(year, month + 1, 0); // последний день предыдущего месяца, встроенно, 0- всегда last day предыдущего месяца 
    const startDay = (firstDay.getDay() + 6) % 7; // понедельник — 0 // какой день недели выясняем (порядковый номер дня недели)
    console.log('startDay = ' + startDay); // посмотреть ? 

    //  <div class="month"><h1>Июнь 2025</h1></div>
    let html = `<div class="month"> <h2>${monthNames[month]} ${year}</h2></div>`; //это заголовок
    html += `<table border="0"><tr class = "weekdays">`; // good decision // border="0" - рамки у таблицы нет
    for (let dayName of dayNames) {   // 7 titles (7 days) // let объявляет переменную, кот. на каждой итерации содержит след.элемент массива
        html += `<th>${dayName}</th>`;
    }
    //html += `</tr><tr class="dates">`; // close and open next
    html += `</tr><tr class="dates" data-month="${monthNames[month]}" data-year="${year}">`;

    // Пустые ячейки до первого дня 
    for (let i = 0; i < startDay; i++) {
        html += `<td></td>`;
    }

    // Дни месяца  // currentDay - в какой день недели попадает текущая дата (date) т.е. номер дня недели
    for (let date = 1; date <= lastDay.getDate(); date++) { //lastDay.getDate() - последнее число месяца (31 например)
        const currentDay = (startDay + date - 1) % 7; //startDay - номер дня недели, на который приходится 1-е число месяца
        html += `<td>${date}</td>`;
        if (currentDay === 6 && date !== lastDay.getDate()) { // день недели = 6 (суббота) и это не последний день месяца, то close тек.строку и open след.
            html += `</tr><tr class="dates" data-month="${monthNames[month]}" data-year="${year}">`; // новая строка после воскресенья
        }
    }

    html += `</tr></table>`;
    document.getElementById("calendar").innerHTML = html; //.innerHTML = html — вставляет в этот элемент HTML‑код, который хранится в переменной html
} //  в контейнер с id="calendar" загружается весь сгенерированный календарь 