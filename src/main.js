
import { generateCalendar, monthNames } from './calendarView.js';
import { createBulletElement, getBulletText, getBulletChecked } from './bulletElement.js';
import { getWeather, getWeatherV2,createCityWeather } from './weather.js';
import {generateSmallCalendar} from './smallCalendarView.js';

// Ссылка на модальное окно и элементы заметок
const modal = document.querySelector('.modal');
const noteArea = document.getElementById('note-area');
const closeButton = document.querySelector('.close');
const noteContent = document.getElementById('notes');//это контейнер (<div id="notes">) внутри модального окна, где хранятся все заметки

let currentDateKey = ''; // Текущая выбранная дата
let currentYear, currentMonth; // Текущий отображаемый год и месяц
let currentDayDiv = null;

// клики на даты для открытия модальных окон
function dateClickHandlers() {

  const dates = document.querySelectorAll('tr.dates td');// все ячейки <td> внутри <tr class="dates">
  dates.forEach(date => {  // dates это даты 
    date.addEventListener('click', function (event) {
      const day = event.target.textContent; // это просто текст, который находится внутри ячейки <td>, по которой кликнули
      if (!day) return; // пустые ячейки, ничего не возвращает  

      const datesRow = event.target.closest('tr.dates');//Находим ближайший родительский <tr> с классом dates — это строка таблицы, для опр-я месяца и года 
      const month = datesRow.dataset.month;
      const year = datesRow.dataset.year;
      currentDateKey = `${month} ${year}-${day}`;// Формируем уникальный ключ для хранения заметок в localStorage

      currentDayDiv = event.target;

      modal.style.display = 'block';

      cleanNote(); // Очищаем старые заметки

      // Загружаем сохранённые заметки (JSON)
      const savedData = localStorage.getItem(currentDateKey);
      const bulletList = savedData ? JSON.parse(savedData) : [];//Если в savedData что-то есть — преврати это из строки JSON в массив объектов

      // Восстанавливаем каждую заметку
      bulletList.forEach(bullet => {

        const bulletElement = createBulletElement(bullet); // только текст

        if (bullet.checked) {
          const textSpan = bulletElement.querySelector('span');
          textSpan.classList.add('done');
        }

        noteContent.appendChild(bulletElement);
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

      togglerHighlight(dayDiv, note);

    });
  });
}

function rerenderCalendarDay() { // для устранения ошибки: день подчеркивался после перещелкивания месяца 
  const note = localStorage.getItem(currentDateKey);// проверяется, есть ли заметка в localStorage
  togglerHighlight(currentDayDiv, note);
}

function togglerHighlight(dayElement, note) {
  if (note && note.length !== 0) {
    dayElement.classList.add('has-note'); // если есть — добавляется класс has-note для подсветки 
  } else {
    dayElement.classList.remove('has-note');
  }
}

// Очищаем заметки из модального окна
function cleanNote() {           //replaceChildren()-удаляет все дочерние элементы внутри noteContent. То есть он очищает всё содержимое блока заметок
  noteContent.replaceChildren();//noteContent — это контейнер со всеми заметками, 
  noteArea.value = ''; //очищает текстовое поле ввода заметки, чтобы оно было пустым при открытии следующей даты
}

// Сохраняем заметки в localStorage
function saveCurrentNote() {
  if (currentDateKey) { // Текущая выбранная дата сurrentDateKey //noteContent контейнер внутри МО, где все заметки хранятся внутри выбранной даты
    const bulletsDivs = noteContent.querySelectorAll('div'); // bulletsDivs — это контейнеры для 1 дня 
    const bulletList = []; // bulletList — это текст всех заметок только одного выбранного дня
    bulletsDivs.forEach(bulletDiv => { // bulletDiv - контейнер для одной заметки //forEach собирает все заметки одного дня в массив bulletList, чтобы их потом сохранить
      const textFromSpan = getBulletText(bulletDiv); // вытаскивает текст 
      const bulletCheck = getBulletChecked(bulletDiv); // возв-т значение чекбокса 

      bulletList.push(
        {
          text: textFromSpan,
          checked: bulletCheck // сохраняем состояние
        }
      ); 
    });

    if (bulletList.length === 0) {
      localStorage.removeItem(currentDateKey);//удаляется запись за текущую дату 
    } else {
      localStorage.setItem(currentDateKey, JSON.stringify(bulletList)); //массив в строку
    } // Это делается, чтобы не хранить пустые записи.
  }
}

// Навешиваем обработчик на кнопку закрытия модального окна
closeButton.addEventListener('click', () => {
  saveCleanNotes();
});

// Закрытие модального окна при клике вне содержимого
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    saveCleanNotes();
  }
});

function saveCleanNotes() {
  saveCurrentNote();
  modal.style.display = 'none';
  cleanNote();
  rerenderCalendarDay();
}

// Кнопка Enter для добавления новой заметки
noteArea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const bullet = { text: noteArea.value, checked: false };
    const bulletDiv = createBulletElement(bullet);
    noteArea.value = '';
    noteContent.appendChild(bulletDiv);
  }
});

// Функция для обновления календаря и навешивания всех обработчиков
function updateCalendar(year, month) {
  // Генерируем календарь и получаем текущие год и месяц
  const res = generateCalendar(year, month);
  console.log(month);
  
  
  currentYear = res.year;
  currentMonth = res.month;
generateSmallCalendar(currentYear,currentMonth-1);
  dateClickHandlers();
  highlightDaysWithNotes();

  // Навешиваем обработчики на кнопки переключения месяцев
  document.getElementById("prev-month").addEventListener("click", choosePrevMonth);

  function choosePrevMonth() {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {  // Если новый месяц стал меньше 0 (т.е. меньше января)
      newMonth = 11; //  Тогда меняем месяц на 11 — это декабрь (в JavaScript месяцы считаются от 0 до 11)
      newYear--;  // И уменьшаем год на 1 — переходим в декабрь предыдущего года
    }
    updateCalendar(newYear, newMonth);
  }

  document.getElementById("next-month").addEventListener("click", chooseNextMonth);

  function chooseNextMonth() {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    updateCalendar(newYear, newMonth);
  }

  return {
    prevmonth: choosePrevMonth,
    nextmonth: chooseNextMonth
  };
}

// Запускаем начальную загрузку календаря
const monthFunctions = updateCalendar();

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

document.addEventListener('touchstart', (e) => { // e — это объект события при срабатывании события touchstart, touchmove, touchend
  const touch = e.touches[0]; // e содержит данные о событии: координаты, целевой элемент, нажатые клавиши 
  startX = touch.clientX;    // touches — это свойство объекта события e // e.touches[0] — первый палец, который касается экрана
  startY = touch.clientY;
});

document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  endX = touch.clientX;
  endY = touch.clientY;
});

document.addEventListener('touchend', () => {
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) { // возвращает абсолютное значение числа (без знака) Math.abs(-5) → 5
    // Горизонтальный свайп
    if (diffX > 50) {
      console.log('Свайп вправо');
      monthFunctions.prevmonth();
    } else if (diffX < -50) {
      console.log('Свайп влево');
      monthFunctions.nextmonth();
    }
  }
});


const weatherContainer = document.getElementById('weatherContainer');

const weatherTbilisiElement = await createCityWeather(41.6941, 44.8337, "Tbilisi");
const tbilisi = weatherTbilisiElement.querySelector('.weatherCity');
tbilisi.classList.add("tbilisi");
weatherContainer.append(weatherTbilisiElement);

const weatherMoscowElement = await createCityWeather(55.7512, 37.6184, "Moscow");
weatherContainer.append(weatherMoscowElement);




const timeNow = await getCurrentTime("Moscow");
const divCurrentTime = document.getElementById("currentTime");
divCurrentTime.innerHTML = timeNow;


// Текущее время 
async function getCurrentTime(city) {
  let currentCityTime = `текущее время в ${city}: `;
  console.log(currentCityTime);
  let url = `https://timeapi.io/api/time/current/zone?timeZone=Europe%2F${city}`;
  console.log(url);
  let response = await fetch(url);
  console.log(response);

  if (response.ok) { // если HTTP-статус в диапазоне 200-299, получаем тело ответа 
    let json = await response.json(); // тело ответа сервера преобразованный в json
    let timeJson = json.dateTime;
    const date = new Date(timeJson);
    const time = date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
    return currentCityTime + time;

  } else {
    alert("Ошибка HTTP: " + response.status);
  }
}




