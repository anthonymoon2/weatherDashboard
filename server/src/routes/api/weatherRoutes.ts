import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// DONE: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try{
    // extract the city name from the body
    const {cityName} = req.body;

    if (!cityName){
      return res.status(400).json({ error: 'Please do not leave city name blank.' });
    }

    // DONE: GET weather data aray using city name
    const weatherData = await WeatherService.buildForecastArray(cityName);

    // DONE: save city to search history
    HistoryService.addCity(cityName);

    // return weather data array in response as json
    return res.status(200).json({weatherData});

    } catch (error) {
      console.error('Error retrieving weather data:', error);
      return res.status(500).json({ error: 'An error occurred while fetching weather data.' });
    }
});

// DONE: GET search history
router.get('/history', async (_req, res) => {
  const cities = await HistoryService.getCities();

  res.status(200).json(cities);
});

// DONE: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    // get the id from the request params
    const id = parseInt(req.params.id)

    // call function from history service and pass in id
    await HistoryService.removeCity(id);
    res.status(200).json({ message: `City with ID ${id} has been removed from history.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the city.' });
  }
});

export default router;
