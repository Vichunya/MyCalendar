
export function createBulletElement(bulletText) {
    const bulletDiv = document.createElement('div'); //встроенный метод для создания нового элемента
    bulletDiv.textContent = '- ' + bulletText;
    return bulletDiv;

}

