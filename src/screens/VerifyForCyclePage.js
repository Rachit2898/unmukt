import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Stack, TextInput} from '@react-native-material/core';
import SwitchSelector from 'react-native-switch-selector';
// import SvgUri from 'react-native-svg-uri';
import MapPin from '../assets/MapPin.svg';
import DocumentPicker from 'react-native-document-picker';
import {Axios} from '../core/axios';
import AreaVector from '../assets/AreaVector.svg';
import {Picker} from '@react-native-picker/picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker, Polygon} from 'react-native-maps';
import {checkAuth} from '../Helper';
import editButton from '../assets/editProfile.png';
import map from '../assets/map.png';
import Cancel from '../assets/cancel.png';
import Ok from '../assets/ok.png';
import {SafeAreaView} from 'react-native-safe-area-context';

const BoldTextInput = ({
  label,
  value,
  onChangeText,
  isEditable,
  style,
  trailing,
}) => {
  return (
    <View style={style}>
      <Text style={{fontWeight: 'bold'}}>{label}</Text>
      <TextInput
        variant="standard"
        style={{fontWeight: 'bold'}}
        editable={isEditable}
        value={value}
        onChangeText={onChangeText}
        trailing={trailing}
      />
    </View>
  );
};

const VerifyForCyclePage = ({route}) => {
  const {farmerData, refreshFarmerList} = route.params;
  const farmerDetail = route.params.farmerDetails;

  const [addressCords, setAddressCords] = useState([
    {
      latitude: farmerData.farmerAddress.addressCoordinate.coordinates[0],
      longitude: farmerData.farmerAddress.addressCoordinate.coordinates[1],
    },
  ]);

  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      setToken(token);
      // console.log(token);
    });
    AsyncStorage.getItem('profile').then(profile => {
      setProfile(profile);
    });
  }, []);

  useEffect(() => {
    // console.log(addressCords);
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

  const [farmerDetails, setFarmerDetails] = useState(farmerData);

  const [farmerLands, setFarmerLands] = useState([]);

  const [data, setData] = useState({
    id: 25,
    farmerUid: 'axyz',
    firstName: 'Daya',
    middleName: 'Point',
    lastName: 'Prasad',
    mobileNo: '0000000000',
    altMobileNo: '854244522',
    kisanCardNumber: 'dfs',
    approvalToCollectRawMaterial: true,
    catchementAreaId: 8,
    imageDetails: {
      id: 24,
      imageSrc: 'ewtrey',
      imageUri: 'dfgd',
      imageUrlExpiryDate: '2023-01-23',
      orgUnitId: null,
      tenantId: 'TEST',
    },
    farmerAddress: {
      firstLine: 'test',
      secondLine: 'test',
      village: 'test',
      postCode: 'test',
      district: 'test',
      state: 'test',
      country: 'test',
      addressCoordinate: {
        type: 'Point',
        coordinates: [36.13434, -1.2334],
      },
      landmark: 'test',
      insertDataCoordinate: {
        type: 'Point',
        coordinates: [36.13434, -1.2334],
      },
      tenantId: 'TEST',
    },
    editAllowed: false,
    tenantId: 'TEST',
    catchmentName: 'Adgaon',
    captureCoordinate: {
      type: 'Point',
      coordinates: [36.13434, -1.2334],
    },
    harvesterNeeded: true,
    nightHarvestingAllowed: true,
    insertDataCoordinate: {
      type: 'Point',
      coordinates: [36.13434, -1.2334],
    },
  });

  useEffect(() => {
    setData({
      id: farmerDetails.id,
      farmerUid: farmerDetails.farmerUid,
      firstName: farmerDetails.firstName,
      middleName: farmerDetails.middleName,
      lastName: farmerDetails.lastName,
      mobileNo: farmerDetails.mobileNo,
      altMobileNo: farmerDetails.altMobileNo,
      kisanCardNumber: farmerDetails.kisanCardNumber,
      approvalToCollectRawMaterial: farmerDetails.approvalToCollectRawMaterial,
      catchementAreaId: farmerDetails.catchementAreaId,
      imageDetails: farmerDetails.imageDetails,
      farmerAddress: farmerDetails.farmerAddress,
      editAllowed: farmerDetails.editAllowed,
      tenantId: farmerDetails.tenantId,
      catchmentName: farmerDetails.catchmentName,
      captureCoordinate: farmerDetails.captureCoordinate,
      harvesterNeeded: farmerDetails.harvesterNeeded,
      nightHarvestingAllowed: farmerDetails.nightHarvestingAllowed,
      insertDataCoordinate: farmerDetails.insertDataCoordinate,
    });
  }, []);

  const [catchementAreaList, setCatchementAreaList] = useState([]);
  const [selectedCatchementArea, setSelectedCatchementArea] = useState(0);

  useEffect(() => {
    if (profile === null) {
      return;
    }
    Axios.get('/catchmentArea/' + JSON.parse(profile).orgUnitId)
      .then(res => {
        //   setCatchementAreaList(res.data);
        //   select catchement area on farmer details
        setSelectedCatchementArea(
          res.data.findIndex(
            item => item.id === farmerDetails.catchementAreaId,
          ) + 1,
        );
      })
      .catch(err => {
        console.log(err);
      });
  }, [profile]);

  // console.log(farmerDetails);

  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    // fetch image
    // console.log(farmerDetails.imageDetails);
    if (farmerDetails.imageDetails.id === null) {
      return;
    }
    // console.log(item.imageDetails);
    // return

    // return
    Axios.get(`/images/${farmerDetails.imageDetails.id}`)
      .then(async function (response) {
        // check if response is 200
        if (response.status !== 200) {
          alert('Error fetching image');
          return;
        }
        const objectURL = `data:image/png;base64,${response.data.image}`;
        setImageUri(objectURL);
      })
      .catch(function (error) {
        alert('Error fetching image');
      });
  }, []);

  const selectFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      //Printing the log realted to the file
      // console.log('res : ' + JSON.stringify(res));
      // console.log('URI : ' + res[0].uri);
      // console.log('Type : ' + res[0].type);
      // console.log('File Name : ' + res[0].name);
      // console.log('File Size : ' + res[0].size);
      //Setting the state to show single file attributes
      setImageUri(res[0].uri);
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

  const updateData = () => {
    // Check if user have Permission for this action
    const {accessUserRole} = JSON.parse(profile);
    try {
      checkAuth(accessUserRole, 'FARMERUPDATE');
      // console.log(JSON.stringify(data));
      Axios.put('/farmer/' + farmerData.id, data)
        .then(res => {
          // console.log(res.data);
          refreshFarmerList();
          navigation.goBack();
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchFarmerLands();
  }, []);

  const fetchFarmerLands = () => {
    // get list of farmer lands
    Axios.get(`/farmerLand/${farmerData.id}/0/20`)
      .then(function (response) {
        // check if response is 200
        if (response.status !== 200) {
          alert('Error fetching farmer lands');
          return;
        }
        //  console.log(response.data, 'resssssssssssssssssss');
        setFarmerLands(response.data);
      })
      .catch(function (error) {
        console.log(error);
        //  console.log(error.response);
        alert('Error fetching farmer lands');
      });
  };

  // Create view that have list of all setting options
  const options = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ];

  const [isEditable, setIsEditable] = useState(false);
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#ececec'}}>
      <View style={{marginHorizontal: 10, marginTop: 10}}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 5,
            marginVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignContent: 'center',
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: '#B21B1D',
                textAlign: 'center',
              }}>
              {farmerData.firstName} {farmerData.lastName}
            </Text>
          </View>
        </View>
        <View style={styles.div}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            Did we harvested in last cycle?
          </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#0f5717'}}>
            Partialy Yes
          </Text>
        </View>
        <View style={styles.div}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            Did we collected raw material?
          </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#0f5717'}}>
            Partialy Yes
          </Text>
        </View>
        <View style={styles.div}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            Did we get raw material?
          </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#0f5717'}}>
            Partialy Yes
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
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
                fontSize: 18,
                fontWeight: 'bold',
                color: '#B21B1D',
                marginTop: 0,
                width: '50%',
                alignSelf: 'flex-start',
              }}>
              Personal Details
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!isEditable) {
                Linking.openURL(`tel:${farmerDetails.mobileNo}`);
              }
            }}>
            <BoldTextInput
              label="Mobile Number"
              style={{
                marginTop: 20,
                backgroundColor: '#fff',
              }}
              // set editable to false
              editable={isEditable}
              value={farmerDetails.mobileNo}
              onChangeText={text => {
                setData({
                  ...data,
                  mobileNo: text,
                });
                setFarmerDetails({
                  ...farmerDetails,
                  mobileNo: text,
                });
              }}
            />
          </TouchableOpacity>
          <BoldTextInput
            label="Alterantive Number"
            variant="standard"
            style={{
              marginTop: 10,
            }}
            editable={isEditable}
            value={farmerDetails.altMobileNo}
            onChangeText={text => {
              setData({
                ...data,
                altMobileNo: text,
              });
              setFarmerDetails({
                ...farmerDetails,
                altMobileNo: text,
              });
            }}
          />
          <BoldTextInput
            label="Address Line 1"
            variant="standard"
            style={{
              marginTop: 10,
            }}
            editable={isEditable}
            value={farmerDetails.farmerAddress.firstLine}
            onChangeText={text => {
              setData({
                ...data,
                farmerAddress: {
                  ...data.farmerAddress,
                  firstLine: text,
                },
              });
              setFarmerDetails({
                ...farmerDetails,
                farmerAddress: {
                  ...farmerDetails.farmerAddress,
                  firstLine: text,
                },
              });
            }}
          />
          <BoldTextInput
            label="Address Line 2"
            variant="standard"
            style={{
              marginTop: 10,
            }}
            editable={isEditable}
            value={farmerDetails.farmerAddress.secondLine}
            onChangeText={text => {
              setData({
                ...data,
                farmerAddress: {
                  ...data.farmerAddress,
                  secondLine: text,
                },
              });
              setFarmerDetails({
                ...farmerDetails,
                farmerAddress: {
                  ...farmerDetails.farmerAddress,
                  secondLine: text,
                },
              });
            }}
          />
          <Stack style={{width: '100%', marginTop: 10}} direction="row">
            <BoldTextInput
              label="Village"
              variant="standard"
              style={{
                width: '50%',
              }}
              editable={isEditable}
              value={farmerDetails.farmerAddress.village}
              onChangeText={text => {
                setData({
                  ...data,
                  farmerAddress: {
                    ...data.farmerAddress,
                    village: text,
                  },
                });
                setFarmerDetails({
                  ...farmerDetails,
                  farmerAddress: {
                    ...farmerDetails.farmerAddress,
                    village: text,
                  },
                });
              }}
            />
            <BoldTextInput
              label="District"
              variant="standard"
              style={{
                width: '50%',
              }}
              editable={isEditable}
              value={farmerDetails.farmerAddress.district}
              onChangeText={text => {
                setData({
                  ...data,
                  farmerAddress: {
                    ...data.farmerAddress,
                    district: text,
                  },
                });
                setFarmerDetails({
                  ...farmerDetails,
                  farmerAddress: {
                    ...farmerDetails.farmerAddress,
                    district: text,
                  },
                });
              }}
            />
          </Stack>

          <Stack style={{width: '100%', marginTop: 10}} direction="row">
            <BoldTextInput
              label="Pincode*"
              variant="standard"
              style={{
                width: '50%',
              }}
              value={farmerDetails.farmerAddress.postCode}
              editable={isEditable}
              onChangeText={text => {
                setData({
                  ...data,
                  farmerAddress: {
                    ...data.farmerAddress,
                    postCode: text,
                  },
                });
                setFarmerDetails({
                  ...farmerDetails,
                  farmerAddress: {
                    ...farmerDetails.farmerAddress,
                    postCode: text,
                  },
                });
              }}
            />
            <BoldTextInput
              label="State*"
              variant="standard"
              style={{
                width: '50%',
              }}
              value={farmerDetails.farmerAddress.state}
              editable={isEditable}
              onChangeText={text => {
                setData({
                  ...data,
                  farmerAddress: {
                    ...data.farmerAddress,
                    state: text,
                  },
                });
                setFarmerDetails({
                  ...farmerDetails,
                  farmerAddress: {
                    ...farmerDetails.farmerAddress,
                    state: text,
                  },
                });
              }}
            />
          </Stack>

          <BoldTextInput
            label="Country*"
            variant="standard"
            style={{
              marginTop: 10,
            }}
            value={farmerDetails.farmerAddress.country}
            editable={isEditable}
            onChangeText={text => {
              setData({
                ...data,
                farmerAddress: {
                  ...data.farmerAddress,
                  country: text,
                },
              });
              setFarmerDetails({
                ...farmerDetails,
                farmerAddress: {
                  ...farmerDetails.farmerAddress,
                  country: text,
                },
              });
            }}
          />

          <TouchableOpacity
            onPress={() => {
              if (isEditable) {
                navigation.navigate('MapsForPinLocation', {
                  setAddressCord: setAddressCords,
                });
              }
            }}
            style={{
              marginTop: 10,
            }}>
            <BoldTextInput
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
                <Image
                  source={map}
                  style={{height: 35, width: 35, marginRight: 10}}
                />
              }
            />
          </TouchableOpacity>

          <MapView
            style={{width: '100%', height: 200}}
            region={{
              latitude:
                addressCords.length > 0 ? addressCords[0].latitude : 37.78825,
              longitude:
                addressCords.length > 0 ? addressCords[0].longitude : -122.4324,
              latitudeDelta: 0.015 / 20,
              longitudeDelta: 0.0121 / 20,
            }}
            mapType="satellite">
            {addressCords.length > 0 && (
              <Marker
                coordinate={{
                  latitude: addressCords[0].latitude,
                  longitude: addressCords[0].longitude,
                }}
                title="Farmer Address"
                description="Farmer Address"
              />
            )}
          </MapView>

          <BoldTextInput
            label="Landmark"
            variant="standard"
            style={{
              marginTop: 10,
            }}
            editable={isEditable}
            value={farmerDetails.farmerAddress.landmark}
            onChangeText={text => {
              setData({
                ...data,
                farmerAddress: {
                  ...data.farmerAddress,
                  landmark: text,
                },
              });
              setFarmerDetails({
                ...farmerDetails,
                farmerAddress: {
                  ...farmerDetails.farmerAddress,
                  landmark: text,
                },
              });
            }}
          />
          {isEditable ? (
            <View>
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
                  setFarmerDetails({
                    ...farmerDetails,
                    catchmentName: catchementAreaList[itemIndex].name,
                  });
                }}>
                {catchementAreaList.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.name}
                      value={item.id}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </View>
          ) : (
            <BoldTextInput
              label="Catchment Area"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              value={farmerDetails.catchmentName}
              editable={isEditable}
              trailing={
                isEditable ? (
                  <AntDesign name="down" size={20} color="#000000" />
                ) : null
              }
            />
          )}
          <BoldTextInput
            label="Kisan Card Details"
            variant="standard"
            style={{
              marginTop: 10,
            }}
            editable={isEditable}
            value={farmerDetails.kisanCardNumber}
            onChangeText={text => {
              setData({
                ...data,
                kisanCardNumber: text,
              });
              setFarmerDetails({
                ...farmerDetails,
                kisanCardNumber: text,
              });
            }}
          />
          <Stack style={{width: '100%', marginTop: 10}} direction="row">
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#000000',

                width: '50%',
                alignSelf: 'center',
              }}>
              Harvester Needed
            </Text>

            <SwitchSelector
              options={options}
              initial={farmerDetails.harvesterNeeded ? 0 : 1}
              onPress={value => {
                setData({
                  ...data,
                  harvesterNeeded: value === 0 ? true : false,
                });
                setFarmerDetails({
                  ...farmerDetails,
                  harvesterNeeded: value === 0 ? true : false,
                });
              }}
              style={{
                width: '50%',
              }}
              disabled={!isEditable}
            />
          </Stack>
          <Stack style={{width: '100%', marginTop: 10}} direction="row">
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#000000',

                width: '50%',
                alignSelf: 'center',
              }}>
              Night Harvesting
            </Text>

            <SwitchSelector
              options={options}
              initial={farmerDetails.nightHarvestingAllowed ? 0 : 1}
              onPress={value => {
                setData({
                  ...data,
                  nightHarvestingAllowed: value === 0 ? true : false,
                });
                setFarmerDetails({
                  ...farmerDetails,
                  nightHarvestingAllowed: value === 0 ? true : false,
                });
              }}
              style={{
                width: '50%',
              }}
              disabled={!isEditable}
            />
          </Stack>
          <Stack style={{width: '100%', marginTop: 10}} direction="row">
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#000000',

                width: '50%',
                alignSelf: 'center',
              }}>
              Collect Raw Material Approval
            </Text>

            <SwitchSelector
              options={options}
              initial={farmerDetails.approvalToCollectRawMaterial ? 0 : 1}
              onPress={value => {
                setData({
                  ...data,
                  approvalToCollectRawMaterial: value === 0 ? true : false,
                });
                setFarmerDetails({
                  ...farmerDetails,
                  approvalToCollectRawMaterial: value === 0 ? true : false,
                });
              }}
              style={{
                width: '50%',
              }}
              disabled={!isEditable}
            />
          </Stack>
          {isEditable ? (
            <Stack
              style={{marginTop: 10, alignSelf: 'flex-end', padding: 10}}
              direction="row">
              {/* save and dicard button */}
              <TouchableOpacity
                onPress={() => {
                  setIsEditable(!isEditable);
                }}>
                <Image source={Cancel} style={{height: 40, width: 40}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={() => {
                  setIsEditable(!isEditable);
                  updateData();
                }}>
                <Image source={Ok} style={{height: 40, width: 40}} />
              </TouchableOpacity>
            </Stack>
          ) : (
            <TouchableOpacity
              style={{
                marginTop: 10,
                alignSelf: 'flex-end',
                backgroundColor: '#B21B1D',
                padding: 10,
                borderRadius: 50,
              }}
              onPress={() => {
                setIsEditable(!isEditable);
              }}>
              <Image
                source={editButton}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default VerifyForCyclePage;

const styles = StyleSheet.create({
  div: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
});
