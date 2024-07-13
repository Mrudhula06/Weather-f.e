// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TempAndDetails from './components/TempAndDetails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/weatherService';

const App = () => {
  const [query, setQuery] = useState({ q: 'chennai' });
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);
  const [background, setBackground] = useState('from-cyan-500 to-blue-700');

  const topCities = ['chennai', 'bengaluru', 'palakkad', 'delhi', 'mumbai'];

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await getFormattedWeatherData({ ...query, units });
        setWeather(data);
        setBackgroundBasedOnWeather(data);
        saveWeatherData(data); // Save weather data to backend
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeather(null); // Handle error state as needed
      }
    };

    getWeather();
  }, [query, units]);

  const setBackgroundBasedOnWeather = (weather) => {
    if (query && query.q && topCities.includes(query.q.toLowerCase())) {
      setBackground('from-cyan-500 to-blue-700');
    } else {
      const threshold = units === 'metric' ? 20 : 60;
      const newBackground =
        weather.temp <= threshold
          ? 'from-cyan-500 to-blue-700'
          : 'from-yellow-600 to-orange-700';
      setBackground(newBackground);
    }
  };

  const saveWeatherData = async (weatherData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/weather', {
        cityName: query.q,
        date: weatherData.formattedLocalTime, // Assuming formattedLocalTime is the date you want to store
        minTemp: weatherData.temp_min,
        maxTemp: weatherData.temp_max,
        windSpeed: weatherData.speed,
        humidity: weatherData.humidity,
        sunrise: weatherData.sunrise,
        sunset: weatherData.sunset,
        feelsLike: weatherData.feels_like,
      });

      console.log('Weather data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving weather data:', error);
    }
  };

  const handleButtonClick = (cityName) => {
    setQuery({ q: cityName });
    setBackground('from-cyan-500 to-blue-700'); // Immediate change on button click
  };

  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-500 rounded-lg ${background}`}>
      <TopButtons setQuery={setQuery} onButtonClick={handleButtonClick} />
      <Inputs setQuery={setQuery} setUnits={setUnits} />
      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TempAndDetails weather={weather} units={units} />
          <Forecast title='3 hour step forecast' data={weather.hourly} />
          <Forecast title='daily forecast' data={weather.daily} />
        </>
      )}
    </div>
  );
};

export default App;
