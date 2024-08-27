import { promises as fs } from 'fs';

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class

class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json', 'utf-8')
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, 2));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return JSON.parse(cities);
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string): Promise<void> {
    const cities = await this.getCities();
    const id = Math.random().toString(36).substr(2, 9);
    cities.push(new City(id, name));
    await this.write(cities);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}
export default new HistoryService();
