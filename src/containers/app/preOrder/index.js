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

  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const [time, setTime] = useState(new Date());
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [amPm, setAmPm] = useState('AM');

  const handleDaySelect = day => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };
  const handleIncreaseQuantity = async item => {
    console.log(item, 'asdasdasds');

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
      <AppHeader text={'Pre Order'} goBack={true} />

      <FlatList
        data={preOrderData}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
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
                }}>
                <Image
                  resizeMode="contain"
                  source={icons.calendarIcon}
                  style={{height: width(7), width: width(7)}}
                />

                <Text
                  style={{
                    fontFamily: fontFamily.poppinRegular,
                    color: colors.gray,
                    marginLeft: width(3),
                    marginTop: width(1),
                  }}>
                  {moment(selectedDate).format('dddd DD-MM-YYYY')}
                </Text>
              </TouchableOpacity>

              {showCalendar && (
                <View style={{marginTop: width(4)}}>
                  <Calendar
                    current={selectedDate}
                    onDayPress={handleDaySelect}
                    markedDates={{
                      [selectedDate]: {
                        selected: true,
                        selectedColor: colors.redish,
                        selectedTextColor: colors.white,
                      },
                    }}
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

            <View style={{padding: width(3)}}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinSemiBold,
                  color: colors.black,
                  fontSize: 16,
                }}>
                Select Time of Delivery
              </Text>

              <TouchableOpacity
                onPress={() => setOpenTimePicker(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                    resizeMode="contain"
                    source={icons.timeIcon}
                    style={{height: width(5), width: width(5)}}
                  />

                  <Text
                    style={{
                      fontFamily: fontFamily.poppinRegular,
                      color: colors.gray,
                      marginLeft: width(3),
                      marginTop: width(1),
                    }}>
                    {moment(time).format('hh:mm')} {amPm}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => setAmPm('AM')}
                    style={{
                      paddingHorizontal: width(3),
                      backgroundColor:
                        amPm === 'AM' ? colors.redish : colors.softgray,
                      borderRadius: 6,
                    }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.poppinRegular,
                        color: amPm === 'AM' ? colors.white : colors.black,
                      }}>
                      AM
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setAmPm('PM')}
                    style={{
                      paddingHorizontal: width(3),
                      marginHorizontal: width(3),
                      backgroundColor:
                        amPm === 'PM' ? colors.redish : colors.softgray,
                      borderRadius: 6,
                    }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.poppinRegular,
                        color: amPm === 'PM' ? colors.white : colors.black,
                      }}>
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </>
        }
      />
      <View
        style={{
          height: width(20),
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: width(4),
          flexDirection: 'row',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <View style={{width: width(45)}}>
          <ActionButton
            onPress={() =>
              navigation.navigate('CheckoutScreen', {
                selectedDate,
                time,
              })
            }
            height={46}
            width={width(45)}
            name={'Checkout'}
            fontColor={Colors.white}
            bgcColor={Colors.black}
          />
        </View>
        <View style={{width: width(45)}}>
          <ActionButton
            height={46}
            width={width(45)}
            name={'Re-occuring 👑'}
            bgcColor={Colors.white}
            fontColor={Colors.black}
            // onPress={handleAddToCart}
          />
        </View>
      </View>

      <DatePicker
        modal
        open={openTimePicker}
        date={time}
        mode="time"
        onConfirm={selectedTime => {
          setOpenTimePicker(false);
          setTime(selectedTime);
        }}
        onCancel={() => setOpenTimePicker(false)}
      />
    </View>
  );
};

export default PreOrderScreen;
