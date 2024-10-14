import fs from 'node:fs/promises';

// TODO: Define a City class with name and id properties
class City{
  name: string;
  id: number;

  constructor(name: string, id: number){
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // DONE: Define a read method that reads from the searchHistory.json file
  // reads db.json file and returns content as a string 
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // DONE: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }

  // TODO: Define a getCities method that reads the cities from the db.json file and returns them as an array of City objects
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

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string) {
    if (!cityName){
      throw new Error('City cannot be blank!');
    }
    console.log(`Added City: ${cityName}`);

    // get the exsiting cities
    const cities = await this.getCities();

    // get next available ID
    const nextId = cities.length > 0 ? cities[cities.length - 1].id + 1 : 1;

    // create new city object
    const newCity = new City(cityName, nextId);

    // add to newly created ciities array
    cities.push(newCity);

    // write to file
    await this.write(cities);
  }


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
