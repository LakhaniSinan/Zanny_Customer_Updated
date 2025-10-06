import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import AddressCard from '../../../components/addressCard';
import Button from '../../../components/button';
import Header from '../../../components/header';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants/index';
import {handelGetAddress} from '../../../redux/slices/Address';
import {setCurrentLocation} from '../../../redux/slices/Location';
import {setOrderType} from '../../../redux/slices/OrderType';
import {setPaymentType} from '../../../redux/slices/PaymentType';
import {
  addAddress,
  checkAddressCahngeIsPossible,
  deleteAddress,
} from '../../../services/address';
import {setCartData} from '../../../redux/slices/Cart';
import {CommonActions} from '@react-navigation/native';

const Address = ({navigation, route}) => {
  const dispatch = useDispatch();
  const userAddress = useSelector(state => state.AddressSlice.address);
  const cartData = useSelector(state => state.CartSlice.cartData);
  const type = route?.params?.type ? route?.params?.type : null;
  const user = useSelector(state => state.LoginSlice.user);
  const [current, setCurrent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(handelGetAddress());
    }
  }, []);

  const showAlert = val =>
    Alert.alert(
      'Please Confirm',
      'Are you sure you want to delete address?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('canecelled'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleDelete(val),
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log('canecelled'),
      },
    );

  const handleDelete = val => {
    deleteAddress(val)
      .then(response => {
        alert(response?.data?.message);
        dispatch(handelGetAddress());
      })
      .catch(error => {});
  };

  const handleSelectAddress = val => {
    AsyncStorage.setItem('userCurrentAddress', JSON.stringify(val));
    dispatch(setCurrentLocation(val));
    navigation.navigate('Checkout');
  };

  const handleAddressPrivateOrder = item => {
    handleSelectAddress(item);
    navigation.navigate('PrivateOrder');
  };

  const handleUpdateOrderType = () => {
    dispatch(setOrderType('pickup'));
    dispatch(setPaymentType(''));
    navigation.navigate('Cart');
  };

  const handleChangeAddress = item => {
    handleSelectAddress(item);
    dispatch(setCartData([]));
    AsyncStorage.setItem('cartData', JSON.stringify([]));

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'AllRestaurants'}],
      }),
    );
  };

  const handleAddressChange = async item => {
    if (type == 'privateOrder') {
      Alert.alert(
        'Confirm',
        'This address will be your delivery address for this order',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => handleAddressPrivateOrder(item)},
        ],
      );
    } else {
      try {
        let params = {
          restaurantId: cartData[0]?.merchantId,
          latitude: item?.latitude,
          longitude: item?.longitude,
        };
        setIsLoading(true);
        const response = await checkAddressCahngeIsPossible(params);
        setIsLoading(false);

        if (response?.status == 200 || response?.status == 201) {
          let data = response?.data?.result;
          console.log(data, 'datadatadatadata');

          if (data == 'deliveryAvailable') {
            AsyncStorage.setItem('userCurrentAddress', JSON.stringify(item));
            dispatch(setCurrentLocation(item));
            navigation.navigate('Checkout');
          } else if (data == 'pickupAvailable') {
            Alert.alert(
              'Warning',
              "Delivery isn't available for your address. Select 'Pick Up' to proceed.",
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Pick Up Order',
                  onPress: () => handleUpdateOrderType(item),
                },
              ],
            );
          } else if (data == 'notAvailable') {
            Alert.alert(
              'Warning',
              'Cart Will Be Empty Upon Changing Location',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => handleChangeAddress(item)},
              ],
            );
          } else {
            Alert.alert('Warning', 'Some thing went wrrong');
          }
        } else {
          console.log(response?.data, 'datadatadata');
        }
      } catch (error) {
        setIsLoading(false);
        console.log('🚀 ~ error:', error);
      }
    }
  };

  const saveLocation = () => {
    const payload = {
      placeType: current?.placeType,
      address: current?.address,
      street: '',
      floor: '',
      latitude: current?.latitude,
      longitude: current?.longitude,
      userId: user?._id,
    };
    addAddress(payload).then(response => {
      if (response.data.status == 'error') {
        alert(response.data.message);
      } else {
        addressGet();
      }
    });
  };

  return (
    <>
      <SafeAreaView
        style={{flex: 1, marginBottom: 5, backgroundColor: colors.white}}>
        <OverLayLoader isloading={isLoading} />

        {type == 'checkout' || type == 'privateOrder' ? (
          <Header text="Select Address" goBack={true} />
        ) : (
          <Header text="Address" drawer={true} />
        )}
        <ScrollView style={{flex: 1, backgroundColor: '#FFF'}}>
          {current?.address && type == 'checkout' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <View style={{marginHorizontal: width(3), width: width(65)}}>
                <Text style={styles.addressname}>{current?.placeType}</Text>
                <Text style={styles.address}>{current?.address}</Text>
              </View>
              <TouchableOpacity
                onPress={saveLocation}
                style={{
                  backgroundColor: colors.yellow,
                  paddingVertical: 5,
                  borderRadius: 5,
                  paddingHorizontal: 15,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
          {current?.address && type == 'privateOrder' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <View style={{marginHorizontal: width(3), width: width(65)}}>
                <Text style={styles.addressname}>{current?.placeType}</Text>
                <Text style={styles.address}>{current?.address}</Text>
              </View>
              <TouchableOpacity
                onPress={saveLocation}
                style={{
                  backgroundColor: colors.yellow,
                  paddingVertical: 5,
                  borderRadius: 5,
                  paddingHorizontal: 15,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
          {userAddress?.length > 0 ? (
            userAddress.map(val => {
              return (
                <AddressCard
                  item={val}
                  addressname={val?.label}
                  address={val?.address}
                  handleSelectAddress={handleSelectAddress}
                  handleAddressChange={handleAddressChange}
                  onPressEdit={() =>
                    navigation.navigate('AddEditAddress', {
                      type: 'edit',
                      data: val,
                    })
                  }
                  onPressdelete={() => showAlert(val._id)}
                  type={type}
                  navigation={navigation}
                />
              );
            })
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: width(50),
              }}>
              <Text style={{fontSize: 16, fontWeight: '700', color: 'black'}}>
                No Saved Address Found
              </Text>
            </View>
          )}
          <View style={styles.btnview}>
            <Button
              heading="Add new address"
              color={colors.themeColor}
              onPress={() =>
                navigation.navigate('AddEditAddress', {type: 'add'})
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  btnview: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});

export default Address;
