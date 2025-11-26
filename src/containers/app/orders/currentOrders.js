import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import CartImage from '../../../components/cartImage';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import {getAllOrdersByCustomerId} from '../../../services/order';
import styles from './style';

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
