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
          console.log('---------farmerdailyaddition---------');
          console.log(response.data);
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
          console.log('---------usertargetpercollectioncycle---------');
          console.log(response.data);
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

        <View
          style={{
            backgroundColor: '#D9D9D9',
            marginHorizontal: 10,
            borderRadius: 5,
            marginVertical: 10,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              position: 'relative',
              padding: 20,
              justifyContent: 'space-between',
              borderBottomWidth: showDetails ? 1 : 0,
              borderColor: '#fafafa',
            }}
            onPress={() => setShowDetails(!showDetails)}>
            <Text
              style={{
                fontSize: 20,
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
            marginVertical: 10,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              position: 'relative',
              padding: 20,
              justifyContent: 'space-between',
              borderBottomWidth: showLandDetails ? 1 : 0,
              borderColor: '#fafafa',
            }}
            onPress={() => setShowLandDetails(!showLandDetails)}>
            <Text
              style={{
                fontSize: 20,
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
      </View>
    </ScrollView>
  );
}
