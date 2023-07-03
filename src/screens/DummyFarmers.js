import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Button} from 'react-native';
import MapView, {Marker, Polygon} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const farmersData = [
  {
    id: 1,
    name: 'Farmer A',
    latitude: 27.48063651010104,
    longitude: 80.99966660141945,
  },
  {
    id: 2,
    name: 'Farmer B',
    latitude: 27.48136316793982,
    longitude: 80.99891189485788,
  },
  {
    id: 3,
    name: 'Farmer C',
    latitude: 27.48194972574425,
    longitude: 80.99948689341545,
  },
  {
    id: 4,
    name: 'Farmer D',
    latitude: 27.481312899909646,
    longitude: 81.00035324692726,
  },
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
  const [landCoordinates, setLandCoordinates] = useState([]);
  const [newFarmCoordinates, setNewFarmCoordinates] = useState([]);

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
  const handleAddLandCoordinate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    setLandCoordinates(prevCoordinates => [...prevCoordinates, newCoordinate]);
  };

  const addNewFarm = () => {
    setNewFarmCoordinates([...newFarmCoordinates, landCoordinates]);
  };

  const isPointInsidePolygon = (point, polygon) => {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [polyX, polyY] = polygon[i];
      const [prevPolyX, prevPolyY] = polygon[j];
      const intersect =
        polyY > y !== prevPolyY > y &&
        x < ((prevPolyX - polyX) * (y - polyY)) / (prevPolyY - polyY) + polyX;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // ...

  const checkOverlap = () => {
    if (newFarmCoordinates.length > 0 && landCoordinates.length > 0) {
      const newFarmPolygon = newFarmCoordinates[0].map(coord => [
        coord.latitude,
        coord.longitude,
      ]);
      for (const existingFarm of farmersData) {
        const existingFarmPolygon = farmersData.map(coord => [
          coord.latitude,
          coord.longitude,
        ]);
        let overlap = false;

        for (const coordinate of newFarmPolygon) {
          if (isPointInsidePolygon(coordinate, existingFarmPolygon)) {
            overlap = true;
            break;
          }
        }

        if (overlap) {
          alert('Newly added farm overlaps with existing farm');
          // Perform any additional actions here
        } else {
          alert('Newly farm added ');
        }
      }
    }
  };

  // ...

  useEffect(() => {
    checkOverlap();
  }, [newFarmCoordinates]);

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
          mapType="satellite"
          onPress={event => {
            const {latitude, longitude} = event.nativeEvent.coordinate;
            handleAddLandCoordinate(latitude, longitude);
          }}>
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
          {landCoordinates.map((coordinate, index) => (
            <Marker
              key={index}
              coordinate={coordinate}
              pinColor="blue" // Optionally, customize the marker color
            />
          ))}
          {polygonCoords.length > 0 && <Polygon coordinates={polygonCoords} />}
        </MapView>
      )}
      <Button title="Add Farm" onPress={addNewFarm} />
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
