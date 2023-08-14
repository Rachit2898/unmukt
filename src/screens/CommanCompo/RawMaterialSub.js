import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useFocusEffect} from '@react-navigation/native';
import {Axios} from '../../core/axios';
import {Picker} from '@react-native-picker/picker';
import StartBtn from '../../assets/btn/start.svg';
import Pause from '../../assets/btn/pause.svg';
import OffBtn from '../../assets/btn/off.svg';
import RestartBtn from '../../assets/btn/restart.svg';
import {TextInput} from '@react-native-material/core';
import {checkAuth} from '../../Helper';

const pauseOptions = [
  {title: 'Breakdown', value: 'PB'},
  {title: 'Lunch/Snacks', value: 'PF'},
  {title: 'Land not ready', value: 'PL'},
  {title: 'Other', value: 'PO'},
];

const loosMterialIndicatorOptions = [
  {title: 'Bales', value: false},
  {title: 'Loose', value: true},
];

const RawMaterialSub = props => {
  const {farmerId, landDetails, collectionCycle, profile} = props;
  const [harvestingDetails, setHarvestingDetails] = useState(null);
  const [lossMaterialIndicator, setlossMaterialIndicator] = useState(false);
  const [bale, setBales] = useState('0');
  const [currentHarvestingActivity, setCurrentHarvestingActivity] =
    useState('');

  useFocusEffect(
    useCallback(() => {
      Axios.get(
        `harvestingCollectionDetails/${farmerId}/${landDetails.id}/${collectionCycle}/C/Y`,
      )
        .then(Hres => {
          if (Hres.data.length != 0) {
            setHarvestingDetails(Hres.data[0]);
          }
        })
        .catch(err => {
          alert(`Error while completing action ${err?.message}`);
          console.log(err);
        });
    }, [farmerId, landDetails, profile]),
  );

  const startHarvesting = async activity => {
    // Check if user have Permission for this action
    const {accessUserRole} = JSON.parse(profile);

    try {
      checkAuth(accessUserRole, 'INFRAUPDATE');
      if (
        !activity &&
        (harvestingDetails?.processCode == 'S' ||
          harvestingDetails?.processCode == 'R') &&
        activity != 'E'
      ) {
        alert('please select reason');
        return;
      }
      if (activity == 'E' && !lossMaterialIndicator && bale.trim() <= 0) {
        alert('Add bales count');
        return;
      }
      const data = {
        farmerId: farmerId,
        farmerLandId: landDetails.id,
        collectionCycle: collectionCycle,
        infraId: '',
        activityType: 'C',
        processCode: activity,
        activityDateTime: new Date().toISOString().substring(0, 19),
        countOfBales: lossMaterialIndicator ? null : bale,
        looseMaterialIndigator: lossMaterialIndicator,
      };
      Axios.post(`harvestingCollectionDetails`, data)
        .then(res => {
          console.log(res);
          if (res?.data?.processCode == 'E') {
            props.navigation.goBack();
            alert('Raw material collaction completed');
            return;
          }
          setHarvestingDetails(res.data);
          if (activity == 'R') {
            setCurrentHarvestingActivity('');
          }
        })
        .catch(err => {
          alert(`Error while completing action ${err?.message}`);
          console.log(err);
        });
    } catch (err) {
      alert(err.message);
    }
  };

  const dateFormater = dateString => {
    if (typeof dateString === 'object') {
      var date = new Date(...dateString);
    } else {
      var date = new Date(dateString);
    }

    // Add 5 hours and 30 minutes to the date
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(date);
    return formattedDate;
  };

  return (
    <>
      {/* if harvesting isnt started and response is null */}
      {!harvestingDetails && (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'column',
            // height: 150,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <>
            {/* show big start icon */}
            <View
              style={{
                marginTop: 10,
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center',
                // make the view fadeit
                // opacity: 0.5,
              }}>
              <TouchableOpacity onPress={() => startHarvesting('S')}>
                <FontAwesome5 name="power-off" size={50} color="#B21B1D" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginTop: 10,
                }}>
                Start Collecting
              </Text>
            </View>
          </>
        </View>
      )}
      {/* if harvesting started  */}
      {(harvestingDetails?.processCode == 'S' ||
        harvestingDetails?.processCode == 'R') && (
        <>
          <View
            style={{
              marginVertical: 20,
              marginLeft: 20,
              alignItems: 'center',
              width: 150,
            }}>
            <StartBtn width={50} height={50} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#000000',
                marginTop: 5,
              }}>
              Started
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                marginTop: 5,
              }}>
              {dateFormater(harvestingDetails?.activityDateTime)}
            </Text>
          </View>
          {/* show big start icon */}
          <View
            style={{
              marginTop: 10,
              // alignItems: 'center',
              // alignSelf: 'center',
              // make the view fadeit
              // opacity: 0.5,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => startHarvesting(currentHarvestingActivity)}>
                <Pause width={50} height={50} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                }}>
                Pause
              </Text>
              <View style={{marginTop: 10}}>
                {pauseOptions?.map((prop, key) => (
                  <TouchableOpacity
                    onPress={() => setCurrentHarvestingActivity(prop.value)}
                    key={key}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        backgroundColor: '#D9D9D9',
                        borderRadius: 9,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor:
                            prop.value == currentHarvestingActivity
                              ? '#B21B1D'
                              : '#D9D9D9',
                          borderRadius: 5,
                        }}></View>
                    </View>
                    <Text
                      style={{fontSize: 16, color: '#000000', marginLeft: 5}}>
                      {prop.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity onPress={() => startHarvesting('E')}>
                <OffBtn width={50} height={50} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                }}>
                End
              </Text>
              <View style={{marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => setlossMaterialIndicator(false)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: '#D9D9D9',
                      borderRadius: 9,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: !lossMaterialIndicator
                          ? '#B21B1D'
                          : '#D9D9D9',
                        borderRadius: 5,
                      }}></View>
                  </View>
                  <Text style={{fontSize: 16, color: '#000000', marginLeft: 5}}>
                    Bales
                  </Text>
                  <TextInput
                    style={{width: 90, marginLeft: 10}}
                    label="Count of bales"
                    variant="standard"
                    onChangeText={e => setBales(e)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setlossMaterialIndicator(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: '#D9D9D9',
                      borderRadius: 9,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: lossMaterialIndicator
                          ? '#B21B1D'
                          : '#D9D9D9',
                        borderRadius: 5,
                      }}></View>
                  </View>
                  <Text style={{fontSize: 16, color: '#000000', marginLeft: 5}}>
                    Loose
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {console.log(lossMaterialIndicator)}
        </>
      )}
      {/* ifharvesting paused  */}
      {(harvestingDetails?.processCode == 'PB' ||
        harvestingDetails?.processCode == 'PF' ||
        harvestingDetails?.processCode == 'PO') && (
        <>
          <View
            style={{
              marginVertical: 20,
              marginLeft: 20,
              alignItems: 'center',
              width: 150,
            }}>
            <Pause width={50} height={50} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#000000',
                marginTop: 5,
              }}>
              Paused
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                marginTop: 5,
              }}>
              {dateFormater(harvestingDetails?.activityDateTime)}
            </Text>
          </View>
          {/* show big start icon */}
          <View
            style={{
              marginTop: 10,
              // alignItems: 'center',
              // alignSelf: 'center',
              // make the view fadeit
              // opacity: 0.5,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity onPress={() => startHarvesting('R')}>
                <RestartBtn width={50} height={50} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                }}>
                Restart
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity onPress={() => startHarvesting('E')}>
                <OffBtn width={50} height={50} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000000',
                }}>
                End
              </Text>
              <View style={{marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => setlossMaterialIndicator(false)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: '#D9D9D9',
                      borderRadius: 9,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: !lossMaterialIndicator
                          ? '#B21B1D'
                          : '#D9D9D9',
                        borderRadius: 5,
                      }}></View>
                  </View>
                  <Text style={{fontSize: 16, color: '#000000', marginLeft: 5}}>
                    Bales
                  </Text>
                  <TextInput
                    style={{width: 90, marginLeft: 10}}
                    label="Count of bales"
                    variant="standard"
                    onChangeText={e => setBales(e)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setlossMaterialIndicator(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: '#D9D9D9',
                      borderRadius: 9,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: lossMaterialIndicator
                          ? '#B21B1D'
                          : '#D9D9D9',
                        borderRadius: 5,
                      }}></View>
                  </View>
                  <Text style={{fontSize: 16, color: '#000000', marginLeft: 5}}>
                    Loose
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
      {/*if harvesting is ended */}
      {harvestingDetails?.processCode == 'E' && (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'column',
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: '#39a029', fontSize: 18, fontWeight: 'bold'}}>
            COLLECTION HAS BEEN COMPLETED
          </Text>
          <Text style={{color: '#a07229', fontSize: 14, fontWeight: 'bold'}}>
            Start date :{' '}
            {dateFormater(
              props?.completeharvesterdetails?.rawMaterialCollectionStartDate,
            )}
          </Text>
          <Text style={{color: '#a07229', fontSize: 14, fontWeight: 'bold'}}>
            End date :{' '}
            {dateFormater(
              props?.completeharvesterdetails?.rawMaterialCollectionEndDate,
            )}
          </Text>
        </View>
      )}
    </>
  );
};

export default RawMaterialSub;
