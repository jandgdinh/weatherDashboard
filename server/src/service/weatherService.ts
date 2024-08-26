import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  lat: number;
  lon: number;
}


// TODO: Define a class for the Weather object

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  

  constructor(city: string, date: string, icon: string, iconDescription: string, temperature: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }

}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties

  private baseURL: string;
  private apiKey: string;
  private cityName?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}

  private async fetchLocationData(query: string): Promise<any> {
    this.cityName = query;
    console.log(`Fetching location data with query: ${query}`);
    const response = await fetch(query);
    if (!response.ok) {
      console.error(`Failed to fetch location data: ${response.statusText}`);
      throw new Error('Failed to fetch location data');
    }
    return await response.json();
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}

  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}

  private buildGeocodeQuery(): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
    // TODO: Create fetchAndDestructureLocationData method
   // private async fetchAndDestructureLocationData() {}

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData[0]);
  }

  
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}

  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    if (!response.ok) {
      console.error(`Failed to fetch weather data: ${response.statusText}`);
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    return {
      city: this.cityName || '', // Ensure city is included
      date: new Date().toISOString(), // Ensure date is included
      icon: response.current.weather[0].icon,
      iconDescription: response.current.weather[0].description,
      temperature: response.current.temp,
      windSpeed: response.current.wind_speed,
      humidity: response.current.humidity,
    };
  }

      // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(weatherData: any): Weather[] {
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = [currentWeather];
    for (let i = 1; i < 6; i++) {
      const forecast = weatherData.daily[i];
      const weather = new Weather(
        this.cityName || '',
        new Date(forecast.dt * 1000).toISOString(),
        forecast.weather[0].icon,
        forecast.weather[0].description,
        forecast.temp.day,
        forecast.wind_speed,
        forecast.humidity
      );
      forecastArray.push(weather);
    }
    return forecastArray;
  }

    // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.buildForecastArray(weatherData);
  }
}


export default new WeatherService();
