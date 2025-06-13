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


