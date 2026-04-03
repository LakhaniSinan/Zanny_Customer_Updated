import moment from 'moment';
import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {width} from 'react-native-dimension';
import {useNavigation, useRoute} from '@react-navigation/native';

import {fontFamily, icons} from '../../../assets';
import AppHeader from '../../../components/headerComponent';
import {Colors, colors} from '../../../constants';

const sortAsc = dates => [...dates].sort((a, b) => a.localeCompare(b));

const formatDateRangeLabel = sortedDates => {
  if (!sortedDates?.length) {
    return 'Select dates';
  }
  if (sortedDates.length === 1) {
    return moment(sortedDates[0]).format('ddd DD/MM/YY');
  }
  const first = moment(sortedDates[0]).format('ddd DD/MM/YY');
  const last = moment(sortedDates[sortedDates.length - 1]).format(
    'ddd DD/MM/YY',
  );
  return `${first} - ${last}`;
};

const SubscribeChefScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const chefData = route?.params?.chefData || {};
  const [plan, setPlan] = useState('daily');
  const [selectedDates, setSelectedDates] = useState([]);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const rating = useMemo(() => {
    if (chefData?.reviews?.length) {
      const t = chefData.reviews.reduce((s, r) => s + (r.rating || 0), 0);
      return (t / chefData.reviews.length).toFixed(1);
    }
    return '4.8';
  }, [chefData?.reviews]);

  const reviewCount = chefData?.reviews?.length || 120;

  const cuisineTags = useMemo(() => {
    const raw = chefData?.foodType || 'British, American';
    return String(raw)
      .split(/[,/&]/)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [chefData?.foodType]);

  const markedDates = useMemo(() => {
    const m = {};
    selectedDates.forEach(d => {
      m[d] = {
        selected: true,
        selectedColor: colors.redish,
        selectedTextColor: colors.white,
      };
    });
    return m;
  }, [selectedDates]);

  const calendarCurrent = useMemo(() => {
    if (selectedDates.length) {
      return selectedDates[0];
    }
    return moment().format('YYYY-MM-DD');
  }, [selectedDates]);

  const onDayPress = useCallback(day => {
    const {dateString} = day;
    setSelectedDates(prev => {
      const has = prev.includes(dateString);
      const next = has
        ? prev.filter(d => d !== dateString)
        : [...prev, dateString];
      return sortAsc(next);
    });
  }, []);

  const handleClearCalendar = useCallback(() => {
    setSelectedDates([]);
  }, []);

  const handleApplyCalendar = useCallback(() => {
    setCalendarVisible(false);
  }, []);

  const handleOpenCalendar = useCallback(() => {
    setCalendarVisible(true);
  }, []);

  const handleDayRow = useCallback(
    (dayIndex, dateString) => {
      navigation.navigate('SubscribeChefDay', {
        chefData,
        plan,
        dayIndex,
        dateString,
        subscriptionDates: selectedDates,
      });
    },
    [chefData, navigation, plan, selectedDates],
  );

  const handleCheckout = useCallback(() => {
    if (!selectedDates.length) {
      Alert.alert('Select dates', 'Please select at least one date.');
      return;
    }
    navigation.navigate('OrderSummry', {
      items: [],
      chefData,
      plan,
      subscriptionDates: selectedDates,
      date: formatDateRangeLabel(selectedDates),
      flow: 'subscribe',
    });
  }, [chefData, navigation, plan, selectedDates]);

  return (
    <View style={styles.container}>
      <AppHeader text="Subscribe to Chef" goBack />
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.tabWrap}>
            <TouchableOpacity
              style={[styles.tabBtn, plan === 'daily' && styles.tabActive]}
              onPress={() => setPlan('daily')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.tabText,
                  plan === 'daily' && styles.tabTextActive,
                ]}>
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, plan === 'weekly' && styles.tabActive]}
              onPress={() => setPlan('weekly')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.tabText,
                  plan === 'weekly' && styles.tabTextActive,
                ]}>
                Weekly
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chefCard}>
            <Image
              source={
                chefData?.merchantImage
                  ? {uri: chefData.merchantImage}
                  : icons.User
              }
              style={styles.chefImage}
            />
            <View style={styles.chefInfo}>
              <View style={styles.chefNameRow}>
                <Text style={styles.chefName}>
                  {chefData?.name || 'Leanne Wayne'}
                </Text>
                <View style={styles.verifiedDot}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              </View>
              <View style={styles.tagRow}>
                {cuisineTags.map((t, i) => (
                  <View key={`${t}-${i}`} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{t}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.ratingRow}>
                <Image
                  source={icons.yellowStar}
                  style={styles.starIcon}
                  resizeMode="contain"
                />
                <Text style={styles.metaText}>
                  {rating} ({reviewCount}+) · 2.8 km away
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Select Dates</Text>
          <TouchableOpacity
            style={styles.dateChip}
            onPress={handleOpenCalendar}
            activeOpacity={0.75}>
            <Text style={styles.dateChipIcon}>🗓</Text>
            <Text style={styles.dateChipText}>
              {formatDateRangeLabel(selectedDates)}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Set Orders</Text>
          <Text style={styles.sectionSubText}>
            Choose a date to view available meal options.
          </Text>

          <View style={styles.daysList}>
            {selectedDates.map((dateStr, idx) => (
              <TouchableOpacity
                key={dateStr}
                style={styles.dayRow}
                activeOpacity={0.75}
                onPress={() => handleDayRow(idx + 1, dateStr)}>
                <Text style={styles.dayRowText}>Day {idx + 1}</Text>
                <Image source={icons.CaretRight} style={styles.rightArrow} />
              </TouchableOpacity>
            ))}
            {!selectedDates.length && (
              <Text style={styles.emptyHint}>
                Select dates above to see Day 1, Day 2…
              </Text>
            )}
          </View>
          <View style={{height: width(24)}} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.checkoutBtn}
            activeOpacity={0.85}
            onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Proceed to Check out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={calendarVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select dates</Text>
            <Calendar
              current={calendarCurrent}
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                todayTextColor: colors.redish,
                arrowColor: colors.redish,
                textDayFontFamily: fontFamily.poppinRegular,
                textMonthFontFamily: fontFamily.poppinSemiBold,
                textDayHeaderFontFamily: fontFamily.poppinRegular,
              }}
            />
            <View style={styles.calendarActions}>
              <TouchableOpacity onPress={handleClearCalendar}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApplyCalendar}
                activeOpacity={0.85}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SubscribeChefScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  safeContainer: {flex: 1, backgroundColor: Colors.white},
  tabWrap: {
    marginTop: width(3),
    marginHorizontal: width(4),
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: width(2),
  },
  tabActive: {backgroundColor: '#5B0000'},
  tabText: {
    fontFamily: fontFamily.poppinMedium,
    color: Colors.grayplus,
    fontSize: 13,
  },
  tabTextActive: {color: Colors.white},
  chefCard: {
    marginTop: width(4),
    marginHorizontal: width(4),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
    backgroundColor: colors.white ,
    borderRadius: 16,
    padding: width(3),
    gap: width(3),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chefImage: {
    height: width(16),
    width: width(16),
    borderRadius: width(8),
    backgroundColor: '#EEE',
  },
  chefInfo: {flex: 1},
  chefNameRow: {flexDirection: 'row', alignItems: 'center', gap: width(1)},
  chefName: {
    fontFamily: fontFamily.poppinSemiBold,
    color: Colors.black,
    fontSize: 15,
  },
  verifiedDot: {
    height: width(4),
    width: width(4),
    borderRadius: 999,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {color: Colors.white, fontSize: 9, fontWeight: '700'},
  tagRow: {flexDirection: 'row', flexWrap: 'wrap', gap: width(2), marginTop: 4},
  tagPill: {
    backgroundColor: '#FAF1EC',
    borderRadius: 100,
    paddingHorizontal: width(2.5),
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.warn,
  },
  tagPillText: {fontSize: 10, color: '#50555C'},
  ratingRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  starIcon: {height: width(3), width: width(3), marginRight: 4},
  metaText: {
    fontFamily: fontFamily.poppinRegular,
    color: Colors.grayplus,
    fontSize: 11,
  },
  sectionTitle: {
    marginTop: width(5),
    marginHorizontal: width(4),
    fontFamily: fontFamily.poppinSemiBold,
    color: Colors.black,
    fontSize: 16,
  },
  dateChip: {
    marginTop: width(2),
    marginHorizontal: width(4),
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 999,
    paddingVertical: width(3),
    paddingHorizontal: width(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: width(3),
  },
  dateChipIcon: {fontSize: 15},
  dateChipText: {
    fontFamily: fontFamily.poppinMedium,
    color: Colors.gray,
    fontSize: 13,
    flex: 1,
  },
  sectionSubText: {
    marginTop: width(1),
    marginHorizontal: width(4),
    color: Colors.grayyy,
    fontFamily: fontFamily.poppinRegular,
    fontSize: 12,
  },
  daysList: {
    marginTop: width(3),
    marginHorizontal: width(4),
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  dayRow: {
    height: width(14),
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayRowText: {
    fontFamily: fontFamily.poppinSemiBold,
    color: colors.redish,
    fontSize: 15,
  },
  rightArrow: {height: width(4), width: width(4), tintColor: Colors.grayplus},
  emptyHint: {
    paddingVertical: width(4),
    textAlign: 'center',
    color: Colors.grayyy,
    fontFamily: fontFamily.poppinRegular,
    fontSize: 13,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: Colors.white,
    paddingHorizontal: width(4),
    paddingVertical: width(4),
  },
  checkoutBtn: {
    backgroundColor: Colors.black,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    height: width(12),
  },
  checkoutText: {
    fontFamily: fontFamily.poppinSemiBold,
    color: Colors.white,
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: width(4),
    paddingBottom: width(8),
  },
  modalTitle: {
    fontFamily: fontFamily.poppinSemiBold,
    fontSize: 16,
    marginBottom: width(2),
    color: Colors.black,
  },
  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: width(4),
    marginTop: width(2),
  },
  clearText: {
    fontFamily: fontFamily.poppinMedium,
    color: Colors.grayyy,
    fontSize: 14,
    paddingVertical: width(2),
    paddingHorizontal: width(2),
  },
  applyBtn: {
    backgroundColor: colors.redish,
    borderRadius: 8,
    paddingHorizontal: width(5),
    paddingVertical: width(2),
  },
  applyText: {
    fontFamily: fontFamily.poppinSemiBold,
    color: Colors.white,
    fontSize: 14,
  },
});
