import {Button, TextInput} from '@react-native-material/core';
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
  Modal,
} from 'react-native';
import {Axios} from '../core/axios';
import {checkAuth} from '../Helper';

const HarvesterDailyRecord = ({navigation, route}) => {
  const {harvesterList, collectionCycle, profile} = route?.params;
  const [selectedHarvester, setSelectedHarvester] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(selectedHarvester);
  const [selectedHarvesterReading, setSelectedHarvesterReading] = useState('');
  const [inputValues, setInputValues] = useState({
    harvestingInAcres: '',
    endReading: '',
    startReading: '',
    breakdownTimeInHours: '',
  });
  const current_date = new Date().toISOString().slice(0, 10);

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

  useFocusEffect(
    useCallback(() => {
      if (selectedHarvester) {
        Axios.get(
          `/infradailyrecords/${collectionCycle}/${selectedHarvester}/N/${current_date}`,
        )
          .then(res => {
            console.log(res);
            const [data] = res.data.filter(elm => elm.startReading != null);
            if (res.data.length != 0 && data) {
              setSelectedHarvesterReading(data);
              setInputValues({
                startReading: data?.startReading,
                endReading: data?.endReading ?? '',
                harvestingInAcres:
                  data?.harvestingInAcres == null
                    ? ''
                    : String(data?.harvestingInAcres),
                breakdownTimeInHours:
                  data?.breakdownTimeInHours == null
                    ? ''
                    : String(data?.breakdownTimeInHours),
              });
              return;
            }
            setInputValues({
              harvestingInAcres: '',
              endReading: '',
              startReading: '',
              breakdownTimeInHours: '',
            });
            setSelectedHarvesterReading('');
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
      }
    }, [selectedHarvester]),
  );

  const SubmitReading = () => {
    // Check if user have Permission for this action
    console.log({selectedHarvester});
    const {accessUserRole} = profile;
    try {
      checkAuth(accessUserRole, 'HARVESTINGUPDATE');
      if (!selectedHarvester) {
        return alert('Select HARVESTER first');
      }

      if (!selectedHarvesterReading?.startReading) {
        if (inputValues.startReading.trim() == '') {
          return alert('Start Reading is required');
        }
        if (
          inputValues.endReading.trim() != '' &&
          (inputValues.harvestingInAcres.trim() == '' ||
            inputValues.breakdownTimeInHours.trim() == '')
        ) {
          return alert(
            'HarvestingInAcres and BreakDown is required to submit end reading',
          );
        }
        const data = {
          collectionCycle: collectionCycle,
          infraId: selectedHarvester,
          dateOfOperation: current_date,
          startReading: inputValues.startReading,
          endReading: inputValues.endReading || null,
          harvestingInAcres: inputValues.harvestingInAcres || null,
          breakdownTimeInHours: inputValues.breakdownTimeInHours || null,
          dieselsInLitres: null,
          infraMovementStartTime: '0001-01-01T00:00:00',
          infraMovementEndTime: '0001-01-01T00:00:00',
          countOfBales: null,
          looseMaterialIndicator: null,
          isRawMatAccceptedInPlant: 'N',
          rawMatAccceptDateTime: '0001-01-01T00:00:00',
          orgUnitId: profile?.orgUnitId,
        };
        console.log(data);
        Axios.post(`infradailyrecords`, data)
          .then(res => {
            if (res.data.length != 0) {
              // setSelectedHarvesterReading(res.data[0])
              alert('Data saved successfully');
              navigation.goBack();
            }
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
      } else {
        if (
          inputValues.endReading.trim() != '' &&
          (inputValues.harvestingInAcres.trim() == '' ||
            inputValues.breakdownTimeInHours.trim() == '')
        ) {
          return alert(
            'HarvestingInAcres and BreakDown is required to submit end reading',
          );
        }

        const data = {
          id: selectedHarvesterReading.id,
          collectionCycle: collectionCycle,
          infraId: selectedHarvester,
          dateOfOperation: current_date,
          startReading: inputValues.startReading,
          endReading: inputValues.endReading,
          harvestingInAcres: inputValues.harvestingInAcres,
          breakdownTimeInHours: inputValues.breakdownTimeInHours,
          dieselsInLitres: null,
          infraMovementStartTime: '0001-01-01T00:00:00',
          infraMovementEndTime: '0001-01-01T00:00:00',
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
              // setSelectedHarvesterReading(res.data[0])
              alert('Data saved successfully');
            }
            console.log(res);
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingSec}>
        <Text style={styles.text}>Harvestor Daily Record</Text>
        <Text style={styles.text2}>({current_date})</Text>
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
      <View style={styles.inputContainer}>
        <TextInput
          label="Start Reading"
          variant="standard"
          style={{marginTop: 10, width: '48%'}}
          value={inputValues.startReading}
          onChangeText={text => {
            setInputValues(state => ({...state, startReading: text}));
          }}
          keyboardType="numeric"
          editable={!selectedHarvesterReading?.startReading ? true : false}
        />
        <TextInput
          label="End Reading"
          variant="standard"
          style={{marginTop: 10, width: '48%'}}
          value={inputValues.endReading}
          onChangeText={text => {
            setInputValues(state => ({...state, endReading: text}));
          }}
          keyboardType="numeric"
          // editable={selectedHarvesterReading?.startReading ?true :false}
        />
      </View>
      <TextInput
        label="Harvesting (in acres)"
        variant="standard"
        style={{marginTop: 10}}
        value={inputValues.harvestingInAcres}
        onChangeText={text => {
          setInputValues(state => ({...state, harvestingInAcres: text}));
        }}
        keyboardType="numeric"
        // editable={selectedHarvesterReading?.startReading ?true :false}
      />
      <TextInput
        label="Breakdown (in hours)"
        variant="standard"
        style={{marginTop: 10}}
        value={inputValues.breakdownTimeInHours}
        onChangeText={text => {
          setInputValues(state => ({...state, breakdownTimeInHours: text}));
        }}
        keyboardType="numeric"
        // editable={selectedHarvesterReading?.startReading ?true :false}
      />
      <View style={styles.btnContainer}>
        <Button
          style={styles.btn}
          mode="contained"
          title="Cancel"
          onPress={() => navigation.goBack()}></Button>
        <Button
          style={styles.btn}
          mode="contained"
          title="Save"
          onPress={() => SubmitReading()}
          disabled={
            selectedHarvesterReading?.endReading ? true : false
          }></Button>
      </View>
    </View>
  );
};

export default HarvesterDailyRecord;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 20,

    flex: 1,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  btn: {
    width: '40%',
    backgroundColor: '#B21B1D',
    marginTop: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
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
