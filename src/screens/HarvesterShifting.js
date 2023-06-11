import { Button, TextInput } from '@react-native-material/core'
import { Picker } from '@react-native-picker/picker'
import React, { useCallback, useState } from 'react'
import { View, Text,SafeAreaView, ScrollView, TouchableOpacity, Image,FlatList, Linking, Dimensions ,StyleSheet} from 'react-native'
import StartBtn from '../.../../assets/btn/start.svg'
import StopBtn from '../.../../assets/btn/off.svg'
import { useFocusEffect } from '@react-navigation/native';
import { Axios } from '../core/axios'
import { checkAuth } from '../Helper'


const HarvesterShifting = ({navigation,route}) => {
    const {harvesterList,collectionCycle,profile} = route?.params
    const [selectedHarvester,setSelectedHarvester] =useState('')
    const [selectedHarvesterReading,setSelectedHarvesterReading] =useState('')
    const current_date = new Date().toISOString().slice(0, 10);

    useFocusEffect(
        useCallback(()=>{
            if(selectedHarvester){
                Axios.get(`/infradailyrecords/${collectionCycle}/${selectedHarvester}/N/${current_date}`)
                    .then(res=>{
                        console.log(res)
                        if(res.data.length !=0){ 
                            const [data] =res.data.filter(elm=>((elm.infraMovementStartTime != null && elm?.infraMovementStartTime?.substring(0,4) != '0001') && (elm.infraMovementEndTime == null || elm?.infraMovementEndTime?.substring(0,4) == '0001') ))
                            
                            setSelectedHarvesterReading(data)
                            return
                        }
                        setSelectedHarvesterReading('')
                        
                    })
                    .catch(err=>{
                        alert(`Error while completing action ${err?.message}`)
                        console.log(err)
                    })
            }
        },[selectedHarvester])
    )

    const submit = (actionType)=>{
        // Check if user have Permission for this action 
        const {accessUserRole} =(profile)
        try{
            checkAuth(accessUserRole,'HARVESTINGUPDATE')
            if(!selectedHarvester) {
                return alert('Select HARVESTER first')
            }
            const date =new Date().toISOString().slice(0, 19)
            if(!selectedHarvesterReading?.infraMovementStartTime){
                const data={
                        "collectionCycle": collectionCycle,
                        "infraId": selectedHarvester,
                        "dateOfOperation": current_date,
                        "startReading": null,
                        "endReading": null,
                        "harvestingInAcres": null,
                        "breakdownTimeInHours": null,
                        "dieselsInLitres": null,
                        "infraMovementStartTime": date,
                        "infraMovementEndTime": "0001-01-01T00:00:00",
                        "countOfBales": null,
                        "looseMaterialIndicator": null,
                        "isRawMatAccceptedInPlant": "N",
                        "rawMatAccceptDateTime": "0001-01-01T00:00:00",
                        "orgUnitId":profile?.orgUnitId,
                    }
                Axios.post(`infradailyrecords`,data)
                    .then(res=>{
                        if(res.data.length !=0){
                            // setSelectedHarvesterReading(res.data[0])
                            navigation.goBack()
                            alert('Data saved successfully')
                        }
                    })
                    .catch(err=>{
                        alert(`Error while completing action ${err?.message}`)
                        console.log(err)
                    })
                console.log(data)
            }
            else{
                const data={
                    'id':selectedHarvesterReading.id,
                    "collectionCycle": collectionCycle,
                    "infraId": selectedHarvester,
                    "dateOfOperation": current_date,
                    "startReading": null,
                    "endReading": null,
                    "harvestingInAcres": null,
                    "breakdownTimeInHours": null,
                    "dieselsInLitres": null,
                    "infraMovementStartTime":selectedHarvesterReading?.infraMovementEndTime ? date: selectedHarvesterReading.infraMovementStartTime,
                    "infraMovementEndTime":selectedHarvesterReading?.infraMovementEndTime ? null : date,
                    "countOfBales": null,
                    "looseMaterialIndicator": null,
                    "isRawMatAccceptedInPlant": "N",
                    "rawMatAccceptDateTime": "0001-01-01T00:00:00",
                    "orgUnitId":profile?.orgUnitId,
                }
                Axios.put(`infradailyrecords`,data)
                    .then(res=>{
                        if(res.data.length !=0){
                            // setSelectedHarvesterReading(res.data[0])
                            navigation.goBack()
                            alert('Data saved successfully')
                        }
                    })
                    .catch(err=>{
                        alert(`Error while completing action ${err?.message}`)
                        console.log(err)
                    })
                console.log(data)
            }

        }
        catch(err){
            alert(err.message)
        }
    }
    const dateFormater = (dateString) => {
        if (typeof dateString === "object") {
          var date = new Date(...dateString);
        } else {
          var date = new Date(dateString);
        }
        
        // Add 5 hours and 30 minutes to the date
        date.setHours(date.getHours() + 5);
        date.setMinutes(date.getMinutes() + 30);
      
        const options = {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const formatter = new Intl.DateTimeFormat("en-US", options);
        const formattedDate = formatter.format(date);
        return formattedDate;
      };

    return (
        <View style={styles.container}>
            <View style={styles.headingSec}>
                <Text style={styles.text}>
                    Harvestor Shifting Record
                </Text>
            </View>
            <View style={styles.line}></View>
            <Picker 
                selectedValue={selectedHarvester}
                style={{ height: 50, marginTop: 10,borderWidth:2,borderColor:'red'}}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedHarvester(itemValue)
                }}
            >
                {harvesterList?.map((prop,key)=>{
                    return(
                        <Picker.Item label={`${prop.modelName} ${prop.engineNumber} ${prop?.registrationNumber ? prop?.registrationNumber :''}`}  value={prop.id} key={key} />
                    )
                })}
            </Picker>
            <View style={styles.btnContainer}>
                <TouchableOpacity 
                    onPress={()=>submit('start')}
                    disabled={(!selectedHarvesterReading?.infraMovementStartTime) || (selectedHarvesterReading?.infraMovementStartTime && selectedHarvesterReading?.infraMovementEndTime) ? false :true} 
                    style={[styles.btn_Wrp,{opacity:(!selectedHarvesterReading?.infraMovementStartTime) || (selectedHarvesterReading?.infraMovementStartTime && selectedHarvesterReading?.infraMovementEndTime) ? 1 :.5}]} 
                >
                    <StartBtn width={50} height={50}/>
                    <Text style={styles.text2}>Start</Text>
                    { selectedHarvesterReading?.infraMovementStartTime &&<Text style={styles.text2}>{dateFormater(selectedHarvesterReading?.infraMovementStartTime)}</Text>}
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>submit('stop')}
                    disabled={(!selectedHarvesterReading?.infraMovementStartTime) || (selectedHarvesterReading?.infraMovementStartTime && selectedHarvesterReading?.infraMovementEndTime) ? true :false} 
                    style={[styles.btn_Wrp,{opacity:(!selectedHarvesterReading?.infraMovementStartTime) || (selectedHarvesterReading?.infraMovementStartTime && selectedHarvesterReading?.infraMovementEndTime) ? .5 : 1}]}
                >
                    <StopBtn width={50} height={50}/>
                    <Text style={styles.text2}>Stop</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HarvesterShifting


const styles =StyleSheet.create({
    container:{
        marginTop: 20,
        flexDirection: 'column',
        width: '100%',
        paddingHorizontal:20
    },
    line:{
        borderBottomWidth:1,
        borderBottomColor:'s#c1bfbf',
        marginTop:10,
    },
    text:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        // marginLeft: 10,
        // width: '50%',
        // alignSelf: 'center',
    },
    text2:{
        fontSize: 16,
        color: '#000000',
        marginLeft: 5,
        // width: '60%',
        // alignSelf: 'center',
    },
    headingSec:{
        flexDirection:'row',
    },
    btnContainer:{
        flexDirection:'row',
        marginTop:20,
        paddingHorizontal:30,
        justifyContent:'space-between'
    },
    btn_Wrp:{
       
        // width:'100%',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        // borderWidth:1
    }
})