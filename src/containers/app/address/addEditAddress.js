import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '../../../components/header';
import Button from '../../../components/button';
import Map from '../../../components/locationMap';
import {width, height} from 'react-native-dimension';
import {colors} from '../../../constants';
import {addAddress, updateAddress} from '../../../services/address';
import {useSelector} from 'react-redux';
import {helper} from '../../../helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCurrentLocation} from '../../../redux/slices/Location';
import {useDispatch} from 'react-redux';
import {handelGetAddress} from '../../../redux/slices/Address';
import OverLayLoader from '../../../components/loader';
const AddEditAddress = ({navigation, route}) => {
  const {type} = route.params;
  const dispatch = useDispatch();
  const [isloading, setIsLoading] = useState(false);
  const user = useSelector(state => state.LoginSlice.user);
  const currentLocation = useSelector(
    state => state.LocationSlice.currentLocation,
  );
  const [addressId, setAddressId] = useState(null);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [inputs, setInputs] = useState({
    placeType: '',
    address: '',
    street: '',
    floor: '',
  });

  useEffect(() => {
    checkCurrentLocation();
    getUserLocation();
  }, []);

  const checkCurrentLocation = async () => {
    setIsLoading(true);
    let location = await helper.getCurrentLocation();
    let latitude = location?.coords.latitude;
    let longitude = location?.coords.longitude;
    setLocation({
      latitude,
      longitude,
    });
    let getFormattedAddress = await helper.getLocationAddress(
      latitude,
      longitude,
    );
    let formattedAddress = getFormattedAddress?.results[0]?.formatted_address;
    setIsLoading(false);
    if ((formattedAddress && type == 'add') || type == 'Select') {
      setInputs({
        ...inputs,
        address: formattedAddress,
      });
    }
  };

  const getUserLocation = async () => {
    let location = await helper.checkLocation();
    if (location == 'granted') {
      checkCurrentLocation();
    } else if (location == 'denied') {
      getUserLocation();
    } else if (location == 'blocked') {
      constants?.confirmationModal.isVisible({
        message:
          'Please turn On your Location from settings in order to get Resturants Near You',
        NegText: 'Later',
        PosText: 'Open Settings',
        PosPress: () => Linking.openSettings(),
      });
    }
  };

  useEffect(() => {
    if (type == 'edit') {
      const {noteToRider, floor, address, label, street, latitude, longitude} =
        route.params.data;
      setAddressId(route.params.data._id);
      setInputs({
        placeType: label,
        address: address,
        floor: floor,
        street: street,
        noteToRider: noteToRider,
      });
    }
  }, [type]);

  const onChangeHandler = (type, value) => {
    setInputs({
      ...inputs,
      [type]: value,
    });
  };

  const handleAddress = () => {
    const {placeType, address, street, floor} = inputs;
    const {latitude, longitude} = location;
    const payload = {
      address,
      street: street,
      floor,
      latitude,
      longitude,
      userId: user?._id,
    };
    if (address == '') {
      alert('Address is required');
    } else if (street == '') {
      alert('Street is required');
    } else {
      if (type == 'add') {
        setIsLoading(true);
        addAddress(payload)
          .then(response => {
            setIsLoading(false);
            if (response.data.status == 'error') {
              alert(response.data.message);
            } else {
              setInputs({
                placeType: '',
                address: '',
                street: '',
                floor: '',
                noteToRider: '',
              });
              alert(response.data.message);
              dispatch(handelGetAddress());
              navigation.navigate('Address');
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error, 'error=====>');
          });
      } else if (type == 'Select') {
        setIsLoading(true);
        console.log(payload, 'payloaddddd');
        addAddress(payload)
          .then(response => {
            setIsLoading(false);
            if (response.data.status == 'error') {
              alert(response.data.message);
            } else {
              setInputs({
                placeType: '',
                address: '',
                street: '',
                floor: '',
                noteToRider: '',
              });
              alert(response.data.message);
              navigation.goBack();
              dispatch(handelGetAddress());
              AsyncStorage.setItem(
                'userCurrentAddress',
                JSON.stringify(payload),
              );
              dispatch(setCurrentLocation(payload));
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error, 'error=====>');
          });
      } else {
        setIsLoading(true);
        updateAddress(addressId, payload)
          .then(response => {
            setIsLoading(false);
            alert(response.data.message);
            dispatch(handelGetAddress());
            navigation.navigate('Address');
          })
          .catch(error => {
            setIsLoading(false);
            alert(error.response.message);
          });
      }
    }
  };

  const renderTextInputs = (placeholder, type, multi, keyType) => {
    return (
      <TextInput
        style={styles.textinputs}
        placeholder={placeholder}
        value={inputs[type]}
        onChangeText={text => onChangeHandler(type, text)}
        placeholderTextColor="black"
        multiline={multi}
        keyboardType={keyType}
      />
    );
  };

  return (
    <>
      <OverLayLoader isloading={isloading} />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Header goBack text="Add a New Address" />
        <ScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.containerView}>
            <View style={{marginTop: width(4)}}>
              {/* {location && (
                <Map
                  style={{
                    width: width(100),
                    height: height(37),
                  }}
                  coordinate={{
                    longitude: parseFloat(location?.coords?.longitude),
                    latitude: parseFloat(location?.coords?.latitude),
                    latitudeDelta: 0.0121,
                    longitudeDelta: 0.015,
                  }}
                />
              )} */}
            </View>
            {/* <KeyboardAvoidingView>
              {renderTextInputs('Add a label', 'placeType')}
            </KeyboardAvoidingView> */}
            <KeyboardAvoidingView>
              {renderTextInputs('Address', 'address', true)}
            </KeyboardAvoidingView>
            <KeyboardAvoidingView>
              {renderTextInputs('Street', 'street', true)}
            </KeyboardAvoidingView>
            <KeyboardAvoidingView>
              {renderTextInputs('Floor (Optional)', 'floor', true)}
            </KeyboardAvoidingView>
          </View>
          <View style={{flex: 1, marginBottom: 10, justifyContent: 'flex-end'}}>
            <Button
              heading={type == 'add' ? 'Save and continue' : 'Update'}
              color={colors.themeColor}
              onPress={handleAddress}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  textinputs: {
    paddingLeft: 25,
    margin: 10,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '400',
    justifyContent: 'center',
    color: 'black',
    borderWidth: 0.8,
    borderColor: colors.grey,
  },
  dropPickerStyle: {
    paddingLeft: 25,
    margin: 10,
    borderRadius: 30,
    fontSize: 14,
    fontWeight: '400',
    marginVertical: height(2),
    elevation: 5,
    backgroundColor: 'white',
    color: 'black',
  },
  drroptext: {
    color: colors.black,
    marginLeft: width(5),
  },
  locationText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  containerView: {
    marginTop: -16,
  },
});

export default AddEditAddress;
