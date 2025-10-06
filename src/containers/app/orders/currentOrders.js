import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {addReview, getAllOrdersByCustomerId} from '../../../services/order';
import {useFocusEffect} from '@react-navigation/native';
import {width} from 'react-native-dimension';
import styles from './style';
import CartImage from '../../../components/cartImage';
import {useSelector} from 'react-redux';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';

const CurrentOrders = ({navigation, route}) => {
  let user = useSelector(state => state.LoginSlice.user);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState({});
  const [allOrders, setAllOrders] = useState([]);

  const getOrders = async () => {
    setIsLoading(true);
    getAllOrdersByCustomerId(user._id)
      .then(res => {
        if (res?.data?.status == 'ok') {
          let tempArr = [];
          setIsLoading(false);
          let data = res?.data?.data.reverse();
          data.map((item, index) => {
            if (
              item?.status == 'Pending' ||
              item?.status == 'Accepted' ||
              item?.status == 'ReadyForPickup'
            ) {
              tempArr.push(item);
              setIsLoading(false);
            }
          });
          setAllOrders(tempArr);
        }
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getOrders();
    }, []),
  );

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

    if (allOrders.length > 0) {
      allOrders.forEach(order => {
        if (order.pickupTimmings) {
          // Clear existing interval if any
          if (intervals[order._id]) {
            clearInterval(intervals[order._id]);
          }

          intervals[order._id] = updateRemainingTime(
            order._id,
            order.pickupTimmings,
            order.createdAt,
          );
        }
      });
    }

    return () => {
      Object.values(intervals).forEach(intervalId => clearInterval(intervalId));
    };
  }, [allOrders]);

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <FlatList
          data={allOrders}
          refreshing={isLoading}
          onRefresh={getOrders}
          style={{marginTop: width(2), marginBottom: width(5)}}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('OrderDetail', {
                    detail: item,
                  })
                }
                style={[styles.cardview, {paddingTop: width(6)}]}>
                <View style={styles.innerview}>
                  <CartImage
                    imageUrl={item?.merchantDetails?.merchantImage}
                    imgContainer={styles.imgview}
                    imgStyle={styles.img}
                  />
                  <View style={styles.txtview}>
                    <Text style={styles.txtdate}>
                      Status:{' '}
                      {item.status == 'ReadyForPickup'
                        ? 'Ready For Pickup'
                        : item?.status}
                    </Text>
                    <Text style={styles.txtdate}>
                      Total Bill: £ {item.totalBill}
                    </Text>
                    <Text style={styles.txtdate}>Date: {item.date}</Text>
                    <Text style={styles.txtdate}>
                      Order Id: #{item.orderId}
                    </Text>
                    {item.pickupTimmings && item.orderType == 'pickup' && (
                      <Text
                        style={[
                          styles.txtdate,
                          {color: colors.green, width: 200},
                        ]}>
                        Expected Pickup Time :{' '}
                        {remainingTimes[item._id] || 'Loading...'}
                      </Text>
                    )}
                    <Text style={{...styles.txtdate, marginBottom: width(4)}}>
                      Payment Type:{' '}
                      {item.paymentType ? item.paymentType : 'Card'}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    top: 6,
                    right: 6,
                    position: 'absolute',
                    backgroundColor: colors.green,
                    padding: width(1),
                    borderRadius: 20,
                    paddingHorizontal: width(3),
                  }}>
                  <Text style={{...styles.txtdate, color: colors.white}}>
                    {item.orderType == 'pickup' ? 'Pickup' : 'Delivery'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={{justifyContent: 'center', marginTop: width(50)}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: width(2),
                  color: 'black',
                  textAlign: 'center',
                }}>
                No current orders right now,
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: width(2),
                  color: 'black',
                  textAlign: 'center',
                }}>
                Place order to see
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{height: width(10)}} />}
        />
      </SafeAreaView>
    </>
  );
};

export default CurrentOrders;

const asdasd = {
  __v: 0,
  _id: '67acb1834946c6b3d240594e',
  address:
    'XX4V+XMG, Sector 14-E Sector 14 E Shamsi Colony, Karachi, Karachi City, Sindh, Pakistan',
  createdAt: '2025-02-12T14:34:43.651Z',
  customerDistance: 0,
  date: '12-02-2025',
  deliveryCharges: 2.5,
  deliveryStatus: 'Pending',
  discount: 0,
  driverId: '',
  isPaid: false,
  isPaidDelivery: false,
  isPicked: false,
  latitude: '24.9578464',
  longitude: '66.9937953',
  merchantDetails: {
    _id: '6780fc5251b6e53631f2e0e3',
    address:
      '352, Soldier Bazaar Garden East, Karachi, Karachi City, Sindh, Pakistan',
    email: 'roundtablepizza@gmail.com',
    isApprove: true,
    isOnline: true,
    isPickUp: true,
    latitude: '24.8792546',
    licenseImage:
      'https://res.cloudinary.com/dcmawlfn2/image/upload/v1736494084/oltdckolzxtnfgeg0eto.jpg',
    longitude: '67.0363655',
    merchantImage:
      'https://res.cloudinary.com/dcmawlfn2/image/upload/v1736501455/pexels-photo-262978_pq4su9.jpg',
    name: 'Round Table Pizza',
    phoneNumber: '3007890123',
    pickupTimmings: 40,
    reviews: [],
    safetyCertificate:
      'https://res.cloudinary.com/dcmawlfn2/image/upload/v1736494098/mersn0pcjrna7odwpulk.jpg',
    subscribers: [],
  },
  merchantDistance: 0,
  merchantId: '6780fc5251b6e53631f2e0e3',
  msgToMerchant: 'testing note',
  order: [
    {
      __v: 0,
      _id: '6784091bd78c77246859182b',
      allergiesData: [Array],
      category: 'Fast Food',
      date: '2025-01-12',
      description: 'A pizza piled high with meats, veggies, and cheese',
      discount: 0,
      image:
        'https://res.cloudinary.com/dcmawlfn2/image/upload/v1736706294/rqoz6q5szpfnirwco9qv.jpg',
      isShow: true,
      merchantId: '6780fc5251b6e53631f2e0e3',
      name: 'Supreme Pizza with All the Toppings',
      price: 13,
      selectedQty: 1,
    },
  ],
  orderCode: '86678',
  orderId: '484965',
  orderType: 'delivery',
  paymentType: 'COD',
  pickupTimmings: 40,
  preparationTime: '',
  review: '',
  reviewStatus: false,
  serviceCharges: 5,
  status: 'Pending',
  subTotal: 13,
  tip: 0,
  totalBill: 16.49,
  updatedAt: '2025-02-12T14:34:43.651Z',
  userCardDetails: null,
  userDetails: {
    email: 'starkstony189@gmail.com',
    name: 'Tony Starks',
    phone: '0315428796',
  },
  userId: '6723381c3c60a60d246389a8',
  videoUrl: '',
};
