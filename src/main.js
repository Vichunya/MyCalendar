// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'


// const modal = document.querySelector('.modal');
// const dates = document.querySelectorAll('.dates div');
// console.log(dates);

// dates.forEach(date => {
//   date.addEventListener('click', function (event) {
//     modal.style.display = 'block';
//   })
// });

// const closeButton = document.querySelector('.close'); // закрытие по кнопке 
// closeButton.addEventListener('click', function(event){    // без event тоже работает
//   modal.style.display = 'none';
// });

// modal.addEventListener('click', function(event) {  // работает без forEach // закрытие вне окна
//  if(event.target === modal){
//   modal.style.display = 'none';
//  }
// });


import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

const modal = document.querySelector('.modal');
const dates = document.querySelectorAll('.dates div');
const noteArea = document.getElementById('note-area');
const closeButton = document.querySelector('.close');

// Объект для хранения заметок по дате
const notes = {};

let currentDateKey = ''; // текущий выбранный ключ даты

dates.forEach(date => {
  date.addEventListener('click', function (event) {
    const day = event.target.textContent; // Извлекаем содержимое элемента, на который кликнули //Сохраняем этот текст в переменную day
    console.log(`выбранный день:${day}`);
    if (!day) return; // пропускаем пустые ячейки  

    // Определяем месяц, найдя ближайший предыдущий .month элемент
    const monthElement = event.target.closest('.dates').previousElementSibling.previousElementSibling;//cмотри в структуре div
    console.log(event.target.closest('.dates').previousElementSibling.previousElementSibling);
    const month = monthElement ? monthElement.textContent.trim() : 'Неизвестно';

    // Создаём ключ вида "Июнь 2025-14"
    currentDateKey = `${month}-${day}`;

    // Загружаем заметку, если есть
    const note = localStorage.getItem(currentDateKey); // по ключу вида "Июнь 2025-14"
    noteArea.textContent = note || ''; // обращаемся к ключу currentDateKey объекта notes, и заносим его значение в noteArea

    modal.style.display = 'block';
  });
});

closeButton.addEventListener('click', function () {  // закрытие по кнопке
  saveCurrentNote();  // вызывается ниже, ф-я сохранения заметки 
  modal.style.display = 'none';
});

modal.addEventListener('click', function (event) {   // закрытие вне окна
  if (event.target === modal) {
    saveCurrentNote();
    modal.style.display = 'none';
  }
});

// Сохраняем заметку в объект
function saveCurrentNote() {
  if (currentDateKey) {      // ключ вида "Июнь 2025-14" 
    localStorage.setItem(currentDateKey, noteArea.textContent); // ключ, заметка 
    console.log(`Заметка для ${currentDateKey}:`, notes[currentDateKey]);
  }
}
// КНОПКА ENTER для СПИСКА 
noteArea.addEventListener('keydown', function(event) { // keydown срабатывает при нажатии любой клавиши
  if (event.key === 'Enter') {  // event.key - это встроенное свойство, возвращает название нажатой клавиши
    event.preventDefault(); // Отменяем стандартное поведение (перенос строки)
    
    // Создаём новый элемент списка
    const bullet = document.createElement('div'); // ЗАМЕНИТЬ НАЗВАНИЕ //встроенный метод для создания нового элемента
    bullet.textContent = '• ';
    
    // Вставляем его после текущей строки    //window.getSelection()- или где находится курсор
    const selection = window.getSelection();//window.getSelection()-встр.метод, возвращает текущий выделенный текст
    if (!selection.rangeCount) return; // .rangeCount - диапазон выделения (для чего ?) 
    
    const range = selection.getRangeAt(0);// получаем диапазон или курсор ?
    range.collapse(false); // курсор в конец // сдвигает диапазон в одну точку ? false - сожмётся в конец выделения

    range.insertNode(bullet);// Вставляем в DOM новый div в текущую позицию курсора
 
    // Перемещаем курсор внутрь новой строки
    range.setStart(bullet, 1); //"установить курсор после первого символа"
    range.setEnd(bullet, 1); //(• занимает позицию 0) РАЗОБРАТЬСЯ 
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

// ВЫДЕЛЕНИЕ ДНЯ, ГДЕ ЕСТЬ ЗАМЕТКА
function highlightDaysWithNotes() {
  // Получаем все блоки с датами
  const allDatesBlocks = document.querySelectorAll('.dates');
  
  allDatesBlocks.forEach(datesBlock => {
    // Находим предыдущий элемент с классом month и берем из него месяц
    const monthElement = datesBlock.previousElementSibling.previousElementSibling;
    const month = monthElement ? monthElement.textContent.trim() : 'Неизвестно';

    // Проходимся по всем div с числами внутри блока dates
    datesBlock.querySelectorAll('div').forEach(dayDiv => {
      const day = dayDiv.textContent.trim();
      if (!day) return; // пропускаем пустые ячейки

      const key = `${month}-${day}`;
      const note = localStorage.getItem(key);
      if (note && note.trim() !== '') {
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
saveCurrentNote = function() {
  originalSaveCurrentNote();
  highlightDaysWithNotes();
};
