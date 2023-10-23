function getWeatherIconName(weatherCode, isDay) {
    if (isDay === 1) {
        if (weatherCode <= 2) {
            return "bi bi-sun-fill";
        }
        if (weatherCode === 3) {
            return "bi bi-cloud";
        }
    } else {
        if (weatherCode <= 2) {
            return "bi bi-moon-fill";
        }
        if (weatherCode === 3) {
            return "bi bi-cloud-moon-fill";
        }
    }

    if (weatherCode <= 19) {
        return "bi bi-cloud-haze";
    }
    if (weatherCode <= 21 || (weatherCode >= 25 && weatherCode <= 27)) {
        return "bi bi-cloud-rain-fill";
    }
    if (weatherCode <= 24) {
        return "bi bi-cloud-snow-fill";
    }
    if (weatherCode === 28) {
        return "bi bi-cloud-fog-fill";
    }
    if (weatherCode === 29) {
        return "bi bi-cloud-lightning-rain-fill";
    }
    if (weatherCode <= 39) {
        return "bi bi-tropical-storm";
    }
    if (weatherCode <= 49) {
        return "bi bi-cloud-fog2-fill";
    }
    if (weatherCode <= 59) {
        return "bi bi-cloud-drizzle-fill";
    }
    if (weatherCode <= 69) {
        return "bi bi-cloud-rain-fill";
    }
    if (weatherCode <= 79) {
        return "bi bi-snow2";
    }
    if (weatherCode <= 99) {
        return "bi bi-cloud-rain-fill";
    }
}

export { getWeatherIconName };
