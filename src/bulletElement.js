
export function createBulletElement(bullet) {
    const bulletDiv = document.createElement('div'); //встроенный метод для создания нового элемента

    const button = document.createElement('button');
    button.textContent = '❌';
    button.style.marginLeft = '10px';

    // обработчик нажатия на кнопку для удаления элемента 
    button.addEventListener('click', () => {
        bulletDiv.remove(); // Удаляем сам div с кнопкой и текстом
    });

    // ЧЕКБОКС 
    const checkbox = document.createElement('input'); // Создаём чекбокс
    checkbox.type = 'checkbox'; // Указываем тип
    checkbox.checked = bullet.checked;//bullet.checked для сохранения галочки после закрытия //устанавливает это состояние в интерфейсе при загрузке

    const textSpan = document.createElement('span'); // чтобы текст списка был отдельно от чекбокса // QUESTION bulletText
    textSpan.textContent = bullet.text;

    // Хендлер для зачеркивания текста
    checkbox.addEventListener('change', () => { // change - показывает на изменение состояния  
        if (checkbox.checked) {  //.checked это встроенное свойство для <input type="checkbox"> 
            textSpan.classList.add('done'); // добавляем класс зачеркивания 
        } else {
            textSpan.classList.remove('done'); // убираем класс зачеркивания 
        }
    });

    // Добавляем чекбокс и текст в div
    bulletDiv.appendChild(checkbox);
    bulletDiv.appendChild(textSpan);
    bulletDiv.appendChild(button); // Добавляе кнопку в div

    return bulletDiv; // а если без return, тогда ничего не будет   
}

export function getBulletText(bulletDiv) { // для получения текста заметки //bulletDiv - одна заметка — это один блок с текстом, чекбоксом и кнопкой
    const span = bulletDiv.querySelector('span'); // Находит внутри bulletDiv первый тег <span>
    return span.textContent; // Возвращает текстовое содержимое этого <span>
}


