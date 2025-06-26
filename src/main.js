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
const modalContent = document.getElementById('modalContent');

// Объект для хранения заметок по дате
const notes = {};

let currentDateKey = ''; // текущий выбранный ключ даты

dates.forEach(date => {
  date.addEventListener('click', function (event) {
    const day = event.target.textContent; // Извлекаем содержимое элемента, на который кликнули //Сохраняем этот текст в переменную day
    console.log(`выбранный день:${day}`);
    if (!day) return; // пропускаем пустые ячейки  

    // Определяем МЕСЯЦ, найдя ближайший предыдущий .month элемент
    const monthElement = event.target.closest('.dates').previousElementSibling.previousElementSibling;//cмотри в структуре div
    console.log(event.target.closest('.dates').previousElementSibling.previousElementSibling);
    const month = monthElement ? monthElement.textContent.trim() : 'Неизвестно';

    // Создаём ключ вида "Июнь 2025-14"  
    currentDateKey = `${month}-${day}`;

    // Загружаем заметку, если есть
    const bulletString = localStorage.getItem(currentDateKey); // по ключу вида "Июнь 2025-14", получает данные
    const bulletList = bulletString ? bulletString.split(","): []; // если есть строка bulletString, то тогда ее нужно разделить запятыми, если нет, то тогда вернуть пустой список
                                                         
    
    bulletList.forEach(bullet => {
      const bulletElement = document.createElement('div'); //встроенный метод для создания нового элемента
      bulletElement.textContent = bullet; // значение переменной bullet записывается в перем.bulletElement ? 
      
      modalContent.appendChild(bullet); // вставляет элемент в конец 
    });



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
    const bullets = modalContent.querySelectorAll('div');//нашли все буллеты " - " или дни (div) ? 
    const bulletList = []; //сделали пустой список 
    bullets.forEach(bullet => {
      bulletList.push(bullet.textContent);  // заполнили список //метод массива, который добавляет новый элемент в конец массива.
    }); // добавляет в массив bulletList текстовое содержимое элемента bullet  
    localStorage.setItem(currentDateKey, bulletList); // ключ, cохранили в список //установка значения ? 
    console.log(`Заметка для ${currentDateKey}:`, notes[currentDateKey]);
  }
}
// КНОПКА ENTER для СПИСКА 
noteArea.addEventListener('keydown', function(event) { // keydown срабатывает при нажатии любой клавиши
  if (event.key === 'Enter') {  // event.key - это встроенное свойство, возвращает название нажатой клавиши
    event.preventDefault(); // Отменяем стандартное поведение (перенос строки)
    
    // Создаём новый элемент списка
    const bullet = document.createElement('div'); //встроенный метод для создания нового элемента
    bullet.textContent = '- ' + noteArea.value;//встраиваем в bullet значение noteArea предварительно поставив "-"
    noteArea.value = '';// очищаем область 
    
    modalContent.appendChild(bullet);//вставляем значение нового bullet в конец 
  }
});

// ВЫДЕЛЕНИЕ ДНЯ, ГДЕ ЕСТЬ ЗАМЕТКА
function highlightDaysWithNotes() {
  // Получаем все блоки с датами
  const allDatesBlocks = document.querySelectorAll('.dates');
  
  allDatesBlocks.forEach(datesBlock => {  // 2 блока по 30 дней 
    // Находим предыдущий элемент с классом month и берем из него месяц // ?? 
    const monthElement = datesBlock.previousElementSibling.previousElementSibling; // найдет каждый месяц 
    const month = monthElement ? monthElement.textContent.trim() : 'Неизвестно';

    // Проходимся по всем div с числами внутри блока dates // бежит по каждому из блоков (их 2)
    datesBlock.querySelectorAll('div').forEach(dayDiv => {
      const day = dayDiv.textContent.trim();   //dayDiv - один день (один div)
      if (!day) return; // пропускаем пустые ячейки

      const key = `${month}-${day}`;
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
saveCurrentNote = function() {
  originalSaveCurrentNote();
  highlightDaysWithNotes();
};
