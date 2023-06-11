import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IconButton} from '@react-native-material/core';
import {useNavigation} from '@react-navigation/native';
import {Image, View, StyleSheet, Platform} from 'react-native';
import Home from '../screens/Home';
import Dashboard from '../assets/Deshboard.svg';
import DashboardUnselected from '../assets/DeshboardUnselected.svg';
import Farmer from '../assets/Farmer.svg';
import FarmerUnselected from '../assets/FarmerUnselected.svg';
import Catchment from '../assets/Catchment.svg';
import CatchmentUnselected from '../assets/CatchmentUnselected.svg';
import Profile from '../assets/Profile.svg';
import ProfileUnselected from '../assets/ProfileUnselected.svg';
import Harvest from '../assets/harvest.svg';
import HarvestUnselected from '../assets/harvestUnselected.svg';
import InfraImage from '../assets/InfraImg.svg';
import InfraImageSelected from '../assets/InfraRed.svg';
import Farmers from '../screens/Farmers';
import UserProfileView from '../screens/UserProfileView';
import CatchmentTab from '../screens/CatchmentTab';
import Infra from '../screens/Infra';
import HarvestingRecord from '../screens/HarvestingRecord';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 80 : 50,
          backgroundColor: '#F8F8F8',
          borderTopColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        },
        tabBarActiveTintColor: '#B21B1D',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({focused}) => (
            <View style={styles.tabIconContainer}>
              {focused ? (
                <Dashboard width={30} height={30} fill="#B21B1D" />
              ) : (
                <DashboardUnselected width={30} height={30} fill="gray" />
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Infra"
        component={Infra}
        options={({navigation}) => ({
          tabBarIcon: ({focused}) => (
            <View
              style={{
                borderRadius: 0,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {focused ? (
                <Farmer width="30" height="30" />
              ) : (
                <FarmerUnselected width="30" height="30" />
              )}
            </View>
          ),
          headerLeft: () => (
            <IconButton
              icon="arrow-back"
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Farmers"
        component={Farmers}
        options={{
          tabBarLabel: 'Farmers',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                borderRadius: 50,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {focused ? (
                <InfraImageSelected width="30" height="30" />
              ) : (
                <InfraImage width="30" height="30" />
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Harvesting"
        component={HarvestingRecord}
        options={{
          tabBarLabel: 'Harvesting',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                borderRadius: 50,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {focused ? (
                <Harvest width="30" height="30" />
              ) : (
                <HarvestUnselected width="30" height="30" />
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Catchmet"
        component={CatchmentTab}
        options={{
          tabBarLabel: 'Catchment',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                borderRadius: 50,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {focused ? (
                <Catchment width="30" height="30" />
              ) : (
                <CatchmentUnselected width="30" height="30" />
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={UserProfileView}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                borderRadius: 50,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {focused ? (
                <Profile width="30" height="30" />
              ) : (
                <ProfileUnselected width="30" height="30" />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
