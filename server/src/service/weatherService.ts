import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  longitude: number;
  latitude: number;
}

// TODO: Define a class for the Weather object
class Weather{
  cityName: string;
  date: string;
  icon: string;
  iconDescription: string;
  temperature: number;
  wind: number;
  humidity: number;

  constructor(cityName: string, date: string, icon: string, iconDescription: string, temperature: number, wind: number, humidity: number){
    this.cityName = cityName;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  cityName: string;

  constructor(cityName: string){
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = cityName;
  }

  
  // TODO: Create fetchLocationData method - gets the data to input for long and latitude
  private async fetchLocationData(geocodeURL: string) {
    try {
      const response = await fetch(geocodeURL);

      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }

      const locationData = await response.json();
      return locationData; // gives data from geocode 
    } catch (err: any) {
      throw new Error(err);
    }
  }
  
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const longitude = locationData[0].lon;
    const latitude = locationData[0].lat;

    return {longitude, latitude};
  }

  // TODO: Create buildGeocodeQuery method - takes in cityname and gives the geocode url to find longitude and latitude
  private buildGeocodeQuery(cityName: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const {longitude, latitude} = coordinates;

    let url = `${this.baseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`
    return url;
  }

  // TODO: Create fetchAndDestructureLocationData method -- gives the long and lat given city name
  private async fetchAndDestructureLocationData(cityName: string) {
    // first build geocode URL
    let geocodeURL = this.buildGeocodeQuery(cityName);

    // fetch the location data for the longitude and latitude
    let locationData = await this.fetchLocationData(geocodeURL);

    // get the longitude and latitude by destructuring this data
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(cityName: string) {
    try {
      // fetch and destructure cityname to get long and lat coordinates
      const coordinates: Coordinates = await this.fetchAndDestructureLocationData(cityName);

      // get the url to fetch weather data from api
      const weatherQueryURL = this.buildWeatherQuery(coordinates);

      // fetch data from api 
      const response = await fetch(weatherQueryURL);

      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }

      const weatherData = await response.json();

      return weatherData;
    } catch (err) {
      console.log('Error: ', err);
      return err;
    }
  }

  // converts unix timestamp into actual date
  private convertDate(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);
    return date.toUTCString();
  }

  // DONE: parses the weather data
  private parseWeather(weatherData: any, day: number) {
    const weatherDataSingle = weatherData.list[day];

    // parse 
    const date = this.convertDate(weatherDataSingle.dt);

    const icon = weatherDataSingle.weather[0].icon;
    const iconDescription = weatherDataSingle.weather[0].description;
    const temperature = weatherDataSingle.main.temp;
    const wind = weatherDataSingle.wind.speed;
    const humidity = weatherDataSingle.main.humidity;

    //console.log(`date: ${date} icon: ${icon} iconDescription: ${iconDescription} temperature: ${temperature} wind: ${wind} humidity: ${humidity}`);

    return{date, icon, iconDescription, temperature, wind, humidity};
  }

  // DONE: Complete getWeatherForCity method
  async getWeatherForCity(cityName: string, day: number) {
    // fetch the weather data using city name
    const weatherData = await this.fetchWeatherData(cityName);
    
    // parse weather data for corresponding day
    const {date, icon, iconDescription, temperature, wind, humidity} = await this.parseWeather(weatherData, day);

    // create and return new weather object
    return new Weather(cityName, date, icon, iconDescription, temperature, wind, humidity);
  }

  // DONE: Complete buildForecastArray method
  async buildForecastArray(cityName: string) {
    const forecastArray = [];

    // for loop (loop through every eight element to get the forecast for next 5 days (list is in 3hr increments))
    for (let i=0; i<41; i+=8){
      // get weather object for each day
      let weatherDay = await this.getWeatherForCity(cityName, i);

      // add to array
      forecastArray.push(weatherDay);
    }
    return forecastArray;
  }
}

export default new WeatherService('');
