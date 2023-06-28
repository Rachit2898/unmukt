import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
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

import WeatherCard from './WeatherCard';
import {useFocusEffect} from '@react-navigation/native';
import {Axios} from '../core/axios';
import imageUp from '../assets/upDown.png';
import imageDown from '../assets/dropDown.png';

const Infra = ({navigation, route, ...props}) => {
  const [showInfra, setShowinfra] = useState(true);
  const [showRaw, setShowRaw] = useState(false);
  const [harvesterList, setHarvesterList] = useState([]);
  const [profile, setProfile] = useState({});
  const [collectionCycle, setCollectionCycle] = useState(null);
  const [tractorList, setTractorList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('profile').then(profile => {
        setProfile(JSON.parse(profile));
      });

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
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (profile?.orgUnitId && collectionCycle) {
        Axios.get(
          `getAllInfraDetailsbyType/H/${collectionCycle}/${profile.orgUnitId}`,
        )
          .then(res => {
            setHarvesterList([
              {modelName: 'Select', engineNumber: 'Harvester', id: null},
              ...res.data,
            ]);
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
        Axios.get(
          `getAllInfraDetailsbyType/T/${collectionCycle}/${profile.orgUnitId}`,
        )
          .then(res => {
            setTractorList([
              {
                modelName: 'Select',
                engineNumber: 'Transport Vehicle',
                id: null,
              },
              ...res.data,
            ]);
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
      }
    }, [profile?.orgUnitId]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: '#B21B1D',
          marginHorizontal: 10,
          borderRadius: 5,
        }}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowinfra(state => !state)}>
          <Text style={styles.text}>INFRA</Text>

          {showInfra ? (
            <AntDesign name="down" size={20} color="#fff" />
          ) : (
            <AntDesign name="up" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>
      {showInfra && (
        <>
          <TouchableOpacity
            style={styles.dropdownItems}
            onPress={() =>
              navigation.navigate('HarvesterDailyRecord', {
                harvesterList: harvesterList,
                collectionCycle: collectionCycle,
                profile: profile,
              })
            }>
            <Text style={styles.text2}>Harvestor Daily Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItems}
            onPress={() =>
              navigation.navigate('HarvesterShifting', {
                harvesterList: harvesterList,
                collectionCycle: collectionCycle,
                profile: profile,
              })
            }>
            <Text style={styles.text2}>Harvester Shifting Records</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItems}
            onPress={() =>
              navigation.navigate('TactorDailyRecord', {
                tractorList: tractorList,
                collectionCycle: collectionCycle,
                profile: profile,
              })
            }>
            <Text style={styles.text2}>Tractor/Truck Daily Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItems}
            onPress={() =>
              navigation.navigate('RawMaterialTrip', {
                tractorList: tractorList,
                collectionCycle: collectionCycle,
                profile: profile,
              })
            }>
            <Text style={styles.text2}>Raw Material (Bales) Per Trip</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.line}></View>
      <View
        style={{
          backgroundColor: '#B21B1D',
          marginHorizontal: 10,
          borderRadius: 5,
        }}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowRaw(state => !state)}>
          <Text style={styles.text}>Accept Raw Material</Text>

          {showRaw ? (
            <AntDesign name="up" size={20} color="#fff" />
          ) : (
            <AntDesign name="down" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>
      {!showRaw && (
        <>
          <TouchableOpacity
            style={styles.dropdownItems}
            onPress={() =>
              navigation.navigate('AcceptRawMaterial', {
                tractorList: tractorList,
                collectionCycle: collectionCycle,
                profile: profile,
              })
            }>
            <Text style={styles.text2}>
              Accept Raw Material at Storage Area/Plant
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dropdown: {
    flexDirection: 'row',
    position: 'relative',
    padding: 10,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  text2: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
  line: {
    borderBottomColor: '#c1bfbf',
    marginHorizontal: 20,
    marginTop: 10,
  },
  dropdownItems: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default Infra;
