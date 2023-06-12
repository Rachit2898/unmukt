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
import {useFocusEffect} from '@react-navigation/native';
import {Axios} from '../core/axios';
import {checkAuth} from '../Helper';

const RawMaterialTrip = ({navigation, route}) => {
  const {tractorList, collectionCycle, profile} = route?.params;
  const [selectedTractor, setSelectedTractor] = useState('');
  const [bale, setBales] = useState('');
  const [lossMaterialIndicator, setlossMaterialIndicator] = useState(false);
  const [selectedTractorReading, setSelectedTractorReading] = useState('');
  const current_date = new Date().toISOString().slice(0, 10);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(selectedTractor);
  const handlePickerChange = (itemValue, itemIndex) => {
    setSelectedValue(itemValue);
    setSelectedTractor(itemValue);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedTractor) {
        Axios.get(
          `/infradailyrecords/${collectionCycle}/${selectedTractor}/N/${current_date}`,
        )
          .then(res => {
            console.log(res);
            const [data] = res.data.filter(
              elm =>
                elm.looseMaterialIndicator != null || elm?.countOfBales != null,
            );
            if (res.data.length != 0 && data) {
              setSelectedTractorReading(data);
              if (data.looseMaterialIndicator == 'Y') {
                setlossMaterialIndicator(true);
                setBales('');
              } else {
                setBales(data.countOfBales ?? '');
                setlossMaterialIndicator(false);
              }
              return;
            }
            // setInputValues({dieselsInLitres:'',endReading:'',startReading:''})
            setSelectedTractorReading('');
            setBales('');
            setlossMaterialIndicator(false);
          })
          .catch(err => {
            alert(`Error while completing action ${err?.message}`);
            console.log(err);
          });
      }
    }, [selectedTractor]),
  );
  const submit = () => {
    // Check if user have Permission for this action
    const {accessUserRole} = profile;
    try {
      checkAuth(accessUserRole, 'INFRAUPDATE');
      if (
        (selectedTractorReading?.looseMaterialIndicator != null ||
          selectedTractorReading.countOfBales != null) &&
        selectedTractorReading?.isRawMatAccceptedInPlant == 'N'
      ) {
        alert('Kindly accept previous trip to start new');
        return;
      }

      if (!selectedTractor) {
        return alert('Select  Transport Vehicle first');
      }
      if (!lossMaterialIndicator && (bale.trim() == '0' || bale.trim() == '')) {
        return alert('Please enter Bales');
      }
      const data = {
        collectionCycle: collectionCycle,
        infraId: selectedTractor,
        dateOfOperation: current_date,
        startReading: null,
        endReading: null,
        harvestingInAcres: null,
        breakdownTimeInHours: null,
        dieselsInLitres: null,
        infraMovementStartTime: '0001-01-01T00:00:00',
        infraMovementEndTime: '0001-01-01T00:00:00',
        countOfBales: lossMaterialIndicator ? null : bale,
        looseMaterialIndicator: lossMaterialIndicator ? 'Y' : null,
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
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingSec}>
        <Text style={styles.text}>Raw Material (Bales) Per Trip</Text>
        <Text style={styles.text2}>({current_date})</Text>
      </View>
      <View style={styles.line}></View>
      <TouchableOpacity style={styles.pickerButton} onPress={handleModalOpen}>
        <Text style={styles.pickerButtonText}>
          {selectedValue ? `Selected: ${selectedValue}` : 'Select Tractor'}
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
                height: '90%',
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
              <ScrollView>
                {tractorList?.map((prop, key) => (
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
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleModalClose}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setlossMaterialIndicator(false)}
        style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
        <View
          style={{
            width: 18,
            height: 18,
            backgroundColor: '#D9D9D9',
            borderRadius: 9,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: !lossMaterialIndicator ? '#B21B1D' : '#D9D9D9',
              borderRadius: 5,
            }}></View>
        </View>
        <Text style={{fontSize: 16, color: '#000000', marginLeft: 5}}>
          Bales
        </Text>
        <TextInput
          style={{width: 90, marginLeft: 10}}
          label="Count of bales"
          variant="standard"
          onChangeText={e => setBales(e)}
          value={String(bale)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setlossMaterialIndicator(true)}
        style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
        <View
          style={{
            width: 18,
            height: 18,
            backgroundColor: '#D9D9D9',
            borderRadius: 9,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: lossMaterialIndicator ? '#B21B1D' : '#D9D9D9',
              borderRadius: 5,
            }}></View>
        </View>
        <Text style={{fontSize: 16, color: '#000000', marginLeft: 5}}>
          Loose
        </Text>
      </TouchableOpacity>

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
          onPress={() => submit()}
          // disabled={selectedTractorReading?.looseMaterialIndicator != null ? true :false}
        ></Button>
      </View>
    </View>
  );
};

export default RawMaterialTrip;

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
