import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';

import {fontFamily, icons} from '../../../assets';
import ActionButton from '../../../components/actionButton';
import AppHeader from '../../../components/headerComponent';
import PreOrderCard from '../../../components/preOrderCard';
import {Colors, colors} from '../../../constants';
import {setPreOrderData} from '../../../redux/slices/PreOrder';

const PreOrderScreen = ({navigation}) => {
  const {preOrderData} = useSelector(state => state.PreOrderDataSlice);
  const dispatch = useDispatch();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const handleDaySelect = day => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const handleIncreaseQuantity = async item => {
    const updated = preOrderData.map(prod =>
      prod._id === item._id
        ? {...prod, selectedQty: prod.selectedQty + 1}
        : prod,
    );

    dispatch(setPreOrderData(updated));
    await AsyncStorage.setItem('preOrder', JSON.stringify(updated));
  };

  const handleDecreaseQuantity = item => {
    if (item.selectedQty === 1) {
      Alert.alert(
        'Remove Item',
        'If you continue the product will be removed from your cart',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            onPress: async () => {
              const updated = preOrderData.filter(
                prod => prod._id !== item._id,
              );
              dispatch(setPreOrderData(updated));
              await AsyncStorage.setItem('preOrder', JSON.stringify(updated));
            },
          },
        ],
      );
    } else {
      const updated = preOrderData.map(prod =>
        prod._id === item._id
          ? {...prod, selectedQty: prod.selectedQty - 1}
          : prod,
      );
      dispatch(setPreOrderData(updated));
    }
  };

  const handleSelectToCheckout = async item => {
    const updated = preOrderData.map(prod =>
      prod._id === item._id ? {...prod, isSelected: !prod.isSelected} : prod,
    );

    dispatch(setPreOrderData(updated));
    await AsyncStorage.setItem('preOrder', JSON.stringify(updated));
  };

  const renderItem = ({item}) => (
    <PreOrderCard
      item={item}
      handleIncreaseQuantity={handleIncreaseQuantity}
      handleDecreaseQuantity={handleDecreaseQuantity}
      handleSelectToCheckout={handleSelectToCheckout}
    />
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader text={'Pre Order'} goBack />

      <FlatList
        data={preOrderData}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={
          <>
            {/* DATE */}
            <View style={{padding: width(3)}}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinSemiBold,
                  color: colors.black,
                  fontSize: 16,
                }}>
                Select Date
              </Text>

              <TouchableOpacity
                onPress={() => setShowCalendar(prev => !prev)}
                style={{
                  flexDirection: 'row',
                  borderRadius: 100,
                  padding: width(4),
                  paddingHorizontal: width(7),
                  alignItems: 'center',
                  borderColor: colors.softgray,
                  borderWidth: 1,
                  marginTop: width(2),
                }}>
                <Image
                  source={icons.calendarIcon}
                  resizeMode="contain"
                  style={{height: width(7), width: width(7)}}
                />

                <Text
                  style={{
                    fontFamily: fontFamily.poppinRegular,
                    color: colors.gray,
                    marginLeft: width(3),
                  }}>
                  {selectedDate
                    ? moment(selectedDate).format('dddd DD-MM-YYYY')
                    : 'Select delivery date'}
                </Text>
              </TouchableOpacity>

              {showCalendar && (
                <View style={{marginTop: width(4)}}>
                  <Calendar
                    current={selectedDate || moment().format('YYYY-MM-DD')}
                    onDayPress={handleDaySelect}
                    markedDates={
                      selectedDate
                        ? {
                            [selectedDate]: {
                              selected: true,
                              selectedColor: colors.redish,
                              selectedTextColor: colors.white,
                            },
                          }
                        : {}
                    }
                    theme={{
                      todayTextColor: colors.redish,
                      arrowColor: colors.redish,
                      textDayFontFamily: fontFamily.poppinRegular,
                      textMonthFontFamily: fontFamily.poppinSemiBold,
                      textDayHeaderFontFamily: fontFamily.poppinRegular,
                    }}
                  />
                </View>
              )}
            </View>

            {/* TIME */}
            <View style={{padding: width(3)}}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinSemiBold,
                  color: colors.black,
                  fontSize: 16,
                }}>
                Select Time Of Delivery
              </Text>

              <TouchableOpacity
                onPress={() => setOpenTimePicker(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: colors.softgray,
                  borderRadius: 100,
                  borderWidth: 1,
                  marginTop: width(2),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: width(4),
                    paddingHorizontal: width(7),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.timeIcon}
                    resizeMode="contain"
                    style={{height: width(5), width: width(5)}}
                  />

                  <Text
                    style={{
                      fontFamily: fontFamily.poppinRegular,
                      color: colors.gray,
                      marginLeft: width(3),
                    }}>
                    {time
                      ? moment(time).format('hh:mm A')
                      : 'Select delivery time'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        }
      />

      {/* FOOTER */}
      <View
        style={{
          height: width(20),
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: width(4),
          alignItems: 'center',
          backgroundColor: colors.white,
          elevation: 5,
        }}>
        <View style={{width: width(45)}}>
          <ActionButton
            name="Checkout"
            width={width(45)}
            height={46}
            bgcColor={Colors.black}
            fontColor={Colors.white}
            onPress={() => {
              if (!selectedDate)
                return Alert.alert(
                  'Missing Date',
                  'Please select delivery date',
                );

              if (!time)
                return Alert.alert(
                  'Missing Time',
                  'Please select delivery time',
                );

              if (selectedDate < moment().format('YYYY-MM-DD')) {
                return Alert.alert(
                  'Invalid Date',
                  'Please select a valid delivery date',
                );
              }

              if (
                selectedDate === moment().format('YYYY-MM-DD') &&
                moment(time).isBefore(moment())
              ) {
                return Alert.alert(
                  'Invalid Time',
                  'Please select a valid delivery time',
                );
              }

              if (preOrderData.filter(i => i.isSelected).length === 0) {
                return Alert.alert(
                  'No Items Selected',
                  'Please select at least one item',
                );
              }

              navigation.navigate('CheckoutScreen', {
                selectedDate,
                time,
              });
            }}
          />
        </View>
        <View style={{width: width(45)}}>
          <ActionButton
            name="Re-occuring 👑"
            width={width(45)}
            height={46}
            bgcColor={Colors.white}
            fontColor={Colors.black}
          />
        </View>
      </View>

      {/* TIME PICKER */}
      <DatePicker
        modal
        open={openTimePicker}
        date={time || new Date()}
        mode="time"
        onConfirm={t => {
          setOpenTimePicker(false);
          setTime(t);
        }}
        onCancel={() => setOpenTimePicker(false)}
      />
    </View>
  );
};

export default PreOrderScreen;
