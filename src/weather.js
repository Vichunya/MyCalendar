
const cardTemplate = document.getElementById('cityTemplate');
const content = cardTemplate.content;

export async function createCityWeather(latitude, longitude, city) {
    const cardCopy = content.cloneNode(true);
    const cardTitle = cardCopy.getElementById('titleForecast');
    const cardCity = cardCopy.getElementById('city');
    cardCity.innerHTML = city;
    //  вызвать метод getWeatherV2 
    const forecast = await getWeatherV2(latitude, longitude, city);

    // найти все элементы погоды в темплейт 1,2,3
    const hour1 = cardCopy.querySelector('#hour_1');
    const hour2 = cardCopy.querySelector('#hour_2');
    const hour3 = cardCopy.querySelector('#hour_3');

    // в inner html дивов засунуть каждое соответствующее значение результатов работы функции getWeatherV2 (1-е значение массива, 2-е и 3-е)
    hour1.textContent = forecast[0];
    hour2.textContent = forecast[1];
    hour3.textContent = forecast[2];

    // не забыть про await в main.js 
    return cardCopy;
}

export async function getWeatherV2(latitude, longitude, city) {

    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise&hourly=temperature_2m,rain&timezone=Europe%2FMoscow&forecast_days=2`;
    let response = await fetch(url);
    let weatherForecast = [];
    if (response.ok) { // если HTTP-статус в диапазоне 200-299, получаем тело ответа 
        let json = await response.json(); // тело ответа сервера преобразованный в json
        let hourly = json.hourly; // hourly-это объект (время, темпер., дожди) 
        console.log(hourly);
        let temperature = hourly.temperature_2m;
        let time = hourly.time;
        let rain = hourly.rain;
        let daily = json.daily; // для рассвета 
        let sunrise = daily.sunrise;

        let currentTime = new Date();
        console.log(currentTime.getHours());
        let currentHours = currentTime.getHours();

        for (let i = 0; i < 3; i++) {
            const formattedTime = time[currentHours + i].replace("T", " ");
            weatherForecast.push(`${formattedTime} ${temperature[currentHours + i]}° ${rain[currentHours + i]}mm`);
        }
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
    return weatherForecast;
}









export async function getWeather(latitude, longitude, city) {

    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise&hourly=temperature_2m,rain&timezone=Europe%2FMoscow&forecast_days=2`;
    let response = await fetch(url);
    let weatherForecast = `прогноз погоды на 3 часа в ${city}: `;
    if (response.ok) { // если HTTP-статус в диапазоне 200-299, получаем тело ответа 
        let json = await response.json(); // тело ответа сервера преобразованный в json
        let hourly = json.hourly; // hourly-это объект (время, темпер., дожди) 
        console.log(hourly);
        let temperature = hourly.temperature_2m;
        let time = hourly.time;
        let rain = hourly.rain;
        let daily = json.daily; // для рассвета 
        let sunrise = daily.sunrise;

        let currentTime = new Date();
        console.log(currentTime.getHours());
        let currentHours = currentTime.getHours();

        for (let i = 0; i < 3; i++) {
            const formattedTime = time[currentHours + i].replace("T", " ");
            weatherForecast += `${formattedTime} ${temperature[currentHours + i]}° ${rain[currentHours + i]}mm<br>`;
        }
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
    return weatherForecast;
}






