import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { width } from 'react-native-dimension';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { icons, images } from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import AppHeader from '../../../components/headerComponent';
import HistoryCard from '../../../components/historyCard';
import OverLayLoader from '../../../components/loader';
import { colors, Colors } from '../../../constants';
import { getAllOrdersByCustomerId } from '../../../services/order';
import CustomModal from '../../../components/customModal';
import { setCartData } from '../../../redux/slices/Cart';

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const user = useSelector(state => state.LoginSlice.user);
  const cartData = useSelector(state => state.CartSlice.cartData);

  const [modalData, setModalData] = useState({
    type: 'default',
    Icon: null,
    name: '',
    detail: '',
    onConfirm: () => { },
    onCancel: () => { },
  });

  const showModal = (icon, type, message) => {
    setModalData({
      type,
      name: type === 'error' ? 'Error' : 'Success',
      detail: message,
      Icon: icon,
      onConfirm: () => setModalVisible(false),
      onCancel: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const handleGetAllOrders = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      const response = await getAllOrdersByCustomerId(user?._id);
      setAllOrders(response?.data?.data || []);
    } catch (error) {
      console.log(error, 'Error fetching orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllOrders();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    handleGetAllOrders(true);
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.noOrders} style={styles.emptyImage} />
      <Text style={styles.emptyText}>
        {user
          ? 'No Orders Found'
          : 'No orders found, Please login first to see your orders history.'}
      </Text>
      {!user && (
        <View style={{ width: width(30), marginLeft: 10, marginTop: width(2) }}>
          <ActionBuuton
            name="Login"
            height={50}
            fontSize={14}
            bgcColor={colors.redish}
            fontColor={colors.white}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      )}
    </View>
  );

  // **************************************************
  // 🚀 ORDER AGAIN HANDLER (FINAL LOGIC)
  // **************************************************
  const handleAddToCart = async (selectedItem) => {
    const orderArray = selectedItem?.order || [];

    if (!user) {
      showModal(icons?.cross, 'error', 'Please login first to add items in your cart');
      return;
    }

    // 1️⃣ Extract merchant from the old order
    const orderMerchantId = orderArray[0]?.merchantId;

    if (!orderMerchantId) {
      showModal(icons?.cross, 'error', 'Invalid order data');
      return;
    }

    // 2️⃣ If cart is empty → add whole order
    if (cartData.length === 0) {
      dispatch(setCartData(orderArray));
      await AsyncStorage.setItem('cartData', JSON.stringify(orderArray));

      showModal(icons?.check, 'success', 'Order added to cart');
      return;
    }

    // 3️⃣ Validate merchant for existing cart
    const cartMerchantId = cartData[0]?.merchantId;

    if (cartMerchantId !== orderMerchantId) {
      showModal(icons?.cross, 'error', 'You can only order from the same merchant');
      return;
    }

    // 4️⃣ Same merchant → replace entire cart
    dispatch(setCartData(orderArray));
    await AsyncStorage.setItem('cartData', JSON.stringify(orderArray));

    showModal(icons?.check, 'success', 'Order added to cart successfully');
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppHeader goBack={true} cartIcon={true} text="History" />

      <FlatList
        data={allOrders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <HistoryCard item={item} handleAddToCart={handleAddToCart} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && renderEmptyComponent()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Loader */}
      <OverLayLoader isloading={loading} />

      <CustomModal
        visible={modalVisible}
        type={modalData.type}
        Icon={modalData.Icon}
        name={modalData.name}
        detail={modalData.detail}
        onConfirm={modalData.onConfirm}
        onCancel={modalData.onCancel}
        close={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default MyOrdersScreen;
