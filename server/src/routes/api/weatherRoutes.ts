import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/:city', async (req: Request, res: Response) => {
  try {
    const cityName = req.params.city;
    const weather = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    res.json(weather);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await HistoryService.removeCity(id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export default router;
