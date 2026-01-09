import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
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

  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editData, setEditData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const modalQueueRef = useRef([]);
  const processingModalRef = useRef(false);
  const openModalTimerRef = useRef(null);

  /* ---------------- MODAL HELPER ---------------- */
  const processModalQueue = () => {
    if (processingModalRef.current) return;
    const nextConfig = modalQueueRef.current.shift();
    if (!nextConfig) return;

    processingModalRef.current = true;
    setModalConfig(nextConfig);
    setModalVisible(true);

    openModalTimerRef.current = setTimeout(() => {
      processingModalRef.current = false;
      processModalQueue();
    }, 500);
  };

  const openModal = config => {
    modalQueueRef.current.push(config);
    processModalQueue();
  };

  useEffect(() => {
    return () => {
      if (openModalTimerRef.current) {
        clearTimeout(openModalTimerRef.current);
        openModalTimerRef.current = null;
      }
      modalQueueRef.current = [];
      processingModalRef.current = false;
    };
  }, []);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    if (user) dispatch(handelGetAddress());
  }, [dispatch, user]);

  /* ---------------- PULL TO REFRESH ---------------- */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(handelGetAddress()).finally(() => setRefreshing(false));
  }, [dispatch]);

  /* ---------------- ADDRESS STORAGE ---------------- */
  const saveAddress = async item => {
    await AsyncStorage.setItem('userCurrentAddress', JSON.stringify(item));
    dispatch(setCurrentLocation(item));
  };

  /* ---------------- DELETE ---------------- */
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
      setIsLoading(true);
      const res = await deleteAddress(id);
      if (res.status == 200 || res.status == 201) {
        openModal({
          Icon: icons.check,
          name: 'Success',
          detail: res?.data?.message,
          onConfirm: () => {
            setModalVisible(false);
            dispatch(handelGetAddress());
          },
        });
      } else {
        openModal({
          Icon: icons.cross,
          name: 'Error',
          detail: res?.data?.message,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- ADDRESS CHANGE FLOW ---------------- */
  const handleAddressChange = async item => {
    if (type === 'privateOrder') {
      openModal({
        type: 'confirmation',
        Icon: icons.Info,
        name: 'Confirm',
        detail: 'This address will be used for this order',
        buttonName: 'OK',
        onConfirm: async () => {
          setModalVisible(false);
          await saveAddress(item);
          navigation.navigate('PrivateOrder');
        },
        onCancel: () => setModalVisible(false),
      });
      return;
    }

    try {
      setIsLoading(true);

      let params = {
        restaurantId: cartData[0]?.merchantId,
        latitude: item.latitude,
        longitude: item.longitude,
      };

      const res = await checkAddressCahngeIsPossible(params);

      console.log(res, 'resresresresresres');

      const result = res?.data?.result;

      if (result === 'deliveryAvailable' || result === undefined) {
        await saveAddress(item);
        return;
      }

      if (result === 'pickupAvailable') {
        openModal({
          type: 'confirmation',
          Icon: icons.alertIcon,
          name: 'Warning',
          detail: "Delivery isn't available. Pick up instead?",
          buttonName: 'Pick Up',
          onConfirm: () => {
            setModalVisible(false);
            dispatch(setOrderType('pickup'));
            dispatch(setPaymentType(''));
            navigation.navigate('Cart');
          },
          onCancel: () => setModalVisible(false),
        });
        return;
      }

      if (result === 'notAvailable' && cartData?.length > 0) {
        openModal({
          type: 'confirmation',
          Icon: icons.alertIcon,
          name: 'Warning',
          detail:
            'The distance between the two locations is too much so basket will be cleared',
          buttonName: 'Continue',
          onConfirm: async () => {
            setModalVisible(false);
            await saveAddress(item);
            dispatch(setCartData([]));
            dispatch(handelGetAddress());
            await AsyncStorage.setItem('cartData', JSON.stringify([]));
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'BottomStack'}],
              }),
            );
          },
          onCancel: () => setModalVisible(false),
        });
      }
    } catch (e) {
      console.log(e, 'akajksbdakjsbdjaksbdjaksbd');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- ADD / UPDATE ---------------- */
  const handleAddOrUpdate = async formData => {
    setShowAddressPopup(false);

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
        onConfirm: () => {
          setModalVisible(false);
          dispatch(handelGetAddress());
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- MEMOIZED LIST ---------------- */
  const addressList = useMemo(() => {
    return address?.map(item => (
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
    ));
  }, [address]);

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <OverLayLoader isloading={isLoading} />

      <AppHeader
        goBack
        addressPlus
        text="Address"
        onPressAddress={() => {
          setModalMode('add');
          setEditData(null);
          setShowAddressPopup(true);
        }}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {address?.length > 0 ? (
          addressList
        ) : (
          <Text style={styles.empty}>No Saved Address Found</Text>
        )}
      </ScrollView>

      <ChangeAddressModal
        visible={showAddressPopup}
        onClose={() => {
          setShowAddressPopup(false);
          setEditData(null);
          setModalMode('add');
        }}
        mode={modalMode}
        data={editData}
        onUpdate={handleAddOrUpdate}
      />

      <CustomModal
        visible={modalVisible}
        {...modalConfig}
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
