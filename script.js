const apiKey = "126ad1e6af5f45d8b5954840241602";
const baseUri = "https://api.weatherapi.com/v1/";

// AQI based on us-epa-index
const airQualityCategories  = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for Sensitive Groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous"
};

// to parse the data of current weather from api
function parseCurrentWeather(data){

    // extracting location properties and then combining
    const { name, region, country } = data.location
    const location =  `${name}, ${region}, ${country}`;

    // extracting current weather related properties
    const { last_updated, temp_c, temp_f, condition: { text: condition_text, icon: condition_icon } } = data.current;
    const { wind_mph, wind_kph, humidity, feelslike_c, feelslike_f } = data.current;
    const { air_quality: { "us-epa-index": indexValue } } = data.current;
    
    return {
        location, 
        last_updated,
        condition_icon, 
        condition_text,
        temp_c,
        temp_f,
        feelslike_c, 
        feelslike_f,
        humidity,
        wind_kph,
        wind_mph,
        indexValue
    }
}

// to render weather data to ui
function displayCurrentWeather(data){
    // make weather container visible
    document.getElementById('weather-container').style.display = 'block';

    // select html elements
    const location = document.getElementById("location");
    const lastUpdated = document.getElementById("last-updated");
    const conditionImg = document.getElementById("condition-img");
    const temp = document.getElementById("temp");
    const tempUnit = document.getElementById("temp-unit");
    const condtionText = document.getElementById("condition-text");
    const feelslikeTemp = document.getElementById("feelslike-temp");
    const humidity = document.getElementById("humidity");
    const windspeed = document.getElementById("windspeed");
    const aqi = document.getElementById("aqi");

    // render data to selected elements
    location.textContent = data.location;
    lastUpdated.textContent = data.last_updated;
    conditionImg.src = data.condition_icon; 
    temp.textContent = data.temp_c;
    tempUnit.textContent = "°C";
    condtionText.textContent = data.condition_text;
    feelslikeTemp.textContent = data.feelslike_c;
    humidity.textContent = data.humidity;
    windspeed.textContent = data.wind_kph;
    aqi.textContent = airQualityCategories[data.indexValue];
}

// async code to make api requests
async function makeRequest(uri){
    const response = await fetch(uri);
    // validate response from promise
    if(!response.ok){
        return new Error(`Error! ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

// to get current weather information
function getCurrentWeather(searchTerm){
    const currentWeatherUri = `${baseUri}current.json?key=${apiKey}&aqi=yes&q=${searchTerm}`;
    makeRequest(currentWeatherUri)
        .then((data) => {
            const parsedData = parseCurrentWeather(data);
            displayCurrentWeather(parsedData);
        })
        .catch((err) => console.log(err));
}

 function searchHandler(){
    const inputBox = document.getElementById("input-box"); 
    let searchTerm = inputBox.value;
    getCurrentWeather(searchTerm);
 }
