import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ImageBackground} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);

  const API_KEY = 'fec4e075f7257cd1f6871b81e495fcc4';
  const units = 'metric';

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}`,
        );
        console.log('response');
        console.log(response.data);
        setWeatherData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  const getWeatherIconUrl = iconCode => {
    console.log('iconCode');
    console.log(iconCode);
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getBackgroundColor = (weatherId, sunrise, sunset, currentTime) => {
    const isDayTime =
      currentTime >= sunrise * 1000 && currentTime <= sunset * 1000;
    let backgroundColor = '#FFFFFF';

    if (weatherId >= 200 && weatherId <= 232) {
      // Thunderstorm
      backgroundColor = isDayTime ? '#616161' : '#212121';
    } else if (weatherId >= 300 && weatherId <= 321) {
      // Drizzle
      backgroundColor = isDayTime ? '#90CAF9' : '#5C6BC0';
    } else if (weatherId >= 500 && weatherId <= 531) {
      // Rain
      backgroundColor = isDayTime ? '#80DEEA' : '#4DD0E1';
    } else if (weatherId >= 600 && weatherId <= 622) {
      // Snow
      backgroundColor = isDayTime ? '#E1F5FE' : '#B3E5FC';
    } else if (weatherId >= 701 && weatherId <= 781) {
      // Atmosphere (Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado)
      backgroundColor = isDayTime ? '#ECEFF1' : '#CFD8DC';
    } else if (weatherId === 800) {
      // Clear
      backgroundColor = isDayTime ? '#FEBF62' : '#283593';
    } else if (weatherId >= 801 && weatherId <= 804) {
      // Clouds
      backgroundColor = isDayTime ? '#B0BEC5' : '#455A64';
    }

    return backgroundColor;
  };

  const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getTextColor = backgroundColor => {
    const {r, g, b} = hexToRgb(backgroundColor);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  if (!weatherData) {
    return (
      <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
        Loading...
      </Text>
    );
  }

  const {
    main: {temp},
    weather: [{description, icon}],
    name,
    dt,
  } = weatherData;

  const location = name;
  const temperature = `${Math.round(temp)}°C`;
  const weatherCondition = description;
  const weatherIconUrl = getWeatherIconUrl(icon);
  const time = getCurrentTime();
  const weatherIcon = require('./../assets/Sunny.png');
  const currentTime = new Date().getTime();
  const backgroundColor = getBackgroundColor(
    weatherData.weather[0].id,
    weatherData.sys.sunrise,
    weatherData.sys.sunset,
    currentTime,
  );
  console.log('backgroundColor');
  console.log(backgroundColor);
  const textColor = getTextColor(backgroundColor);

  function getCurrentTime() {
    const now = new Date();
    const day = new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(
      now,
    );
    const hour = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now);
    return `${day}, ${hour}`;
  }

  return (
    <View style={[styles.card, {backgroundColor}]}>
      <View style={styles.leftSection}>
        <Text
          style={[
            styles.temperature,
            {
              color: textColor,
            },
          ]}>
          {temperature}
        </Text>
        <Text
          style={[
            styles.weatherCondition,
            {
              color: textColor,
            },
          ]}>
          {weatherCondition}
        </Text>
        <Text
          style={[
            styles.location,
            {
              color: textColor,
            },
          ]}>
          {location}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text
          style={[
            styles.time,
            {
              color: textColor,
            },
          ]}>
          {time}
        </Text>
        <Image
          source={{
            uri: weatherIconUrl,
          }}
          style={styles.weatherIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  leftSection: {
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  weatherCondition: {
    fontSize: 24,
    fontWeight: '500',
  },
  location: {
    fontSize: 18,
    fontWeight: '400',
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontSize: 18,
    fontWeight: '400',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default WeatherCard;
