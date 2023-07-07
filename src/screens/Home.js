import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Linking,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BarChart, Grid} from 'react-native-svg-charts';
import BarChartComponent from './BarChartComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Axios} from '../core/axios';
import WeatherCard from './WeatherCard';
import {useFocusEffect} from '@react-navigation/native';
import imageUp from '../assets/upDown.png';
import imageDown from '../assets/dropDown.png';

const dailyData = {
  labels: ['Target', 'Achieved'],
  datasets: [
    {
      data: [500, 323],
      colors: [
        (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // green color for target
        (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // red color for achieved
      ],
    },
  ],
};

const weeklyData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      data: [120, 150, 80, 220],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
};

const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [300, 450, 280, 800, 990, 430],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
};

const chartConfig = {
  yAxisMinValue: 0,
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

export default function Home() {
  // Create view that have list of all setting options
  const screenWidth = Dimensions.get('window').width;
  const [showDetails, setShowDetails] = useState(true);
  const [showLandDetails, setShowLandDetails] = useState(true);
  const [showSourcingDetails, setShowSourcingDetails] = useState(true);
  const [sourceData, setSourceData] = useState('');

  var data = dailyData;

  const [activeTab, setActiveTab] = useState('daily');

  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  if (activeTab === 'daily') {
    data = dailyData;
    labels = dailyData.labels;
  } else if (activeTab === 'weekly') {
    data = weeklyData;
    labels = weeklyData.labels;
  } else if (activeTab === 'monthly') {
    data = monthlyData;
    labels = monthlyData.labels;
  }

  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    AsyncStorage.getItem('profile').then(profile => {
      if (profile !== null) {
        setUserDetails(JSON.parse(profile));
      }
    });
  }, []);

  const [farmerList, setFarmerList] = useState([]);

  const [dailyFarmerAchieved, setDailyFarmerAchieved] = useState(0);
  const [dailyFarmerTarget, setDailyFarmerTarget] = useState(0);

  const [weeklyFarmerAchieved, setWeeklyFarmerAchieved] = useState(0);
  const [weeklyFarmerTarget, setWeeklyFarmerTarget] = useState(0);

  const [totalFarmerAchieved, setTotalFarmerAchieved] = useState(0);
  const [totalFarmerTarget, setTotalFarmerTarget] = useState(0);

  const [landList, setLandList] = useState([]);

  const [dailyLandAchieved, setDailyLandAchieved] = useState(0);
  const [dailyLandTarget, setDailyLandTarget] = useState(0);

  const [weeklyLandAchieved, setWeeklyLandAchieved] = useState(0);
  const [weeklyLandTarget, setWeeklyLandTarget] = useState(0);

  const [totalLandAchieved, setTotalLandAchieved] = useState(0);
  const [totalLandTarget, setTotalLandTarget] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // console.log('url', '/farmerdailyaddition/username/' + userDetails.userName+'/'+userDetails.orgUnitId)
      Axios.get(
        '/farmerdailyaddition/username/' +
          userDetails.userName +
          '/' +
          userDetails.orgUnitId,
      )
        .then(response => {
          setFarmerList(response.data);
        })
        .catch(error => {
          console.log(error);
        });

      Axios.get(
        '/usertargetpercollectioncycle/' +
          userDetails.userName +
          '/' +
          userDetails.orgUnitId,
      )
        .then(response => {
          setDailyFarmerTarget(response.data[0].dailyTarFarmerAddition);
          setWeeklyFarmerTarget(response.data[0].weeklyTarFarmerAddition);
          setTotalFarmerTarget(response.data[0].totalTarFarmerAddition);

          setDailyLandTarget(response.data[0].dailyTarAcreLandAddition);
          setWeeklyLandTarget(response.data[0].weeklyTarAcreLandAddition);
          setTotalLandTarget(response.data[0].totalTarAcreLandAddition);
        })
        .catch(error => {
          console.log(error);
        });

      Axios.get('sourcingDashboardSummary/June-2023/1 ')
        .then(response => {
          setSourceData(response.data);
        })
        .catch(error => {
          console.log(error);
        });

      // Land KPIs
      Axios.get(
        '/farmerlanddailykpis/username/' +
          userDetails.userName +
          '/' +
          userDetails.orgUnitId,
      )
        .then(response => {
          //   console.log('---------farmerlanddailykpis---------')
          //   console.log(response.data);
          setLandList(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }, [userDetails]),
  );

  useEffect(() => {
    setDailyFarmerAchieved(getTotalFarmersAdded('daily'));
    setWeeklyFarmerAchieved(getTotalFarmersAdded('weekly'));
    setTotalFarmerAchieved(getTotalFarmersAdded('total'));
  }, [farmerList]);

  useEffect(() => {
    setDailyLandAchieved(getTotalLandsAdded('daily'));
    setWeeklyLandAchieved(getTotalLandsAdded('weekly'));
    setTotalLandAchieved(getTotalLandsAdded('total'));
  }, [landList]);

  // Filter farmer list based on date range
  const getFilteredFarmerList = dateRange => {
    const currentDate = new Date();
    let startDate = null;
    if (dateRange === 'weekly') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7,
      );
    } else if (dateRange === 'daily') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
    }
    console.log(startDate, dateRange);
    return farmerList.filter(farmer => {
      const farmerDateAdded = new Date(
        farmer.dateAdded[0],
        farmer.dateAdded[1] - 1,
        farmer.dateAdded[2],
      );
      return startDate
        ? farmerDateAdded >= startDate && farmerDateAdded <= currentDate
        : true;
    });
  };

  // Filter land list based on date range
  const getFilteredLandList = dateRange => {
    const currentDate = new Date();
    let startDate = null;
    if (dateRange === 'weekly') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7,
      );
    } else if (dateRange === 'daily') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
    }
    return landList.filter(farmer => {
      const farmerDateAdded = new Date(
        farmer.dateAdded[0],
        farmer.dateAdded[1] - 1,
        farmer.dateAdded[2],
      );
      return startDate
        ? farmerDateAdded >= startDate && farmerDateAdded <= currentDate
        : true;
    });
  };

  // Get total farmers added for a given date range
  const getTotalFarmersAdded = dateRange => {
    const filteredFarmerList = getFilteredFarmerList(dateRange);
    return filteredFarmerList.reduce(
      (total, farmer) => total + farmer.totalFarmerAdded,
      0,
    );
  };

  // Get total land added for a given date range
  const getTotalLandsAdded = dateRange => {
    const filteredLandList = getFilteredLandList(dateRange);
    return filteredLandList.reduce(
      (total, farmer) => total + farmer.landSizeAcre,
      0,
    );
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,

        backgroundColor: '#fff',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
      }}>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'column',
          width: '100%',
        }}>
        <View style={{marginHorizontal: 10, borderRadius: 5}}>
          <WeatherCard />
        </View>

        <View style={styles.firstDiv}>
          <TouchableOpacity
            style={[styles.button, {borderBottomWidth: showDetails ? 1 : 0}]}
            onPress={() => setShowDetails(!showDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Farmer’s Addition KPI
            </Text>
            {!showDetails ? (
              <Image
                source={imageUp}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            ) : (
              <Image
                source={imageDown}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            )}
          </TouchableOpacity>

          {showDetails && (
            <View
              style={{
                marginTop: 10,
                flexDirection: 'column',
              }}>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '33%',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#000000',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Daily
                  </Text>
                  <BarChartComponent
                    target={dailyFarmerTarget}
                    achieved={dailyFarmerAchieved}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    width: '33%',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#000000',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Weekly
                  </Text>
                  <BarChartComponent
                    target={weeklyFarmerTarget}
                    achieved={weeklyFarmerAchieved}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '33%',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#000000',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Total
                  </Text>
                  <BarChartComponent
                    target={totalFarmerTarget}
                    achieved={totalFarmerAchieved}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            backgroundColor: '#D9D9D9',
            marginHorizontal: 10,
            borderRadius: 5,
            marginVertical: 5,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              position: 'relative',
              padding: 10,
              justifyContent: 'space-between',
              borderBottomWidth: showLandDetails ? 1 : 0,
              borderColor: '#fafafa',
            }}
            onPress={() => setShowLandDetails(!showLandDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Land Addition KPI
            </Text>

            {!showLandDetails ? (
              <Image
                source={imageUp}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            ) : (
              <Image
                source={imageDown}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            )}
          </TouchableOpacity>

          {showLandDetails && (
            <View
              style={{
                marginTop: 10,
                flexDirection: 'column',
              }}>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '33%',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#000000',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Daily
                  </Text>
                  <BarChartComponent
                    target={dailyLandTarget}
                    achieved={dailyLandAchieved}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    width: '33%',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#000000',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Weekly
                  </Text>
                  <BarChartComponent
                    target={weeklyLandTarget}
                    achieved={weeklyLandAchieved}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    width: '33%',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#000000',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Total
                  </Text>
                  <BarChartComponent
                    target={totalLandTarget}
                    achieved={totalLandAchieved}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.firstDiv}>
          <TouchableOpacity
            style={[styles.button, {borderBottomWidth: showDetails ? 1 : 0}]}
            onPress={() => setShowSourcingDetails(!showSourcingDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Sourcing KPI
            </Text>
            {!showSourcingDetails ? (
              <Image
                source={imageUp}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            ) : (
              <Image
                source={imageDown}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            )}
          </TouchableOpacity>

          {showSourcingDetails && (
            <View
              style={{
                marginHorizontal: 10,
                flexDirection: 'column',
                marginBottom: 10,
              }}>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: '#B21B1D',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  Farmers & Land
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Farmers
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.farmers_count ? sourceData?.farmers_count : 0}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Land Onboarded
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.land_onboarded ? sourceData?.land_onboarded : 0}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Total Land (Acres)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.total_land_in_acres
                    ? sourceData?.total_land_in_acres
                    : 0}
                </Text>
              </View>

              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: '#B21B1D',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  Harvesting
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Harvesting Completed (Acres)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.area_harvested ? sourceData?.area_harvested : 0}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Harvesting Done by Farmer (Acres)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.area_harvested_by_farmers
                    ? sourceData?.area_harvested_by_farmers
                    : 0}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Harvesting in Progress (Acres)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.area_harvesting_in_progress
                    ? sourceData?.area_harvesting_in_progress
                    : 0}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Farmers who used their Harvesters
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.harvesting_by_farmers
                    ? sourceData?.harvesting_by_farmers
                    : 0}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Farmer who used USPL Harvesters
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.harvesting_by_uspl
                    ? sourceData?.harvesting_by_uspl
                    : 0}
                </Text>
              </View>

              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: '#B21B1D',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  Harvesting to be Started
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Farmer Impacted
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.farmer_impacted_count_h
                    ? sourceData?.farmer_impacted_count_h
                    : 0}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Land Parcel Impacted
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.land_parcel_impacted_count_h
                    ? sourceData?.land_parcel_impacted_count_h
                    : 0}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Land Impacted (Acres)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.land_impacted_in_acres_h
                    ? sourceData?.land_impacted_in_acres_h
                    : 0}
                </Text>
              </View>

              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: '#B21B1D',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  Infra Details
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Harvester
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.harvester_count
                    ? sourceData?.harvester_count
                    : 0}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Tractor
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.tractor_count ? sourceData?.tractor_count : 0}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Baler
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.baler_count ? sourceData?.baler_count : 0}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Reaper
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.reaper_count ? sourceData?.reaper_count : 0}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Pickup
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.racker_count}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Rickshaw
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.rickshaw_count}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Racker
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.racker_count}
                </Text>
              </View>

              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: '#B21B1D',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  Raw Material Collection Details
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Area Collected (Acres)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.area_collected}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Collection In Progress (Acres)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.area_collection_in_progress}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Bales Count
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.count_of_bales}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Bales Collected (Tons)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.bales_collected}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Loose material collected (Tons)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.loose_rm_collected}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Total Material Collected (Tons)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.material_collected}
                </Text>
              </View>

              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: '#B21B1D',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  Raw Material Collection to be started
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Farmer Impacted
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.farmer_impacted_count_c}
                </Text>
              </View>

              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Land Parcel (Impacted)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.land_parcel_impacted_count_c}
                </Text>
              </View>
              <View style={styles.div}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  Land Impacted (Acres)
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: 'gray'}}>
                  {sourceData?.land_impacted_in_acres_c}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.firstDiv}>
          <TouchableOpacity
            style={[styles.button, {borderBottomWidth: showDetails ? 1 : 0}]}
            onPress={() => setShowDetails(!showDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Harvesting KPI
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#B21B1D',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Coming Soon
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.firstDiv}>
          <TouchableOpacity
            style={[styles.button, {borderBottomWidth: showDetails ? 1 : 0}]}
            onPress={() => setShowDetails(!showDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Collection KPI
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#B21B1D',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Coming Soon
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.firstDiv}>
          <TouchableOpacity
            style={[styles.button, {borderBottomWidth: showDetails ? 1 : 0}]}
            onPress={() => setShowDetails(!showDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Weekly Task KPI
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#B21B1D',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Coming Soon
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.firstDiv}>
          <TouchableOpacity
            style={[styles.button, {borderBottomWidth: showDetails ? 1 : 0}]}
            onPress={() => setShowDetails(!showDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Monthly Task KPI
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#B21B1D',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Coming Soon
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.firstDiv}>
          <TouchableOpacity
            style={[styles.button, {borderBottomWidth: showDetails ? 1 : 0}]}
            onPress={() => setShowDetails(!showDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Last 7 Days Harvesting KPI
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#B21B1D',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Coming Soon
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.firstDiv}>
          <TouchableOpacity
            style={[styles.button, {borderBottomWidth: showDetails ? 1 : 0}]}
            onPress={() => setShowDetails(!showDetails)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000000',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Last 7 Days Collection KPI
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#B21B1D',
                marginHorizontal: 10,
                alignSelf: 'center',
              }}>
              Coming Soon
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  div: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 1,
    borderRadius: 5,
  },
  firstDiv: {
    backgroundColor: '#D9D9D9',
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  button: {
    flexDirection: 'row',
    position: 'relative',
    padding: 10,
    justifyContent: 'space-between',
    borderColor: '#fafafa',
  },
});
