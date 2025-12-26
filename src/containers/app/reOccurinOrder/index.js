import moment from 'moment';
import {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';

import {fontFamily, icons} from '../../../assets';
import ActionButton from '../../../components/actionButton';
import AppHeader from '../../../components/headerComponent';
import PreOrderCard from '../../../components/preOrderCard';
import {Colors, colors} from '../../../constants';

const ReOccurinOrder = ({navigation}) => {
  const {preOrderData} = useSelector(state => state.PreOrderDataSlice);
  const [dailyOrWeekly, setDailyOrWeekly] = useState('daily');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [activeDateIndex, setActiveDateIndex] = useState(null);

  /* ---------------- CREATE DATE OBJECT ---------------- */
  const createDateEntry = useCallback(
    dateString => ({
      date: dateString,
      day: moment(dateString).format('ddd'),
      time: null,
      isOpen: true,
      products: preOrderData.map(p => ({
        ...p,
        selectedQty: p.selectedQty || 1,
        isSelected: true,
      })),
    }),
    [preOrderData],
  );

  /* ---------------- DATE SELECT ---------------- */
  const handleDayPress = useCallback(
    day => {
      const today = moment().startOf('day');
      const selected = moment(day.dateString);

      if (selected.isBefore(today)) return;

      setSelectedDates(prev => {
        const exists = prev.find(d => d.date === day.dateString);
        if (exists) {
          return prev.filter(d => d.date !== day.dateString);
        }
        return [...prev, createDateEntry(day.dateString)];
      });
    },
    [createDateEntry],
  );

  /* ---------------- MARKED DATES ---------------- */
  const markedDates = useMemo(() => {
    return selectedDates.reduce((acc, item) => {
      acc[item.date] = {
        customStyles: {
          container: {
            backgroundColor: colors.red,
            borderRadius: 8,
          },
          text: {
            color: colors.white,
            fontWeight: 'bold',
          },
        },
      };
      return acc;
    }, {});
  }, [selectedDates]);

  /* ---------------- PRODUCT UPDATE ---------------- */
  const updateProduct = useCallback((dateIndex, productId, changes) => {
    setSelectedDates(prev => {
      const updated = [...prev];
      updated[dateIndex] = {
        ...updated[dateIndex],
        products: updated[dateIndex].products.map(p =>
          p._id === productId ? {...p, ...changes} : p,
        ),
      };
      return updated;
    });
  }, []);

  /* ---------------- TIME CONFIRM ---------------- */
  const handleTimeConfirm = time => {
    setSelectedDates(prev => {
      const updated = [...prev];
      updated[activeDateIndex] = {
        ...updated[activeDateIndex],
        time,
      };
      return updated;
    });
    setOpenTimePicker(false);
  };

  /* ---------------- PRODUCTS RENDER ---------------- */
  const renderProducts = (item, dateIndex) => (
    <FlatList
      data={item.products}
      keyExtractor={p => p._id}
      renderItem={({item: prod}) => (
        <PreOrderCard
          item={prod}
          type={'reOccuring'}
          handleIncreaseQuantity={() =>
            updateProduct(dateIndex, prod._id, {
              selectedQty: prod.selectedQty + 1,
            })
          }
          handleDecreaseQuantity={() =>
            prod.selectedQty > 1 &&
            updateProduct(dateIndex, prod._id, {
              selectedQty: prod.selectedQty - 1,
            })
          }
          handleSelectToCheckout={() =>
            updateProduct(dateIndex, prod._id, {
              isSelected: !prod.isSelected,
            })
          }
        />
      )}
    />
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader text="Re Occurring" goBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: width(3), alignItems: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: width(35)}}>
              <ActionButton
                name="Daily"
                bgcColor={
                  dailyOrWeekly === 'daily' ? Colors.redish : Colors.border
                }
                fontColor={
                  dailyOrWeekly === 'daily' ? Colors.white : Colors.gray
                }
                height={width(10)}
                borderRadius={10}
                onPress={() => setDailyOrWeekly('daily')}
                styleProps={{
                  borderColor: colors.border,
                }}
              />
            </View>
            <View style={{width: width(4)}} />
            <View style={{width: width(35)}}>
              <ActionButton
                name="Weekly"
                bgcColor={
                  dailyOrWeekly === 'weekly' ? Colors.redish : Colors.border
                }
                fontColor={
                  dailyOrWeekly === 'weekly' ? Colors.white : Colors.gray
                }
                height={width(10)}
                borderRadius={10}
                onPress={() => setDailyOrWeekly('weekly')}
                styleProps={{
                  borderColor:
                    dailyOrWeekly === 'weekly' ? colors.redish : colors.border,
                }}
              />
            </View>
          </View>

          <Text
            style={{
              fontFamily: fontFamily.poppinRegular,
              fontSize: 12,
              color: colors.gray,
              textAlign: 'center',
              marginTop: width(2),
              width: '80%',
            }}>
            Enable automated weekly or daily orders to streamline your
            experience.
          </Text>
        </View>
        {/* -------- CALENDAR -------- */}

        <View style={{padding: width(3)}}>
          <Text style={{fontFamily: fontFamily.poppinSemiBold, fontSize: 16}}>
            Select Date
          </Text>

          <TouchableOpacity
            onPress={() => setShowCalendar(v => !v)}
            style={{
              flexDirection: 'row',
              borderRadius: 100,
              padding: width(4),
              borderWidth: 1,
              borderColor: colors.border,
              marginTop: width(2),
            }}>
            <Image
              resizeMode="contain"
              source={icons.calendarIcon}
              style={{width: 22, height: 22}}
            />
            <Text style={{marginLeft: 10, color: colors.gray}}>Pick Dates</Text>
          </TouchableOpacity>

          {showCalendar && (
            <Calendar
              markingType="custom"
              markedDates={markedDates}
              onDayPress={handleDayPress}
              minDate={moment().format('YYYY-MM-DD')}
              theme={{
                todayTextColor: colors.redish,
                arrowColor: colors.redish,
              }}
            />
          )}
        </View>

        <Text
          style={{
            marginHorizontal: width(3),
            marginTop: width(4),
            fontSize: 16,
            fontFamily: fontFamily.poppinBold,
            borderBottomWidth: 0.5,
            borderColor: colors.border,
            paddingBottom: width(2),
          }}>
          Set Orders
        </Text>

        {selectedDates.length === 0 && (
          <Text
            style={{
              textAlign: 'center',
              color: colors.gray,
              marginTop: width(6),
              fontFamily: fontFamily.poppinRegular,
            }}>
            No dates selected yet. Please select one or more dates above to set
            your orders.
          </Text>
        )}

        <FlatList
          data={selectedDates}
          keyExtractor={item => item.date}
          renderItem={({item, index}) => (
            <View style={{paddingHorizontal: width(3)}}>
              <TouchableOpacity
                onPress={() =>
                  setSelectedDates(prev => {
                    const updated = [...prev];
                    updated[index].isOpen = !updated[index].isOpen;
                    return updated;
                  })
                }
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: width(4),
                  borderBottomWidth: 0.5,
                  borderColor: colors.border,
                }}>
                <Text style={{fontFamily: fontFamily.poppinSemiBold}}>
                  {item.day} {moment(item.date).format('DD/MM/YYYY')}
                </Text>
                <Image
                  resizeMode="contain"
                  source={icons.arrowDown}
                  style={{
                    height: 10,
                    width: 10,
                    transform: [{rotate: item.isOpen ? '180deg' : '0deg'}],
                  }}
                />
              </TouchableOpacity>

              {item.isOpen && (
                <>
                  {renderProducts(item, index)}

                  <TouchableOpacity
                    onPress={() => {
                      setActiveDateIndex(index);
                      setOpenTimePicker(true);
                    }}
                    style={{
                      flexDirection: 'row',
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 100,
                      padding: width(4),
                      marginVertical: width(3),
                    }}>
                    <Image
                      resizeMode="contain"
                      source={icons.timeIcon}
                      style={{height: 18, width: 18}}
                    />
                    <Text style={{marginLeft: 10, color: colors.gray}}>
                      {item.time
                        ? moment(item.time).format('hh:mm A')
                        : 'Select delivery time'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        />
      </ScrollView>

      {/* -------- FOOTER -------- */}
      <View style={{padding: width(4)}}>
        <ActionButton
          name="Proceed to Checkout"
          bgcColor={Colors.black}
          fontColor={Colors.white}
          height={50}
          onPress={() => {
            if (!selectedDates.length) {
              return Alert.alert('Please select at least one date');
            }

            // 🔹 Step 1: sirf selected products rakhna
            const filteredDates = selectedDates
              .map(dateItem => {
                const selectedProducts = dateItem.products.filter(
                  p => p.isSelected === true,
                );

                return {
                  ...dateItem,
                  products: selectedProducts,
                };
              })
              // 🔹 Step 2: wo dates hata do jisme koi product selected nahi
              .filter(dateItem => dateItem.products.length > 0);

            // 🔹 Step 3: time validation (sirf valid dates ke liye)
            for (const d of filteredDates) {
              if (!d.time) {
                return Alert.alert(
                  'Missing Time',
                  `Please select time for ${moment(d.date).format(
                    'DD/MM/YYYY',
                  )}`,
                );
              }
            }

            // 🔹 Step 4: Next screen par clean data bhejo
            navigation.navigate('ReOccuringCheckout', {
              selectedDates: filteredDates,
            });
          }}
        />
      </View>

      {/* -------- TIME PICKER -------- */}
      <DatePicker
        modal
        open={openTimePicker}
        date={new Date()}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setOpenTimePicker(false)}
      />
    </View>
  );
};

export default ReOccurinOrder;
