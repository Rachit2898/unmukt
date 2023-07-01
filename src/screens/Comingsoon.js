import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Comingsoon = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon</Text>
    </View>
  );
};

export default Comingsoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#B21B1D',
    fontWeight: 'bold',
    fontSize: 35,
  },
});
