import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'


const modal = document.querySelector('.modal');
const dates = document.querySelectorAll('.dates div');
console.log(dates);

dates.forEach(date => {
  date.addEventListener('click', function (event) {
    modal.style.display = 'block';
  })
});

const closeButton = document.querySelector('.close'); // закрытие по кнопке 
closeButton.addEventListener('click', function(event){    // без event тоже работает
  modal.style.display = 'none';
});

modal.addEventListener('click', function(event) {  // работает без forEach // закрытие вне окна 
 if(event.target === modal){
  modal.style.display = 'none';
 }
});
