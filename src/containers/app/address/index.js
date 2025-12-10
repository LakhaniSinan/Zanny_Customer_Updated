import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';

import AddressCard from '../../../components/addressCard';
import CustomModal from '../../../components/customModal';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import ChangeAddressModal from '../../../components/modalComponent';

import {icons} from '../../../assets';
import {colors} from '../../../constants';

import {handelGetAddress} from '../../../redux/slices/Address';
import {setCartData} from '../../../redux/slices/Cart';
import {setCurrentLocation} from '../../../redux/slices/Location';
import {setOrderType} from '../../../redux/slices/OrderType';
import {setPaymentType} from '../../../redux/slices/PaymentType';

import {
  addAddress,
  checkAddressCahngeIsPossible,
  deleteAddress,
  updateAddress,
} from '../../../services/address';

const Address = ({navigation, route}) => {
  const dispatch = useDispatch();

  const {address} = useSelector(state => state.AddressSlice);
  const cartData = useSelector(state => state.CartSlice.cartData);
  const user = useSelector(state => state.LoginSlice.user);
  const type = route?.params?.type || null;

  const [current, setCurrent] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editData, setEditData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: null,
    Icon: null,
    name: '',
    detail: '',
    buttonName: 'OK',
    onConfirm: null,
    onCancel: null,
  });

  const openModal = config => {
    setModalConfig({
      type: null,
      Icon: null,
      name: '',
      detail: '',
      buttonName: 'OK',
      onConfirm: null,
      onCancel: null,
      ...config,
    });
    setModalVisible(true);
  };
  useEffect(() => {
    if (user) dispatch(handelGetAddress());
  }, [dispatch, user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(handelGetAddress()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const confirmDelete = id => {
    openModal({
      type: 'confirmation',
      Icon: icons.alertIcon,
      name: 'Please Confirm',
      detail: 'Are you sure you want to delete this address?',
      buttonName: 'Confirm',
      onConfirm: () => {
        setModalVisible(false);
        handleDelete(id);
      },
      onCancel: () => setModalVisible(false),
    });
  };

  const handleDelete = async id => {
    try {
      const res = await deleteAddress(id);
      openModal({
        Icon: icons.check,
        name: 'Success',
        detail: res?.data?.message,
      });
      dispatch(handelGetAddress());
    } catch (e) {
      console.log(e);
    }
  };
  const handleSelectAddress = val => {
    AsyncStorage.setItem('userCurrentAddress', JSON.stringify(val));
    dispatch(setCurrentLocation(val));
    navigation.navigate('Checkout');
  };

  const handlePrivateOrder = item => {
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
        routes: [{name: 'BottomStack'}],
      }),
    );
  };

  const handleAddressChange = async item => {
    if (type === 'privateOrder') {
      openModal({
        type: 'confirmation',
        Icon: icons.Info,
        name: 'Confirm',
        detail: 'This address will be used for this order',
        buttonName: 'OK',
        onConfirm: () => {
          setModalVisible(false);
          handlePrivateOrder(item);
        },
        onCancel: () => setModalVisible(false),
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await checkAddressCahngeIsPossible({
        restaurantId: cartData[0]?.merchantId,
        latitude: item.latitude,
        longitude: item.longitude,
      });

      const result = res?.data?.result;

      if (result === 'deliveryAvailable') {
        handleSelectAddress(item);
      } else if (result === 'pickupAvailable') {
        openModal({
          type: 'confirmation',
          Icon: icons.alertIcon,
          name: 'Warning',
          detail: "Delivery isn't available. Pick up instead?",
          buttonName: 'Pick Up',
          onConfirm: () => {
            setModalVisible(false);
            handleUpdateOrderType();
          },
          onCancel: () => setModalVisible(false),
        });
      } else {
        if (cartData?.length > 0) {
          openModal({
            type: 'confirmation',
            Icon: icons.alertIcon,
            name: 'Warning',
            detail: 'Cart will be cleared if you continue',
            buttonName: 'Continue',
            onConfirm: () => {
              setModalVisible(false);
              handleChangeAddress(item);
            },
            onCancel: () => setModalVisible(false),
          });
        } else {
          handleChangeAddress(item);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdate = async formData => {
    if (!formData?.userAddress || !formData?.street || !formData?.city) {
      openModal({
        Icon: icons.cross,
        name: 'Validation Error',
        detail: 'All fields are required',
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        address: formData.userAddress,
        street: formData.street,
        city: formData.city,
        latitude: formData?.latLng?.lat,
        longitude: formData?.latLng?.lng,
        userId: user?._id,
      };

      const res =
        formData.type === 'edit'
          ? await updateAddress(formData._id, payload)
          : await addAddress(payload);

      openModal({
        Icon: icons.check,
        name: 'Success',
        detail: res?.data?.message,
        onClose: () => setModalVisible(false),
      });
      dispatch(handelGetAddress());
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** ---------------- UI ---------------- */
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <OverLayLoader isloading={isLoading} />

      <AppHeader
        goBack
        addressPlus
        text="Address"
        onPressAddress={() => setShowAddressPopup(true)}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {address?.length > 0 ? (
          address.map(item => (
            <AddressCard
              key={item._id}
              item={item}
              onPressdelete={() => confirmDelete(item._id)}
              onPressEdit={() => {
                setModalMode('edit');
                setEditData(item);
                setShowAddressPopup(true);
              }}
              handleAddressChange={handleAddressChange}
            />
          ))
        ) : (
          <Text style={styles.empty}>No Saved Address Found</Text>
        )}
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
        type={modalConfig.type}
        Icon={modalConfig.Icon}
        name={modalConfig.name}
        detail={modalConfig.detail}
        buttonName={modalConfig.buttonName}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
        close={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  empty: {
    textAlign: 'center',
    marginTop: width(40),
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
});

export default Address;
