import {Button, TextInput} from '@react-native-material/core';
import {Picker} from '@react-native-picker/picker';
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
  Modal,
} from 'react-native';
import StartBtn from '../.../../assets/btn/start.svg';
import StopBtn from '../.../../assets/btn/off.svg';
import {useFocusEffect} from '@react-navigation/native';
import {Axios} from '../core/axios';
import {checkAuth} from '../Helper';

const HarvesterShifting = ({navigation, route}) => {
  const {harvesterList, collectionCycle, profile} = route?.params;
  const [selectedHarvester, setSelectedHarvester] = useState('');
  const [selectedHarvesterReading, setSelectedHarvesterReading] = useState('');
  const current_date = new Date().toISOString().slice(0, 10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(selectedHarvester);

  useFocusEffect(
    useCallback(() => {
      if (selectedHarvester) {
        Axios.get(
          `/infradailyrecords/${collectionCycle}/${selectedHarvester}/N/${current_date}`,
        )
          .then(res => {
            console.log(res);
            if (res.data.length != 0) {
              const [data] = res.data.filter(
                elm =>
                  elm.infraMovementStartTime != null &&
                  elm?.infraMovementStartTime?.substring(0, 4) != '0001' &&
                  (elm.infraMovementEndTime == null ||
                    elm?.infraMovementEndTime?.substring(0, 4) == '0001'),
              );

              setSelectedHarvesterReading(data);
              return;
            }
            setSelectedHarvesterReading('');
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
      }
    }, [selectedHarvester]),
  );

  const submit = actionType => {
    // Check if user have Permission for this action
    const {accessUserRole} = profile;
    try {
      checkAuth(accessUserRole, 'HARVESTINGUPDATE');
      if (!selectedHarvester) {
        return alert('Select HARVESTER first');
      }
      const date = new Date().toISOString().slice(0, 19);
      if (!selectedHarvesterReading?.infraMovementStartTime) {
        const data = {
          collectionCycle: collectionCycle,
          infraId: selectedHarvester,
          dateOfOperation: current_date,
          startReading: null,
          endReading: null,
          harvestingInAcres: null,
          breakdownTimeInHours: null,
          dieselsInLitres: null,
          infraMovementStartTime: date,
          infraMovementEndTime: '0001-01-01T00:00:00',
          countOfBales: null,
          looseMaterialIndicator: null,
          isRawMatAccceptedInPlant: 'N',
          rawMatAccceptDateTime: '0001-01-01T00:00:00',
          orgUnitId: profile?.orgUnitId,
        };
        Axios.post(`infradailyrecords`, data)
          .then(res => {
            if (res.data.length != 0) {
              // setSelectedHarvesterReading(res.data[0])
              navigation.goBack();
              alert('Data saved successfully');
            }
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
        console.log(data);
      } else {
        const data = {
          id: selectedHarvesterReading.id,
          collectionCycle: collectionCycle,
          infraId: selectedHarvester,
          dateOfOperation: current_date,
          startReading: null,
          endReading: null,
          harvestingInAcres: null,
          breakdownTimeInHours: null,
          dieselsInLitres: null,
          infraMovementStartTime: selectedHarvesterReading?.infraMovementEndTime
            ? date
            : selectedHarvesterReading.infraMovementStartTime,
          infraMovementEndTime: selectedHarvesterReading?.infraMovementEndTime
            ? null
            : date,
          countOfBales: null,
          looseMaterialIndicator: null,
          isRawMatAccceptedInPlant: 'N',
          rawMatAccceptDateTime: '0001-01-01T00:00:00',
          orgUnitId: profile?.orgUnitId,
        };
        Axios.put(`infradailyrecords`, data)
          .then(res => {
            if (res.data.length != 0) {
              // setSelectedHarvesterReading(res.data[0])
              navigation.goBack();
              alert('Data saved successfully');
            }
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
        console.log(data);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  const dateFormater = dateString => {
    if (typeof dateString === 'object') {
      var date = new Date(...dateString);
    } else {
      var date = new Date(dateString);
    }

    // Add 5 hours and 30 minutes to the date
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(date);
    return formattedDate;
  };

  const handlePickerChange = (itemValue, itemIndex) => {
    setSelectedValue(itemValue);
    setSelectedHarvester(itemValue);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingSec}>
        <Text style={styles.text}>Harvestor Shifting Record</Text>
      </View>
      <TouchableOpacity style={styles.pickerButton} onPress={handleModalOpen}>
        <Text style={styles.pickerButtonText}>
          {selectedValue ? `Selected: ${selectedValue}` : 'Select Harvester'}
        </Text>
      </TouchableOpacity>
      <View style={styles.line}></View>

      <TouchableOpacity
        style={styles.modalBackground}
        activeOpacity={1}
        onPress={handleModalClose}>
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View
              style={{
                shadowColor: '#000',

                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                borderRadius: 5,
                backgroundColor: '#595857',
                opacity: 9999,
              }}>
              {harvesterList?.map((prop, key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.modalItem}
                  onPress={() => {
                    handlePickerChange(prop.id);
                    handleModalClose();
                  }}>
                  <Text style={styles.modalItemText}>
                    {`${prop.modelName} ${prop.engineNumber} ${
                      prop?.registrationNumber ? prop?.registrationNumber : ''
                    }`}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleModalClose}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => submit('start')}
          disabled={
            !selectedHarvesterReading?.infraMovementStartTime ||
            (selectedHarvesterReading?.infraMovementStartTime &&
              selectedHarvesterReading?.infraMovementEndTime)
              ? false
              : true
          }
          style={[
            styles.btn_Wrp,
            {
              opacity:
                !selectedHarvesterReading?.infraMovementStartTime ||
                (selectedHarvesterReading?.infraMovementStartTime &&
                  selectedHarvesterReading?.infraMovementEndTime)
                  ? 1
                  : 0.5,
            },
          ]}>
          <StartBtn width={50} height={50} />
          <Text style={styles.text2}>Start</Text>
          {selectedHarvesterReading?.infraMovementStartTime && (
            <Text style={styles.text2}>
              {dateFormater(selectedHarvesterReading?.infraMovementStartTime)}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => submit('stop')}
          disabled={
            !selectedHarvesterReading?.infraMovementStartTime ||
            (selectedHarvesterReading?.infraMovementStartTime &&
              selectedHarvesterReading?.infraMovementEndTime)
              ? true
              : false
          }
          style={[
            styles.btn_Wrp,
            {
              opacity:
                !selectedHarvesterReading?.infraMovementStartTime ||
                (selectedHarvesterReading?.infraMovementStartTime &&
                  selectedHarvesterReading?.infraMovementEndTime)
                  ? 0.5
                  : 1,
            },
          ]}>
          <StopBtn width={50} height={50} />
          <Text style={styles.text2}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HarvesterShifting;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 20,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 's#c1bfbf',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    // marginLeft: 10,
    // width: '50%',
    // alignSelf: 'center',
  },
  text2: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 5,
    // width: '60%',
    // alignSelf: 'center',
  },
  headingSec: {
    flexDirection: 'row',
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  btn_Wrp: {
    // width:'100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth:1
  },

  pickerButton: {
    height: 50,
    borderWidth: 2,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
  },
  modalItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalCancelButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '800',
  },
});
