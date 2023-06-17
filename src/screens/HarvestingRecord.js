import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
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
  Modal,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Axios} from '../core/axios';
import imageUp from '../assets/upDown.png';
import imageDown from '../assets/dropDown.png';

// Empty component

export default function HarvestingRecord({navigation, routes}) {
  const [showInfra, setShowinfra] = useState(true);
  const [showRaw, setShowRaw] = useState(false);
  const [collectionCycle, setCollectionCycle] = useState(null);
  const [profile, setProfile] = useState({});
  const [HarvestingList, setHarvestingList] = useState([]);
  const [RawMaterialList, setRawMaterialList] = useState([]);
  const [loading, setLoading] = useState(false);

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
      if (collectionCycle) {
        Axios.get(`/harvestingcollectionlists/H/${collectionCycle}`)
          .then(res => {
            setHarvestingList(res?.data);
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
        Axios.get(`/harvestingcollectionlists/C/${collectionCycle}`)
          .then(res => {
            setRawMaterialList(res?.data);
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
      }
    }, [collectionCycle]),
  );

  const navigate = prop => {
    setLoading(true);
    Axios.get(`landCollectionDetails/${prop.farmerLandId}/${collectionCycle}`)
      .then(res => {
        setTimeout(() => {
          console.log(res);
          setLoading(false);
          navigation.navigate('AddFarmerLand', {
            farmerId: prop.farmerId,
            isViewMode: true,
            landDetails: {...res?.data, id: prop.farmerLandId},
            redirect: true,
          });
        }, 500);
      })
      .catch(err => {
        alert(`Unable to fetch land details`);
        console.log(err);
        setLoading(false);
      });
  };
  const setstatus = activitycode => {
    switch (activitycode) {
      case 'S':
        return 'Started';
      case 'R':
        return 'Restarted';
      case 'E':
        return 'Ended';
      case 'PB':
        return 'Paused for breakdown';
      case 'PF':
        return 'Paused for Lunch';
      case 'PO':
        return 'Paused for other';
      case 'PL':
        return 'Paused for other';
    }
  };
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <View style={styles.sec}>
        <View
          style={{
            backgroundColor: '#BD1B21',
            marginHorizontal: 10,
            borderRadius: 5,
          }}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowinfra(state => !state)}>
            <Text style={styles.text}>Harvesting in Progress</Text>

            {!showInfra ? (
              <AntDesign name="up" size={20} color="#fff" />
            ) : (
              <AntDesign name="down" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        {showInfra ? (
          <View style={{backgroundColor: '#f2f2f2'}}>
            {HarvestingList.map((prop, key) => {
              return (
                <TouchableOpacity
                  style={styles.listItem}
                  key={key}
                  onPress={() => navigate(prop)}>
                  <Text style={[styles.text, {fontSize: 16}]}>
                    {prop?.farmerName}
                  </Text>
                  <Text style={styles.text2}>
                    Land id : {prop?.farmerLandId}
                  </Text>
                  <Text style={styles.text2}>
                    Catchment area : {prop?.landCatchmentArea}
                  </Text>
                  <Text style={styles.text2}>
                    Farmer mobile : {prop?.farmerMobieNumber}
                  </Text>
                  <Text
                    style={[
                      styles.text2,
                      {textAlign: 'right', width: '100%', fontWeight: 'bold'},
                    ]}>
                    Status : {setstatus(prop?.processCode)}{' '}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
      <View style={styles.sec}>
        <View
          style={{
            backgroundColor: '#BD1B21',
            marginHorizontal: 10,
            borderRadius: 5,
          }}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowRaw(state => !state)}>
            <Text style={styles.text}>Raw Material Collection in Progress</Text>

            {!showRaw ? (
              <AntDesign name="up" size={20} color="#fff" />
            ) : (
              <AntDesign name="down" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        {showRaw ? (
          <View style={{backgroundColor: '#f2f2f2'}}>
            {RawMaterialList.map((prop, key) => {
              return (
                <TouchableOpacity
                  style={styles.listItem}
                  key={key}
                  onPress={() => navigate(prop)}>
                  <Text style={[styles.textFarmer, {fontSize: 16}]}>
                    {prop?.farmerName}
                  </Text>
                  <Text style={styles.text2}>Land id : {prop?.farmerId}</Text>
                  <Text style={styles.text2}>
                    Catchment area : {prop?.landCatchmentArea}
                  </Text>
                  <Text style={styles.text2}>
                    Farmer mobile : {prop?.farmerMobieNumber}
                  </Text>
                  <Text
                    style={[styles.text2, {width: '100%', fontWeight: 'bold'}]}>
                    Status : {setstatus(prop?.processCode)}{' '}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
      <Modal transparent={true} visible={loading} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <ActivityIndicator size={'large'} color={'#B21B1D'} />
            <Text style={styles.text}>Fetching land details</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dropdown: {
    flexDirection: 'row',
    position: 'relative',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',

    // alignSelf: 'center',
  },
  textFarmer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B21B1D',
    marginLeft: 10,
  },

  text2: {
    fontSize: 14,
    color: '#494c4c',
    marginLeft: 10,
    paddingVertical: 3,
    // width: '60%',
    // alignSelf: 'center',
  },
  icon: {
    position: 'absolute',
    right: 0,

    padding: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
    padding: 10,
  },
  sec: {
    borderRadius: 10,
    marginVertical: 10,
  },
  modal: {
    width: '90%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
