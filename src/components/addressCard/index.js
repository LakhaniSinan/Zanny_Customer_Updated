import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {icons} from '../../assets';
import {colors} from '../../constants';

const AddressCard = ({
  item,
  onPressEdit,
  onPressdelete,
  handleAddressChange,
}) => {
  const {currentLocation} = useSelector(state => state.LocationSlice);

  const isSelected = item?._id === currentLocation?._id;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleAddressChange({...item})}
        style={styles.radioOuter}>
        {isSelected && <View style={styles.radioInner} />}
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>{item?.label || 'Address'}</Text>

        <View style={styles.row}>
          <View style={styles.locationCircle}>
            <Image
              source={icons.location}
              style={styles.locIcon}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.addressText} numberOfLines={2}>
            {item?.address}
          </Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={onPressdelete} style={styles.removeBtn}>
            <Text style={styles.removeTxt}>Remove</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editBtn} onPress={onPressEdit}>
            <Text style={styles.removeTxt}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width(4),
    paddingHorizontal: width(2),
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  editBtn: {
    backgroundColor: '#5C1515',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 10,
  },

  radioOuter: {
    width: width(6),
    height: width(6),
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#5C1515',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width(3),
  },

  radioInner: {
    width: width(3),
    height: width(3),
    borderRadius: 50,
    backgroundColor: '#5C1515',
  },

  // MAIN CARD
  card: {
    flex: 1,
    backgroundColor: colors.clay,
    paddingVertical: width(4),
    paddingHorizontal: width(4),
    borderRadius: 20,
    shadowColor: '#00000022',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginLeft: width(3),
    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  locationCircle: {
    width: width(10),
    height: width(10),
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width(3),
    elevation: 2,
  },

  locIcon: {
    width: 20,
    height: 20,
  },

  addressText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },

  removeBtn: {
    backgroundColor: '#5C1515',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  removeTxt: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
});
