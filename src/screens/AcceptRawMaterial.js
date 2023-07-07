import {Button, Flex, TextInput} from '@react-native-material/core';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import {Axios} from '../core/axios';
import Done from '../assets/btn/done.svg';
import {checkAuth} from '../Helper';
const AcceptRawMaterial = ({navigation, route}) => {
  const {tractorList, collectionCycle, profile} = route?.params;
  const [pendingIncoming, setPendingIncoming] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const current_date = new Date().toISOString().slice(0, 10);

  useFocusEffect(
    useCallback(() => {
      Axios.get(`infradailyrecords/${collectionCycle}`)
        .then(res => {
          if (res.data.length != 0) {
            setPendingIncoming(res.data);
            setRefreshing(false);
            return;
          }
          setRefreshing(false);
        })
        .catch(err => {
          alert(`Error while completing action ${err?.message}`);
          setRefreshing(false);
        });
    }, [collectionCycle, refreshing]),
  );

  const handelSubmit = item => {
    // Check if user have Permission for this action
    const {accessUserRole} = profile;
    try {
      checkAuth(accessUserRole, 'ACCEPTRAWMATERIAL');
      const update = item => {
        const data = {
          id: item.id,
          collectionCycle: collectionCycle,
          infraId: item.infraId,
          dateOfOperation: current_date,
          startReading: null,
          endReading: null,
          harvestingInAcres: null,
          breakdownTimeInHours: null,
          dieselsInLitres: null,
          infraMovementStartTime: '0001-01-01T00:00:00',
          infraMovementEndTime: '0001-01-01T00:00:00',
          countOfBales: item.countOfBales,
          looseMaterialIndicator: item.looseMaterialIndicator,
          isRawMatAccceptedInPlant: 'Y',
          rawMatAccceptDateTime: new Date().toISOString().slice(0, 19),
          orgUnitId: profile?.orgUnitId,
        };
        Axios.put(`infradailyrecords`, data)
          .then(res => {
            const index = pendingIncoming.findIndex(
              elm => elm.id == res.data.id,
            );
            setPendingIncoming(state => {
              state.splice(index, 1);
              return [...state];
            });

            // navigation.goBack()
            alert('Data saved successfully');
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
      };
      Alert.alert(
        'Mark incoming as received',
        'Update incoming status to received',
        [
          {text: 'Save', onPress: () => update(item)},
          {text: 'Cancel', onPress: () => null},
        ],
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const renderList = ({item}) => {
    const [tractor] = tractorList?.filter(elm => elm.id == item.infraId);
    return (
      <TouchableOpacity
        onPress={() => handelSubmit(item)}
        style={styles.listContainer}>
        <View style={styles.innercontaner}>
          <Text style={styles.text2}>
            {tractor.modelName + ' ' + tractor.engineNumber}
          </Text>
          <Text style={[styles.text2, {marginLeft: 20, marginRight: 20}]}>
            {item.looseMaterialIndicator == 'Y'
              ? 'Loose'
              : ` ${item.countOfBales}`}
          </Text>
        </View>
        <Done width={30} height={30} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingSec}>
        <Text style={styles.text}>
          Accept Raw Material at Storage Area/Plant
        </Text>
      </View>

      <View style={styles.line}></View>
      {pendingIncoming.length != 0 && (
        <FlatList
          data={pendingIncoming}
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
          renderItem={renderList}></FlatList>
      )}
    </View>
  );
};

export default AcceptRawMaterial;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 20,
  },
  headingSec: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    // marginLeft: 10,
    // width: '50%',
    // alignSelf: 'center',
  },
  text2: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 5,
    // width: '60%',
    // alignSelf: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 's#c1bfbf',
    marginTop: 10,
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innercontaner: {
    flexDirection: 'row',
  },
});
