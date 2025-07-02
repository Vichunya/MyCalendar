
export function createBulletElement(bulletText) {
    const bulletDiv = document.createElement('div'); //встроенный метод для создания нового элемента
    bulletDiv.textContent = '- ' + bulletText;

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

    const textSpan = document.createElement('span'); // чтобы текст списка был отдельно от чекбокса
    textSpan.textContent = ' ' + bulletText; // раньне на 4 строке ? Из-за этого дублируются ? 

    bulletDiv.appendChild(button); // Добавляе кнопку в div

    // Добавляем чекбокс и текст в div
    bulletDiv.appendChild(checkbox);
    bulletDiv.appendChild(textSpan);

    return bulletDiv;


}


