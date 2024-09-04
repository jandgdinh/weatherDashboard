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
  tempF: number;
  windSpeed: number;
  humidity: number;
  

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
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
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    if (!response || !response.list || !response.list[0] || !response.list[0].weather || !response.list[0].weather[0]) {
      throw new Error('Invalid weather data response');
    }
    const weatherData = response.list[0].weather[0];
    return {
      city: response.city.name,
      date: response.list[0].dt_txt,
      icon: weatherData.icon,
      iconDescription: weatherData.description,
      tempF: response.list[0].main.temp,
      windSpeed: response.list[0].wind.speed,
      humidity: response.list[0].main.humidity,
    };
  }

      // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(weatherData: any): Weather[] {
    const currentWeather = this.parseCurrentWeather(weatherData);
  
    // Filter the list to get one forecast per day (e.g., at noon)
    const dailyForecasts = weatherData.list.filter((entry: any) => {
      const date = new Date(entry.dt_txt);
      return date.getHours() === 12; // Select forecasts at noon
    });
  
    // Ensure we have at least 5 daily forecasts
    if (dailyForecasts.length < 5) {
      console.error('Insufficient daily data provided to buildForecastArray');
      return [];
    }
  
    const forecast = dailyForecasts.slice(0, 5).map((data: any) => {
      return {
        city: weatherData.city.name,
        date: data.dt_txt,
        icon: data.weather[0].icon,
        iconDescription: data.weather[0].description,
        tempF: data.main.temp,
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
      };
    });
  
    return [currentWeather, ...forecast];
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
