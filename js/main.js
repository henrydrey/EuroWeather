



function getSelectedURL() {
    // get selected option values
    var selectedCity = document.getElementById("citySelected").value;
    
    // put the selected option in the URL and return it 
    var apiURL = `http://www.7timer.info/bin/api.pl?lon=${selectedCity.lon}&lat=${selectedCity.lat}&product=civillight&output=json`;
    
    return apiURL;
}

function getCityName() {
    // get selected option values
    var selectedCity = document.getElementById("citySelected");
    var selectedOption = selectedCity.options[selectedCity.selectedIndex];

    // Get the text of the selected option
    var selectedText = selectedOption.text;
    
    // get city name
    var cityName = selectedText;

    // Display the selected text
    document.getElementById('cityName').textContent = `What the weather's like at ${cityName}...`;
}


window.addEventListener("load", () => {
    hideLoadingSpinner();
})

function showLoadingSpinner() {
    document.getElementById("loading-spinner").style.display = "block";
}

function hideLoadingSpinner() {
    document.getElementById("loading-spinner").style.display = "none";
}



async function getForecast() {

    showLoadingSpinner();

    // call getSelectedURL to get new URL based on selected option
    var newURL = getSelectedURL();
    
    let response;
    // Clear existing content
    document.getElementById('weather-result').innerHTML = '';

    // call the API with the new URL 
    try {
        response = await fetch(newURL)
        var data = await response.json();

        var weatherResult = document.getElementById('weather-result');
        weatherResult.innerHTML = '';

        if (data.dataseries && data.dataseries.length > 0) {
            data.dataseries.forEach(series => {
                var forecastDate = series.date;
                var weather = series.weather;
                var maxTemperature = series.temp2m.max;
                var minTemperature = series.temp2m.min;
                
                // Convert forecastDate to string
                const dateString = forecastDate.toString();

                // Convert the string to a Date object
                const dateObject = new Date(
                parseInt(dateString.substring(0, 4)), // Year
                parseInt(dateString.substring(4, 6)) - 1, // Month (subtract 1 as months are zero-indexed)
                parseInt(dateString.substring(6, 8))  // Day
                );
                var displayDate =  new Date(`${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`);

                // Editing weather response to understandable and readable normal language for public
                if (weather != "clear" && weather != "cloudy" && weather != "snow") {
                    if (weather == "ishower") {
                        weather = "isolated showers";
                        var imageURL = "./imgs/isolatedShowers.png";
                    }
                    else if (weather == "oshower") {
                        weather = "occasional showers"
                        var imageURL = "./imgs/oshowers.png";
                    }
                    else if (weather == "lightrain") {
                        weather = "light rain";
                        var imageURL = "./imgs/lightrain.png";
                    }
                    else if (weather == "pcloudy") {
                        weather = "partly cloudy";
                        var imageURL = "./imgs/partlycloudy.png";
                    }
                    else if (weather == "train") {
                        weather = "thunderstorm with rain";
                        var imageURL = "./imgs/train.png";
                    }
                }

                // adding images to unique responses
                if (weather == "clear") {
                    var imageURL = "./imgs/clear.png";
                }

                if (weather == "cloudy") {
                    var imageURL = "./imgs/cloudy.png";
                }

                if (weather == "snow") {
                    var imageURL = "./imgs/snow.png";
                }

                // hide the loading spinner
                hideLoadingSpinner();
                getCityName();

                var forecastItem = document.createElement("div");
                forecastItem.innerHTML = " ";
                forecastItem.innerHTML = `
                <div id="displayDate">
                    <p>${displayDate.toDateString()}</p>
                </div>
                <div>
                    <img src="${imageURL}" id="weather-image" alt="symbol" height="90" width="90"/>
                </div>

                <div id="weatherReturn">
                    <p id="weatherText">${weather.toUpperCase()}</p>
                </div>
                
                <div id="temp">
                    <p>H: ${maxTemperature}°C</p>
               
                    <p>L: ${minTemperature}°C</p>
                </div>
                `
                
                // styling the forecastItem returns 
                forecastItem.style.backgroundColor = "#334463";
                forecastItem.style.borderRadius = "10px";
                forecastItem.style.margin = "5px";
                forecastItem.style.width = "12.5%";
                forecastItem.style.height = "auto";
                forecastItem.style.display = "block";
                forecastItem.style.padding = "0px";
                forecastItem.style.textAlign = "center";
                forecastItem.style.boxShadow = "10px 5px 5px rgb(169, 169, 169)";
                forecastItem.style.transition = ".5s ease-in";
                forecastItem.style.transitionDelay = "0.5s ease-in";

                weatherResult.appendChild(forecastItem);
            });
            
        }
        else {
            weatherResult.innerHTML = `<p>No forecast data available</p>`;
            hideLoadingSpinner();
        }
    }
    catch(error) {
        console.error('Error fetching weather data:', error);
        hideLoadingSpinner();
    } 
}