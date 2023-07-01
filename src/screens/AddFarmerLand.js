import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  Alert,
  Pressable,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  Stack,
  TextInput,
  IconButton,
  Button,
  Icon,
} from '@react-native-material/core';
import SwitchSelector from 'react-native-switch-selector';
// import SvgUri from 'react-native-svg-uri';
import MapPin from '../assets/MapPin.svg';
import DocumentPicker from 'react-native-document-picker';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector, Provider} from 'react-redux';
import geolib, {getAreaOfPolygon} from 'geolib';
import {Picker} from '@react-native-picker/picker';
import {Axios} from '../core/axios';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker, Polygon} from 'react-native-maps';
import axios from 'axios';
import HarvestingSub from './CommanCompo/HarvestingSub';
import RawMaterialSub from './CommanCompo/RawMaterialSub';
import {checkAuth} from '../Helper';
import upDown from '../assets/upDown.png';
import dropDown from '../assets/dropDown.png';
import Verified from '../assets/verified.png';
import UnVerified from '../assets/unverified.png';

const BoldTextInput = ({
  label,
  value,
  onChangeText,
  editable,
  style,
  trailing,
}) => {
  return (
    <View style={style}>
      <Text style={{fontWeight: 'bold'}}>{label}</Text>
      <TextInput
        variant="standard"
        style={{fontWeight: 'bold'}}
        editable={editable}
        value={value}
        onChangeText={onChangeText}
        trailing={trailing}
      />
    </View>
  );
};

export default function AddFarmerLand({navigation, route}) {
  const {
    fetchFarmerLands,
    farmerId,
    isViewMode = false,
    landDetails,
    farmerName,
    redirect = false,
    imageUri,
  } = route.params;
  console.log('first', route.params);
  const [showPopup, setShowPopup] = useState(false);
  const [farmDetailsAdded, setfarmDetailsAdded] = useState(false);
  const [isEditable, setIsEditable] = useState(!isViewMode);

  const [shouldShowShowing, setShouldShowShowing] = useState(true);
  const [collectionCycle, setCollectionCycle] = useState('');

  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [completeharvesterdetails, setcompleteharvesterdetails] = useState({});
  const [landId, setLandId] = useState(landDetails ? landDetails.id : null);
  const [showingData, setShowingData] = useState({
    farmerLandId: landId,
    collectionCycle: '',
    sowing_date: '',
    sowingDuration: 0,
    grainType: '',
    expectedHarvestingDate: '',
    insertDataCoordinate: {
      type: 'Point',
      coordinates: [],
    },
  });

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      setToken(token);
    });
    AsyncStorage.getItem('profile').then(profile => {
      setProfile(profile);
      // console.log(JSON.parse(profile) ,'profileeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    });
  }, []);

  const [locations, setLocations] = React.useState(null);

  React.useEffect(() => {
    const fetchLocation = async () => {
      const locationURL = 'https://maps.app.goo.gl/UNVgimysFD9RS1MC9'; // Replace with your location URL
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationURL,
        )}`,
      ); // Replace YOUR_API_KEY with your actual Google Maps API key

      if (response.data.results.length > 0) {
        const {lat, lng} = response.data.results[0].geometry.location;
        setLocations({lat: lat, lng: lng});
      }
    };

    fetchLocation();
  }, []);

  console.log({locations});

  useEffect(() => {
    var collectionCycle = '';
    // If the current date is between 15th Jan to 15th July then it is June-2023 (and then June-2024, June-2025 ....) and if the current date is between 16th July to 14th Jan then it would be Dec-2023 (and then Dec-2024 ...Dec-2025) ...
    var today = new Date();
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();
    if (currentMonth >= 0 && currentMonth <= 6) {
      collectionCycle = 'June' + '-' + currentYear;
    } else if (currentMonth >= 7 && currentMonth <= 11) {
      collectionCycle = 'December' + '-' + currentYear;
    }
    setCollectionCycle(collectionCycle);
  }, []);

  useEffect(() => {
    if (collectionCycle && isViewMode) {
      Axios.get(`landCollectionDetails/${landId}/${collectionCycle}`)
        .then(res => {
          console.log(res);
          const json = res.data;
          if (json?.sowing_date) {
            const sowing_date = new Date(
              json.sowing_date[0],
              json.sowing_date[1] - 1,
              json.sowing_date[2],
            );
            const expectedHarvestingDate = new Date(
              json.expectedHarvestingDate[0],
              json.expectedHarvestingDate[1] - 1,
              json.expectedHarvestingDate[2],
            );
            console.log(
              json.sowing_date[0],
              json.sowing_date[1] - 1,
              json.sowing_date[0],
              'dateeeeeeeeeeeeeeeeeeee',
            );
            setShowingData({
              ...showingData,
              sowing_date,
              expectedHarvestingDate,
              sowingDuration: json.sowingDuration,
              grainType: json.grainType,
              collectionCycle: json.collectionCycle,
              insertDataCoordinate: landDetails?.insertDataCoordinate,
            });
            setcompleteharvesterdetails(json);
            setShowingDate(sowing_date);
            setHarvestingDate(expectedHarvestingDate);
            setShouldShowShowing(false);
            return;
          }
          setShouldShowShowing(true);
          setShowingData(state => ({
            ...state,
            collectionCycle,
            insertDataCoordinate: landDetails?.insertDataCoordinate,
          }));
        })
        .catch(err => {
          alert('Something went wrong' + ' ' + err.message);
          console.log(err);
        });

      // AsyncStorage.getItem("landCollectionDetails"+landId)
      // .then((data) => {
      //     // console.log('-------landCollectionDetails-------'+landId);
      //     // console.log(data);
      //     if(data){
      //         const json = JSON.parse(data);
      //         console.log(json)
      //         var collectionCycle = "";
      //                 // If the current date is between 15th Jan to 15th July then it is June-2023 (and then June-2024, June-2025 ....) and if the current date is between 16th July to 14th Jan then it would be Dec-2023 (and then Dec-2024 ...Dec-2025) ...
      //                 var today = new Date();
      //                 var currentMonth = today.getMonth();
      //                 var currentYear = today.getFullYear();
      //                 if(currentMonth >= 0 && currentMonth <= 6){
      //                     collectionCycle = "June"+'-'+ currentYear;
      //                 }else if(currentMonth >= 7 && currentMonth <= 11){
      //                     collectionCycle = "December"+'-' + currentYear;
      //                 }
      //                 if(json[0]?.collectionCycle === collectionCycle){
      //                     setShowingDate(new Date(json[0].sowing_date));
      //                     setHarvestingDate(new Date(json[0].expectedHarvestingDate));

      //                     setShowingData({
      //                         ...showingData,
      //                         sowing_date: new Date(json[0].sowing_date),
      //                         expectedHarvestingDate: new Date(json[0].expectedHarvestingDate),
      //                         sowingDuration: json[0].sowingDuration,
      //                         grainType: json[0].grainType,
      //                         collectionCycle: json[0].collectionCycle
      //                     });
      //                     setShouldShowShowing(false);
      //                 }else{
      //                     setShouldShowShowing(true);
      //                 }
      //         setCollectionCycle(collectionCycle);
      //     }
      // }
      // )
      // .catch((err) => {
      //     console.log(err);
      // });
    }
  }, [collectionCycle, landDetails]);

  // useEffect(() => {
  //     if(landId){
  //         setShowingData({
  //             ...showingData,
  //             farmerLandId: landId
  //         });
  //     }
  // }, [landId]);
  // useEffect(() => {
  //     setShowingData({
  //         ...showingData,
  //         sowing_date: new Date(),
  //         expectedHarvestingDate: new Date()
  //     });
  // }, []);

  useEffect(() => {
    var collectionCycle = '';
    // If the current date is between 15th Jan to 15th July then it is June-2023 (and then June-2024, June-2025 ....) and if the current date is between 16th July to 14th Jan then it would be Dec-2023 (and then Dec-2024 ...Dec-2025) ...
    var today = new Date();
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();
    if (currentMonth >= 0 && currentMonth <= 6) {
      if (currentMonth === 6) {
        if (today.getDate() >= 15) {
          collectionCycle = 'June' + '-' + currentYear;
        } else {
          collectionCycle = 'December' + '-' + currentYear;
        }
      } else {
        collectionCycle = 'June' + '-' + currentYear;
      }
    } else if (currentMonth >= 7 && currentMonth <= 11) {
      if (currentMonth === 11) {
        if (today.getDate() <= 15) {
          collectionCycle = 'December' + '-' + currentYear;
        } else {
          collectionCycle = 'June' + '-' + (currentYear + 1);
        }
      } else {
        collectionCycle = 'December' + '-' + currentYear;
      }
    }
    // setShowingData({
    //     ...showingData,
    //     collectionCycle: collectionCycle,
    //     farmerLandId: landId,
    //     sowing_date: new Date(),
    //     expectedHarvestingDate: new Date(),
    //     insertDataCoordinate: {
    //         type: "Point",
    //         coordinates: location ? [location.insertDataCoordinate.coordinates[0], location.insertDataCoordinate.coordinates[1]]: [0, 0]
    //     }

    // });
  }, [showingDate, harvestingDate, landId, location]);

  const [location, setLocation] = useState(null);
  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        console.log(pos);
        const crd = pos.coords;
        console.log(crd);
        //   setPosition({
        //     latitude: crd.latitude,
        //     longitude: crd.longitude,
        //     latitudeDelta: 0.0421,
        //     longitudeDelta: 0.0421,
        //   });

        setLocation({
          insertDataCoordinate: {
            type: 'Point',
            coordinates: [crd.longitude, crd.latitude],
          },
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const [polygonCoords, setMyPolygonCoords] = useState([]);

  const [jsonData, setJsonData] = useState({
    landmark: '',
    plotNumOrSurveyNum: '',
    landSize: '',
    landUnit: '',
    harvestingPlan: 'HARVESTER',
    landOwnership: 'FARMEROWNED',
    // "polygon":{
    //         "type": "Point",
    //         "coordinates": [
    //            ]
    //     },
    polygonCoordinate: '',
    insertDataCoordinate: {
      type: 'Point',
      coordinates: [],
    },
    reaperNeeded: true,
    landCatchmentId: 0,
    distanceToWaterSource: 0,
    overrideByUser: 'N',
  });

  const [showDetails, setShowDetails] = useState(true);
  const [showHarvestingDetails, setShowHarvestingDetails] = useState(false);
  const [showRawMaterialDetails, setShowRawMaterialDetails] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showingDate, setShowingDate] = useState(new Date());
  const [showHarvestingDatePicker, setShowHarvestingDatePicker] =
    useState(false);
  const [harvestingDate, setHarvestingDate] = useState(new Date());

  // const polygonCoords = useSelector((state) => state.areaCordinates);

  const [areaCalculation, setAreaCalculation] = useState(0);

  const [catchementAreaList, setCatchementAreaList] = useState([]);
  const [selectedCatchementArea, setSelectedCatchementArea] = useState(0);

  useEffect(() => {
    if (areaCalculation > 0 && jsonData.landSize !== '') {
      //    check if the difference is less more than 20% or not
      var diff = Math.abs(areaCalculation - jsonData.landSize);
      var percentage = (diff / jsonData.landSize) * 100;
      console.log(percentage);
      if (percentage >= 20 && !isViewMode) {
        // alert with yes or no to override
        Alert.alert(
          'Override',
          'Map calculated area & area provide by farmer is differer by 20% Do You want to override the data?',
          [
            {
              text: 'No',
              onPress: () => {
                setJsonData({
                  ...jsonData,
                  overrideByUser: 'N',
                });
              },
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                setJsonData({
                  ...jsonData,
                  overrideByUser: 'Y',
                });
              },
            },
          ],
          {cancelable: false},
        );
        return;
      }
    }
  }, [areaCalculation]);

  const submitLandDetails = () => {
    // Check if user have Permission for this action
    const {accessUserRole} = JSON.parse(profile);
    try {
      checkAuth(accessUserRole, 'FARMERUPDATE');
      console.log('working');
      // check all fields are filled or not one by one
      if (jsonData.plotNumOrSurveyNum === '') {
        alert('Please enter plot number or survey number');
        return;
      }

      if (jsonData.landSize === '') {
        alert('Please enter land size');
        return;
      }
      if (jsonData.landUnit === '') {
        alert('Please enter land unit');
        return;
      }

      console.log(farmerId);
      console.log(jsonData);
      Axios.post('/farmerLand/' + farmerId, jsonData)
        .then(res => {
          console.log(res.data);
          console.log(res.data.id);
          // go back to previous screen
          fetchFarmerLands();
          setLandId(res.data.id);
          setShowDetails(true);
          setfarmDetailsAdded(true);
          alert('Land added successfully');
          // navigation.goBack();
        })
        .catch(err => {
          console.log(err.response);
          alert('Error adding land details');
        });
    } catch (err) {
      alert(err.message);
    }
  };

  const updateLandDetails = () => {
    // Check if user have Permission for this action
    const {accessUserRole} = JSON.parse(profile);
    try {
      checkAuth(accessUserRole, 'FARMERUPDATE');
      console.log(JSON.stringify(jsonData));
      Axios.put('/farmerLand/' + farmerId, jsonData)
        .then(res => {
          console.log(res.data);
          alert('Land updated successfully');
          // go back to previous screen
          fetchFarmerLands();
          navigation.goBack();
        })
        .catch(err => {
          // print error status
          console.log(err);
          console.log(err.response);
          alert('Error adding land details');
        });
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (profile === null) {
      return;
    }
    Axios.get('/catchmentArea/' + JSON.parse(profile).orgUnitId)
      .then(res => {
        // console.log(res.data);
        setCatchementAreaList(res.data);
        setSelectedCatchementArea(
          res.data.findIndex(item => item.id === landDetails.landCatchmentId),
        );
      })
      .catch(err => {
        // console.log(err);
      });
  }, [profile]);

  useEffect(() => {
    if (isViewMode) {
      if (redirect) {
        return;
      }
      console.log(landDetails);

      // console.log(landDetails.landOwnership);
      setJsonData({
        ...jsonData,
        id: landDetails.id,
        landmark: landDetails.landmark,
        landSize: landDetails.landSize,
        landCatchmentId: landDetails.landCatchmentId,
        plotNumOrSurveyNum: landDetails.plotNumOrSurveyNum,
        harvestingPlan: landDetails.harvestingPlan,
        landOwnership: landDetails.landOwnership,
        reaperNeeded: landDetails.reaperNeeded,
        distanceToWaterSource: landDetails.distanceToWaterSource,
        // polygon: {
        //     ...jsonData.polygon,
        //     coordinates: landDetails.polygon.coordinates
        // },
        polygonCoordinate: landDetails.polygonCoordinate,
        insertDataCoordinate: {
          ...jsonData.insertDataCoordinate,
          coordinates: landDetails.insertDataCoordinate.coordinates,
        },
        autoCalcLandArea: landDetails.autoCalcLandArea,
        overrideByUser: landDetails.overrideByUser,
        landUnit: landDetails.landUnit,
        catchmentName: landDetails.catchmentName,
        tenantId: landDetails.tenantId,
      });

      // loop through the coordinates and set the polygon
      var latlongArray = JSON.parse(landDetails.polygonCoordinate) || [];
      var newpolygonCoords = [];
      latlongArray.forEach(element => {
        newpolygonCoords.push({
          latitude: element[1],
          longitude: element[0],
        });
      });

      setMyPolygonCoords(newpolygonCoords);

      setAreaCalculation(Number(landDetails.autoCalcLandArea));
    }
  }, [landDetails]);

  useEffect(() => {
    // console.log(polygonCoords);
    if (polygonCoords.length > 2) {
      const areaInAcres = calculateAreaInAcres();
      // console.log(areaInAcres);
      setAreaCalculation(Number(areaInAcres));

      var latlongArray = [];
      var latLogNormal = [];
      polygonCoords.forEach(element => {
        latlongArray.push([element.longitude, element.latitude]);
        latLogNormal.push(element.longitude);
        latLogNormal.push(element.latitude);
      });
      // console.log(latlongArray);
      setJsonData({
        ...jsonData,
        autoCalcLandArea: Number(areaInAcres),
        // polygon: {
        //     ...jsonData.polygon,
        //     coordinates: latlongArray
        // },
        polygonCoordinate: JSON.stringify(latlongArray),
        insertDataCoordinate: {
          ...jsonData.insertDataCoordinate,
          coordinates: latLogNormal,
        },
      });
    }
  }, [polygonCoords]);

  const calculateAreaInAcres = () => {
    const polygonCoordinates = polygonCoords.flat(); // flatten the array of arrays
    const areaInSquareMeters = getAreaOfPolygon(polygonCoordinates);
    const areaInAcres = areaInSquareMeters / 4046.85642;
    return areaInAcres.toFixed(2); // return the result rounded to 2 decimal places
  };

  // useEffect(() => {
  //         console.log(jsonData);
  //     }, [jsonData]);

  // Create view that have list of all setting options
  const options = [
    {label: 'YES', value: 'Yes'},
    {label: 'NO', value: 'No'},
  ];

  const harvestingPlanOptions = [
    {label: 'HARVESTER', value: 'Harvester'},
    {label: 'MANUAL', value: 'Manual'},
  ];
  const landOwnerOptions = [
    {label: 'OWNED', value: 'Owned'},
    {label: 'LEASED', value: 'Leased'},
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ececec',
      }}>
      <>
        <DatePicker
          modal
          open={showDatePicker}
          date={showingDate}
          onConfirm={date => {
            console.log(date, 'test');
            setShowDatePicker(false);
            setShowingDate(date);

            setShowingData({
              ...showingData,
              sowing_date: date.toISOString(),
            });
          }}
          onCancel={() => {
            setShowDatePicker(false);
          }}
        />
      </>

      <>
        <DatePicker
          modal
          open={showHarvestingDatePicker}
          date={harvestingDate}
          onConfirm={date => {
            console.log(date);
            setShowHarvestingDatePicker(false);
            setHarvestingDate(date);

            setShowingData({
              ...showingData,
              // make it string on same format as
              expectedHarvestingDate: date.toISOString(),
            });
          }}
          onCancel={() => {
            setShowHarvestingDatePicker(false);
          }}
        />
      </>
      <ScrollView style={{margin: 10}}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <View
            style={{
              flexDirection: 'row',

              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5,
            }}>
            <Image
              source={{uri: imageUri}}
              style={{
                width: 110,
                height: 125,
                marginHorizontal: 10,
                borderRadius: 2,
              }}
            />

            <View style={{width: '100%'}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  marginTop: 10,
                  width: '70%',
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: 'bold',
                      color: '#B21B1D',
                    }}>
                    {farmerName}
                  </Text>
                  {landDetails.catchmentName === 'Tora' ? (
                    <View style={{alignItems: 'center', width: '20%'}}>
                      <Image
                        style={{height: 22, width: 22}}
                        source={Verified}
                      />
                    </View>
                  ) : (
                    <View style={{alignItems: 'center', width: '20%'}}>
                      <Image
                        style={{height: 20, width: 20}}
                        source={UnVerified}
                      />
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    paddingTop: 10,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#000000',
                  }}>
                  UID: {farmerId}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  navigation.navigate('VerifyLand', {
                    fetchFarmerLands: fetchFarmerLands,
                    farmerId,
                    farmerName,
                    landDetails,
                    isViewMode: true,
                    imageUri,
                  })
                }
                style={{
                  alignContent: 'center',
                  marginTop: 10,
                  width: '55%',
                  paddingHorizontal: 10,
                  backgroundColor: '#B21B1D',
                  borderRadius: 5,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#fff',
                    textAlign: 'center',
                    padding: 10,
                  }}>
                  Verify for current cycle
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'column',
              marginVertical: 10,
              backgroundColor: '#fff',
              padding: 10,
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
                Land Details
              </Text>
            </View>

            <Stack style={{}}>
              {!redirect && (
                <>
                  <BoldTextInput
                    label="Land Area Provided by Farmer (in acres)*"
                    variant="standard"
                    style={{
                      marginTop: 20,
                    }}
                    keyboardType="numeric"
                    editable={isEditable}
                    value={String(jsonData.landSize) || ''}
                    onChangeText={text => {
                      setJsonData({
                        ...jsonData,
                        landSize: text,
                        landUnit: 'acres',
                      });
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (isEditable) {
                        navigation.navigate('MapView', {
                          polygonCoords,
                          setMyPolygonCoords,
                        });
                      }
                    }}
                    style={{
                      marginTop: 10,
                    }}>
                    <BoldTextInput
                      label="Automatic Area Calculated*"
                      variant="standard"
                      editable={false}
                      value={String(areaCalculation) || ''}
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
                  {isViewMode && polygonCoords && polygonCoords.length > 0 && (
                    <MapView
                      style={{width: '100%', height: 200}}
                      region={{
                        latitude:
                          polygonCoords.length > 0
                            ? polygonCoords[0].latitude
                            : 0,
                        longitude:
                          polygonCoords.length > 0
                            ? polygonCoords[0].longitude
                            : 0,
                        // zoom level based on the area of the polygon
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                      mapType="satellite"
                      zoomEnabled={true}>
                      {polygonCoords.length > 0 && (
                        <Polygon
                          coordinates={polygonCoords}
                          fillColor="rgba(255, 255, 255, 0.5)"
                        />
                      )}
                    </MapView>
                  )}

                  {isEditable ? (
                    <>
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
                          setJsonData({
                            ...jsonData,
                            landCatchmentId: itemValue,
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
                    </>
                  ) : (
                    <BoldTextInput
                      label="Catchment Area"
                      variant="standard"
                      style={{
                        marginTop: 10,
                      }}
                      value={landDetails.catchmentName}
                      editable={isEditable}
                      trailing={
                        isEditable ? (
                          <Image
                            style={{
                              position: 'absolute',
                              right: 0,
                              marginRight: 10,
                              height: 20,
                              width: 20,
                            }}
                            source={dropDown}
                          />
                        ) : null
                      }
                    />
                  )}

                  <BoldTextInput
                    label="Survey No/Plot No."
                    variant="standard"
                    style={{
                      marginTop: 20,
                    }}
                    editable={isEditable}
                    value={jsonData.plotNumOrSurveyNum}
                    onChangeText={text => {
                      setJsonData({...jsonData, plotNumOrSurveyNum: text});
                    }}
                  />
                  <BoldTextInput
                    label="Landmark"
                    variant="standard"
                    style={{
                      marginTop: 10,
                    }}
                    value={jsonData.landmark}
                    editable={isEditable}
                    onChangeText={text => {
                      setJsonData({...jsonData, landmark: text});
                    }}
                  />
                  <Stack style={{width: '100%', marginTop: 10}} direction="row">
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000000',

                        width: '50%',
                        alignSelf: 'center',
                      }}>
                      Harvesting Plan*
                    </Text>

                    <SwitchSelector
                      options={harvestingPlanOptions}
                      initial={
                        !isEditable
                          ? landDetails.harvestingPlan === 'HARVESTER'
                            ? 0
                            : 1
                          : jsonData.harvestingPlan === 'HARVESTER'
                          ? 0
                          : 1
                      }
                      onPress={value =>
                        setJsonData({...jsonData, harvestingPlan: value})
                      }
                      style={{
                        marginTop: 10,
                        width: '50%',
                      }}
                      disabled={!isEditable}
                    />
                  </Stack>
                  <Stack style={{width: '100%', marginTop: 10}} direction="row">
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000000',

                        width: '50%',
                        alignSelf: 'center',
                      }}>
                      Land Ownership*
                    </Text>

                    <SwitchSelector
                      options={landOwnerOptions}
                      initial={
                        !isEditable
                          ? landDetails.landOwnership === 'FARMEROWNED'
                            ? 0
                            : 1
                          : jsonData.landOwnership === 'FARMEROWNED'
                          ? 0
                          : 1
                      }
                      onPress={value =>
                        setJsonData({...jsonData, landOwnership: value})
                      }
                      style={{
                        marginTop: 10,
                        width: '50%',
                      }}
                      disabled={!isEditable}
                    />
                  </Stack>
                  <Stack style={{width: '100%', marginTop: 10}} direction="row">
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000000',

                        width: '50%',
                        alignSelf: 'center',
                      }}>
                      Reaper Needed*
                    </Text>

                    <SwitchSelector
                      options={options}
                      initial={
                        !isEditable
                          ? landDetails.reaperNeeded === true
                            ? 0
                            : 1
                          : jsonData.reaperNeeded === true
                          ? 0
                          : 1
                      }
                      onPress={value =>
                        setJsonData({
                          ...jsonData,
                          reaperNeeded: value === 'Yes' ? true : false,
                        })
                      }
                      style={{
                        marginTop: 10,
                        width: '50%',
                      }}
                      disabled={!isEditable}
                    />
                  </Stack>
                  {!redirect && !isEditable && (
                    <TouchableOpacity
                      style={{
                        marginTop: 10,
                        alignSelf: 'flex-end',
                        padding: 10,
                        backgroundColor: '#B21B1D',
                        // make it round
                        borderRadius: 50,
                      }}
                      onPress={() => {
                        setIsEditable(!isEditable);
                        setShowDetails(true);
                      }}>
                      <AntDesign name="edit" size={25} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  <BoldTextInput
                    label="Distance From Water Source (In Meters)"
                    variant="standard"
                    style={{
                      marginTop: 20,
                    }}
                    // only numbers
                    keyboardType="numeric"
                    value={String(jsonData.distanceToWaterSource) || ''}
                    editable={isEditable}
                    onChangeText={text => {
                      setJsonData({
                        ...jsonData,
                        distanceToWaterSource: Number(text),
                      });
                    }}
                  />
                </>
              )}
              {!redirect && isEditable && !farmDetailsAdded && (
                <Stack
                  style={{
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
                    onPress={() => navigation.goBack()}></Button>
                  <Button
                    mode="contained"
                    title="Save"
                    style={{
                      width: '40%',
                      backgroundColor: '#B21B1D',
                      marginTop: 10,
                    }}
                    onPress={() =>
                      !isViewMode ? submitLandDetails() : updateLandDetails()
                    }></Button>
                </Stack>
              )}
            </Stack>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5,
            }}>
            {!redirect && (
              <>
                <View
                  style={{
                    marginTop: 20,
                    alignSelf: 'flex-end',
                    padding: 10,
                    backgroundColor: '#B21B1D',
                    // make it round
                    borderRadius: 50,
                  }}>
                  {/* Show only month and year like July 2022 */}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#fff',
                    }}>
                    {collectionCycle}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    flexDirection: 'column',
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      position: 'relative',
                    }}
                    // onPress={() => setShowDetails(!showDetails)}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#B21B1D',
                        width: '50%',
                        alignSelf: 'center',
                      }}>
                      Sowing Details
                    </Text>

                    <Image
                      style={{
                        position: 'absolute',
                        right: 0,
                        marginRight: 10,
                        height: 20,
                        width: 20,
                      }}
                      source={dropDown}></Image>
                  </TouchableOpacity>

                  {/* {showDetails && ( */}
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'column',
                    }}>
                    {/* put datepicker inside textinput*/}
                    <TouchableOpacity
                      onPress={() => {
                        if (shouldShowShowing) {
                          setShowDatePicker(true);
                        }
                      }}>
                      <BoldTextInput
                        label="Date of Sowing"
                        variant="standard"
                        value={
                          // convert date to string
                          showingDate.getDate() +
                          '/' +
                          (showingDate.getMonth() + 1) +
                          '/' +
                          showingDate.getFullYear()
                        }
                        style={{
                          marginTop: 10,
                        }}
                        editable={shouldShowShowing}
                        // icon on right side of text input
                        trailing={
                          <FontAwesome5
                            name="calendar-alt"
                            size={20}
                            color="#B21B1D"
                          />
                        }
                      />
                    </TouchableOpacity>

                    <BoldTextInput
                      label="Sowing Duration (In Days)"
                      variant="standard"
                      style={{
                        marginTop: 10,
                      }}
                      value={String(showingData.sowingDuration) || ''}
                      onChangeText={text => {
                        setShowingData({
                          ...showingData,
                          sowingDuration: Number(text),
                        });
                      }}
                      editable={shouldShowShowing}
                    />
                    {/* put datepicker inside textinput*/}
                    <TouchableOpacity
                      onPress={() => {
                        if (shouldShowShowing) {
                          setShowHarvestingDatePicker(true);
                        }
                      }}>
                      <BoldTextInput
                        label="Expected Harvesting Date"
                        variant="standard"
                        style={{
                          marginTop: 10,
                        }}
                        value={
                          // convert date to string
                          harvestingDate.getDate() +
                          '/' +
                          (harvestingDate.getMonth() + 1) +
                          '/' +
                          harvestingDate.getFullYear()
                        }
                        editable={shouldShowShowing}
                        // icon on right side of text input
                        trailing={
                          <FontAwesome5
                            name="calendar-alt"
                            size={20}
                            color="#B21B1D"
                          />
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (shouldShowShowing) {
                          setShowHarvestingDatePicker(true);
                        }
                      }}>
                      <BoldTextInput
                        label="Expected Fire date"
                        variant="standard"
                        style={{
                          marginTop: 10,
                        }}
                        value={{}}
                        editable={shouldShowShowing}
                        // icon on right side of text input
                        trailing={
                          <FontAwesome5
                            name="calendar-alt"
                            size={20}
                            color="#B21B1D"
                          />
                        }
                      />
                    </TouchableOpacity>
                    <BoldTextInput
                      label="Grain Type"
                      variant="standard"
                      style={{
                        marginTop: 10,
                      }}
                      value={String(showingData.grainType) || ''}
                      onChangeText={text => {
                        setShowingData({...showingData, grainType: text});
                      }}
                      editable={shouldShowShowing}
                    />
                    {showDetails && shouldShowShowing && landId && (
                      <Stack
                        style={{
                          justifyContent: 'space-between',
                        }}
                        direction="row">
                        <Button
                          mode="contained"
                          title="Cancel"
                          style={{
                            width: '40%',
                            backgroundColor: '#B21B1D',
                            marginTop: 10,
                          }}
                          onPress={() => navigation.goBack()}></Button>
                        <Button
                          mode="contained"
                          title="Save"
                          style={{
                            width: '40%',
                            backgroundColor: '#B21B1D',
                            marginTop: 10,
                          }}
                          onPress={() => {
                            // Check if user have Permission for this action
                            const {accessUserRole} = JSON.parse(profile);
                            try {
                              checkAuth(accessUserRole, 'FARMERUPDATE');
                              console.log(
                                showingData,
                                'submiiiiiiiiiiiiiiiiiiiiiiitttttttttt',
                              );
                              // return
                              // save data to database
                              Axios.post('/landCollectionDetails', showingData)
                                .then(response => {
                                  console.log(response.data);
                                  if (landId) {
                                    // AsyncStorage.getItem('landCollectionDetails'+landId)
                                    // .then((data) => {
                                    // var dataInAsyncStorage = JSON.parse(data);
                                    // if (dataInAsyncStorage) {
                                    //     // remove the old item
                                    //     AsyncStorage.setItem('landCollectionDetails'+landId, JSON.stringify(showingData));
                                    // } else {
                                    //     AsyncStorage.setItem('landCollectionDetails'+landId, JSON.stringify([showingData]));
                                    // }
                                    // Alert.alert('Success', 'Data saved successfully');
                                    // })
                                    // .catch((error) => {
                                    // console.log(error);
                                    // AsyncStorage.setItem('landCollectionDetails'+landId, JSON.stringify(showingData));
                                    Alert.alert(
                                      'Success',
                                      'Data saved successfully',
                                    );
                                    // });
                                  } else {
                                    // AsyncStorage.setItem('landCollectionDetails'+landId, JSON.stringify([showingData]));
                                    Alert.alert(
                                      'Success',
                                      'Data saved successfully',
                                    );
                                  }
                                  navigation.goBack();
                                })
                                .catch(error => {
                                  console.log(
                                    error,
                                    'errrorrrrrrrrrrrrrrrrrrrrrrrrr',
                                  );
                                });
                            } catch (err) {
                              alert(err.message);
                            }
                          }}></Button>
                      </Stack>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
            }}>
            <View
              style={{
                marginTop: 30,
                flexDirection: 'column',
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                }}
                onPress={() =>
                  setShowHarvestingDetails(!showHarvestingDetails)
                }>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#000000',

                    width: '50%',
                    alignSelf: 'center',
                  }}>
                  Harvesting Details
                </Text>
                {!showHarvestingDetails ? (
                  <Image
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginRight: 10,
                      height: 20,
                      width: 20,
                    }}
                    source={dropDown}
                  />
                ) : (
                  <Image
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginRight: 10,
                      height: 20,
                      width: 20,
                    }}
                    source={upDown}
                  />
                )}
              </TouchableOpacity>

              {showHarvestingDetails &&
                (shouldShowShowing ? (
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'column',
                      height: 150,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* show big start icon */}
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'center',
                        // make the view fadeit
                        opacity: 0.5,
                      }}>
                      <FontAwesome5
                        name="power-off"
                        size={50}
                        color="#B21B1D"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: '#000000',
                          marginTop: 10,
                        }}>
                        Start
                      </Text>
                    </View>
                  </View>
                ) : (
                  <HarvestingSub
                    navigation={navigation}
                    completeharvesterdetails={completeharvesterdetails}
                    profile={profile}
                    landDetails={landDetails}
                    farmerId={farmerId}
                    collectionCycle={collectionCycle}
                  />
                ))}
            </View>

            <View
              style={{
                marginTop: 30,
                flexDirection: 'column',
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                }}
                onPress={() =>
                  setShowRawMaterialDetails(!showRawMaterialDetails)
                }>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#000000',

                    alignSelf: 'center',
                  }}>
                  Raw Material Details
                </Text>

                {!showRawMaterialDetails ? (
                  <Image
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginRight: 10,
                      height: 20,
                      width: 20,
                    }}
                    source={dropDown}
                  />
                ) : (
                  <Image
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginRight: 10,
                      height: 20,
                      width: 20,
                    }}
                    source={upDown}
                  />
                )}
              </TouchableOpacity>

              {showRawMaterialDetails &&
                (!completeharvesterdetails?.actualHarvestingEndDate ? (
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'column',
                      height: 150,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* show big start icon */}
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'center',
                        // make the view fadeit
                        opacity: 0.5,
                      }}>
                      <FontAwesome5
                        name="power-off"
                        size={50}
                        color="#B21B1D"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: '#000000',
                          marginTop: 10,
                        }}>
                        Start
                      </Text>
                    </View>
                  </View>
                ) : (
                  <RawMaterialSub
                    navigation={navigation}
                    completeharvesterdetails={completeharvesterdetails}
                    profile={profile}
                    landDetails={landDetails}
                    farmerId={farmerId}
                    collectionCycle={collectionCycle}
                  />
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
