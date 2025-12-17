import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import ActionBuuton from '../../../components/actionButton';
import AppHeader from '../../../components/headerComponent';
import {updateOrderStatus} from '../../../services/order';
import {colors} from './../../../constants/index';
import styles from './style';

const OrderDetail = ({navigation, route}) => {
  const data = route.params;
  console.log(data, 'routerouterouteroute');

  const user = useSelector(state => state.LoginSlice.user);
  const [subTotal, setSubTotal] = useState(0);
  const [prepareTime, setPrepareTime] = useState('');
  const [remainingTimes, setRemainingTimes] = useState({});

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
      const qty = item?.selectedQty || item?.quantity || 1;
      const price =
        item?.discount && item?.discount > 0 ? item.discount : item.price;

      total += qty * price;
    });

    setSubTotal(total);
  }, [data]);

  const handleAccept = () => {
    if (prepareTime == '') {
      alert('Please enter preparation time');
    } else {
      alert('Order accepted successfully');
      setPrepareTime('');
    }
  };

  const handleCancelOrder = () => {
    let payload = {
      Id: data?._id,
      status: 'Rejected',
      userId: user?._id,
    };

    updateOrderStatus(payload)
      .then(response => {
        if (response?.data?.status == 'ok') {
          alert(response?.data?.message);
          navigation.goBack();
        } else {
          alert(response?.data?.message);
        }
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  const cofirmAlert = () => {
    Alert.alert('Are you sure?', 'You want to cancel this order?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => handleCancelOrder()},
    ]);
  };
  const getStatusStyle = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {bg: 'rgba(255,165,0,0.2)', color: '#FFA500'};
      case 'accepted':
        return {bg: 'rgba(30,144,255,0.2)', color: '#1E90FF'};
      case 'rejected':
        return {bg: 'rgba(255,69,0,0.2)', color: '#FF4500'};
      case 'completed':
        return {bg: 'rgba(50,205,50,0.2)', color: '#32CD32'};
      default:
        return {bg: 'rgba(144,238,144,0.3)', color: '#32CD32'};
    }
  };

  const statusStyle = getStatusStyle(data?.status);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <AppHeader text="Order Details" goBack={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <Image
          source={{
            uri: data.merchantDetails?.merchantImage,
          }}
          style={styles.imageStyle}
          resizeMode="cover"
        /> */}
        <Text style={styles.orderheading}>Order Details</Text>
        <View style={styles.borderstyle}>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order number</Text>
            <View style={styles.oredernotxt}>
              <Text style={styles.oredernotxt}>{data.orderId}</Text>
            </View>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order Status</Text>
            <Text
              style={[
                styles.oredernotxt,
                {
                  backgroundColor: statusStyle.bg,
                  borderColor: statusStyle.color,
                  color: statusStyle.color,
                  borderRadius: 100,
                },
              ]}>
              {data.status}
            </Text>
          </View>
          {data.pickupTimmings && data.orderType == 'pickup' && (
            <View style={styles.ordertxtview}>
              <Text style={{color: colors.black}}>Expected Time :</Text>
              <Text style={styles.oredernotxt}>
                {remainingTimes[data?._id] || 'Loading...'}
              </Text>
            </View>
          )}
          {data.orderType == 'pickup' && (
            <View style={styles.ordertxtview}>
              <Text style={{color: colors.black}}>Expected Time :</Text>
              <Text style={styles.oredernotxt}>
                {data.orderType == 'pickup' ? 'Pickup' : 'Deliver'}
              </Text>
            </View>
          )}
          {data?.status == 'Completed' ? (
            <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Delivery Status</Text>
              <View style={styles.oredernotxt}>
                <Text>{data?.deliveryStatus}</Text>
              </View>
            </View>
          ) : null}
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order from</Text>
            <Text style={styles.orderfromtxt}>
              {data.merchantDetails?.name}
            </Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery address:</Text>
            <Text style={styles.deliverytxt}>{data.address}</Text>
          </View>
          {data?.deliveryStatus == 'Collected' ? (
            <>
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
            </>
          ) : null}
        </View>

        <View style={styles.borderstyle}>
          {data.order.map((item, ind) => {
            return (
              <View key={ind} style={styles.ordertxtview}>
                <Text style={styles.subheading}>
                  QTY : {item.quantity || item.selectedQty}x {item.name}
                </Text>

                <Text style={styles.pricetxt}>
                  £ {item?.discount > 0 ? item?.discount : item?.price}
                </Text>
              </View>
            );
          })}
        </View>
        {data?.promoData?.promoCode && (
          <>
            <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Promo Code</Text>

              <Text style={styles.pricetxt}>{data?.promoData?.promoCode}</Text>
            </View>
            <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Promo Discount</Text>

              <Text style={styles.pricetxt}>
                {data?.promoData?.discount} %OFF
              </Text>
            </View>
          </>
        )}
        <View style={styles.borderstyle}>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Sub Total</Text>
            <Text style={styles.pricetxt}>£ {subTotal}</Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery fee</Text>
            <Text style={styles.pricetxt}>
              £ {data.deliveryCharges ? data.deliveryCharges : 0}
            </Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Service Charges</Text>
            <Text style={styles.pricetxt}>£ {data?.serviceCharges}</Text>
          </View>

          {data.status == 'Accepted' || data.status == 'Completed' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{left: width(3), color: colors.black}}>
                Preparation Time
              </Text>
              <Text style={{right: width(5), color: 'grey', fontWeight: '600'}}>
                {data?.preparationTime} mins
              </Text>
            </View>
          ) : null}
          <View style={styles.ordertxtview}>
            <Text style={styles.subtotaltxt}>Total Amount</Text>
            <Text style={styles.pricetxt}>£ {data?.totalBill}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{padding: width(3)}}>
        {data.status == 'Pending' ? (
          <ActionBuuton
            onPress={cofirmAlert}
            name={'Cancel Order'}
            bgcColor={colors.black}
            fontColor={colors.white}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default OrderDetail;
