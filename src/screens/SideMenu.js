import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../assets/user.png';
import {useNavigation} from '@react-navigation/native';

const SideMenu = () => {
  const [userDetails, setUserDetails] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('profile').then(profile => {
      if (profile !== null) {
        setUserDetails(JSON.parse(profile));
      }
    });
  }, []);
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <View style={{padding: 10, marginTop: 20}}>
        <Pressable
          onPress={() => navigation.navigate('Comingsoon')}
          style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Value Added Services
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Heap')}
          style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Heap
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Comingsoon')}
          style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Raw material estimation methodology
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Comingsoon')}
          style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Local Payments
          </Text>
        </Pressable>
        <Pressable
          style={styles.div}
          onPress={() => navigation.navigate('CostCalculation')}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Cost Calculation
          </Text>
        </Pressable>
        <Pressable
          style={styles.div}
          onPress={() => navigation.navigate('DummyFarmerLand')}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Show Land Parcels near me
          </Text>
        </Pressable>

        <Pressable
          style={styles.div}
          onPress={() => navigation.navigate('QueryScreen')}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Raise A Query
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Comingsoon')}
          style={styles.div}>
          <Text style={{fontWeight: 'bold', color: '#494c4c', fontSize: 16}}>
            Daily Status reporting
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Comingsoon')}
          style={styles.div}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#494c4c',
              fontSize: 16,
            }}>
            Daily Transport Vehicle Reporting
          </Text>
        </Pressable>
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
