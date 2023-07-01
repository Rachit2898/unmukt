import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const CostCalculationScreen = () => {
  const [distance, setDistance] = useState('');
  const [vehicleType, setVehicleType] = useState('tractor');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');

  const calculateCost = () => {
    if (distance && price) {
      const calculatedCost = parseFloat(distance) * parseFloat(price);
      setCost(calculatedCost.toFixed(2)); // Set the calculated cost with 2 decimal places
    } else {
      setCost('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cost Calculation</Text>
      <View style={styles.inputContainer}>
        <Text>Vehicle Type:</Text>
        <Picker
          style={styles.picker}
          selectedValue={vehicleType}
          onValueChange={itemValue => setVehicleType(itemValue)}>
          <Picker.Item label="Tractor" value="tractor" />
          <Picker.Item label="Pickup" value="pickup" />
          <Picker.Item label="Truck" value="truck" />
          <Picker.Item label="Rickshaw" value="rickshaw" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Distance (in kilometers)"
        value={distance}
        onChangeText={text => setDistance(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price per kilometer"
        value={price}
        onChangeText={text => setPrice(text)}
        keyboardType="numeric"
      />
      <Pressable
        style={{
          backgroundColor: '#B21B1D',
          paddingVertical: 10,
          alignItems: 'center',
        }}
        onPress={calculateCost}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>Calculate Cost</Text>
      </Pressable>
      {cost !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>Distance: {distance} km</Text>
          <Text style={styles.result}>Vehicle Type: {vehicleType}</Text>
          <Text style={styles.result}>Price per kilometer: {price} USD</Text>
          <Text style={styles.result}>Cost: {cost} USD</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  picker: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  resultContainer: {
    marginTop: 16,
  },
  result: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
});

export default CostCalculationScreen;
