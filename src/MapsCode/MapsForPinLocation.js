import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import geolib, {getAreaOfPolygon} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector, Provider } from "react-redux";
import { cordinates } from "../Redux-Files/mapAreaCordinates";

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to display maps and location data.',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}



const MapsForPinLocation = ({ navigation, route }) => {


  const [position, setPosition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [marks, setMarks] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState([]);

  const { setAddressCord } = route.params;

  const [areaCalculation, setAreaCalculation] = useState(0);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition((pos) => {
      console.log(pos);
      const crd = pos.coords;
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.015/20,
        longitudeDelta: 0.0121/20
        
      });
    });
  }, []);

  const handleMarkerPress = (event) => {
    const newMark = event.nativeEvent.coordinate;
    if (marks.length > 0) {
    }
    else{
      setMarks([...marks, newMark]);
    }
    // setPolygonCoords([...marks, newMark]); // set polygon coordinates to all current marks plus the new one
  };

//   calculate area of polygon in acres

// useEffect(() => {
//     if (polygonCoords.length > 2) {
//         const areaInAcres = calculateAreaInAcres();
//         // console.log(areaInAcres);
//         setAreaCalculation(areaInAcres);
//     }
// }, [polygonCoords]);

// const calculateAreaInAcres = () => {
//     const polygonCoordinates = polygonCoords.flat(); // flatten the array of arrays
//     const areaInSquareMeters = getAreaOfPolygon(polygonCoordinates);
//     const areaInAcres = areaInSquareMeters / 4046.85642;
//     return areaInAcres.toFixed(2); // return the result rounded to 2 decimal places
//   };

  


  return (
    <View style={{
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'column',

    }}>
      <View style={styles.container}>
        <MapView 
        style={styles.map}
        onPress={handleMarkerPress}
        initialRegion={position}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        mapType="satellite"
        >
          {marks.map((mark, index) => (
            <Marker 
            key={index}
            coordinate={mark}
            onDrag={(event) => {
              const newMark = event.nativeEvent.coordinate;
              const newMarks = [...marks];
              newMarks[index] = newMark;
              setMarks(newMarks);
              setPolygonCoords(newMarks);
              }}
              draggable={true}


            />
          ))}
          {/* {polygonCoords.length > 0 && <Polygon coordinates={polygonCoords} />} */}
        </MapView>
        

        <TouchableOpacity style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'black',
          }}
          onPress={() => {
              setMarks(marks.slice(0, marks.length - 1));
              setPolygonCoords(marks.slice(0, marks.length - 1));
              if (marks.length <= 2) {
                  setAreaCalculation(0);
              }
          }}>
              <Text style={{
                  padding: 10,
                  borderRadius: 5,
                  color: 'white',
                  width: 100,
                  textAlign: 'center',
              }}>Undo</Text>
          </TouchableOpacity>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        alignContent: 'center',
        width: '100%',
        justifyContent: 'space-around',
      }}>
        <TouchableOpacity style={[styles.button,{
              backgroundColor: '#B21B1D',
              color: 'white',
          }]} onPress={
              () => {
                  // setMarks([]);
                  // setPolygonCoords([]);
                  // setAreaCalculation(0);
                  // go back on press with polygon coordinates
                  // setMyPolygonCoords(polygonCoords);
                  navigation.goBack();
              }
              }>
            <Text style={{
                color: 'white',
                width: 100,
                textAlign: 'center',
            }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,{
              backgroundColor: '#B21B1D',
              color: 'white',
          }]} onPress={
              () => {
                  // setMarks([]);
                  // setPolygonCoords([]);
                  // setAreaCalculation(0);
                  // go back on press with polygon coordinates
                  // setMyPolygonCoords(polygonCoords);
                  console.log(marks);
                  setAddressCord(marks);
                  navigation.goBack();
              }
              }>
            <Text style={{
                color: 'white',
                width: 100,
                textAlign: 'center',
            }}>Ok</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '90%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'balck',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
});

export default MapsForPinLocation;
