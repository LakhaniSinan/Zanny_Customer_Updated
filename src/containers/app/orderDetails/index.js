import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, icons, images} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import CustomModal from '../../../components/customModal';
import AppHeader from '../../../components/headerComponent';
import {updateOrderStatus} from '../../../services/order';
import {colors} from './../../../constants/index';
import styles from './style';
import {setCartData} from '../../../redux/slices/Cart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OverLayLoader from '../../../components/loader';

const OrderDetail = ({navigation, route}) => {
  const data = route.params;
  console.log(data, 'datadatadatadatadatadatadata123d');

  const {cartData} = useSelector(state => state.CartSlice);
  const [isloading, setIsloding] = useState(false);
  const user = useSelector(state => state.LoginSlice.user);
  const [subTotal, setSubTotal] = useState(0);
  const [prepareTime, setPrepareTime] = useState('');
  const [remainingTimes, setRemainingTimes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const dispatch = useDispatch();

  const updateRemainingTime = (orderId, pickupMinutes, orderDate) => {
    // Convert order date string to Date object
    const orderTime = new Date(orderDate);
    const pickupTime = new Date(orderTime.getTime() + pickupMinutes * 60000);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = pickupTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setRemainingTimes(prev => ({...prev, [orderId]: '00:00'}));
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setRemainingTimes(prev => ({
          ...prev,
          [orderId]: `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`,
        }));
      }
    }, 1000);

    return interval; // Return interval ID for cleanup
  };

  useEffect(() => {
    const intervals = {};

    // Enable countdown timer for current order
    if (data.pickupTimmings) {
      intervals[data._id] = updateRemainingTime(
        data._id,
        data.pickupTimmings,
        data.createdAt,
      );
    }

    return () => {
      Object.values(intervals).forEach(intervalId => clearInterval(intervalId));
    };
  }, [data]);

  useEffect(() => {
    let total = 0;

    data?.order?.forEach(item => {
      const qty = item?.quantity ?? item?.selectedQty ?? 1;

      const unitPrice =
        Number(item?.discount) > 0 ? Number(item.discount) : Number(item.price);

      total += qty * unitPrice;
    });

    setSubTotal(total);
  }, [data?.order]);

  const handleCancelOrder = () => {
    let payload = {
      Id: data?._id,
      status: 'Cancelled',
      userId: user?._id,
    };
    setIsloding(true);
    updateOrderStatus(payload)
      .then(response => {
        setIsloding(false);
        if (response?.status == 200 || response?.status == 201) {
          openModal({
            type: 'success',
            Icon: icons.check,
            name: 'Success',
            detail: response?.data?.message,
            buttonName: 'OK',
            onConfirm: () => {
              setModalVisible(false);
              setTimeout(() => {
                navigation.goBack();
              }, 300);
            },
          });
        } else {
          openModal({
            type: 'error',
            Icon: icons.alertIcon,
            name: 'Error',
            detail: response?.data?.message,
            buttonName: 'OK',
            onConfirm: () => {
              setModalVisible(false);
              navigation.goBack();
            },
          });
        }
      })
      .catch(error => {
        console.log(error, 'error');
        setIsloding(false);
      });
  };
  const modalQueueRef = useRef([]);
  const processingModalRef = useRef(false);
  const openModalTimerRef = useRef(null);
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

  const cofirmAlert = () => {
    openModal({
      type: 'confirmation',
      Icon: icons.alertIcon,
      name: 'Please Confirm',
      detail: 'Are you sure you want to cancel this order?',
      buttonName: 'Confirm',

      onConfirm: () => {
        setModalVisible(false);
        setTimeout(() => {
          handleCancelOrder();
        }, 300);
      },
      onCancel: () => setModalVisible(false),
    });
  };

  const getStatusStyle = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          bg: 'rgba(255,165,0,0.2)',
          color: '#FFA500',
          bannerBg: '#FFA500',
          badgeBg: '#FFE5B4',
          badgeTextColor: '#FF8C00',
        };
      case 'accepted':
        return {
          bg: 'rgba(30,144,255,0.2)',
          color: '#1E90FF',
          bannerBg: '#1E90FF',
          badgeBg: '#B0E0E6',
          badgeTextColor: '#0066CC',
        };
      case 'cancelled':
        return {
          bg: 'rgba(255,69,0,0.2)',
          color: '#FF4500',
          bannerBg: '#FF4500',
          badgeBg: '#FFE4E1',
          badgeTextColor: '#CC0000',
        };
      case 'rejected':
        return {
          bg: 'rgba(255,69,0,0.2)',
          color: '#FF4500',
          bannerBg: '#FF4500',
          badgeBg: '#FFE4E1',
          badgeTextColor: '#CC0000',
        };
      case 'completed':
      case 'delivered':
        return {
          bg: 'rgba(50,205,50,0.2)',
          color: '#32CD32',
          bannerBg: '#FFA500',
          badgeBg: '#90EE90',
          badgeTextColor: '#006400',
        };
      default:
        return {
          bg: 'rgba(238, 144, 144, 0.3)',
          color: '#32CD32',
          bannerBg: '#FFA500',
          badgeBg: '#90EE90',
          badgeTextColor: '#006400',
        };
    }
  };
  const statusStyle = getStatusStyle(data?.status);

  // Format delivery date and time
  const formatDeliveryDateTime = () => {
    if (data?.createdAt) {
      const date = moment(data.createdAt);
      return date.format('dddd, MMMM D, HH:mm');
    }
    if (data?.deliveryDate) {
      const date = moment(data.deliveryDate);
      return date.format('dddd, MMMM D, HH:mm');
    }
    return '';
  };

  const showModal = (Icon, type, detail, onConfirm = () => {}) => {
    if (modalVisible) return; // 🔥 IMPORTANT FIX

    setModalConfig({
      type,
      Icon,
      name: type === 'error' ? 'Error' : 'Success',
      detail,
      buttonName: 'OK',
      onConfirm: () => {
        setModalVisible(false);
        onConfirm();
      },
      onCancel: () => setModalVisible(false),
    });

    setModalVisible(true);
  };

  const handleAddToCart = async selectedOrder => {
    try {
      if (modalVisible) return; // 🔥 DOUBLE SAFETY

      const orderItems = selectedOrder?.order || [];

      if (!user?._id) {
        showModal(
          icons.cross,
          'error',
          'Please login first to add items to cart',
        );
        return;
      }

      if (!orderItems.length) {
        showModal(icons.cross, 'error', 'No items found in this order');
        return;
      }

      const orderMerchantId = orderItems[0]?.merchantId;
      if (!orderMerchantId) {
        showModal(icons.cross, 'error', 'Invalid merchant information');
        return;
      }

      if (!cartData?.length) {
        dispatch(setCartData(orderItems));
        await AsyncStorage.setItem('cartData', JSON.stringify(orderItems));

        showModal(icons.check, 'success', 'Order added to cart', () =>
          navigation.navigate('CartScreen'),
        );
        return;
      }

      const cartMerchantId = cartData[0]?.merchantId;
      if (cartMerchantId !== orderMerchantId) {
        showModal(
          icons.cross,
          'error',
          'You can only order again from the same restaurant',
        );
        return;
      }

      showModal(
        icons.check,
        'success',
        'This order has already been added to your cart. Please go to the cart and place your order.',
        () => navigation.navigate('CartScreen'),
      );
    } catch (error) {
      showModal(icons.cross, 'error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <AppHeader text="Order Details" goBack={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            {backgroundColor: statusStyle.bannerBg},
          ]}>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: statusStyle.badgeBg},
            ]}>
            <Text
              style={[
                styles.statusBadgeText,
                {color: statusStyle.badgeTextColor},
              ]}>
              {data?.status === 'Completed' ? 'Delivered' : data?.status}
            </Text>
          </View>
          {data?.createdAt && (
            <Text style={styles.deliveryDateTime}>
              {formatDeliveryDateTime()}
            </Text>
          )}
        </View>

        <ImageBackground
          style={styles.orderCard}
          source={images.tickertCard}
          resizeMode="cover"
          imageStyle={styles.orderCardImage}>
          <View style={styles.orderNumberRow}>
            <Text style={styles.orderNumberLabel}>Order number:</Text>
            <Text style={styles.orderNumberText}>#{data.orderId}</Text>
          </View>

          {data.order?.map((item, ind) => {
            return (
              <View key={ind}>
                <View style={styles.orderItemContainer}>
                  <Image
                    source={{
                      uri:
                        item?.image ||
                        item?.productImage ||
                        'https://via.placeholder.com/100',
                    }}
                    style={styles.orderItemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.orderItemDetails}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemPrice}>
                      £{item?.discount > 0 ? item?.discount : item?.price}
                    </Text>
                    <Text style={styles.orderItemQty}>
                      x{item.quantity || item.selectedQty || 1}
                    </Text>
                  </View>
                </View>
                {ind < data.order.length - 1 && (
                  <View style={styles.itemSeparator} />
                )}
              </View>
            );
          })}

          <View style={styles.chefSection}>
            <Text style={styles.chefLabel}>Chef's Name</Text>
            <View style={styles.chefInfoContainer}>
              <Image
                source={{
                  uri:
                    data.merchantDetails?.merchantImage ||
                    data.merchantDetails?.profileImage ||
                    'https://via.placeholder.com/50',
                }}
                style={styles.chefProfileImage}
                resizeMode="cover"
              />
              <Text style={styles.chefName}>
                {data.merchantDetails?.name || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.addressLeft}>
            <View style={styles.addressIconContainer}>
              <Image
                source={icons.location}
                style={styles.addressIcon}
                resizeMode="contain"
              />
            </View>

            <View>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {data?.address || 'No address available'}
              </Text>
            </View>
          </View>
          {data?.deliveryStatus == 'Collected' ? (
            <View style={styles.orderCard}>
              <Text style={styles.orderheading}>Driver Details</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: width(2),
                }}>
                <Text style={{color: colors.black, left: width(4)}}>Name</Text>
                <Text style={{color: colors.black, right: width(4)}}>
                  {data?.driverDetails?.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: width(2),
                }}>
                <Text style={{color: colors.black, left: width(4)}}>Email</Text>
                <Text style={{color: colors.black, right: width(4)}}>
                  {data?.driverDetails?.email}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: width(2),
                }}>
                <Text style={{color: colors.black, left: width(4)}}>
                  Phone No.
                </Text>
                <Text style={{color: colors.black, right: width(4)}}>
                  {data?.driverDetails?.phoneNumber}
                </Text>
              </View>
              <View style={styles.ordertxtview}>
                <Text style={styles.subheading}>Otp</Text>
                <Text style={styles.oredernotxt}>{data?.orderCode}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.costBreakdownContainer}>
            <View style={styles.costRow}>
              <Text
                style={[
                  styles.costLabel,
                  {fontSize: 16, fontFamily: fontFamily.poppinBold},
                ]}>
                Sub Total
              </Text>
              <Text style={styles.costValue}>
                £{subTotal ? subTotal.toFixed(2) : '0.00'}
              </Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Delivery fee</Text>
              <Text style={styles.costValue}>
                £
                {data.deliveryCharges
                  ? parseFloat(data.deliveryCharges).toFixed(2)
                  : '0.00'}
              </Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Service charge</Text>
              <Text style={styles.costValue}>
                £
                {data.serviceCharges
                  ? parseFloat(data.serviceCharges).toFixed(2)
                  : '0.00'}
              </Text>
            </View>
            <View style={styles.dividerLine} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                £{data?.totalBill || '0.00'}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={{height: width(20)}} />
      </ScrollView>
      <View style={styles.bottomButtonContainer}>
        {data.status == 'Pending' ? (
          <ActionBuuton
            onPress={cofirmAlert}
            name={'Cancel Order'}
            bgcColor={colors.black}
            fontColor={colors.white}
            height={width(12)}
            borderRadius={100}
            fontSize={16}
            styleProps={{borderWidth: 0}}
          />
        ) : (
          <ActionBuuton
            onPress={() => handleAddToCart(data)}
            name={'Order Again'}
            bgcColor={colors.black}
            fontColor={colors.white}
            height={width(12)}
            borderRadius={100}
            fontSize={16}
            styleProps={{borderWidth: 0}}
          />
        )}
      </View>
      <OverLayLoader isloading={isloading} />
      <CustomModal
        visible={modalVisible}
        close={() => setModalVisible(false)}
        {...modalConfig}
      />
    </SafeAreaView>
  );
};

export default OrderDetail;
