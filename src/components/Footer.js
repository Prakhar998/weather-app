import React from 'react';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: 'black',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ width: '50%' }}>
        <Typography variant="body1">About</Typography>
        The weather app is a user-friendly application designed to provide real-time weather information 
        for specific locations. With an intuitive interface, users can effortlessly access crucial
         meteorological details such as temperature, humidity, wind speed, and forecasts.
        The app serves a diverse range of purposes, from assisting individuals in planning outdoor 
          activities and travel to helping them make informed decisions based on current weather condi
        tions. Users can input their desired locations, either by city name or geographical coordinates,
           to receive accurate and up-to-date weather data. Additionally, the app supports features
        like background image changes based on weather conditions, making it visually engaging. Whet
        her it's checking the day's forecast, monitoring severe weather alerts, or simply staying
        informed about the atmospheric conditions in different regions, the weather app is a valuable
        tool for users seeking reliable and easily accessible weather information.
      </div>
      <div style={{ width: '20%' }}>
        <Typography variant="body1">Contact Details</Typography>
        mail : cu17bcs1017@gmail.com
      </div>
    </div>
  );
};

export default Footer;
