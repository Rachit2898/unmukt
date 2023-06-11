import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Axios} from '../../core/axios';

export default function Farmer({navigation, item, refreshFarmerList}) {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    // fetch image
    // console.log(item.imageDetails);
    // if (item.imageDetails.id === null) {
    //     return;
    // }
    // // console.log(item.imageDetails);
    // // return
    // console.log(`/images/${item.imageDetails.id}`);
    // // return
    // Axios.get(`/images/${item.imageDetails.id}`)
    // .then(async function (response) {
    //     // check if response is 200
    //     if (response.status !== 200) {
    //         alert('Error fetching image');
    //         return;
    //     }
    //     console.log(response)
    //     const objectURL = `data:image/png;base64,${response.data.image}`
    //     setImageUri(objectURL);
    // }
    // )
    // .catch(function (error) {
    //     console.log(JSON.stringify(error));
    //     console.log(error.response);
    //     alert('Error fetching image');
    // }
    // );
  }, []);
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 5,
        borderRadius: 5,
      }}
      onPress={() =>
        navigation.navigate('FarmerProfile', {
          farmerData: item,
          refreshFarmerList: refreshFarmerList,
        })
      }>
      <Image
        source={{uri: imageUri}}
        style={{
          width: 100,
          height: 100,
          resizeMode: 'contain',
          margin: 20,
        }}
      />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '50%',
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: '#fff',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#B21B1D',
            marginTop: 10,
          }}>
          {item.firstName}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: '#494c4c',
            marginTop: 8,
          }}>
          UID: {item.farmerUid}
        </Text>

        <Text
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: '#494c4c',
            marginTop: 5,
          }}>
          Mob: {item.mobileNo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
