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
import {getAllOrdersByCustomerId} from '../../../services/order';
import {setCartData} from '../../../redux/slices/Cart';
import HistoryCardSkeleton from '../../../components/cardSkeleton/OrderSkeleton';

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [orderCategoryTab, setOrderCategoryTab] = useState('all');
  console.log('order', allOrders)

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
 // ✅ FILTER ORDERS BY TAB - UPDATED VERSION
const filteredOrders = useMemo(() => {

  if (orderCategoryTab === 'all') {
    return allOrders;
  }

  if (orderCategoryTab === 'buynow') {
    return allOrders.filter(item => item?.orderCategory === 'normal');
  }

  if (orderCategoryTab === 'preOrder') {
    return allOrders.filter(item => item?.orderCategory === 'preOrder');
  }

   if (orderCategoryTab === 'daily') {
    return allOrders.filter(item => item?.orderCategory === 'daily');
  }

  return allOrders;

}, [allOrders, orderCategoryTab]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.noOrders} style={styles.emptyImage} />
      <Text style={styles.emptyText}>
        No{' '}
        {orderCategoryTab === 'all'
          ? 'all'
          : orderCategoryTab === 'buynow'
          ? 'buynow'
          : 'Pre-Order'}{' '}
        Orders Found
      </Text>
      {!user && (
        <View style={{width: width(30), marginLeft: 10, marginTop: width(2)}}>
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
  const handleAddToCart = async selectedItem => {
    const orderArray = selectedItem?.order || [];

    if (!user) {
      showModal(
        icons?.cross,
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

    // 3️⃣ Validate merchant for existing cart
    const cartMerchantId = cartData[0]?.merchantId;

    if (cartMerchantId !== orderMerchantId) {
      showModal(
        icons?.cross,
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
      <AppHeader goBack={true} cartIcon={true} text="History" />

      {/* 🔘 TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setOrderCategoryTab('all')}
          style={[
            styles.tabButton,
            orderCategoryTab === 'all' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              orderCategoryTab === 'all' && styles.activeText,
            ]}>
            All
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
            PreOrder
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setOrderCategoryTab('buynow')}
          style={[
            styles.tabButton,
            orderCategoryTab === 'buynow' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              orderCategoryTab === 'buynow' && styles.activeText,
            ]}>
            Buy Now 
          </Text>
        </TouchableOpacity>

          <TouchableOpacity
          onPress={() => setOrderCategoryTab('daily')}
          style={[
            styles.tabButton,
            orderCategoryTab === 'daily' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              orderCategoryTab === 'daily' && styles.activeText,
            ]}>
            Daily 
          </Text>
        </TouchableOpacity>

      </View>

      {/* 📦 ORDERS LIST */}
      <FlatList
        data={loading ? [1, 1, 1] : filteredOrders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return loading ? (
            <HistoryCardSkeleton />
          ) : (
            <HistoryCard orderCategoryTab={orderCategoryTab} item={item} handleAddToCart={handleAddToCart} />
          );
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && renderEmptyComponent()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

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
    // backgroundColor: colors.border,
    // borderRadius: 100,
    margin: width(4),
    flexDirection: 'row',
    padding: width(1),
    justifyContent: 'space-between',
  },
  tabButton: {
    height: width(10),
    width: 75,
    backgroundColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width(3),
  },
  activeTab: {
    backgroundColor: colors.redish,
  },
  tabText: {
    fontFamily: fontFamily.poppinBold,
    fontSize: 10,
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
