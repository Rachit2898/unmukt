import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import AddFarmer from '../screens/AddFarmer';
import FarmerProfile from '../screens/FarmerProfile';
import Login from '../components/Login';
import AddFarmerLand from '../screens/AddFarmerLand';
import Maps from '../MapsCode/Maps';
import LandDetails from '../screens/LandDetails';
import MapsForPinLocation from '../MapsCode/MapsForPinLocation';
import HarvesterDailyRecord from '../screens/HarvesterDailyRecord';
import HarvesterShifting from '../screens/HarvesterShifting';
import TactorDailyRecord from '../screens/TractorDailyRecord';
import RawMaterialTrip from '../screens/RawMaterialTrip';
import AcceptRawMaterial from '../screens/AcceptRawMaterial';

const Stack = createStackNavigator();

export default function TabRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen name="BottamTab" component={BottomTabs} />
      <Stack.Screen name="AddFarmer" component={AddFarmer} />
      <Stack.Screen name="FarmerProfile" component={FarmerProfile} />
      <Stack.Screen name="AddFarmerLand" component={AddFarmerLand} />
      <Stack.Screen name="MapView" component={Maps} />
      <Stack.Screen name="LandDetails" component={LandDetails} />
      <Stack.Screen name="MapsForPinLocation" component={MapsForPinLocation} />
      <Stack.Screen
        name="HarvesterDailyRecord"
        component={HarvesterDailyRecord}
      />
      <Stack.Screen name="HarvesterShifting" component={HarvesterShifting} />
      <Stack.Screen name="TactorDailyRecord" component={TactorDailyRecord} />
      <Stack.Screen name="RawMaterialTrip" component={RawMaterialTrip} />
      <Stack.Screen name="AcceptRawMaterial" component={AcceptRawMaterial} />
    </Stack.Navigator>
  );
}
