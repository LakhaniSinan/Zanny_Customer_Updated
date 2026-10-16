import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import Modal from 'react-native-modal';
import {fontFamily, icons} from '../../assets';
import {colors, Colors} from '../../constants';
import PrimaryButton from '../primaryButton';

// Star Rating Button Component
const StarRatingButton = ({rating, selected, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.ratingButton, selected && styles.ratingButtonSelected]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {[...Array(rating)].map((_, index) => (
          <Image
            key={index}
            source={icons.yellowStar}
            style={{
              height: width(3),
              width: width(3),
              marginRight: 1,
            }}
            resizeMode="contain"
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const FilterModal = ({visible, onClose, onApplyFilter}) => {
  const [selectedRating, setSelectedRating] = useState(2);
  const [location, setLocation] = useState('Near me');
  const [ethnicity, setEthnicity] = useState('American');
  const [dietary, setDietary] = useState('Breakfast');
  const [specialRating, setSpecialRating] = useState('Michelin Star');

  const handleApplyFilter = () => {
    const filterData = {
      rating: selectedRating,
      location,
      ethnicity,
      dietary,
      specialRating,
    };
    onApplyFilter && onApplyFilter(filterData);
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
      useNativeDriver={true}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter by</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Near me"
                placeholderTextColor={Colors.grayyy}
                value={location}
                onChangeText={setLocation}
              />
              <Image
                source={icons.arrowDown}
                style={styles.dropdownIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.label}>Rating</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(rating => (
                <StarRatingButton
                  key={rating}
                  rating={rating}
                  selected={selectedRating === rating}
                  onPress={() => setSelectedRating(rating)}
                />
              ))}
            </View>
          </View>

          {/* Ethnicity */}
          <View style={styles.section}>
            <Text style={styles.label}>Ethnicity</Text>
            <TouchableOpacity style={styles.inputContainer}>
              <Text
                style={[
                  styles.dropdownText,
                  {color: ethnicity ? Colors.black : Colors.grayyy},
                ]}>
                {ethnicity}
              </Text>
              <Image
                source={icons.arrowDown}
                style={styles.dropdownIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Dietary */}
          <View style={styles.section}>
            <Text style={styles.label}>Dietary</Text>
            <TouchableOpacity style={styles.inputContainer}>
              <Text
                style={[
                  styles.dropdownText,
                  {color: dietary ? Colors.black : Colors.grayyy},
                ]}>
                {dietary}
              </Text>
              <Image
                source={icons.arrowDown}
                style={styles.dropdownIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Special Star Rating */}
          <View style={styles.section}>
            <Text style={styles.label}>Special Star Rating</Text>
            <TouchableOpacity style={styles.inputContainer}>
              <Text
                style={[
                  styles.dropdownText,
                  {color: specialRating ? Colors.black : Colors.grayyy},
                ]}>
                {specialRating}
              </Text>
              <Image
                source={icons.arrowDown}
                style={styles.dropdownIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Apply Filter Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            name="Apply Filter"
            onPress={handleApplyFilter}
            fontSize={16}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: width(6),
    borderTopRightRadius: width(6),
    maxHeight: '90%',
    paddingBottom: width(5),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width(5),
    paddingTop: width(5),
    paddingBottom: width(3),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.poppinBold,
    color: Colors.black,
  },
  closeButton: {
    width: width(8),
    height: width(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.black,
    fontWeight: '300',
  },
  scrollContent: {
    paddingHorizontal: width(5),
    paddingTop: width(4),
  },
  section: {
    marginBottom: width(5),
  },
  label: {
    fontSize: 14,
    fontFamily: fontFamily.poppinBold,
    color: Colors.black,
    marginBottom: width(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.softgray,
    paddingVertical: width(3.5),
    paddingHorizontal: width(4),
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: Colors.black,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
  },
  dropdownIcon: {
    height: width(4),
    width: width(4),
    tintColor: Colors.gray,
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width(2),
  },
  ratingButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: width(2.5),
    paddingHorizontal: width(3),
    borderWidth: 1,
    borderColor: Colors.softgray,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width(15),
  },
  ratingButtonSelected: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  buttonContainer: {
    paddingHorizontal: width(5),
    paddingTop: width(4),
    height: width(13),
  },
});
