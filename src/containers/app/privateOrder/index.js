import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native';
import Header from '../../../components/header';
import { width, height } from 'react-native-dimension';
import { colors, STRIPE_PUBLISH_TEST } from '../../../constants';
import { FlatList } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import Button from '../../../components/button';
import moment from 'moment/moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { color, set } from 'react-native-reanimated';
import CommonModal from '../../../components/modal';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { addPrivateOrder } from '../../../services/privateOrder';
import { useFocusEffect } from '@react-navigation/native';
import OverLayLoader from '../../../components/loader';
import { PlatformPay, StripeProvider, usePlatformPay } from '@stripe/stripe-react-native';
import { createStripeClientSecret, placeUserOrder } from '../../../services/order';

const PrivateOrder = ({ route, navigation }) => {
  const ref = useRef();
  const wallet = useSelector(
    state => state.PaymentCardSlice.currentPaymentCard,
  );
  let location = useSelector(state => state.LocationSlice.currentLocation);
  const user = useSelector(state => state.LoginSlice.user);
  const [selectedProduct, setSelectedProduct] = useState(
    route?.params?.productsList,
  );
  const [merchantDetails, setMerchnatDetails] = useState(
    route?.params?.details,
  );
  const [showPicker, setShowPicker] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);
  const [date, setDate] = useState(new Date());
  const [orderBill, setOrderBill] = useState({
    subTotal: 0,
    discount: 0,
  });
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);
  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay();

  useEffect(() => {
    (async function () {
      if (await isPlatformPaySupported()) {
        if (Platform.OS == 'android') {
          setIsGooglePaySupported(true);
          setIsApplePaySupported(false);
        } else {
          setIsGooglePaySupported(false);
          setIsApplePaySupported(true);
        }
      }
    })();
  }, [isPlatformPaySupported]);

  useEffect(() => {
    let newArrr = selectedProduct.map((item, ind) => {
      return {
        ...item,
        isSelected: false,
        selectedQty: 0,
      };
    });
    setSelectedProduct(newArrr);
  }, []);

  const handleIncrease = ind => {
    let tempArr = [...selectedProduct];
    if (tempArr[ind]?.isSelected) {
      tempArr[ind].selectedQty = tempArr[ind].selectedQty + 1;
      setSelectedProduct(tempArr);
      handleBill();
    }
  };

  const handleDecrease = ind => {
    console.log('called');
    let tempArr = [...selectedProduct];
    if (tempArr[ind].selectedQty < 1) {
      alert('Selected quantity cannot be less than 1');
    } else {
      if (tempArr[ind].isSelected) {
        tempArr[ind].selectedQty = tempArr[ind].selectedQty - 1;
        setSelectedProduct(tempArr);
        handleBill();
      }
    }
  };

  const handleBill = () => {
    let total = 0;
    if (selectedProduct.length > 0) {
      selectedProduct.map(item => {
        {
          let value = item?.discount > 0 ? item.discount : item.price;
          item?.isSelected ? (total += value * item.selectedQty) : null;
        }
      });

      setOrderBill({
        ...orderBill,
        subTotal: total,
      });
    }
  };

  console.log(orderBill, 'billllllll=>');

  const handleConfirmOrder = date => {
    let temp = [...selectedDate];
    let foramtedDate = moment(date).format('DD-MM-YYYY hh:mm a');
    setShowPicker(false);
    temp.push({ time: foramtedDate });
    setSelectedDate(temp);
  };

  const handleRemoveDate = ind => {
    let temp = [...selectedDate];
    temp.splice(ind, 1);
    setSelectedDate(temp);
  };

  const hanleSelectProduct = (item, ind) => {
    let temp = [...selectedProduct];
    temp[ind].isSelected = !temp[ind].isSelected;
    if (temp[ind].isSelected) {
      temp[ind].selectedQty = 1;
    }
    if (!temp[ind].isSelected) {
      temp[ind].selectedQty = 0;
    }
    setSelectedProduct(temp);
    handleBill();
  };

  const payWithApple = async orderPayload => {

    let passedAmount = orderBill.subTotal
    createStripeClientSecret({
      amount: orderBill.subTotal
    }).then(async ressss => {
      setIsLoading(false);
      console.log(ressss.data.secretKey, 'RESSSS');
      let clientSecret = ressss.data.secretKey;
      const { error } = await confirmPlatformPayPayment(clientSecret, {
        applePay: {
          cartItems: [
            {
              label: 'to Zannys Foods',
              amount: passedAmount.toString(),
              paymentType: PlatformPay.PaymentType.Immediate,
            },
          ],
          merchantCountryCode: 'GB',
          currencyCode: 'GBP',
          requiredShippingAddressFields: [
            PlatformPay.ContactField.PostalAddress,
          ],
          requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
        },
      });
      if (error) {
        setIsLoading(false);
        console.log(error, 'Errr');
      } else {
        setIsLoading(true);
        placeUserOrder(orderPayload)
          .then(res => {
            if (res.status != 200) {
              alert(res.data.message);
              setIsLoading(false);
            } else {
              setIsLoading(false);
              alert(res.data.message);
              dispatch(setCartData([]));
              AsyncStorage.setItem('cartData', JSON.stringify([]));
              navigation.navigate('AllRestaurants');
            }
          })
          .catch(err => {
            setIsLoading(false);
            alert(err?.response?.data?.message);
          });
      }
    });
  };

  const handleCreateOrder = async () => {
    if (user) {
      let temp = [];
      await selectedProduct.map((item, ind) => {
        if (item?.isSelected) {
          temp.push(item);
        }
      });
      let payload = {
        order: temp,
        userDetails: user,
        userId: user?._id,
        merchantId: merchantDetails?._id,
        merchantDetails: merchantDetails,
        address: location?.address,
        latitude: location?.latitude,
        longitude: location?.longitude,
        selectedDates: selectedDate,
        totalBill: orderBill?.subTotal,
        expMonth: wallet?.expiryMonth,
        expYear: wallet?.expiryYear,
        number: wallet?.cardNo,
        userCardDetails: wallet,
      };
      if (temp.length < 1) {
        alert('Please select products');
      } else if (selectedDate?.length < 1) {
        alert('Please select date');
      } else if (wallet?.cardNo == 'Apple Pay') {
        setIsLoading(true);
        payWithApple(payload);
      } else {
        console.log(payload, 'payloaddddddd');
        setIsLoading(true);
        addPrivateOrder(payload)
          .then(response => {
            setIsLoading(false);
            if (response?.data?.status == 'ok') {
              console.log(response?.data, 'ress ok===>');
              alert(response?.data?.message);
              setSelectedProduct([]);
              setSelectedDate([]);
              navigation.goBack();
            } else {
              alert(response?.data?.message);
              console.log(response?.data, 'else res=====>');
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error, 'error=====>');
          });
      }
    } else {
      alert('Please login first to place order');
    }
  };

  const AllHeaderData = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            elevation: 5,
            paddingVertical: 10,
            marginTop: width(2),
            marginHorizontal: width(2),
            shadowColor: 'black',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: width(3),
              marginVertical: width(3),
            }}>
            <AntDesign name="wallet" color={colors.yellow} size={22} />
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginLeft: width(2),
              }}>
              Payment Method
            </Text>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <AntDesign
                style={{}}
                name="edit"
                color={colors.yellow}
                size={22}
                onPress={() => {
                  if (user) {
                    navigation.navigate('PaymentOptions', {
                      isGooglePaySupported,
                      isApplePaySupported,
                    })
                  } else {
                    alert('Please login first to add card');
                  }
                }}
              //   onPress={() => navigation.navigate('Addresses')}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              marginVertical: width(3),
              marginHorizontal: width(3),
            }}>
            <AntDesign
              name="creditcard"
              color={colors.yellow}
              size={22}
              onPress={() => navigation.navigate('Addresses')}
            />
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginLeft: width(2),
                letterSpacing: 3,
              }}>
              {wallet?.cardNo == "Apple Pay" ? "Apple Pay" : <>{wallet?.cardNo
                ? '****' + wallet?.cardNo.toString().slice(12, 16)
                : 'Please select card'}</>}

            </Text>
            {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text style={{fontWeight: 'bold'}}>
                  Rs.{orderBill.subTotal}.00
                </Text>
              </View> */}
          </View>
        </View>
        <View
          style={{
            marginHorizontal: width(2),
            borderRadius: 10,
            marginTop: height(2),
            marginBottom: width(2),
            backgroundColor: 'white',
            elevation: 5,
          }}>
          <View
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              <EvilIcons
                style={{}}
                name="location"
                color={colors.yellow}
                size={22}
              />
            </View>

            <Text
              style={{
                color: 'black',
                fontSize: 16,
                marginLeft: 5,
                fontWeight: '600',
                marginVertical: width(2),
              }}>
              Delivery address
            </Text>

            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <AntDesign
                style={{}}
                name="edit"
                color={colors.yellow}
                size={22}
                onPress={() => {
                  if (user) {
                    navigation.navigate('Address', {
                      type: 'privateOrder',
                      location,
                    });
                  } else {
                    alert('Please login first to add address');
                  }
                }}
              />
            </View>
          </View>
          <View
            style={{
              marginHorizontal: width(5),
              marginBottom: width(2),
            }}>
            <Text
              style={{
                color: 'black',
              }}>
              {location?.address}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 10,
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
              marginBottom: 10,
            }}>
            Select food for your private order
          </Text>
        </View>
      </>
    );
  };

  return (
    <>
      <OverLayLoader isloading={isloading} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <StripeProvider publishableKey={STRIPE_PUBLISH_TEST}
          merchantIdentifier="merchant.com.zannycustomer">
          <Header goBack={true} text={'Private Order'} />
          <DatePicker
            modal
            open={showPicker}
            date={date}
            title="Select Date & Time for placing your Order"
            minimumDate={new Date()}
            onConfirm={date => handleConfirmOrder(date)}
            onCancel={() => {
              setShowPicker(false);
            }}
          />

          <FlatList
            data={selectedProduct}
            ListHeaderComponent={<AllHeaderData />}
            style={{ marginBottom: width(3) }}
            renderItem={({ item, index }) => {
              if (item.isShow) {
                let result = item.allergiesData.some(item =>
                  user?.allergies.includes(item.name),
                );
                if (result) return null;
                else {
                  return (
                    <View
                      key={index}
                      //   onPress={() => handlePressProduct(item, index)}\
                      style={{
                        backgroundColor: colors.white,
                        marginBottom: width(2),
                        marginHorizontal: width(2),
                        elevation: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: 'white',
                          paddingVertical: width(3),
                          marginVertical: width(1),
                        }}>
                        <TouchableOpacity
                          onPress={() => hanleSelectProduct(item, index)}>
                          <View
                            style={{
                              // padding: 5,
                              // margin: 5,
                              backgroundColor:
                                selectedProduct[index]?.isSelected == true
                                  ? colors.yellow
                                  : colors.white,
                              height: width(5),
                              width: width(5),
                              marginLeft: width(3),
                              borderRadius: 200,
                              borderColor: colors.yellow,
                              borderWidth: 0.5,
                            }}></View>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: width(3) }}>
                          <Text style={{ fontWeight: 'bold', color: 'black' }}>
                            {item?.name}
                          </Text>
                          <Text style={{ color: 'grey' }}>{item?.description}</Text>
                          {item.discount > 0 ? (
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ color: 'grey' }}>
                                £{item.discount}
                              </Text>
                              <Text
                                style={{
                                  color: 'grey',
                                  marginLeft: 10,
                                  textDecorationLine: 'line-through',
                                }}>
                                £{item.price}
                              </Text>
                            </View>
                          ) : (
                            <Text
                              style={{
                                color: 'grey',
                              }}>
                              £{item.price}
                            </Text>
                          )}
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            marginRight: 10,
                          }}>
                          <Image
                            source={{ uri: item?.image }}
                            resizeMode="stretch"
                            style={{
                              height: width(20),
                              borderRadius: 10,
                              width: width(30),
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: width(2),
                        }}>
                        <TouchableOpacity onPress={() => handleDecrease(index)}>
                          <View
                            style={{
                              width: width(7),
                              borderRadius: 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginHorizontal: width(4),
                              backgroundColor:
                                [selectedProduct?.index]?.userQuantity < 1
                                  ? ['#cdcaca']
                                  : colors.orangeColor,
                              height: width(7),
                            }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>-</Text>
                          </View>
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'black',
                            fontWeight: '600',
                          }}>
                          {selectedProduct[index]?.selectedQty}
                        </Text>
                        <TouchableOpacity onPress={() => handleIncrease(index)}>
                          <View
                            style={{
                              width: width(7),
                              borderRadius: 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginHorizontal: width(4),
                              backgroundColor: colors.orangeColor,
                              height: width(7),
                            }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }
              }
            }}
          />
          <CommonModal ref={ref}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    paddingVertical: width(4),
                    color: colors.yellow,
                    fontSize: 18,
                    fontWeight: '600',
                    left: width(40),
                  }}>
                  Select Time
                </Text>
                <MaterialIcons
                  name="cancel"
                  size={25}
                  color={colors.yellow}
                  style={{ right: width(5) }}
                  onPress={() => ref.current.hide()}
                />
              </View>
              {selectedDate.length > 0 ? (
                selectedDate?.map((item, ind) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.yellow,
                        width: width(80),
                        borderRadius: 8,
                        justifyContent: 'space-between',
                        marginLeft: width(2),
                        marginTop: width(2),
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          color: colors.white,
                          paddingVertical: width(3),
                          fontWeight: '500',
                          paddingHorizontal: width(3),
                        }}>
                        Date & Time : {item?.time}
                      </Text>
                      <MaterialIcons
                        name="cancel"
                        size={20}
                        color={colors.white}
                        style={{ right: width(2) }}
                        onPress={() => handleRemoveDate(ind)}
                      />
                    </View>
                  );
                })
              ) : (
                <Text style={{ color: colors.black, alignSelf: 'center' }}>
                  Please Select Date & Time for your Order
                </Text>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.yellow,
                    margin: width(4),
                    alignItems: 'center',
                    borderRadius: 8,
                    width: '30%',
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => setShowPicker(true)}>
                  <Text
                    style={{
                      color: colors.white,
                      fontWeight: '600',
                      paddingVertical: width(4),
                    }}>
                    Add Time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.yellow,
                    margin: width(4),
                    alignItems: 'center',
                    borderRadius: 8,
                    width: '30%',
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => ref.current.hide()}>
                  <Text
                    style={{
                      color: colors.white,
                      fontWeight: '600',
                      paddingVertical: width(4),
                    }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </CommonModal>
          <View style={{ marginBottom: width(2) }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: width(1),
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  left: width(4),
                }}>
                Total Bill
              </Text>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  right: width(4),
                }}>
                £ {orderBill?.subTotal}
              </Text>
            </View>
            <Button
              onPress={() => ref.current.isVisible({})}
              heading="Select Time"
            />
          </View>
          <Button onPress={handleCreateOrder} heading="Place Order" />
        </StripeProvider>
      </SafeAreaView>
    </>
  );
};

export default PrivateOrder;
