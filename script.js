const apiKey = "126ad1e6af5f45d8b5954840241602";
const baseUri = "https://api.weatherapi.com/v1/";
const locationId = "1129302";

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
    console.log(data);
}

// to get current weather information
async function getCurrentWeather(locationId){
    const currentWeatherUri = `${baseUri}current.json?key=${apiKey}&aqi=yes&q=id:${locationId}`;
    const response = await fetch(currentWeatherUri);
    // validate response from promise
    if(!response.ok){
        return new Error(`Error! ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

getCurrentWeather(locationId)
    .then((data) => {
        const parsedData = parseCurrentWeather(data);
        displayCurrentWeather(parsedData);
    })
    .catch((err) => console.log(err));