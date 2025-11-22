export async function getWeather(latitude, longitude) {
const weatherForecast = document.querySelector('.weather');
//console.log("weatherForecast:" + weatherForecast);
let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise&hourly=temperature_2m,rain&timezone=Europe%2FMoscow&forecast_days=2`;
let response = await fetch(url);
if (response.ok) { // если HTTP-статус в диапазоне 200-299
  // получаем тело ответа (см. про этот метод ниже)
  let json = await response.json(); // тело ответа сервера преобразованный в json
  let hourly = json.hourly; // hourly-это объект (время, темпер., дожди) 
  console.log(hourly);
  let temperature = hourly.temperature_2m;

  let time = hourly.time;
  let rain = hourly.rain;
  let daily = json.daily;
  let sunrise = daily.sunrise;

  let currentTime = new Date();
  console.log(currentTime.getHours());
  let currentHours = currentTime.getHours();
  //let stringForecast = `прогноз погоды: ${time[currentHours]} ${temperature[currentHours]}° ${rain[currentHours]}mm`;

  weatherForecast.innerHTML = "прогноз погоды: ";
  for (let i = 0; i < 3; i++) {
    //console.log(weatherForecast.innerHTML);
    const formattedTime = time[currentHours + i].replace("T", " ");
    weatherForecast.innerHTML += `${formattedTime} ${temperature[currentHours + i]}° ${rain[currentHours + i]}mm<br>`;
  }
} else {
  alert("Ошибка HTTP: " + response.status);
}

}

getWeather(41.6941, 44.8337);





