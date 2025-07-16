
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { createBulletElement, getBulletText } from "./bulletElement.js"
import { generateCalendar } from "./calendarView.js"

generateCalendar();
const modal = document.querySelector('.modal');
const dates = document.querySelectorAll('tr.dates td');
const noteArea = document.getElementById('note-area');
const closeButton = document.querySelector('.close');
const noteContent = document.getElementById('notes');

// Объект для хранения заметок по дате 
const notes = {};

let currentDateKey = ''; // текущий выбранный ключ даты

console.log(dates);
dates.forEach(date => { // навешивает на все даты клик 
  date.addEventListener('click', function (event) {
    const day = event.target.textContent; // Извлекаем содержимое элемента, на который кликнули 
    console.log(`выбранный день:${day}`);
    if (!day) return; // пропускаем пустые ячейки  

    //Определяем МЕСЯЦ 
    // const monthElement = event.target.closest('.dates').previousElementSibling.previousElementSibling;//cмотри в структуре div
    //сonsole.log(event.target.closest('.dates').previousElementSibling.previousElementSibling);
    //const month = monthElement ? monthElement.textContent.trim() : 'Неизвестно';
    const datesRow = event.target.closest('tr.dates');
    const month = datesRow.dataset.month;
    const year = datesRow.dataset.year;
    currentDateKey = `${month} ${year}-${day}`;



    // Создаём ключ вида "Июнь 2025-14"  
   
    modal.style.display = 'block';
    // Загружаем заметку, если есть
    const bulletString = localStorage.getItem(currentDateKey); // по ключу вида "Июнь 2025-14", получает данные
    const bulletList = bulletString ? bulletString.split(",") : []; // если есть строка bulletString, то тогда ее нужно разделить запятыми, если нет, то тогда вернуть пустой список

    bulletList.forEach(bullet => {
      const bulletElement = createBulletElement(bullet);  // вызываем функцию с текстом bullet
      noteContent.appendChild(bulletElement);            // вставляем элемент
    });


  });
});

closeButton.addEventListener('click', function () {  // ЗАКРЫТИЕ по кнопке
  saveCurrentNote();  // вызывается ниже, ф-я сохранения заметки 
  modal.style.display = 'none';
  cleanNote(); // очищение содержимого заметки 
});

modal.addEventListener('click', function (event) {   // ЗАКРЫТИЕ вне окна
  if (event.target === modal) {
    saveCurrentNote();
    modal.style.display = 'none';
    cleanNote();
  }
});

// Сохраняем заметку в объект
function saveCurrentNote() {
  if (currentDateKey) {      // ключ вида "Июнь 2025-14" 
    const bulletsDivs = noteContent.querySelectorAll('div');//нашли все divs внутри блока с заметками
    console.log(`Текст для ${bulletsDivs}`); 

    const bulletList = []; //сделали пустой список 
    bulletsDivs.forEach(bulletDiv => {
      console.log('текущее содержимое' + bulletDiv.textContent);

      const textFromSpan = getBulletText(bulletDiv);

      bulletList.push(textFromSpan);
    }); // добавляет в массив bulletList текстовое содержимое элемента bulletDiv  
    localStorage.setItem(currentDateKey, bulletList); // cохраняются записи по каждой дате currentDateKey
    console.log(`Заметка для ${currentDateKey}:`, notes[currentDateKey]);
  }
}

// Очищение содержимого заметок 
function cleanNote() {
  noteContent.replaceChildren();

}

// КНОПКА ENTER для СПИСКА 
noteArea.addEventListener('keydown', function (event) { // keydown срабатывает при нажатии любой клавиши
  if (event.key === 'Enter') {  // event.key - это встроенное свойство, возвращает название нажатой клавиши
    event.preventDefault(); // Отменяем стандартное поведение (перенос строки)

    // Создаём новый элемент списка
    const bulletDiv = createBulletElement(noteArea.value); // то, что вернулось (див с текстом, может быть и кнопка, и чекбокс)

    noteArea.value = '';// очищаем инпут 

    noteContent.appendChild(bulletDiv);//вставляем значение нового bulletDiv в конец 

  }
});

// ВЫДЕЛЕНИЕ ДНЯ, ГДЕ ЕСТЬ ЗАМЕТКА
function highlightDaysWithNotes() {
  // Получаем все блоки с датами
  const allDatesBlocks = document.querySelectorAll('.dates');
  

  allDatesBlocks.forEach(datesBlock => {  // 2 блока по 30 дней 

    const month = datesBlock.dataset.month;
    const year = datesBlock.dataset.year;
    console.log(`БЛОК С ДНЯМИ ${datesBlock}`);


    // Проходимся по всем div с числами внутри блока dates // бежит по каждому из блоков (их 2)
    datesBlock.querySelectorAll('td').forEach(dayDiv => {  // запись querySelector - уточнить ? 
      console.log(`ДЕНЬ ${dayDiv}`);
      const day = dayDiv.textContent.trim();   //dayDiv - один день (один div)
      if (!day) return; // пропускаем пустые ячейки

      const key = `${month} ${year}-${day}`;
      const note = localStorage.getItem(key);
      if (note && note.length !== 0) {  // если есть заметка и она непустая 
        dayDiv.classList.add('has-note'); // добавляем класс
      } else {
        dayDiv.classList.remove('has-note'); // на всякий случай убираем класс если заметки нет
      }
    });
  });
}

// Вызываем функцию сразу после загрузки
highlightDaysWithNotes();

// А также можно вызывать её после сохранения заметки
// Для этого можно обернуть saveCurrentNote так:

const originalSaveCurrentNote = saveCurrentNote;
saveCurrentNote = function () {
  originalSaveCurrentNote();
  highlightDaysWithNotes(); // ф-я выделения дня, где есть заметка 
};

