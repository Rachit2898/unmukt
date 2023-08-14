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
import Verified from '../../assets/verified.png';
import UnVerified from '../../assets/unverified.png';
import FarmerProfile from '../../assets/user.png';

export default function Farmer({navigation, item, refreshFarmerList}) {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    // console.log(item.imageDetails);
    // if (item.imageDetails.id === null) {
    //   return;
    // }
    // // console.log(item.imageDetails);
    // // return
    // console.log(`/images/${item.imageDetails.id}`);
    // // return
    // Axios.get(`/images/${item.imageDetails.id}`)
    //   .then(async function (response) {
    //     // check if response is 200
    //     if (response.status !== 200) {
    //       alert('Error fetching image');
    //       return;
    //     }
    //     console.log(response);
    //     const objectURL = `data:image/png;base64,${response.data.image}`;
    //     setImageUri(objectURL);
    //   })
    //   .catch(function (error) {
    //     console.log(JSON.stringify(error));
    //     console.log(error.response);
    //     alert('Error fetching image');
    //   });
  }, []);
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 5,
        borderRadius: 5,
        marginHorizontal: 10,
        padding: 10,
      }}
      onPress={() =>
        navigation.navigate('FarmerProfile', {
          farmerData: item,
          refreshFarmerList: refreshFarmerList,
        })
      }>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#B21B1D',
              }}>
              {item.firstName} {item.lastName}
            </Text>
          </View>
          {item?.verified ? (
            <View style={{alignItems: 'center', width: '20%'}}>
              <Image style={{height: 22, width: 22}} source={Verified} />
              <Text style={{fontSize: 12, fontWeight: 'bold', color: 'gray'}}>
                Verified
              </Text>
            </View>
          ) : (
            <View style={{alignItems: 'center', width: '20%'}}>
              <Image style={{height: 20, width: 20}} source={UnVerified} />
              <Text style={{fontSize: 12, fontWeight: 'bold', color: 'gray'}}>
                Unverified
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: '#494c4c',
            marginTop: 8,
          }}>
          Catchment: {item.catchmentName}
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
        <View
          style={{
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: '#494c4c',
            }}>
            Mob: {item.mobileNo}
          </Text>
          <View>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: 'gray'}}>
              Harvesting:Yes
            </Text>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: 'gray'}}>
              Collection:Yes
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
