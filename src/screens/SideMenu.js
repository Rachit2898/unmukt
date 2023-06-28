import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../assets/user.png';

const SideMenu = () => {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    AsyncStorage.getItem('profile').then(profile => {
      if (profile !== null) {
        setUserDetails(JSON.parse(profile));
      }
    });
  }, []);
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          padding: 10,
          marginRight: 10,
          borderBottomWidth: 1,
          marginBottom: 10,
          backgroundColor: '#fff',
        }}>
        <Image
          source={User}
          onError={() => setImage(require('../assets/profile.png'))}
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
            borderWidth: 2,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#494c4c',
          }}>
          {userDetails.firstName} {userDetails.lastName}
        </Text>
      </View>
      <View style={{padding: 10}}>
        <View style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Value Added Services
          </Text>
        </View>
        <View style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Heap
          </Text>
        </View>
        <View style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Raw material estimation methodology
          </Text>
        </View>
        <View style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Local Payments
          </Text>
        </View>
        <View style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Cost Calculation
          </Text>
        </View>
        <View style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Show Land Parcels near me
          </Text>
        </View>

        <View style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Raise A Query
          </Text>
        </View>
        <View style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Daily Status reporting
          </Text>
        </View>
        <View style={styles.div}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#494c4c',
              fontSize: 16,
            }}>
            Daily Transport Vehicle Reporting
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#B21B1D',
          position: 'absolute',
          bottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          height: 50,
          marginHorizontal: 10,
          borderRadius: 5,
        }}>
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
          Logout
        </Text>
      </View>
    </View>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  div: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
});
