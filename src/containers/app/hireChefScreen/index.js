import moment from 'moment';
import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {width} from 'react-native-dimension';
import {fontFamily, icons} from '../../../assets';
import CustomPicker from '../../../components/customPicker';
import GooglePlacesInput from '../../../components/googlePlaceInput';
import AppHeader from '../../../components/headerComponent';
import PrimaryButton from '../../../components/primaryButton';
import {colors} from '../../../constants';

const EVENT_TYPES = [
  {name: 'Birthday'},
  {name: 'Wedding'},
  {name: 'Anniversary'},
  {name: 'Corporate Event'},
];

const GUEST_OPTIONS = [
  {name: '10'},
  {name: '20'},
  {name: '30'},
  {name: '40'},
  {name: '50+'},
];

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 AM'];

const HireChefScreen = ({navigation}) => {
  const eventTypeRef = useRef(null);
  const dateRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const guestsRef = useRef(null);

  const handleDaySelect = day => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const [formState, setFormState] = useState({
    eventType: '',
    date: 'Monday 10-12-25',
    guests: '20',
    time: '12:00 PM',
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectValue = (name, item) => {
    setFormState(prev => ({
      ...prev,
      [name]: item.name,
    }));
  };

  const handleProceed = () => {
    navigation.navigate('SelectMeals', formState);
  };

  return (
    <View style={styles.container}>
      <AppHeader text="Hire Chef" goBack={true} cartIcon={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <CustomPicker
            ref={eventTypeRef}
            label="Type of Event"
            labelll="Select event type"
            value={formState.eventType}
            listData={EVENT_TYPES}
            name="eventType"
            handleSelectValue={handleSelectValue}
            handleOpenModal={() => eventTypeRef.current?.show()}
          />
        </View>

        <View style={{}}>
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
              padding: width(3),
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

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Hours</Text>
          <View style={styles.timeRow}>
            {TIME_SLOTS.map(time => {
              const isActive = formState.time === time;
              return (
                <TouchableOpacity
                  key={time}
                  onPress={() =>
                    setFormState(prev => ({
                      ...prev,
                      time,
                    }))
                  }
                  style={[styles.timeChip, isActive && styles.timeChipActive]}>
                  <Text
                    style={[
                      styles.timeText,
                      isActive && styles.timeTextActive,
                    ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Cooking Address</Text>
          <GooglePlacesInput
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </View>

        <View style={styles.section}>
          <CustomPicker
            ref={guestsRef}
            label="Guests"
            labelll="Select guests"
            value={formState.guests}
            listData={GUEST_OPTIONS}
            name="guests"
            handleSelectValue={handleSelectValue}
            handleOpenModal={() => guestsRef.current?.show()}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.proceedButtonWrapper}>
          <PrimaryButton name="Proceed" onPress={handleProceed} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: width(4),
    paddingTop: width(4),
    paddingBottom: width(6),
    gap: width(5),
  },
  section: {
    gap: width(2),
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
    marginBottom: width(2),
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeChip: {
    flex: 1,
    paddingVertical: width(2.5),
    marginRight: width(2),
    borderRadius: 14,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipActive: {
    backgroundColor: '#5C1515',
  },
  timeText: {
    fontSize: 13,
    color: colors.black,
  },
  timeTextActive: {
    color: colors.white,
  },
  footer: {
    paddingHorizontal: width(4),
    paddingBottom: width(4),
    paddingTop: width(2),
    backgroundColor: colors.white,
  },
  proceedButtonWrapper: {
    height: width(13),
  },
});

export default HireChefScreen;
