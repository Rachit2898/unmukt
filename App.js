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

import MenuIcon from './src/assets/MenuIcon.svg';
import Notification from './src/assets/Notification.svg';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Login from './src/components/Login';
import BottomTabs from './src/navigation/BottomTabs';
import {NavigationContainer} from '@react-navigation/native';
import TabRoutes from './src/navigation/TabRoutes';
import SvgUri from 'react-native-svg-uri';
import Maps from './src/MapsCode/Maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from './src/Redux-Files/store';
import MainApp from './MainApp';
import {Provider} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';

function App() {
  const [screen, setScreen] = React.useState('BottamTab');
  const handleNavigationStateChange = state => {
    setScreen(state.routes[state.index].name);
  };
  return (
    <Provider store={store}>
      <NavigationContainer onStateChange={handleNavigationStateChange}>
        <SafeAreaView style={{flex: 1}}>
          <MainApp screen={screen} />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
