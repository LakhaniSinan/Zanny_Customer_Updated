import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
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
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import ChangeAddressModal from '../../../components/modalComponent';
import {colors} from '../../../constants/index';
import {handelGetAddress} from '../../../redux/slices/Address';
import {setCartData} from '../../../redux/slices/Cart';
import {setCurrentLocation} from '../../../redux/slices/Location';
import {setOrderType} from '../../../redux/slices/OrderType';
import {setPaymentType} from '../../../redux/slices/PaymentType';
import {
  addAddress,
  checkAddressCahngeIsPossible,
  deleteAddress,
} from '../../../services/address';
import CustomModal from '../../../components/customModal';
import {icons} from '../../../assets';

const Address = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {address} = useSelector(state => state.AddressSlice);
  const cartData = useSelector(state => state.CartSlice.cartData);
  const type = route?.params?.type ? route?.params?.type : null;
  const user = useSelector(state => state.LoginSlice.user);
  const [current, setCurrent] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editData, setEditData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    title: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  const showError = message => {
    setModalData({
      Icon: icons.cross,
      title: 'Validation Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

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
        Alert.alert(response?.data?.message);
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
    console.log(item, 'itemitemitemitemitem');

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
      } finally {
        setIsLoading(false);
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
        Alert.alert(response.data.message);
      } else {
        // addressGet();
      }
    });
  };

  const handleEditAddress = item => {
    setModalMode('edit');
    setEditData(item);
    setShowAddressPopup(true);
  };

  const handleAddOrUpdate = formData => {
    console.log(formData, 'handleAddOrUpdatehandleAddOrUpdate');
    const payload = {
      address: formData?.fullAddress,
      street: formData?.street,
      // floor,
      // latitude,
      // longitude,
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

  return (
    <>
      <SafeAreaView
        style={{flex: 1, marginBottom: 5, backgroundColor: colors.white}}>
        <OverLayLoader isloading={isLoading} />

        <AppHeader
          goBack={true}
          addressPlus={true}
          text="Address"
          onPressAddress={() => setShowAddressPopup(true)}
        />

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
          {address?.length > 0 ? (
            address?.map(val => {
              return (
                <AddressCard
                  item={val}
                  onPressdelete={() => showAlert(val._id)}
                  handleAddressChange={handleAddressChange}
                  onPressEdit={() => handleEditAddress(val)}
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
          {/* <View style={styles.btnview}>
            <Button
              heading="Add new address"
              color={colors.themeColor}
              onPress={() =>
                navigation.navigate('AddEditAddress', {type: 'add'})
              }
            />
          </View> */}
        </ScrollView>
        <ChangeAddressModal
          visible={showAddressPopup}
          onClose={() => setShowAddressPopup(false)}
          mode={modalMode}
          data={editData}
          onUpdate={handleAddOrUpdate}
        />
        <CustomModal
          visible={modalVisible}
          Icon={modalData.Icon}
          name={modalData.title}
          detail={modalData.detail}
          buttonName={modalData.buttonName}
          onPress={modalData.onPress}
          close={() => setModalVisible(false)}
        />
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
