import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {getAllOrdersByCustomerId, addReview} from '../../../services/order';
import {useFocusEffect} from '@react-navigation/native';
import {width} from 'react-native-dimension';
import styles from './style';
import CartImage from '../../../components/cartImage';
import {useSelector} from 'react-redux';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Modal from 'react-native-modal';
import Button from '../../../components/button';

const PastOrders = ({navigation, route}) => {
  let user = useSelector(state => state.LoginSlice.user);
  const [isLoading, setIsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [ratings, setRatings] = useState(5);
  const [productDetail, setProductDetail] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [review, setReview] = useState('');
  const getOrders = async () => {
    setIsLoading(true);
    getAllOrdersByCustomerId(user._id)
      .then(res => {
        if (res?.data?.status == 'ok') {
          let tempArr = [];
          setIsLoading(false);
          let data = res?.data?.data.reverse();
          data.map((item, index) => {
            if (item?.status == 'Completed' || item?.status == 'Rejected') {
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

  const handleOnPressReview = item => {
    setIsVisible(true);
    setProductDetail(item);
  };

  const ratingCompleted = rating => {
    setRatings(rating);
  };

  const handleAddReview = () => {
    if (review == '') {
      alert('Review is required');
    } else {
      console.log(productDetail?._id, 'orderId');
      let payload = {
        merchantId: productDetail?.merchantDetails?._id,
        review: review,
        rating: ratings,
        name: user?.name,
      };
      console.log(payload, 'payloadddddddddddd=>');
      setIsLoading(true);
      addReview(productDetail?._id, payload)
        .then(res => {
          setIsLoading(false);
          if (res?.status == 200) {
            setIsVisible(false);
            alert(res?.data?.message);
            setRatings(5), setReview('');
            getOrders();
          } else {
            alert(res?.data?.message);
          }
        })
        .catch(error => {
          console.log(error, 'error Add Review===');
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <FlatList
          data={allOrders}
          refreshing={isLoading}
          contentContainerStyle={{flexGrow: 1}}
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
                    <Text style={styles.txtdate}>Status: {item.status}</Text>
                    <Text style={styles.txtdate}>
                      Total Bill: £ {item.totalBill}
                    </Text>
                    <Text style={styles.txtdate}>Date: {item.date}</Text>
                    <Text style={styles.txtdate}>
                      Order Id: #{item.orderId}
                    </Text>
                    <Text style={{...styles.txtdate, marginBottom: width(4)}}>
                      Payment Type: {item.paymentType}
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
                {item?.status === 'Completed' &&
                  item?.reviewStatus == false &&
                  item?.deliveryStatus == 'Delivered' && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.orangeColor,
                        paddingHorizontal: width(3),
                        borderRadius: 5,
                        paddingVertical: width(3),
                        alignSelf: 'flex-end',
                        marginHorizontal: width(2),
                        marginBottom: width(3),
                      }}
                      onPress={() => handleOnPressReview(item)}>
                      <Text style={{color: colors.white}}>Review</Text>
                    </TouchableOpacity>
                  )}
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
                No past orders right now,
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
        />
        <View>
          <Modal isVisible={isVisible} animationIn="bounceInUp">
            <View
              style={{
                width: width(90),
                backgroundColor: 'transparent',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  width: '95%',
                  borderRadius: 20,
                  elevation: 10,
                  alignSelf: 'center',
                }}>
                <MaterialIcons
                  style={{
                    position: 'absolute',
                    zIndex: 100,
                    top: 10,
                    right: 15,
                  }}
                  name="cancel"
                  color={colors.orangeColor}
                  size={30}
                  onPress={() => setIsVisible(false)}
                />
                <View style={{marginTop: width(15), marginBottom: width(5)}}>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: colors.grey,
                      marginHorizontal: width(4),
                    }}>
                    <TextInput
                      style={{
                        marginLeft: width(2),
                        color: colors.black,
                        textAlign: 'left',
                        height: width(40),
                        textAlignVertical: 'top',
                      }}
                      placeholder="Please enter your review"
                      multiline={true}
                      numberOfLines={10}
                      value={review}
                      onChangeText={value => setReview(value)}
                      placeholderTextColor={colors.grey}
                    />
                  </View>
                </View>
                <AirbnbRating
                  size={20}
                  defaultRating={ratings}
                  showRating={false}
                  onFinishRating={ratingCompleted}
                  selectedColor={colors.orangeColor}
                />
                <View style={{marginTop: width(5)}}>
                  <Button
                    heading="Send"
                    color={colors.orangeColor}
                    onPress={handleAddReview}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </>
  );
};

export default PastOrders;
