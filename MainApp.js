import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Platform, Text, Pressable} from 'react-native';
import MenuIcon from './src/assets/MenuIcon.svg';
import Notification from './src/assets/Notification.svg';
import BackButton from './src/assets/back.png';
import Menu from './src/assets/menu.png';
import Login from './src/components/Login';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import TabRoutes from './src/navigation/TabRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {isLogin} from './src/Redux-Files/loginSlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IconButton} from '@react-native-material/core';

function MainApp({screen}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoginValue = useSelector(state => state.login);

  console.log(screen);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (token !== null) {
        dispatch(isLogin(true));
      } else {
        dispatch(isLogin(false));
      }
    });
  }, []);

  if (isLoginValue === null) {
    return null;
  }

  return isLoginValue ? (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000045',
      }}
      edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          {screen != 'BottamTab' ? (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                left: 0,
                paddingLeft: 10,
                bottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={BackButton}
                style={{height: 30, width: 30}}
                resizeMode="contain"
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={{
                position: 'absolute',
                left: 0,
                paddingLeft: 10,
                bottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Menu}
                style={{height: 30, width: 30}}
                resizeMode="contain"
              />
            </Pressable>
          )}
          <Image
            source={require('./src/assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.notificationIcon}>
            <Notification width={30} height={30} />
          </View>
        </View>

        <TabRoutes />
      </View>
    </SafeAreaView>
  ) : (
    <Login />
  );
}

// Remaining styles...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000045',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
    height: Platform.OS === 'ios' ? 85 : 60,
    backgroundColor: '#F8F8F8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  logo: {
    height: 50,
    marginHorizontal: 'auto',
  },
  notificationIcon: {
    position: 'absolute',
    right: 0,
    paddingRight: 10,
    bottom: 10,
  },
});

export default MainApp;
