import React, { useEffect } from 'react';
import { View, SafeAreaView, Text, TextInput } from 'react-native';
import Header from '../../../components/header';
import { width } from 'react-native-dimension';
import { colors } from '../../../constants';
import { useState } from 'react';
import Button from '../../../components/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCurrentPaymentCard } from '../../../redux/slices/paymentCard';
import {
  addPaymentCard,
  updatePaymentCard,
  deletePaymentCard,
} from '../../../services/paymentCard';
import { useDispatch } from 'react-redux';
import OverLayLoader from '../../../components/loader';

const AddEditPaymentCard = ({ route, navigation }) => {
  const disptach = useDispatch();
  const [isloading, setIsLoading] = useState(false)
  const [inputs, setInputs] = useState({
    cardName: '',
    cardNo: '',
    expiryMonth: '',
    expiryYear: '',
  });
  const { type, detail } = route?.params;

  const handleChangeInputs = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  useEffect(() => {
    if (type == 'edit') {
      setInputs({
        cardName: detail?.cardName,
        cardNo: `${detail?.cardNo}`,
        expiryMonth: detail?.expiryMonth,
        expiryYear: detail?.expiryYear,
      });
    }
  }, []);
  const handleAddEditCard = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    const { cardName, cardNo, expiryMonth, expiryYear } = inputs;
    let payload = {
      cardName,
      cardNo,
      expiryMonth,
      expiryYear,
      userId: data?._id,
    };
    if (cardName == '') {
      alert('Card holder name required');
    } else if (cardNo == '') {
      alert('Card number is required');
    } else if (expiryMonth == '') {
      alert('Expiry month is required');
    } else if (expiryYear == '') {
      alert('Expiry year is required');
    } else {
      if (type == 'add') {
        setIsLoading(true)
        addPaymentCard(payload)
          .then(response => {
            setIsLoading(false)
            if (response?.data?.status == 'ok') {
              setInputs({
                cardName: '',
                cardNo: '',
                expiryMonth: '',
                expiryYear: '',
              });
              let data = response?.data?.data
              data["isSelected"] = true
              AsyncStorage.setItem('paymentCard', JSON.stringify(data));
              disptach(setCurrentPaymentCard(data));
              navigation.goBack();
            } else {
              alert(response?.data?.message);
            }
          })
          .catch(error => {
            setIsLoading(false)
            console.log(error, 'error');
          });
      } else {
        setIsLoading(true)
        updatePaymentCard(detail._id, payload)
          .then(response => {
            setIsLoading(false)
            if (response?.data?.status == 'ok') {
              let data = response?.data?.data
              data["isSelected"] = true
              AsyncStorage.setItem('paymentCard', JSON.stringify(data));
              disptach(setCurrentPaymentCard(data));
              alert(response?.data?.message);
              navigation.goBack();
            } else {
              alert(response?.data?.message);
            }
          })
          .catch(error => {
            setIsLoading(false)
            console.log(error, 'error');
          });
      }
    }
  };

  const handleDelete = () => {
    deletePaymentCard(detail._id)
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
  return (
    <>
      <OverLayLoader isloading={isloading} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <Header
          text={type == 'add' ? 'Add Payment Card' : 'Edit Payment Card'}
          goBack={true}
        />
        <Text
          style={{
            marginTop: width(2),
            paddingHorizontal: width(3),
            color: colors.black,
          }}>
          Card Holder Name
        </Text>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: colors.black,
            marginHorizontal: width(2),
            marginTop: width(1),
            borderRadius: 8,
          }}>
          <TextInput
            style={{ marginLeft: width(2), paddingVertical: width(3), color: colors.black }}
            placeholder="Enter Card Holder Name"
            placeholderTextColor={colors.black}
            value={inputs.cardName}
            onChangeText={value => handleChangeInputs('cardName', value)}
          />
        </View>

        <Text
          style={{
            marginTop: width(2),
            paddingHorizontal: width(3),
            color: colors.black,
          }}>
          Card Number
        </Text>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: colors.black,
            marginHorizontal: width(2),
            borderRadius: 8,
            marginTop: width(1)
          }}>
          <TextInput
            style={{ marginLeft: width(2), paddingVertical: width(3), color: colors.black }}
            placeholder="Enter Card No"
            value={inputs.cardNo}
            placeholderTextColor={colors.black}
            onChangeText={value => handleChangeInputs('cardNo', value)}
            maxLength={16}
            keyboardType="numeric"
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: "45%" }}>
            <Text
              style={{
                marginTop: width(2),
                paddingHorizontal: width(3),
                color: colors.black,
              }}>
              Expiry Month
            </Text>
            <View
              style={{
                marginTop: 5,
                borderWidth: 0.5,
                borderColor: colors.black,
                marginHorizontal: width(2),
                borderRadius: 8,
              }}>
              <TextInput
                style={{ marginLeft: width(2), paddingVertical: width(3), color: colors.black }}
                placeholder="Expiry Month"
                placeholderTextColor={colors.black}
                value={inputs.expiryMonth}
                onChangeText={value => handleChangeInputs('expiryMonth', value)}
                maxLength={2}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={{ width: "45%" }}>
            <Text
              style={{
                marginTop: width(2),
                paddingHorizontal: width(3),
                color: colors.black,
              }}>
              Expiry Year
            </Text>
            <View
              style={{
                marginTop: 5,
                borderWidth: 0.5,
                borderColor: colors.black,
                marginHorizontal: width(2),
                borderRadius: 8,

              }}>
              <TextInput
                style={{ marginLeft: width(2), paddingVertical: width(3), color: colors.black }}
                placeholder="Expiry Year"
                placeholderTextColor={colors.black}
                value={inputs.expiryYear}
                onChangeText={value => handleChangeInputs('expiryYear', value)}
                maxLength={2}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          </View>
        </View>
        <View
          style={{ justifyContent: 'flex-end', flex: 1, marginBottom: width(5) }}>
          <Button
            heading={type == 'add' ? 'Add Payment Card' : 'Edit Payment Card'}
            onPress={handleAddEditCard}
          />
          {type == 'edit' ? (
            <View style={{ marginTop: width(5) }}>
              <Button heading="Delete Payment Card" onPress={handleDelete} />
            </View>
          ) : (
            ''
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddEditPaymentCard;
