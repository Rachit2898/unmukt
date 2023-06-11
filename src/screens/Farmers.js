import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  TextInput,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Axios} from '../core/axios';
import Farmer from './CommanCompo/Farmer';
import {useFocusEffect} from '@react-navigation/native';
import {checkAuth} from '../Helper';

export default function Farmers({navigation}) {
  // Create view that have list of all setting options

  const [search, setSearch] = useState('');

  const [farmerList, setFarmerList] = useState([]);
  const [userName, setUserName] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setprofile] = useState(false);
  const [index, setIndex] = useState(0);

  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    // check if user is logged in and get user name
    AsyncStorage.getItem('profile').then(profile => {
      if (profile !== null) {
        setprofile(profile);
        setUserName(JSON.parse(profile).userName);
      }
    });
    AsyncStorage.getItem('token').then(token => {
      if (token !== null) {
        console.log(token);
        setToken(token);
        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    });
  }, []);

  const refreshList = () => {
    if (userName === null || token === null) {
      return;
    }
    setRefreshing(true);
    // get list of farmers
    Axios.get(`/farmer/0/10`)
      .then(function (response) {
        // check if response is 200
        if (response.status !== 200) {
          alert('Error fetching farmers');
          return;
        }
        setFarmerList(response.data);
        setRefreshing(false);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response);
        alert('Error fetching farmers');
      });
  };

  useFocusEffect(
    useCallback(() => {
      if (userName === null || token === null) {
        return;
      }

      // get list of farmers
      Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('useEffect');
      Axios.get(`/farmer/${index}/500`)
        .then(function (response) {
          // check if response is 200
          console.log(
            response,
            'farmer fetchedsdddddddddddddddddddddddddddddddddddddd',
          );
          if (response.status !== 200) {
            alert('Error fetching farmers');
            setRefreshing(false);
            return;
          }
          setIndex(0);
          setRefreshing(false);
          setFarmerList(state => [...response.data]);
        })
        .catch(function (error) {
          setRefreshing(false);
          console.log(JSON.stringify(error));
          console.log(error.response);
          alert('Error fetching farmers');
        });
    }, [userName, token]),
  );

  useEffect(() => {
    if (userName === null || token === null || index == 0) {
      return;
    }
    console.log('get more list of farmers');
    Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    Axios.get(`/farmer/${index}/500`)
      .then(function (response) {
        // check if response is 200
        if (response.status !== 200) {
          alert('Error fetching farmers');
          return;
        }
        setFarmerList(state => [...state, ...response.data]);
        console.log(response, console.log(index));
        setRefreshing(false);
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        console.log(error.response);
        alert('Error fetching farmers');
        setRefreshing(false);
      });
  }, [index]);

  const refreshFarmerList = () => {
    if (userName === null || token === null) {
      return;
    }
    console.log('refresh');
    setRefreshing(true);
    // get list of farmers
    Axios.get(`/farmer/0/10`)
      .then(function (response) {
        // check if response is 200
        if (response.status !== 200) {
          alert('Error fetching farmers');
          return;
        }
        setIndex(0);
        setFarmerList(response.data);
        setRefreshing(false);
      })
      .catch(function (error) {
        setRefreshing(false);
        console.log(error);
        console.log(error.response);
        alert('Error fetching farmers');
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
      }}>
      {/* create a search bar on top using TextInput with a search icon on left */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%',
          marginTop: 10,
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 10,
          backgroundColor: '#ffffff',
        }}>
        <AntDesign
          name="search1"
          size={20}
          style={{color: '#000', marginLeft: 10}}
        />
        <TextInput
          style={{
            width: '90%',
            height: '100%',
            padding: 10,
          }}
          placeholder="Search for Farmer by Name/Mobile"
          onChangeText={text => setSearch(text)}
          value={search}
        />
      </View>

      {/* create a list of farmers */}
      <FlatList
        style={{
          marginTop: 10,
        }}
        data={farmerList.filter(farmer => {
          if (search === '') {
            return true;
          }
          if (farmer.firstName.toLowerCase().includes(search.toLowerCase())) {
            return true;
          }
          // if (farmer.lastName.toLowerCase().includes(search.toLowerCase())) {
          //     return true;
          // }
          if (farmer.mobileNo.toLowerCase().includes(search.toLowerCase())) {
            return true;
          }
          return false;
        })}
        initialNumToRender={50}
        // onEndReached={()=>{setIndex(index=>index+1);setRefreshing(true);console.log('triggereddddddddddddddddddddddddddddddddddddddd')}}
        // onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refreshFarmerList}
        renderItem={({item}) => (
          <Farmer
            navigation={navigation}
            item={item}
            refreshFarmerList={refreshFarmerList}
          />
        )}
        // end each item with a horizontal line
      />
      {/* Add an add floating button on bottom left */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: '#B21B1D',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          try {
            const {accessUserRole} = JSON.parse(profile);
            checkAuth(accessUserRole, 'FARMERUPDATE');
            // navigation.navigate('AddFarmer', {refreshFarmerList: refreshFarmerList});
          } catch (err) {
            alert(err.message);
          }
          // navigate to add farmer screen
        }}>
        <AntDesign name="plus" size={20} style={{color: '#fff'}} />
      </TouchableOpacity>
    </View>
  );
}
