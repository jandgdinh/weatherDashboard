import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const cityName = req.body.city;
    const weather = await WeatherService.getWeatherForCity(cityName);
    res.json(weather);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await HistoryService.removeCity(id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export default router;
