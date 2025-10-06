import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Header from '../../../components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPaymentCardById } from '../../../services/paymentCard';
import { width } from 'react-native-dimension';
import { colors } from '../../../constants';
import styles from './style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPaymentCard } from '../../../redux/slices/paymentCard';
import { useFocusEffect } from '@react-navigation/native';
import OverLayLoader from '../../../components/loader';
import Google from "../../../assets/images/google.png"
import Apple from "../../../assets/images/apple.png"

const PaymentCard = ({ navigation }) => {
  const disptach = useDispatch();
  const wallet = useSelector(
    state => state.PaymentCardSlice.currentPaymentCard,
  );
  const [paymentCards, setPaymentCards] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getUserPaymentCards();
    }, []),
  );

  console.log(wallet, 'walletwalletwallet');

  const getUserPaymentCards = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true);
    getPaymentCardById(data._id)
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status == 'ok') {
          console.log(response?.data, 'positive resss');
          let cards = response?.data?.data;
          let Arr = [];
          cards.map((item, index) => {
            if (wallet !== null && item._id == wallet._id) {
              Arr.push({ ...item, isSelected: true });
            } else {
              Arr.push({ ...item, isSelected: false });
            }
          });
          setPaymentCards(Arr);
        } else {
          console.log(response?.data, 'negative resss');
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'error');
      });
  };

  const hadleOnPressRadioBtn = (item, index) => {
    console.log(item, 'itemmmmmm');
    console.log(index, 'indexxxxxxxxx');
    paymentCards[index].isSelected = !paymentCards[index].isSelected;
    AsyncStorage.setItem('paymentCard', JSON.stringify(item));
    disptach(setCurrentPaymentCard(item));
    navigation.goBack();
    alert('Card Selected Successfully');
  };

  return (
    <>
      <OverLayLoader isloading={isloading} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <Header text="Payment Options" goBack={true} />

        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: width(4),
            marginHorizontal: width(2),
            justifyContent: 'space-between',
          }}
          onPress={() =>
            navigation.navigate('AddEditPaymentCard', {
              type: 'add',
            })
          }>
          <View style={styles.subView}>
            <Text style={{ color: colors.black }}>Add Credit or Debit Card</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={15} />
        </TouchableOpacity>

        {paymentCards.length > 0 ? (
          paymentCards.map((item, index) => {
            return (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: width(2),
                  marginHorizontal: width(2),
                }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    width: width(88),
                    borderRadius: 8,
                    elevation: 5,
                    marginRight: width(2),
                    backgroundColor: colors.orangeColor,
                  }}
                  onPress={() =>
                    navigation.navigate('AddEditPaymentCard', {
                      type: 'edit',
                      detail: item,
                    })
                  }>
                  <View style={styles.subView}>
                    <Text style={styles.textStyle}>{item?.cardName}</Text>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.cardNo}>
                      {'\u2022'}
                      {'\u2022'}
                      {'\u2022'}
                      {'\u2022'}
                      {/* {item?.cardNo.toString().slice(0, 4)}{' '}
                          {item?.cardNo.toString().slice(4, 8)}
                          {''} {item?.cardNo.toString().slice(8, 12)}{' '} */}
                      {item?.cardNo.toString().slice(12, 16)}
                    </Text>
                  </View>

                  {/* <View style={styles.subView}>
                        <Text style={styles.textStyle}>Expiry Month : </Text>
                        <Text style={styles.textStyle}>
                          {item?.expiryMonth}
                        </Text>
                      </View> */}

                  {/* <View style={{...styles.subView, marginBottom: width(3)}}>
                        <Text style={styles.textStyle}>Expiry Year : </Text>
                        <Text style={styles.textStyle}>{item?.expiryYear}</Text>
                      </View> */}
                </TouchableOpacity>
                <View>
                  <TouchableOpacity
                    style={{
                      height: width(5),
                      width: width(5),
                      borderColor: colors.yellow,
                      borderWidth: 0.5,
                      borderRadius: 50,
                      backgroundColor: item?.isSelected ? colors.yellow : '',
                    }}
                    onPress={() =>
                      hadleOnPressRadioBtn(item, index)
                    }></TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                marginBottom: width(2),
                color: 'black',
                textAlign: 'center',
              }}>
              No payment cards found
            </Text>
          </View>
        )}

        {/* <TouchableOpacity
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: width(4),
            marginHorizontal: width(2),
            justifyContent: 'space-between',
          }}
        // onPress={() =>
        //   navigation.navigate('AddEditPaymentCard', {
        //     type: 'add',
        //   })
        // }
        >
          <View style={styles.subView}>
            <Image
              source={Google}
              style={{
                width: width(10),
                height: width(5),
                marginRight: width(2),
              }}
              resizeMode="contain"
            />
            <Text style={{ color: colors.black }}>Pay with Google Pay</Text>
          </View>

          <TouchableOpacity
            style={{
              height: width(5),
              width: width(5),
              borderColor: colors.yellow,
              borderWidth: 0.5,
              borderRadius: 50,
            }}></TouchableOpacity>
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: width(4),
            marginHorizontal: width(2),
            justifyContent: 'space-between',
          }}
        // onPress={() =>
        //   navigation.navigate('AddEditPaymentCard', {
        //     type: 'add',
        //   })
        // }
        >
          <View style={styles.subView}>
            <Image
              source={Apple}
              style={{
                width: width(10),
                height: width(10),
                marginRight: width(2),
              }}
              resizeMode="contain"
            />
            <Text style={{ color: colors.black }}>Pay with Apple Pay</Text>
          </View>

          <View
            style={{
              height: width(5),
              width: width(5),
              borderColor: colors.yellow,
              borderWidth: 0.5,
              borderRadius: 50,
            }}
          />
        </TouchableOpacity>

        {/* <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 5,
            marginHorizontal: width(2),
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.yellow,
              borderRadius: 30,
              padding: width(3),
              alignItems: 'center',
            }}
            onPress={() =>
              navigation.navigate('AddEditPaymentCard', {
                type: 'add',
              })
            }>
            <AntDesign name="plus" size={25} color={'#ffff'} />
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
    </>
  );
};

export default PaymentCard;
