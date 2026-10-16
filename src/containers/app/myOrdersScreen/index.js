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
import {colors, Colors} from '../../../constants';
import {getAllOrdersByCustomerId} from '../../../services/order';
import {setCartData} from '../../../redux/slices/Cart';
import HistoryCardSkeleton from '../../../components/cardSkeleton/OrderSkeleton';

const ORDER_TABS = [
  {key: 'all', label: 'All', category: null},
  {key: 'preOrder', label: 'PreOrder', category: 'preOrder'},
  {key: 'buynow', label: 'Buy Now', category: 'normal'},
  {key: 'daily', label: 'Daily', category: 'daily'},
];

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [orderCategoryTab, setOrderCategoryTab] = useState('all');

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

  const filteredOrders = useMemo(() => {
    const activeTab = ORDER_TABS.find(tab => tab.key === orderCategoryTab);
    if (!activeTab?.category) {
      return allOrders;
    }
    return allOrders.filter(item => item?.orderCategory === activeTab.category);
  }, [allOrders, orderCategoryTab]);

  const activeTabLabel = useMemo(() => {
    const activeTab = ORDER_TABS.find(tab => tab.key === orderCategoryTab);
    return activeTab?.label || 'All';
  }, [orderCategoryTab]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.noOrders} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No {activeTabLabel} Orders Found</Text>
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
        {ORDER_TABS.map(tab => {
          const isActive = orderCategoryTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setOrderCategoryTab(tab.key)}
              style={[styles.tabButton, isActive && styles.activeTab]}>
              <Text style={[styles.tabText, isActive && styles.activeText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 📦 ORDERS LIST */}
      <FlatList
        data={loading ? [1, 1, 1] : filteredOrders}
        keyExtractor={(item, index) =>
          loading
            ? `skeleton-${index}`
            : item?._id?.toString() || index.toString()
        }
        renderItem={({item}) => {
          return loading ? (
            <HistoryCardSkeleton />
          ) : (
            <HistoryCard
              orderCategoryTab={orderCategoryTab}
              item={item}
              handleAddToCart={handleAddToCart}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading ? renderEmptyComponent : null}
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
    justifyContent: 'space-between',
    margin: width(4),
    flexDirection: 'row',
    padding: width(1),
    justifyContent: 'space-between',
  },
  tabButton: {
    height: width(10),
    width: width(22),
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
