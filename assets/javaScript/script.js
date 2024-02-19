// Function to search for a city
function searchCity(cityName) {
    const apiKey = '1769804fca8c14db4d580d966557a6d0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.cod === '200') {
                const city = response.city.name;
                const date = response.list[0].dt_txt;
                const temperature = response.list[0].main.temp;
                const humidity = response.list[0].main.humidity;
                const windSpeed = response.list[0].wind.speed;

                const forecast = [];

                for (let i = 1; i <= 5; i++) {
                    const forecastItem = {
                        date: response.list[i].dt_txt,
                        temperature: response.list[i].main.temp,
                        humidity: response.list[i].main.humidity,
                        windSpeed: response.list[i].wind.speed,
                    };
                    forecast.push(forecastItem);
                }

                const weatherData = {
                    city: city,
                    date: date,
                    temperature: temperature,
                    humidity: humidity,
                    windSpeed: windSpeed,
                    forecast: forecast,
                };

                updateWeatherDisplay(weatherData);
                updateSearchHistory(cityName); // Update search history when searching for a city
            } else {
                console.error(`API error: ${response.message}`);
            }
        },
        error: function (error) {
            console.error(`AJAX error: ${error.statusText}`);
        },
    });
}

// Function to update the weather display
function updateWeatherDisplay(weatherData) {
    const weatherDisplay = $('#weatherDisplay');
    weatherDisplay.empty();

    // Get the current date
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const weatherContent = `
        <h2>${weatherData.city}</h2>
        <p>Current Date: ${formattedCurrentDate}</p>
        <p>Temperature: ${weatherData.temperature}°C</p>
        <p>Humidity: ${weatherData.humidity}%</p>
        <p>Wind Speed: ${weatherData.windSpeed} m/s</p>
        <h3>5-Day Forecast:</h3>
        <ul id="forecastList"></ul>
    `;

    weatherDisplay.append(weatherContent);

    const forecastList = $('#forecastList');

    // Calculate and display forecast dates for the next 5 days
    for (let i = 1; i <= 5; i++) {
        const forecastDate = new Date();
        forecastDate.setDate(currentDate.getDate() + i);
        const formattedForecastDate = forecastDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const forecastItemContent = `
            <li>
                <p>Date: ${formattedForecastDate}</p>
                <p>Temperature: ${weatherData.forecast[i - 1].temperature}°C</p>
                <p>Humidity: ${weatherData.forecast[i - 1].humidity}%</p>
                <p>Wind Speed: ${weatherData.forecast[i - 1].windSpeed} m/s</p>
            </li>
        `;
        forecastList.append(forecastItemContent);
    }
}


function updateSearchHistory(cityName) {
    const searchHistory = $('#searchHistory');
    const historyItem = `<li class="history-item">${cityName}</li>`;
    searchHistory.prepend(historyItem);

}



// Function to update the footer with current time and date
function updateFooterWithCurrentDateTime() {
    const footer = $('#currentDateTime');

    function updateDateTime() {
        const options = { timeZone: 'America/Denver', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedDateTime = new Date().toLocaleString('en-US', options);
        footer.text(formattedDateTime);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Call the function to update the footer with current time and date
updateFooterWithCurrentDateTime();

// Event listener for the search button click
$('#searchButton').on('click', function () {
    const cityName = $('#cityInput').val().trim();
    if (cityName) {
        searchCity(cityName);
    } else {
        console.log('Please enter a city name');
    }
});

// Function to handle pressing 'Enter' key in the search input
$('#cityInput').on('keypress', function (event) {
    if (event.which === 13) {
        const cityName = $('#cityInput').val().trim();
        if (cityName) {
            searchCity(cityName);
        } else {
            console.log('Please enter a city name');
        }
    }
});
