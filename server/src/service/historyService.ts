import fs from 'node:fs/promises';

class City{
  name: string;
  id: number;

  constructor(name: string, id: number){
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  // DONE: reads from the db.json file
  // reads db.json file and returns content as a string 
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // DONE: write method that writes the updated cities array to the db.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }

  // DONE: reads the cities from the db.json file and returns them as an array of City objects
  async getCities() {
    try {
      // call read function
      const citiesData = await this.read();

      // create new array parsedCities and parse the data from db.json file
      const parsedCities: City[] = JSON.parse(citiesData)

      // check if it is an array
      if (Array.isArray(parsedCities)) {
        return parsedCities;
      } else {
        return [];
      }
    } catch(err){
      console.error('Error reading cities data:', err);
      return [];
    }
  }

  // DONE: adds a city to the db.json file
  async addCity(cityName: string) {
    if (!cityName){
      throw new Error('City cannot be blank!');
    }
    console.log(`Added City: ${cityName}`);

    // get the existing cities
    const cities = await this.getCities();

    // get next available ID
    const nextId = cities.length > 0 ? cities[cities.length - 1].id + 1 : 1;

    // create new city object
    const newCity = new City(cityName, nextId);

    // add to newly created cities array
    cities.push(newCity);

    // write to file
    await this.write(cities);
  }


  // DONE: removes a city from the db.json file
  async removeCity(id: number) {
    // get the existing cities
    const cities = await this.getCities();

    // filter out the city with the specific numeric ID (excludes matching city with id creating new array updatedCities without it)
    const updatedCities = cities.filter((city: City) => city.id !== id);

    // write to file
    await this.write(updatedCities);
  }
}

export default new HistoryService();
