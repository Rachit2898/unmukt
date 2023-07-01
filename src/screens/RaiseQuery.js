import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Picker} from '@react-native-picker/picker';

const QueryScreen = () => {
  const [query, setQuery] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('Payment/Labour');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = () => {
    // Implement the logic to generate a ticket or handle the query
    // You can send the query, category, and image to a backend API for processing
    // Display a success message or navigate to a confirmation screen
    console.log('Category:', category);
    console.log('Query:', query);
    console.log('Image:', image);
  };

  const opencamera = async () => {
    try {
      let granted;
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      } else if (Platform.OS === 'ios') {
        granted = true; // On iOS, permissions are requested at build-time
      }
      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === 'ios'
      ) {
        const options = {
          quality: 0.5,
          mediaType: 'photo',
          maxHeight: 720,
          maxWidth: 1024,
        };

        await launchCamera(options, response => {
          const data = new FormData();

          if (response.assets != undefined) {
            data.append('file_name', {
              uri: response.assets[0].uri,
              type: 'image/jpg',
              name: response.assets[0].uri,
            });
          }
          setPhoto(data);
        });
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const opencameragallery = async () => {
    try {
      let granted;
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      } else if (Platform.OS === 'ios') {
        granted = true; // On iOS, permissions are requested at build-time
      }
      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === 'ios'
      ) {
        const options = {
          quality: 0.5,
          mediaType: 'photo',
          maxHeight: 720,
          maxWidth: 1024,
        };

        await launchImageLibrary(options, response => {
          if (response.didCancel) {
            return null;
          }

          const data = new FormData();
          if (response.assets != undefined) {
            data.append('file_name', {
              uri: response.assets[0].uri,
              type: 'image/jpg',
              name: response.assets[0].uri,
            });
          }
          setPhoto(data);
        });
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Raise a Query</Text>
      <Picker
        selectedValue={category}
        onValueChange={value => setCategory(value)}
        style={styles.picker}>
        <Picker.Item label="Payment/Labour" value="Payment/Labour" />
        <Picker.Item label="Harvesting" value="Harvesting" />
        <Picker.Item label="Collection" value="Collection" />
        <Picker.Item label="Farmer" value="Farmer" />
        <Picker.Item label="Land" value="Land" />
        <Picker.Item label="Electricity" value="Electricity" />
        <Picker.Item label="Diesel" value="Diesel" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Any other issue" value="Any other issue" />
      </Picker>
      <TextInput
        style={styles.queryInput}
        placeholder="Enter your query, feedback, or suggestion"
        value={query}
        onChangeText={text => setQuery(text)}
        multiline
      />
      <View style={{marginTop: 10, borderBottomWidth: 0.5, paddingBottom: 5}}>
        <Text style={styles.title}>Take Photo</Text>
        <Pressable
          style={{alignItems: 'center', justifyContent: 'center'}}
          onPress={() =>
            Alert.alert('Choose Type', '', [
              {
                text: 'Camera',
                onPress: () => opencamera(),
              },
              {
                text: 'Gallery',
                onPress: () => opencameragallery(),
              },
              {
                text: 'Cancel',
                onPress: () => {},
              },
            ])
          }>
          {!photo ? (
            <AntDesign name="camera" size={70} color="#B21B1D" />
          ) : (
            <Image
              style={{
                borderWidth: 1,
                width: '90%',
                height: 180,
                alignSelf: 'center',
              }}
              source={{uri: photo?._parts[0][1]?.name}}
            />
          )}
        </Pressable>
      </View>
      <Button title="Submit" onPress={handleSubmit} color="#B21B1D" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ececec',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#B21B1D',
  },
  picker: {
    marginBottom: 16,
    color: '#B21B1D',
    borderRadius: 4,
  },
  queryInput: {
    height: 120,
    borderColor: '#B21B1D',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  imageText: {
    marginBottom: 16,
    color: '#B21B1D',
  },
});

export default QueryScreen;
