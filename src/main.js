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
    const day = event.target.textContent;
    if (!day) return; // пропускаем пустые ячейки

    // Определяем месяц, найдя ближайший предыдущий .month элемент
    const monthElement = event.target.closest('.dates').previousElementSibling.previousElementSibling;
    const month = monthElement ? monthElement.textContent.trim() : 'Неизвестно';

    // Создаём ключ вида "Июнь 2025-14"
    currentDateKey = `${month}-${day}`;

    // Загружаем заметку, если есть
    noteArea.textContent = notes[currentDateKey] || '';

    modal.style.display = 'block';
  });
});

closeButton.addEventListener('click', function () {
  saveCurrentNote();
  modal.style.display = 'none';
});

modal.addEventListener('click', function (event) {
  if (event.target === modal) {
    saveCurrentNote();
    modal.style.display = 'none';
  }
});

// Сохраняем заметку в объект
function saveCurrentNote() {
  if (currentDateKey) {
    notes[currentDateKey] = noteArea.textContent;
    console.log(`Заметка для ${currentDateKey}:`, notes[currentDateKey]);
  }
}
