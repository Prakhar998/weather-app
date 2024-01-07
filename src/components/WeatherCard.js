import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import clear from '../images/download.jpeg';
import cold from '../images/cold.jpeg';
import cloud from '../images/clo.jpeg';
import rain from '../images/rai.jpeg';
import thunder from '../images/thun.jpeg';
import drizzle from '../images/dri.jpeg';
import mist from '../images/mis.jpeg';
import fog from '../images/fog.jpeg';
import smoke from '../images/smok.jpeg';
import haze from '../images/haz.jpeg';
import dust from '../images/dus.jpeg';
import hot from '../images/hot.jpeg';
import snow from '../images/sno.jpeg';

const dbName = 'WeatherDB';
const storeName = 'WeatherStore';

const imageArray = [
  { condition: 'Clear', temperature: { min: -Infinity, max: Infinity }, imageUrl: clear },
  { condition: 'Clouds', temperature: { min: -Infinity, max: Infinity }, imageUrl: cloud },
  { condition: 'Rain', temperature: { min: -Infinity, max: Infinity }, imageUrl: rain },
  { condition: 'Snow', temperature: { min: -Infinity, max: Infinity }, imageUrl: snow },
  { condition: 'Thunderstorm', temperature: { min: -Infinity, max: Infinity }, imageUrl: thunder },
  { condition: 'Drizzle', temperature: { min: -Infinity, max: Infinity }, imageUrl: drizzle },
  { condition: 'Mist', temperature: { min: -Infinity, max: Infinity }, imageUrl: mist },
  { condition: 'Fog', temperature: { min: -Infinity, max: Infinity }, imageUrl: fog },
  { condition: 'Smoke', temperature: { min: -Infinity, max: Infinity }, imageUrl: smoke },
  { condition: 'Haze', temperature: { min: -Infinity, max: Infinity }, imageUrl: haze },
  { condition: 'Dust', temperature: { min: -Infinity, max: Infinity }, imageUrl: dust },
  { condition: 'Hot', temperature: { min: 30, max: Infinity }, imageUrl: hot },
  { condition: 'Cold', temperature: { min: -Infinity, max: 10 }, imageUrl: cold },
];

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      reject(`IndexedDB error: ${event.target.error}`);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
  });
};

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [defaultCity, setDefaultCity] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const openDBInstance = async () => {
      const db = await openDB();
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          setWeatherData(cursor.value.weatherData);
        }
      };
    };

    openDBInstance();
  }, []);

  const fetchData = async (city) => {
    const apiKey = '72e3f92baaa835377239472343d04ec4';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);

      const db = await openDB();
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      objectStore.clear();
      objectStore.add({ weatherData: response.data });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationChange = (e) => {
    setLocationInput(e.target.value);
  };

  const handleSearchByLocation = async () => {
    fetchData(locationInput);
  };

  const handleDefaultCityChange = (e) => {
    setDefaultCity(e.target.value);
  };

  useEffect(() => {
    fetchData(defaultCity || 'Mountain View');
  }, [defaultCity]);

  useEffect(() => {
    if (weatherData) {
      const matchingImage = imageArray.find(
        (image) =>
          image.condition.toLowerCase() ===
            weatherData.weather[0].main.toLowerCase() &&
          weatherData.main.temp >= image.temperature.min &&
          weatherData.main.temp <= image.temperature.max
      );

      if (matchingImage) {
        setBackgroundImage(`url(${matchingImage.imageUrl})`);
      } else {
        setBackgroundImage('');
      }
    }
  }, [weatherData]);

  return (
    <Card
      style={{
        marginTop: '50px',
        padding: '150px',
        backgroundImage: backgroundImage,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      <CardContent>
        <div>
          <Typography variant="h5">{weatherData?.name}</Typography>
          <TextField
            label="Enter Location"
            variant="outlined"
            value={locationInput}
            onChange={handleLocationChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchByLocation();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearchByLocation}
            style={{ marginLeft: '10px' }}
          >
            Search by Location
          </Button>
          <TextField
            label="Default City"
            variant="outlined"
            value={defaultCity}
            onChange={handleDefaultCityChange}
            style={{ marginLeft: '10px' }}
          />
        </div>
        {weatherData ? (
          <>
            <Typography variant="subtitle1">
              Temperature: {weatherData.main.temp}°C
            </Typography>
            <Typography variant="subtitle1">
              Condition: {weatherData.weather[0].description}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">Loading weather data...</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
