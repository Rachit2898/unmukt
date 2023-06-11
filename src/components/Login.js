import React, {useState, useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
} from 'react-native';
import {
  Stack,
  TextInput,
  IconButton,
  Button,
} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Entypo';
// import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {isLogin} from '../Redux-Files/loginSlice';
import {Axios} from '../core/axios';
import {ProfileData} from '../Redux-Files/ProfileSlice';

export default function Login() {
  // Create view that have list of all setting options
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    // check if token is present in local storage
    AsyncStorage.getItem('token').then(token => {
      if (token !== null) {
        dispatch(isLogin(true));
      }
    });
  }, []);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (phoneNumber === '' || password === '') {
      alert('Please enter username and password');
      return;
    }
    setLoading(true);
    Axios.post('authenticate', {
      userName: phoneNumber,
      password: password,
    })
      .then(function (response) {
        console.log(response, 'logiiiiiiiiiiinnnnnnnnnnnnnn');
        // check if response is 200
        if (response.status !== 200) {
          setLoading(false);
          alert('Invalid username or password');
          return;
        }
        Axios.get(`userAuth/${response.data.userName}`, {
          headers: {Authorization: `Bearer ${response.headers.authorization}`},
        })
          .then(res => {
            console.log(res, 'authhhhhhhhhhhhhhhhh');
            const accessUserRole = Array.from(
              res.data,
              elm => elm.accessUserRole,
            );
            setLoading(false);
            // set token in local storage
            AsyncStorage.setItem('token', response.headers.authorization);
            AsyncStorage.setItem(
              'profile',
              JSON.stringify({
                ...response.data,
                accessUserRole: accessUserRole,
              }),
            );
            Axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${response.headers.authorization}`;
            dispatch(isLogin(true));
            dispatch(
              ProfileData({...response.data, accessUserRole: accessUserRole}),
            );
          })
          .catch(err => {
            setLoading(false);
            console.log(err);
            alert(err.message);
          });
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        // alert('Invalid username or password');
        alert(error.message);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <Image
        source={require('../assets/icon.png')}
        style={{
          width: '100%',
          height: 100,
          resizeMode: 'contain',
          margin: 20,
        }}
      />

      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%',
          marginTop: 50,
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 10,
          backgroundColor: '#DBDBDBC2',
        }}>
        <Stack
          style={{width: '100%', padding: 20, marginTop: 40, marginBottom: 40}}>
          <TextInput
            label="Phone Number"
            variant="outlined"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={{
              marginTop: 20,
            }}
          />
          <TextInput
            label="Password"
            variant="outlined"
            textContentType="password"
            style={{
              marginTop: 20,
            }}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            trailing={props => (
              <IconButton
                icon={props => (
                  <Icon
                    name={showPassword ? 'eye-with-line' : 'eye'}
                    {...props}
                  />
                )}
                {...props}
                onPress={handleTogglePasswordVisibility}
              />
            )}
          />

          <Button
            mode="contained"
            onPress={() => handleLogin()}
            style={{
              margin: 16,
              width: 200,
              alignSelf: 'center',
              padding: 2,
              backgroundColor: '#651C20',
            }}
            title={!loading && 'Login'}
            loading={loading}></Button>
        </Stack>
      </View>
    </View>
  );
}
