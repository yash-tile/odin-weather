const baseUri = "https://api.weatherapi.com/v1/current.json?";
const inputBox = document.getElementById("input-box"); 

let apiKey = sessionStorage.getItem("apiKey");
if (!apiKey) {
    apiKey = prompt("Please enter your API key from weatherapi.com: ");
    sessionStorage.setItem("apiKey", apiKey);
}

// AQI based on us-epa-index
const airQualityCategories  = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for Sensitive Groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous"
};

function parseCurrentWeather(data){

    // extracting location properties and then combining for a readable location name
    const { name, region, country } = data.location
    const location =  `${name}, ${region}, ${country}`;

    // extracting required current weather related properties
    const { last_updated, temp_c, condition: { text: condition_text, icon: condition_icon } } = data.current;
    const { wind_kph, humidity, feelslike_c } = data.current;
    const { air_quality: { "us-epa-index": indexValue } } = data.current;
    
    const parsedWeather =  {
        location, 
        last_updated,
        condition_icon, 
        condition_text,
        temp_c,
        feelslike_c, 
        humidity,
        wind_kph,
        indexValue
    };
    return parsedWeather;
}

function displayCurrentWeather(data){
    document.getElementById('weather-container').style.display = 'block';

    const location = document.getElementById("location");
    const lastUpdated = document.getElementById("last-updated");
    const conditionImg = document.getElementById("condition-img");
    const temp = document.getElementById("temp");
    const condtionText = document.getElementById("condition-text");
    const feelslikeTemp = document.getElementById("feelslike-temp");
    const humidity = document.getElementById("humidity");
    const windspeed = document.getElementById("windspeed");
    const aqi = document.getElementById("aqi");

    location.textContent = data.location;
    lastUpdated.textContent = data.last_updated;
    conditionImg.src = data.condition_icon; 
    temp.textContent = Math.round(data.temp_c);
    condtionText.textContent = data.condition_text;
    feelslikeTemp.textContent = data.feelslike_c;
    humidity.textContent = data.humidity;
    windspeed.textContent = data.wind_kph;
    aqi.textContent = airQualityCategories[data.indexValue];
}

async function makeRequest(uri){
    const response = await fetch(uri);
    // validate response from promise
    if(!response.ok){
        throw new Error(`Error! ${response.status}`);
    }
    const data = await response.json();
    return data;
}

async function getCurrentWeather(searchTerm) {
    try {
        const currentWeatherUri = `${baseUri}key=${apiKey}&aqi=yes&q=${searchTerm}`;
        const data = await makeRequest(currentWeatherUri);
        console.log(data);
        const parsedData = parseCurrentWeather(data);
        displayCurrentWeather(parsedData);
    } 
    catch (err) {
        console.log(err.message);
        const weatherContainer = document.getElementById("weather-container");
        weatherContainer.style.display = 'block';
        weatherContainer.innerHTML = "Bad request! Please enter a valid city name.";
    }
}

 function searchHandler(){
    let searchTerm = inputBox.value;
    getCurrentWeather(searchTerm);
}

inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchHandler();
    }
});