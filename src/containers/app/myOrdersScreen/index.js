import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';

import {fontFamily, icons, images} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import CustomModal from '../../../components/customModal';
import AppHeader from '../../../components/headerComponent';
import HistoryCard from '../../../components/historyCard';
import OverLayLoader from '../../../components/loader';
import {colors, Colors} from '../../../constants';
import {setCartData} from '../../../redux/slices/Cart';
import {getAllOrdersByCustomerId} from '../../../services/order';

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔑 TAB STATE (NORMAL / PREORDER)
  const [orderCategoryTab, setOrderCategoryTab] = useState('normal');

  const user = useSelector(state => state.LoginSlice.user);
  const cartData = useSelector(state => state.CartSlice.cartData);

  const [modalData, setModalData] = useState({
    type: 'default',
    Icon: null,
    name: '',
    detail: '',
    onConfirm: () => {},
    onCancel: () => {},
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
      console.log(error);
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

  // ✅ FILTER ORDERS BY TAB
  const filteredOrders = useMemo(() => {
    return allOrders.filter(item => item?.orderCategory === orderCategoryTab);
  }, [allOrders, orderCategoryTab]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.noOrders} style={styles.emptyImage} />
      <Text style={styles.emptyText}>
        No {orderCategoryTab === 'normal' ? 'Normal' : 'Pre-Order'} Orders Found
      </Text>
    </View>
  );

  const handleAddToCart = async selectedItem => {
    const orderArray = selectedItem?.order || [];

    if (!user) {
      showModal(
        icons.cross,
        'error',
        'Please login first to add items in your cart',
      );
      return;
    }

    const orderMerchantId = orderArray[0]?.merchantId;
    if (!orderMerchantId) return;

    if (cartData.length === 0) {
      dispatch(setCartData(orderArray));
      await AsyncStorage.setItem('cartData', JSON.stringify(orderArray));
      showModal(icons.check, 'success', 'Order added to cart');
      return;
    }

    if (cartData[0]?.merchantId !== orderMerchantId) {
      showModal(
        icons.cross,
        'error',
        'You can only order from the same merchant',
      );
      return;
    }

    dispatch(setCartData(orderArray));
    await AsyncStorage.setItem('cartData', JSON.stringify(orderArray));
    showModal(icons.check, 'success', 'Order added successfully');
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <AppHeader goBack cartIcon text="History" />

      {/* 🔘 TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setOrderCategoryTab('normal')}
          style={[
            styles.tabButton,
            orderCategoryTab === 'normal' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              orderCategoryTab === 'normal' && styles.activeText,
            ]}>
            Normal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOrderCategoryTab('preOrder')}
          style={[
            styles.tabButton,
            orderCategoryTab === 'preOrder' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              orderCategoryTab === 'preOrder' && styles.activeText,
            ]}>
            Pre-Order
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📦 ORDERS LIST */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <HistoryCard item={item} handleAddToCart={handleAddToCart} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && renderEmptyComponent()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

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
  tabContainer: {
    backgroundColor: colors.border,
    borderRadius: 100,
    margin: width(4),
    flexDirection: 'row',
    padding: width(1),
  },
  tabButton: {
    height: width(12),
    width: width(45),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: colors.redish,
  },
  tabText: {
    fontFamily: fontFamily.poppinBold,
    fontSize: 12,
    color: colors.gray,
  },
  activeText: {
    color: colors.white,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: Colors.gray,
  },
});

export default MyOrdersScreen;
