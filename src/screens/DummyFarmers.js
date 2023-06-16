import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker, Polygon} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const farmersData = [
  {id: 1, name: 'Farmer A', latitude: 27.489, longitude: 81.001},
  {id: 2, name: 'Farmer B', latitude: 27.4895, longitude: 81.001},
  {id: 3, name: 'Farmer C', latitude: 27.4898, longitude: 81.002},
  {id: 4, name: 'Farmer D', latitude: 27.4899, longitude: 81.0023},
  {id: 5, name: 'Farmer E', latitude: 27.4887, longitude: 81.0017},
  {id: 6, name: 'Farmer F', latitude: 27.4883, longitude: 81.0015},
  {id: 7, name: 'Farmer G', latitude: 27.4879, longitude: 81.0018},
  {id: 8, name: 'Farmer H', latitude: 27.488, longitude: 81.0022},
  {id: 9, name: 'Farmer I', latitude: 27.4885, longitude: 81.0025},
  {id: 10, name: 'Farmer J', latitude: 27.4887, longitude: 81.0019},
  {id: 11, name: 'Farmer k', latitude: 27.4895, longitude: 81.0119},
];
const polygonCoords = [
  {latitude: 27.489, longitude: 81.001},
  {latitude: 27.4895, longitude: 81.001},
  {latitude: 27.4898, longitude: 81.002},
  {latitude: 27.4899, longitude: 81.0023},

  {latitude: 27.488, longitude: 81.0022},
];

const App = () => {
  const [farmers, setFarmers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    // Get the current location
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        filterFarmersWithinRadius(latitude, longitude);
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const filterFarmersWithinRadius = (latitude, longitude) => {
    const filteredFarmers = farmersData.filter(farmer => {
      const distance = calculateDistance(
        latitude,
        longitude,
        farmer.latitude,
        farmer.longitude,
      );
      return distance <= 1000;
    });

    setFarmers(filteredFarmers);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance * 1000; // Convert distance to meters
  };

  const toRad = value => {
    return (value * Math.PI) / 180;
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          mapType="satellite">
          {farmers.map(farmer => (
            <Marker
              key={farmer.id}
              coordinate={{
                latitude: farmer.latitude,
                longitude: farmer.longitude,
              }}
              title={farmer.name}
            />
          ))}
          {polygonCoords.length > 0 && <Polygon coordinates={polygonCoords} />}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default App;
