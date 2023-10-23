import { getWeatherIconName } from "./getWeatherIcon.js";

const currentWeatherIcon = document.querySelector("#current-weather-icon");
const currentTemp = document.querySelector("#current-temp");
const currentPrecipitation = document.querySelector("#current-precipitation");
const currentHumidity = document.querySelector("#current-humidity");
const currentWind = document.querySelector("#current-wind");
const currentDay = document.querySelector("#day");
const currentFeelsLike = document.querySelector("#current-feels-like");
const fahrenheitButton = document.querySelector("#fahrenheit-button");
const celciusButton = document.querySelector("#celcius-button");
const mileButton = document.querySelector("#mile-button");
const kilometerButton = document.querySelector("#kilometer-button");
const tempUnitText = document.querySelectorAll(".temp-unit");
const speedUnitText = document.querySelector("#speed-unit");
const latitudeInput = document.querySelector("#latitude-input");
const longitudeInput = document.querySelector("#longitude-input");
const locationInputButton = document.querySelector("#submit-location-button");
const currentLocation = document.querySelector("#currentLocation");
const hourlyWeatherPanel = document.querySelector(".hourly-weather-panel");

let tempUnit = "fahrenheit";
let speedUnit = "mile";
let crd;
let long;
let lat;
let newLocationSet = false;

navigator.geolocation.getCurrentPosition(successLoad, () => {
    alert(
        "Unable to get your current location. Please enable location access."
    );
});

async function successLoad(pos) {
    crd = pos.coords;
    let data;
    if (!newLocationSet) {
        data = await getWeatherData(
            crd.latitude,
            crd.longitude,
            tempUnit,
            speedUnit
        );
    } else {
        data = await getWeatherData(lat, long, tempUnit, speedUnit);
    }
    if (localStorage.getItem("tempUnit")) {
        tempUnit = localStorage.getItem("tempUnit");
        handleUnitButton(tempUnit);
    }
    if (localStorage.getItem("speedUnit")) {
        speedUnit = localStorage.getItem("speedUnit");
        handleUnitButton(speedUnit);
    }
    renderCurrentWeather(data);
    renderHourlyWeather(data);
}

async function reload() {
    let data;
    if (!newLocationSet) {
        data = await getWeatherData(
            crd.latitude,
            crd.longitude,
            tempUnit,
            speedUnit
        );
    } else {
        data = await getWeatherData(lat, long, tempUnit, speedUnit);
    }
    renderCurrentWeather(data);
    renderHourlyWeather(data);
}

async function getWeatherData(latitude, longitude, tempUnit, speedUnit) {
    tempUnit = tempUnit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";
    speedUnit = speedUnit === "mile" ? "&windspeed_unit=mph" : "";
    let data = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,is_day,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m,winddirection_10m&current_weather=true${tempUnit}${speedUnit}&timezone=auto`,
        {
            method: "GET",
        }
    );
    data = data.json();
    return data;
}

function parseCurrentWeatherData(data) {
    const hour = new Date().getHours();
    const isDay = data.current_weather.is_day;
    data = data.hourly;
    const weatherObj = {
        weatherCode: data.weathercode[hour],
        temperature: data.temperature_2m[hour],
        precipitation: data.precipitation_probability[hour],
        humidity: data.relativehumidity_2m[hour],
        wind: data.windspeed_10m[hour],
        isDay,
        windDirection: data.winddirection_10m[hour],
        feelsLike: data.apparent_temperature[hour],
    };
    return weatherObj;
}

function parseHourlyWeaterData(data) {
    console.log(data);
    let hourlyWeather = [];
    data = data.hourly;
    for (let i = 0; i <= 24; i++) {
        let weatherObj = {
            weatherCode: data.weathercode[i],
            temperature: data.temperature_2m[i],
            isDay: data.is_day[i],
        };
        hourlyWeather.push(weatherObj);
    }
    return hourlyWeather;
}

function renderCurrentWeather(data) {
    const currentData = parseCurrentWeatherData(data);
    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    currentWeatherIcon.className = getWeatherIconName(
        currentData.weatherCode,
        currentData.isDay
    );
    currentTemp.innerText = currentData.temperature;
    currentPrecipitation.innerText = currentData.precipitation;
    currentHumidity.innerText = currentData.humidity;
    currentWind.innerText = currentData.wind;
    currentDay.innerText = dayNames[new Date().getDay()];
    currentFeelsLike.innerText = currentData.feelsLike;
    if (newLocationSet) {
        currentLocation.innerText = `${lat},${long}`;
    }
}

function renderHourlyWeather(data) {
    const hourlyData = parseHourlyWeaterData(data);
    hourlyWeatherPanel.innerHTML = "";
    for (let i = 0; i <= 24; i++) {
        let newBlock = document.createElement("div");
        newBlock.innerHTML = `
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;border-right: solid;padding:1rem;">
            <span class="hourly-weather-hour">${i}:00</span>
            <i class="${getWeatherIconName(
                hourlyData[i].weatherCode,
                hourlyData[i].isDay
            )}" id="hourly-weather-icon"></i>
            <div class="temperature-display">
                <div id="hourly-temp">${hourlyData[i].temperature}</div>&deg;
                <span class="temp-unit">${
                    localStorage.getItem("tempUnit") === "fahrenheit"
                        ? "F"
                        : "C"
                }</span>
            </div>
        </div>`;
        hourlyWeatherPanel.appendChild(newBlock);
    }
}

function handleUnitButton(button) {
    if (button === "fahrenheit") {
        if (!fahrenheitButton.classList.contains("selected-button")) {
            fahrenheitButton.classList.add("selected-button");
            celciusButton.classList.remove("selected-button");
            tempUnit = "fahrenheit";
            changeUnitText(tempUnitText, "F");
            localStorage.setItem("tempUnit", "fahrenheit");
        }
    }
    if (button === "celcius") {
        if (!celciusButton.classList.contains("selected-button")) {
            celciusButton.classList.add("selected-button");
            fahrenheitButton.classList.remove("selected-button");
            tempUnit = "celcius";
            changeUnitText(tempUnitText, "C");
            localStorage.setItem("tempUnit", "celcius");
        }
    }
    if (button === "mile") {
        if (!mileButton.classList.contains("selected-button")) {
            mileButton.classList.add("selected-button");
            kilometerButton.classList.remove("selected-button");
            speedUnit = "mile";
            speedUnitText.innerText = "mph";
            localStorage.setItem("speedUnit", "mile");
        }
    }
    if (button === "kilometer") {
        if (!kilometerButton.classList.contains("selected-button")) {
            kilometerButton.classList.add("selected-button");
            mileButton.classList.remove("selected-button");
            speedUnit = "kilometer";
            speedUnitText.innerText = "km/h";
            localStorage.setItem("speedUnit", "kilometer");
        }
    }
    reload();
}

function changeUnitText(elements, text) {
    elements.forEach((val) => {
        val.innerText = text;
    });
}

function handleLocationInput(latitude, longitude) {
    if (latitude == "" || longitude == "") {
        alert("Please input latitude and longitude");
    }
    if (latitude < -90 || latitude > 90) {
        alert("Please input valid latitude");
    }
    if (longitude < -180 || longitude > 180) {
        alert("Please input valid longitude");
    }
    lat = latitude;
    long = longitude;
    newLocationSet = true;
    reload();
}

fahrenheitButton.addEventListener("click", () =>
    handleUnitButton("fahrenheit")
);
celciusButton.addEventListener("click", () => handleUnitButton("celcius"));
mileButton.addEventListener("click", () => handleUnitButton("mile"));
kilometerButton.addEventListener("click", () => handleUnitButton("kilometer"));
locationInputButton.addEventListener("click", () =>
    handleLocationInput(latitudeInput.value, longitudeInput.value)
);
