import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
  Platform,
} from 'react-native';
import MapView, {Marker, Polygon} from 'react-native-maps';
import {TextInput} from '@react-native-material/core';
import Geolocation from '@react-native-community/geolocation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BoldTextInput = ({label, value, style, onChangeText}) => {
  return (
    <View style={style}>
      <Text style={{fontWeight: 'bold', color: '#B21B1D'}}>{label}:</Text>
      <TextInput
        variant="standard"
        style={{fontWeight: 'bold'}}
        editable={true}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const Heap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const navigation = useNavigation();

  const [farmerName, setFarmerName] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [landSize, setLandSize] = React.useState('');
  const [kdName, setKdName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [dateOfDiscussion, setDateOfDiscussion] = React.useState('');
  const [selectedCatchementArea, setSelectedCatchementArea] = useState(0);
  const [catchementAreaList, setCatchementAreaList] = useState([]);

  const handleFarmerNameChange = text => {
    setFarmerName(text);
  };

  const handleMobileNumberChange = text => {
    setMobileNumber(text);
  };

  const handleLocationChange = text => {
    setLocation(text);
  };

  const handleLandSizeChange = text => {
    setLandSize(text);
  };

  const handleKdNameChange = text => {
    setKdName(text);
  };

  const handlePriceChange = text => {
    setPrice(text);
  };

  const handleDateOfDiscussionChange = text => {
    setDateOfDiscussion(text);
  };

  useEffect(() => {
    getLocationAsync();
  }, []);

  const [addressCords, setAddressCords] = useState([
    {
      latitude: 0,
      longitude: 0,
    },
  ]);

  const getLocationAsync = async () => {
    // Get the current location
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const opencamera = async () => {
    try {
      let granted;
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      } else if (Platform.OS === 'ios') {
        granted = true; // On iOS, permissions are requested at build-time
      }
      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === 'ios'
      ) {
        const options = {
          quality: 0.5,
          mediaType: 'photo',
          maxHeight: 720,
          maxWidth: 1024,
        };

        await launchCamera(options, response => {
          const data = new FormData();

          if (response.assets != undefined) {
            data.append('file_name', {
              uri: response.assets[0].uri,
              type: 'image/jpg',
              name: response.assets[0].uri,
            });
          }
          setPhoto(data);
        });
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const opencameragallery = async () => {
    try {
      let granted;
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      } else if (Platform.OS === 'ios') {
        granted = true; // On iOS, permissions are requested at build-time
      }
      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === 'ios'
      ) {
        const options = {
          quality: 0.5,
          mediaType: 'photo',
          maxHeight: 720,
          maxWidth: 1024,
        };

        await launchImageLibrary(options, response => {
          if (response.didCancel) {
            return null;
          }

          const data = new FormData();
          if (response.assets != undefined) {
            data.append('file_name', {
              uri: response.assets[0].uri,
              type: 'image/jpg',
              name: response.assets[0].uri,
            });
          }
          setPhoto(data);
        });
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <View style={styles.card}>
          <TextInput
            label="Farmer Name"
            value={farmerName}
            variant="standard"
            style={{
              marginTop: 10,
            }}
            onChangeText={handleFarmerNameChange}
          />

          <TextInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={handleMobileNumberChange}
            style={{
              marginTop: 10,
            }}
            variant="standard"
          />

          <TextInput
            label="Location"
            value={location}
            onChangeText={handleLocationChange}
            style={{
              marginTop: 10,
            }}
            variant="standard"
          />
          <TextInput
            label="Land Size (Acres)"
            value={landSize}
            onChangeText={handleLandSizeChange}
            style={{
              marginTop: 10,
            }}
            variant="standard"
          />
          <TextInput
            label="KD Name"
            value={kdName}
            onChangeText={handleKdNameChange}
            style={{
              marginTop: 10,
            }}
            variant="standard"
          />
          <TextInput
            label="Price (Rs)"
            value={price}
            onChangeText={handlePriceChange}
            style={{
              marginTop: 10,
            }}
            variant="standard"
          />
          <TextInput
            label="Date of Discussion"
            value={dateOfDiscussion}
            onChangeText={handleDateOfDiscussionChange}
            style={{
              marginTop: 10,
            }}
            variant="standard"
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              paddingVertical: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
              }}>
              Add Photo*
            </Text>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#000000',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 20,
              }}
              onPress={() => {
                // select image from gallery
                opencameragallery();
              }}>
              <AntDesign name="cloudupload" size={20} color="#ffffff" />
            </TouchableOpacity>

            {/* takePhoto() */}

            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#000000',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 20,
              }}
              onPress={() => {
                // take photo from camera
                opencamera();
              }}>
              <AntDesign name="camera" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              // if (isEditable){
              navigation.navigate('MapsForPinLocation', {
                setAddressCord: setAddressCords,
              });
              // }
            }}
            style={{
              marginTop: 10,
            }}>
            <TextInput
              label="Locate Farmer Address*"
              variant="standard"
              editable={false}
              value={
                addressCords.length > 0
                  ? addressCords[0].latitude + ', ' + addressCords[0].longitude
                  : ''
              }
              // icon on right side of text input
              trailing={
                <FontAwesome5 name="map-marked-alt" size={20} color="#B21B1D" />
              }
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              borderRadius: 5,
              marginHorizontaln: 10,
              marginVertical: 20,
              justifyContent: 'space-between',
            }}>
            <Pressable
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                marginTop: 10,
                width: '45%',
                paddingHorizontal: 10,
                backgroundColor: '#B21B1D',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                  padding: 10,
                }}>
                Save
              </Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                marginTop: 10,
                width: '45%',
                paddingHorizontal: 10,
                backgroundColor: '#B21B1D',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                  padding: 10,
                }}>
                Discard
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  map: {
    width: 350,
    height: 300,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B21B1D',
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    color: '#000000',
  },
});

export default Heap;
