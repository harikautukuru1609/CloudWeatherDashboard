const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");
const message = document.getElementById("message");
const panel = document.getElementById("weatherPanel");
const searchButton = document.getElementById("searchButton");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name.";
        return;
    }

    searchButton.disabled = true;
    message.textContent = "Loading weather data...";
    panel.hidden = true;

    try {
        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to fetch weather.");
        }

        document.getElementById("location").textContent =
            `${data.city}, ${data.country}`;

        document.getElementById("temperature").textContent =
            data.temperature;

        document.getElementById("feelsLike").textContent =
            data.feels_like;

        document.getElementById("description").textContent =
            data.description;

        document.getElementById("humidity").textContent =
            data.humidity;

        document.getElementById("wind").textContent =
            data.wind_speed;

        document.getElementById("pressure").textContent =
            data.pressure;

        const icon = document.getElementById("weatherIcon");
        icon.src =
            `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
        icon.alt = data.description;

        message.textContent = "";
        panel.hidden = false;

    } catch (error) {
        message.textContent = error.message;
    } finally {
        searchButton.disabled = false;
    }
});

// Load the default city when the page opens.
form.requestSubmit();