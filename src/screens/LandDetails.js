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
import {
  Stack,
  TextInput,
  IconButton,
  Button,
  Icon,
} from '@react-native-material/core';
import SwitchSelector from 'react-native-switch-selector';
// import SvgUri from 'react-native-svg-uri';
import MapPin from '../assets/MapPin.svg';
import DocumentPicker from 'react-native-document-picker';
import {Axios} from '../core/axios';
import AreaVector from '../assets/AreaVector.svg';
import {Picker} from '@react-native-picker/picker';
import MapView, {Marker, Polygon} from 'react-native-maps';

export default function LandDetails({navigation, route}) {
  const {landData, farmerDetails} = route.params;
  console.log(landData);
  const [polygonCoords, setPolygonCoords] = useState([]);

  // Create view that have list of all setting options
  const options = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ];

  const harvestingPlanOptions = [
    {label: 'Harvester', value: 'Harvester'},
    {label: 'Manual', value: 'Manual'},
  ];
  const landOwnerOptions = [
    {label: 'Owned', value: 'Owned'},
    {label: 'Leased', value: 'Leased'},
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
      }}>
      <ScrollView
        style={{
          width: '100%',
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: 10,
              position: 'relative',
            }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: '#000000',
                marginTop: 0,
                width: '100%',
                paddingLeft: 20,
                alignSelf: 'flex-start',
              }}>
              {farmerDetails.firstName} {farmerDetails.lastName}
            </Text>
          </View>
          {/* make a line seperator */}
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#000000',
              marginTop: 10,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: 10,
              position: 'relative',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#000000',
                marginTop: 0,
                width: '50%',
                paddingLeft: 20,
                alignSelf: 'flex-start',
              }}>
              Land Details
            </Text>
          </View>

          <Stack
            style={{
              width: '100%',
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 30,
            }}>
            <TextInput
              label="Village Location"
              variant="standard"
              style={{
                marginTop: 20,
              }}
              editable={false}
              value={landData.villageLocation || ''}
            />
            <TextInput
              label="Land Area Provided by Farmer (in acres)"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              editable={false}
              value={String(landData.landSize) || ''}
            />
            <TextInput
              label="Landmark"
              variant="standard"
              style={{
                marginTop: 10,
              }}
              editable={false}
              value={landData.landmark || ''}
            />
            <Stack style={{width: '100%', marginTop: 10}} direction="row">
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginLeft: 10,
                  width: '50%',
                  alignSelf: 'center',
                }}>
                Land Ownership
              </Text>

              <SwitchSelector
                options={landOwnerOptions}
                initial={landData.landOwnership === 'FARMEROWNED' ? 0 : 1}
                style={{
                  marginTop: 10,
                  width: '50%',
                }}
                disabled={true}
              />
            </Stack>
            <Stack style={{width: '100%', marginTop: 10}} direction="row">
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginLeft: 10,
                  width: '50%',
                  alignSelf: 'center',
                }}>
                Reaper Needed
              </Text>

              <SwitchSelector
                options={options}
                initial={landData.reaperNeeded ? 0 : 1}
                style={{
                  marginTop: 10,
                  width: '50%',
                }}
                disabled={true}
              />
            </Stack>

            <Text>Map View</Text>

            <MapView
              style={{width: '100%', height: 200}}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {polygonCoords.length > 0 && (
                <Polygon coordinates={polygonCoords} />
              )}
            </MapView>
          </Stack>
        </View>
      </ScrollView>
    </View>
  );
}
