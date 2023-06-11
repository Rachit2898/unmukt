import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image,FlatList, Linking } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Stack, TextInput, IconButton, Button, Icon } from "@react-native-material/core";
import Axios from 'axios';
import SwitchSelector from "react-native-switch-selector";
// import SvgUri from 'react-native-svg-uri';
import MapPin from '../assets/MapPin.svg'
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../Redux-Files/store';
import { useDispatch, useSelector, Provider } from "react-redux";
import { isLogin } from "../Redux-Files/loginSlice";
import MapView, { Marker, Polygon } from 'react-native-maps';

export default function CatchmentTab({navigation}) {
// show only map view
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'flex-start',
        }}>

            <MapView
                style={{
                    width: '100%',
                    height: '100%',
                    }}
                initialRegion={{
                    latitude: 21.340298,
                    longitude: 83.688806,
                    latitudeDelta: 0.0922/2,
                    longitudeDelta: 0.0421/2,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: 21.340298,
                        longitude: 83.688806,
                    }}
                    title="My Marker"
                    description="Some description"
                />

                <Marker
                    coordinate={{
                        latitude: 24.5726,
                        longitude: 88.3639,
                    }}
                    title="My Marker"
                    description="Some description"
                />
                </MapView>
      </View>
    );
}
