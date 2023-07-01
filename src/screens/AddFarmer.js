import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Stack,
  TextInput,
  IconButton,
  Button,
  Icon,
} from '@react-native-material/core';
import Axios from 'axios';
import SwitchSelector from 'react-native-switch-selector';
// import SvgUri from 'react-native-svg-uri';
import MapPin from '../assets/MapPin.svg';
import DocumentPicker from 'react-native-document-picker';
import Geolocation from '@react-native-community/geolocation';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {checkAuth} from '../Helper';
import baseURL from '../Config';

export default function AddFarmer({navigation, route}) {
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const result = await check(PERMISSIONS.ANDROID.CAMERA);
        if (result === 'granted') {
          console.log('Camera permission already granted');
        } else {
          await requestCameraPermission();
        }
      } catch (err) {
        console.warn(err);
      }
    };
    checkCameraPermission();
  }, []);

  const {refreshFarmerList} = route.params;

  const [addressCords, setAddressCords] = useState([
    {
      latitude: 0,
      longitude: 0,
    },
  ]);

  useEffect(() => {
    console.log(addressCords);
    var latlongArray = [];
    addressCords.forEach(element => {
      latlongArray.push(element.latitude);
      latlongArray.push(element.longitude);
    });
    setData({
      ...data,
      farmerAddress: {
        ...data.farmerAddress,
        addressCoordinate: {
          ...data.farmerAddress.addressCoordinate,
          coordinates: latlongArray,
        },
      },
    });
  }, [addressCords]);

  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to display maps and location data.',
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

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        pos => {
          console.log(pos);
          const crd = pos.coords;
          console.log(crd);
          setPosition({
            latitude: crd.latitude,
            longitude: crd.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          });

          setData({
            ...data,
            captureCoordinate: {
              ...data.captureCoordinate,
              coordinates: [crd.longitude, crd.latitude],
            },
            insertDataCoordinate: {
              ...data.insertDataCoordinate,
              coordinates: [crd.longitude, crd.latitude],
            },
            farmerAddress: {
              ...data.farmerAddress,
              insertDataCoordinate: {
                ...data.farmerAddress.insertDataCoordinate,
                coordinates: [crd.longitude, crd.latitude],
              },
            },
          });
        },
        error => {
          console.log(error.code, error.message);
          if (retryCount < maxRetries) {
            retryCount += 1;
            console.log(`Retrying... (${retryCount}/${maxRetries})`);
            getCurrentLocation();
          } else {
            console.log('Max retries reached.');
          }
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };
    getCurrentLocation();
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const getCurrentPosition = () => {
      Geolocation.getCurrentPosition(
        pos => {
          console.log(pos);
          const crd = pos.coords;
          console.log(crd);
          setPosition({
            latitude: crd.latitude,
            longitude: crd.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          });
        },
        error => {
          console.log(error.code, error.message);
          if (retryCount < maxRetries) {
            retryCount += 1;
            console.log(`Retrying... (${retryCount}/${maxRetries})`);
            getCurrentPosition();
          } else {
            console.log('Max retries reached.');
          }
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };
    getCurrentPosition();
  }, []);

  const [data, setData] = useState({
    farmerUid: 'USPL001',
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNo: '',
    altMobileNo: '',
    kisanCardNumber: '',
    catchementAreaId: 8,
    approvalToCollectRawMaterial: true,
    captureCoordinate: {
      type: 'Point',
      coordinates: [],
    },
    harvesterNeeded: true,
    nightHarvestingAllowed: true,
    insertDataCoordinate: {
      type: 'Point',
      coordinates: [],
    },
    tenantId: 'test',
    imageDetails: {},
    farmerAddress: {
      firstLine: '',
      secondLine: '',
      village: '',
      postCode: '',
      district: '',
      state: 'Odisha',
      country: 'India',
      addressCoordinate: {
        type: 'Point',
        coordinates: [],
      },
      landmark: '',
      insertDataCoordinate: {
        type: 'Point',
        coordinates: [],
      },
      tenantId: 'test',
    },
  });

  // useEffect(() => {
  //     console.log('---------data---------');
  //     console.log(data);
  //     // print address coordinate
  //     console.log(data.farmerAddress.addressCoordinate.coordinates);
  //   }, [data]);
  const saveData = () => {
    // Check if user have Permission for this action
    const {accessUserRole} = JSON.parse(profile);
    try {
      checkAuth(accessUserRole, 'FARMERUPDATE');

      // check all fields are filled or not one by one
      if (data.firstName == '') {
        alert('Please enter first name');
        return;
      }
      if (data.lastName == '') {
        alert('Please enter last name');
        return;
      }
      if (data.mobileNo == '') {
        alert('Please enter mobile number');
        return;
      }
      if (data.farmerAddress.firstLine == '') {
        alert('Please enter address');
        return;
      }
      if (data.farmerAddress.village == '') {
        alert('Please enter village');
        return;
      }
      if (data.farmerAddress.postCode == '') {
        alert('Please enter post code');
        return;
      }
      if (data.farmerAddress.district == '') {
        alert('Please enter district');
        return;
      }
      if (data.farmerAddress.state == '') {
        alert('Please enter state');
        return;
      }
      if (data.farmerAddress.country == '') {
        alert('Please enter country');
        return;
      }

      // check if image is selected or not
      if (data.imageDetails == {}) {
        alert('Please select image');
        return;
      }

      // check mobile number is valid or not
      if (data.mobileNo.length != 10) {
        alert('Please enter valid mobile number');
        return;
      }
      console.log(data);
      Axios.post(`${baseURL}/farmer`, data, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => {
          console.log(res, 'adeeddddddddddddddddddddddddddddddddd');
          refreshFarmerList();
          navigation.goBack();
        })
        .catch(err => {
          console.log(err), 'errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr';
          alert('Error while saving data');
        });
    } catch (err) {
      alert(err.message);
    }
  };

  const [catchementAreaList, setCatchementAreaList] = useState([]);
  const [selectedCatchementArea, setSelectedCatchementArea] = useState(0);

  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      setToken(token);
      console.log(token);
    });
    AsyncStorage.getItem('profile').then(profile => {
      setProfile(profile);
    });
  }, []);

  useEffect(() => {
    if (token === null || profile === null) {
      return;
    }
    console.log('====================');
    console.log(profile);
    console.log(
      'url',
      `${baseURL}/catchmentArea/` + JSON.parse(profile).orgUnitId,
    );
    Axios.get(`${baseURL}/catchmentArea/` + JSON.parse(profile).orgUnitId, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        console.log(res.data);
        setCatchementAreaList(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    console.log(token);

    // set tenant id
    setData({
      ...data,
      tenantId: 'test',
      imageDetails: {
        ...data.imageDetails,
        orgUnitId: JSON.parse(profile).orgUnitId,
        tenantId: JSON.parse(profile).tenantId,
      },
    });
  }, [token, profile]);

  const [imageUri, setImageUri] = useState(null);

  const selectFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      // const res = await DocumentPicker.pick({
      //     type: [DocumentPicker.types.images],
      //     capture: true,
      // });
      // console.log(res)
      // //Printing the log realted to the file
      // console.log('res : ' + JSON.stringify(res));
      // console.log('URI : ' + res[0].uri);
      // console.log('Type : ' + res[0].type);
      // console.log('File Name : ' + res[0].name);
      // console.log('File Size : ' + res[0].size);
      // //Setting the state to show single file attributes
      // setImageUri(res[0].uri);
      // // get image to upload using axios
      // const image = res[0];
      // const formData = new FormData();
      // formData.append('file', image);

      //new added here

      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        freeStyleCropEnabled: true,
        compressImageQuality: 0.5,
      });
      setImageUri(image.path);

      // get image to upload using axios
      const formData = new FormData();
      formData.append('file', {
        uri: image.path,
        type: 'image/jpeg',
        name: 'image-' + Date.now() + '.jpg',
      });

      setIsLoading(true);

      Axios.post(`${baseURL}/images/1`, formData, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(res => {
          console.log('-----------------');
          console.log(res.data);
          setData({
            ...data,
            imageDetails: {
              // "id": res.data.id,
              imageSrc: res.data.imageSrc,
              imageUri: res.data.imageUri,
              imageUrlExpiryDate: res.data.imageUrlExpiryDate,
              orgUnitId: res.data.orgUnitId,
              tenantId: res.data.tenantId,
            },
          });
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          alert('Error while uploading image');
          setIsLoading(false);
        });

      // setData({
      //     ...data,
      //     imageDetails: {
      //         ...data.imageDetails,
      //         imageUri: res[0].uri,
      //         imageSrc: res[0].uri,
      //     }
      // })
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  //   const takePicture = async (camera) => {
  //     const options = { quality: 0.5, base64: true };
  //     const data = await camera.takePictureAsync(options);
  //     setImageUri(data.uri);
  //   };

  const takePhoto = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        freeStyleCropEnabled: true,
        compressImageQuality: 0.5,
      });
      setImageUri(image.path);

      // get image to upload using axios
      const formData = new FormData();
      formData.append('file', {
        uri: image.path,
        type: 'image/jpeg',
        name: 'image-' + Date.now() + '.jpg',
      });

      setIsLoading(true);

      Axios.post(`${baseURL}/images/1`, formData, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(res => {
          console.log('-----------------');
          console.log(res.data);
          setData({
            ...data,
            imageDetails: {
              // "id": res.data.id,
              imageSrc: res.data.imageSrc,
              imageUri: res.data.imageUri,
              imageUrlExpiryDate: res.data.imageUrlExpiryDate,
              orgUnitId: res.data.orgUnitId,
              tenantId: res.data.tenantId,
            },
          });
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          alert('Error while uploading image');
          setIsLoading(false);
        });
      // do something with the image, such as upload it to a server
    } catch (err) {
      console.warn(err);
    }
  };

  // Create view that have list of all setting options
  const options = [
    {label: 'YES', value: 'Yes'},
    {label: 'NO', value: 'No'},
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
      }}>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <ScrollView
        style={{
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: 10,
              position: 'relative',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#000000',
                marginTop: 0,
                width: '50%',
                paddingLeft: 20,
                alignSelf: 'flex-start',
              }}>
              Personal Details
            </Text>

            {/* <Text style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    width: '50%',
                    backgroundColor: '#B21B1D',
                    textAlign: 'center',
                    borderRadius: 5,
                    padding: 5,
                    marginRight: 5,
                    }}>Farmer UID (Read Only)</Text> */}
          </View>

          <Stack
            style={{
              width: '100%',
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 30,
            }}>
            <TextInput
              label="First Name*"
              variant="standard"
              style={{
                marginTop: 20,
              }}
              value={data.firstName}
              onChangeText={text => {
                setData({
                  ...data,
                  firstName: text,
                });
              }}
            />
            <TextInput
              label="Middle Name"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={data.middleName}
              onChangeText={text => {
                setData({
                  ...data,
                  middleName: text,
                });
              }}
            />
            <TextInput
              label="Last Name"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={data.lastName}
              onChangeText={text => {
                setData({
                  ...data,
                  lastName: text,
                });
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                marginTop: 20,
                position: 'relative',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginLeft: 10,
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
                  selectFile();
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
                  takePhoto();
                }}>
                <AntDesign name="camera" size={20} color="#ffffff" />
              </TouchableOpacity>

              <Image
                source={{uri: imageUri}}
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'contain',
                  position: 'absolute',
                  right: 10,
                }}
              />
            </View>

            <TextInput
              label="Mobile Number*"
              variant="standard"
              style={{
                marginTop: 20,
              }}
              // accept only numbers
              keyboardType="numeric"
              value={data.mobileNo}
              onChangeText={text => {
                // check if number is 10 digit

                setData({
                  ...data,
                  mobileNo: text,
                });
              }}
            />
            <TextInput
              label="Alterantive Number"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={data.altMobileNo}
              onChangeText={text => {
                setData({
                  ...data,
                  altMobileNo: text,
                });
              }}
            />
            <TextInput
              label="Address Line 1*"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={data.farmerAddress.firstLine}
              onChangeText={text => {
                setData({
                  ...data,
                  farmerAddress: {
                    ...data.farmerAddress,
                    firstLine: text,
                  },
                });
              }}
            />
            <TextInput
              label="Address Line 2"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={data.farmerAddress.secondLine}
              onChangeText={text => {
                setData({
                  ...data,
                  farmerAddress: {
                    ...data.farmerAddress,
                    secondLine: text,
                  },
                });
              }}
            />
            <Stack style={{width: '100%', marginTop: 10}} direction="row">
              <TextInput
                label="Village*"
                variant="standard"
                style={{
                  width: '50%',
                }}
                value={data.farmerAddress.village}
                onChangeText={text => {
                  setData({
                    ...data,
                    farmerAddress: {
                      ...data.farmerAddress,
                      village: text,
                    },
                  });
                }}
              />
              <TextInput
                label="District*"
                variant="standard"
                style={{
                  width: '50%',
                }}
                value={data.farmerAddress.district}
                onChangeText={text => {
                  setData({
                    ...data,
                    farmerAddress: {
                      ...data.farmerAddress,
                      district: text,
                    },
                  });
                }}
              />
            </Stack>

            <Stack style={{width: '100%', marginTop: 10}} direction="row">
              <TextInput
                label="Pincode*"
                variant="standard"
                style={{
                  width: '50%',
                }}
                value={data.farmerAddress.postCode}
                onChangeText={text => {
                  setData({
                    ...data,
                    farmerAddress: {
                      ...data.farmerAddress,
                      postCode: text,
                    },
                  });
                }}
              />
              <TextInput
                label="State*"
                variant="standard"
                style={{
                  width: '50%',
                }}
                value={data.farmerAddress.state}
                onChangeText={text => {
                  setData({
                    ...data,
                    farmerAddress: {
                      ...data.farmerAddress,
                      state: text,
                    },
                  });
                }}
                editable={false}
              />
            </Stack>

            <TextInput
              label="Country*"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={data.farmerAddress.country}
              onChangeText={text => {
                setData({
                  ...data,
                  farmerAddress: {
                    ...data.farmerAddress,
                    country: text,
                  },
                });
              }}
              editable={false}
            />
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
                    ? addressCords[0].latitude +
                      ', ' +
                      addressCords[0].longitude
                    : ''
                }
                // icon on right side of text input
                trailing={
                  <FontAwesome5
                    name="map-marked-alt"
                    size={20}
                    color="#B21B1D"
                  />
                }
              />
            </TouchableOpacity>
            <TextInput
              label="Landmark"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={data.farmerAddress.landmark}
              onChangeText={text => {
                setData({
                  ...data,
                  farmerAddress: {
                    ...data.farmerAddress,
                    landmark: text,
                  },
                });
              }}
            />
            {/* <TextInput
                        label="Catchment Area*"
                        variant="standard"
                        style={{
                            marginTop: 10,
                        }}
                        trailing={<AntDesign name="down" size={20} color="#000000" />}
                    /> */}

            <Text
              style={{
                fontSize: 16,
                color: '#000000',
                marginTop: 10,
                width: '90%',
              }}>
              Catchment Area*
            </Text>

            <Picker
              selectedValue={selectedCatchementArea}
              style={{height: 50, width: '90%', marginTop: 10}}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCatchementArea(itemValue);
                setData({
                  ...data,
                  catchementAreaId: itemValue,
                });
              }}>
              {catchementAreaList.map((item, index) => {
                return (
                  <Picker.Item label={item.name} value={item.id} key={index} />
                );
              })}
            </Picker>

            <TextInput
              label="Kisan Card Details"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={data.kisanCardNumber}
              onChangeText={text => {
                setData({
                  ...data,
                  kisanCardNumber: text,
                });
              }}
            />
            <Stack style={{width: '100%', marginTop: 10}} direction="row">
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginLeft: 10,
                  width: '50%',
                  alignSelf: 'center',
                }}>
                Harvester Needed*
              </Text>

              <SwitchSelector
                options={options}
                initial={0}
                onPress={value => {
                  setData({
                    ...data,
                    harvesterNeeded: value === 0 ? true : false,
                  });
                }}
                style={{
                  marginTop: 10,
                  width: '50%',
                }}
              />
            </Stack>
            <Stack style={{width: '100%', marginTop: 10}} direction="row">
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginLeft: 10,
                  width: '50%',
                  alignSelf: 'center',
                }}>
                Night Harvesting*
              </Text>

              <SwitchSelector
                options={options}
                initial={0}
                onPress={value => {
                  setData({
                    ...data,
                    nightHarvestingAllowed: value === 0 ? true : false,
                  });
                }}
                style={{
                  marginTop: 10,
                  width: '50%',
                }}
              />
            </Stack>
            <Stack style={{width: '100%', marginTop: 10}} direction="row">
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginLeft: 10,
                  width: '50%',
                  alignSelf: 'center',
                }}>
                Collect Raw Material Approval*
              </Text>

              <SwitchSelector
                options={options}
                initial={0}
                onPress={value => {
                  setData({
                    ...data,
                    approvalToCollectRawMaterial: value === 0 ? true : false,
                  });
                }}
                style={{
                  marginTop: 10,
                  width: '50%',
                }}
              />
            </Stack>
            {/* <Stack style={{ width: '100%', marginTop: 20 }} direction="row">
                    <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#000000',
                            marginLeft: 10,
                            alignSelf: 'center',
                        }}>Data Input Location (Read Only)</Text>
                        <MapPin
                            width="40"
                            height="40"
                            style={{
                                marginLeft: 20,
                            }}
                        />
                    </Stack> */}

            <Stack
              style={{
                width: '100%',
                marginTop: 30,
                justifyContent: 'space-between',
              }}
              direction="row">
              <Button
                mode="contained"
                title="Discard"
                style={{
                  width: '40%',
                  backgroundColor: '#B21B1D',
                  marginTop: 10,
                }}
                onPress={() => {
                  // goBack()
                  navigation.goBack();
                }}></Button>
              <Button
                mode="contained"
                title="Save"
                style={{
                  width: '40%',
                  backgroundColor: '#B21B1D',
                  marginTop: 10,
                }}
                onPress={() => {
                  saveData();
                }}></Button>
            </Stack>
          </Stack>
        </View>
      </ScrollView>
    </View>
  );
}
