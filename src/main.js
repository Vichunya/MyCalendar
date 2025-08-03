
import { generateCalendar, monthNames } from './calendarView.js';
import { createBulletElement, getBulletText } from './bulletElement.js';

// Ссылка на модальное окно и элементы заметок
const modal = document.querySelector('.modal');
const noteArea = document.getElementById('note-area');
const closeButton = document.querySelector('.close');
const noteContent = document.getElementById('notes');//это контейнер (<div id="notes">) внутри модального окна, где хранятся все заметки

let currentDateKey = ''; // Текущая выбранная дата
let currentYear, currentMonth; // Текущий отображаемый год и месяц

// Объект для хранения заметок в localStorage — не нужен, т.к. используем localStorage напрямую ? 

// клики на даты для открытия модальных окон
function dateClickHandlers() {

  const dates = document.querySelectorAll('tr.dates td');// все ячейки <td> внутри <tr class="dates">
  dates.forEach(date => {  // dates это даты 
    date.addEventListener('click', function (event) {
      const day = event.target.textContent; // это просто текст, который находится внутри ячейки <td>, по которой кликнули
      if (!day) return; // пустые ячейки 

      const datesRow = event.target.closest('tr.dates');//Находим ближайший родительский <tr> с классом dates — это строка таблицы, для опр-я месяца и года 
      const month = datesRow.dataset.month;
      const year = datesRow.dataset.year;
      currentDateKey = `${month} ${year}-${day}`;// Формируем уникальный ключ для хранения заметок в localStorage

      modal.style.display = 'block';

      cleanNote(); // Очищаем старые заметки

      const bulletString = localStorage.getItem(currentDateKey);//Загружаем сохранённую строку заметок из localStorage по ключу для этой даты
      const bulletList = bulletString ? bulletString.split(",") : [];//Если что-то сохранено — превращаем строку в массив по запятым. Если нет — используем пустой массив 

      bulletList.forEach(bullet => { // Перебираем каждую строку из массива bulletList, В переменной bullet на каждой итерации будет один текст заметки
        const bulletElement = createBulletElement(bullet); //на основе текста заметки создать готовый DOM-элемент с чекбоксом, текстом и кнопкой закрытия
        noteContent.appendChild(bulletElement);// вставляет новый элемент в конец контейнера
      });
    });
  });
}

// Подсвечиваем дни с заметками
function highlightDaysWithNotes() {
  const allDatesBlocks = document.querySelectorAll('.dates'); //allDatesBlocks список всех блоков с неделями (каждая неделя — один <tr class="dates">)
  allDatesBlocks.forEach(datesBlock => { // datesBlock — одна неделя (строка) с 7 днями
    const month = datesBlock.dataset.month;
    const year = datesBlock.dataset.year;

    datesBlock.querySelectorAll('td').forEach(dayDiv => {  // dayDiv - один день. 
      const day = dayDiv.textContent.trim(); //убирает пробелы 
      if (!day) return;

      const key = `${month} ${year}-${day}`; // по каждому дню формируется ключ для заметок (key)
      const note = localStorage.getItem(key);// проверяется, есть ли заметка в localStorage
      if (note && note.length !== 0) {
        dayDiv.classList.add('has-note'); // если есть — добавляется класс has-note для подсветки 
      } else {
        dayDiv.classList.remove('has-note');
      }
    });
  });
}

// Очищаем заметки из модального окна
function cleanNote() {           //replaceChildren()-удаляет все дочерние элементы внутри noteContent. То есть он очищает всё содержимое блока заметок
  noteContent.replaceChildren();//noteContent — это контейнер со всеми заметками, 
  noteArea.value = ''; //очищает текстовое поле ввода заметки, чтобы оно было пустым при открытии следующей даты
}

// Сохраняем заметки в localStorage
function saveCurrentNote() {
  if (currentDateKey) {
    const bulletsDivs = noteContent.querySelectorAll('div'); // bulletsDivs — это контейнеры для 1 дня
    const bulletList = [];
    bulletsDivs.forEach(bulletDiv => { // bulletDiv - контейнер для одной заметки 
      const textFromSpan = getBulletText(bulletDiv);
      bulletList.push(textFromSpan); // bulletList — это текст всех заметок только одного выбранного дня
    });
    localStorage.setItem(currentDateKey, bulletList);
  }
}

// Навешиваем обработчик на кнопку закрытия модального окна
closeButton.addEventListener('click', () => {
  saveCurrentNote();
  modal.style.display = 'none';
  cleanNote();
});

// Закрытие модального окна при клике вне содержимого
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    saveCurrentNote();
    modal.style.display = 'none';
    cleanNote();
  }
});

// Кнопка Enter для добавления новой заметки
noteArea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const bulletDiv = createBulletElement(noteArea.value);
    noteArea.value = '';
    noteContent.appendChild(bulletDiv);
  }
});

// Функция для обновления календаря и навешивания всех обработчиков
function updateCalendar(year, month) {
  // Генерируем календарь и получаем текущие год и месяц
  const res = generateCalendar(year, month);
  currentYear = res.year;
  currentMonth = res.month;

  dateClickHandlers();
  highlightDaysWithNotes();

  // Навешиваем обработчики на кнопки переключения месяцев
  document.getElementById("prev-month").addEventListener("click", () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {  // Если новый месяц стал меньше 0 (т.е. меньше января)
      newMonth = 11; //  Тогда меняем месяц на 11 — это декабрь (в JavaScript месяцы считаются от 0 до 11)
      newYear--;  // И уменьшаем год на 1 — переходим в декабрь предыдущего года
    }
    updateCalendar(newYear, newMonth);
  });

  document.getElementById("next-month").addEventListener("click", () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    updateCalendar(newYear, newMonth);
  });
}

// Запускаем начальную загрузку календаря
updateCalendar();

