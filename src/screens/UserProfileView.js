import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  ImageBackground,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {isLogin} from '../Redux-Files/loginSlice';
import {useNavigation} from '@react-navigation/native';
import User from '../assets/user.png';

export default function UserProfileView() {
  const [userDetails, setUserDetails] = useState({});
  const [image, setImage] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem('profile').then(profile => {
      if (profile !== null) {
        setUserDetails(JSON.parse(profile));
        setImage({uri: JSON.parse(profile)?.userImageId?.imageUri});
      }
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: '#fff',
          padding: 20,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={User}
            onError={() => setImage(require('../assets/profile.png'))}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 20,
              borderWidth: 2,
            }}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#494c4c',
            }}>
            {userDetails.firstName} {userDetails.lastName}
          </Text>
          <Text style={{fontSize: 18, marginBottom: 10, color: '#494c4c'}}>
            UID: {userDetails.id}
          </Text>
          <Text style={{fontSize: 18, marginBottom: 10, color: '#494c4c'}}>
            Designation: {userDetails.userDesignation}
          </Text>
        </View>

        <View style={[styles.infoContainer, {marginTop: 40}]}>
          <Text style={styles.infoText}>Email Address: </Text>
          <Text style={styles.infoTextValue}>{userDetails.email}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Mobile:</Text>
          <Text style={styles.infoTextValue}>{userDetails.mobileNo}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Catchment Area: </Text>
          <Text style={styles.infoTextValue}>
            {userDetails.assignedCatchmentAreaId
              ? userDetails.assignedCatchmentAreaId.map((item, index) => {
                  return <Text key={index}>{item.name} </Text>;
                })
              : ''}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Team:</Text>
          <Text style={styles.infoTextValue}>{userDetails.userTeam}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Organization Unit:</Text>
          <Text style={styles.infoTextValue}>{userDetails.orgUnitId}</Text>
        </View>

        <View style={styles.separator} />

        <Pressable
          onPress={() => navigation.navigate('DummyFarmerLand')}
          style={styles.infoContainer}>
          <Text style={styles.infoText}>Farmer's Land</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: '#B21B1D',
            borderRadius: 5,
            height: 50,
            marginVertical: 40,
            justifyContent: 'center',
          }}
          onPress={() => {
            AsyncStorage.removeItem('profile');
            AsyncStorage.removeItem('token');
            dispatch(isLogin(false));
          }}
          color="#fff">
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: 16,
            }}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = {
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#000',
    marginTop: 20,
    marginBottom: 20,
  },

  infoContainer: {
    flexDirection: 'column',
    width: '90%',
  },

  infoText: {
    fontSize: 16,
    color: '#B21B1D',
    fontWeight: 'bold',
  },
  infoTextValue: {
    fontSize: 16,
    color: '#494c4c',
    marginTop: 10,
    fontWeight: 'bold',
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: '#ececec',
    marginTop: 4,
    marginBottom: 20,
  },
};
