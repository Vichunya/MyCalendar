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
noteArea.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Отменяем стандартное поведение (перенос строки)
    
    // Создаём новый элемент списка
    const bullet = document.createElement('div');
    bullet.textContent = '• ';
    
    // Вставляем его после текущей строки
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    range.collapse(false); // курсор в конец

    range.insertNode(bullet);

    // Перемещаем курсор внутрь новой строки
    range.setStart(bullet, 1);
    range.setEnd(bullet, 1);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
