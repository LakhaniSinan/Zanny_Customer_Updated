import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import Header from '../../../components/header';
import Button from '../../../components/button';
import { colors } from './../../../constants/index';
import styles from './style';
import { width } from 'react-native-dimension';
import { updateOrderStatus } from '../../../services/order';
import { useSelector } from 'react-redux';

const OrderDetail = ({ navigation, route }) => {
  const data = route.params.detail;
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
        setRemainingTimes(prev => ({ ...prev, [orderId]: '00:00' }));
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
    data.order.map(item => {
      total += item.selectedQty * item.price;
    });
    setSubTotal(total);
  }, []);

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
      status: "Rejected",
      userId: user?._id,
    }
    
    updateOrderStatus(payload).then((response) => {
      if (response?.data?.status == "ok") {
        alert(response?.data?.message)
        navigation.goBack()
      } else {
        alert(response?.data?.message)
      }
    }).catch((error) => {
      console.log(error, "error");
    })
  }

  const cofirmAlert = () => {
    Alert.alert('Are you sure?', 'You want to cancel this order?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => handleCancelOrder() },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header text="Order Details" goBack={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: data.merchantDetails.merchantImage,
          }}
          style={styles.imageStyle}
          resizeMode="cover"
        />
        <Text style={styles.orderheading}>Order Details</Text>
        <View style={styles.borderstyle}>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order number</Text>
            <View style={styles.oredernotxt}><Text style={styles.oredernotxt}>{data.orderId}</Text></View>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order Status</Text>
            <Text style={styles.oredernotxt}>{data.status}</Text>
          </View>
          {data.pickupTimmings && data.orderType == 'pickup' && (
            <View style={styles.ordertxtview}>
              <Text style={{ color: colors.black }}>Expected Time :</Text>
              <Text style={styles.oredernotxt}>
                {remainingTimes[data?._id] || 'Loading...'}
              </Text>
            </View>
          )}
          {data.orderType == 'pickup' && (
            <View style={styles.ordertxtview}>
              <Text style={{ color: colors.black }}>Expected Time :</Text>
              <Text style={styles.oredernotxt}>
                {data.orderType == 'pickup' ? 'Pickup' : "Deliver"}
              </Text>
            </View>
          )}
          {data?.status == 'Completed' ? (
            <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Delivery Status</Text>
              <View style={styles.oredernotxt}><Text>{data?.deliveryStatus}</Text></View>
            </View>
          ) : null}
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order from</Text>
            <Text style={styles.orderfromtxt}>{data.merchantDetails.name}</Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery address:</Text>
            <Text style={styles.deliverytxt}>{data.address}</Text>
          </View>
          {data?.deliveryStatus == "Collected" ?
            <>
              <Text style={styles.orderheading}>Driver Details</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: width(2),
                }}>
                <Text style={{ color: colors.black, left: width(4) }}>Name</Text>
                <Text style={{ color: colors.black, right: width(4) }}>
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
                <Text style={{ color: colors.black, left: width(4) }}>Email</Text>
                <Text style={{ color: colors.black, right: width(4) }}>
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
                <Text style={{ color: colors.black, left: width(4) }}>Phone No.</Text>
                <Text style={{ color: colors.black, right: width(4) }}>
                  {data?.driverDetails?.phoneNumber}
                </Text>
              </View>
              <View style={styles.ordertxtview}>
                <Text style={styles.subheading}>Otp</Text>
                <Text style={styles.oredernotxt}>{data?.orderCode}</Text>
              </View>
            </>
            :
            null
          }
        </View>


        <View style={styles.borderstyle}>
          {data.order.map((item, ind) => {
            return (
              <View key={ind} style={styles.ordertxtview}>
                <Text style={styles.subheading}>
                  {item.selectedQty}x {item.name}
                </Text>
                <Text style={styles.pricetxt}>£ {item?.discount > 0 ? item?.discount : item?.price}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.borderstyle}>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery fee</Text>
            <Text style={styles.pricetxt}>
              £ {data.deliveryCharges ? data.deliveryCharges : 0}
            </Text>
          </View>
          {/* <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Discount</Text>
            <Text style={styles.pricetxt}>£ {data.discount}</Text>
          </View> */}
          {data.status == 'Accepted' || data.status == 'Completed' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{ left: width(3), color: colors.black }}>
                Preparation Time
              </Text>
              <Text style={{ right: width(5), color: 'grey', fontWeight: '600' }}>
                {data?.preparationTime} mins
              </Text>
            </View>
          ) : null}
          <View style={styles.ordertxtview}>
            <Text style={styles.subtotaltxt}>Total</Text>
            <Text style={styles.pricetxt}>
              £{' '}
              {data?.totalBill}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ marginTop: width(2), marginBottom: width(2) }}>
        {data.status == 'Pending' ? (
          <Button
            onPress={cofirmAlert}
            heading={'Cancel Order'}
            color={colors.pinkColor}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default OrderDetail;
