import React, {useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import AppHeader from '../../../components/headerComponent';
import CustomPicker from '../../../components/customPicker';
import GooglePlacesInput from '../../../components/googlePlaceInput';
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

const HireChefScreen = () => {
  const eventTypeRef = useRef(null);
  const dateRef = useRef(null);
  const guestsRef = useRef(null);

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
    // For now just log the selection – integrate navigation / API later
    console.log('Hire Chef form submitted:', {
      ...formState,
      location: selectedLocation,
    });
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

        <View style={styles.section}>
          <CustomPicker
            ref={dateRef}
            label="Select Date"
            labelll="Select date"
            value={formState.date}
            listData={[{name: 'Monday 10-12-25'}]}
            name="date"
            handleSelectValue={handleSelectValue}
            handleOpenModal={() => dateRef.current?.show()}
          />
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
                  style={[
                    styles.timeChip,
                    isActive && styles.timeChipActive,
                  ]}>
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
