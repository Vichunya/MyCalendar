
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
    const lastDay = new Date(year, month + 1, 0); // последний день предыдущего месяца, встроенно, 0- всегда last day
    const startDay = (firstDay.getDay() + 6) % 7; // понедельник — 0 // какой день недели выясняем (порядковый номер дня недели)
  console.log('startDay = ' + startDay); // посмотреть !!!! 

    let html = `<h2>${monthNames[month]} ${year}</h2>`; //это строка ? 
    html += `<table border="0"><tr>`; // good decision // border="0" - рамки у таблицы нет
    for (let dayName of dayNames) {   // 7 titles (7 days)
      html += `<th>${dayName}</th>`;
    }
    html += `</tr><tr>`; // close and open next
  
    // Пустые ячейки до первого дня 
    for (let i = 0; i < startDay; i++) {
      html += `<td></td>`;
    }
  
    // Дни месяца  // currentDay - в какой день недели попадает текущая дата (date) т.е. номер дня недели ? 
    for (let date = 1; date <= lastDay.getDate(); date++) { //lastDay.getDate() - последнее число месяца (31 например)
      const currentDay = (startDay + date - 1) % 7; //startDay - номер дня недели, на который приходится 1-е число месяца
      html += `<td>${date}</td>`;
      if (currentDay === 6 && date !== lastDay.getDate()) {
        html += `</tr><tr>`; // новая строка после воскресенья
      }
    }
  
    html += `</tr></table>`;
    document.getElementById("calendar").innerHTML = html;
  }