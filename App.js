/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {store} from './src/Redux-Files/store';
import MainApp from './MainApp';
import {Provider} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import SideMenu from './src/screens/SideMenu';

const Drawer = createDrawerNavigator();

const MyDrawer = ({screen}) => {
  return (
    <Drawer.Navigator
      initialRouteName="BottamTab"
      screenOptions={{
        drawerType: 'front',
      }}
      drawerContent={props => <SideMenu {...props} />}>
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="BottamTab"
        component={() => <MainApp screen={screen} />}
      />
    </Drawer.Navigator>
  );
};

function App() {
  const [screen, setScreen] = React.useState('BottomTab');
  const handleNavigationStateChange = state => {
    const currentRoute = state?.routes[state.index];
    const nestedRoute = currentRoute.state?.routes[currentRoute?.state?.index];
    const screenName = nestedRoute ? nestedRoute?.name : currentRoute.name;
    console.log({screenName});
    setScreen(screenName);
  };
  return (
    <Provider store={store}>
      <NavigationContainer onStateChange={handleNavigationStateChange}>
        <SafeAreaView style={{flex: 1}}>
          <MyDrawer screen={screen} />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
