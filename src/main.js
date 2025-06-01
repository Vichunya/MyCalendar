import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

const modal = document.querySelector('.modal'); 
const dates = document.querySelectorAll('.dates div');

dates.forEach(date => {
  date.addEventListener('click', () => {
    modal.classList.add('open'); // открываем модалку
  });
});

