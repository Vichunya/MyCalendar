
export function createBulletElement(bulletText) {
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

    const textSpan = document.createElement('span'); // чтобы текст списка был отдельно от чекбокса // QUESTION bulletText
    textSpan.textContent = bulletText; 

    // Добавляем чекбокс и текст в div
    bulletDiv.appendChild(checkbox);
    bulletDiv.appendChild(textSpan);
    bulletDiv.appendChild(button); // Добавляе кнопку в div

    return bulletDiv; // а если не без return ? 
}

export function getBulletText(bulletDiv) { // для получения текста заметки //bulletDiv - одна заметка — это один блок с текстом, чекбоксом и кнопкой удаления
    const span = bulletDiv.querySelector('span'); // Находит внутри bulletDiv первый тег <span>
    return span.textContent; // Возвращает текстовое содержимое этого <span>
}


