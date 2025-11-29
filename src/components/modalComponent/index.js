import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {fontFamily, icons, images} from '../../assets';
import {Colors} from '../../constants';
import CustomInput from '../customInput';

const ChangeAddressModal = ({
  visible,
  onClose,
  onUpdate = () => {},
  mode = 'add', // 'add' | 'edit'
  data = null, // data for edit mode
}) => {
  const {address} = useSelector(state => state.AddressSlice);

  const [form, setForm] = useState({
    fullAddress: '',
    street: '',
    city: '',
  });

  useEffect(() => {
    // For edit mode, populate fields from data
    if (mode === 'edit' && data) {
      setForm({
        fullAddress: data.address || '',
        street: data.street || '',
        city: data.city || '',
      });
    } else {
      // Clear form for add mode
      setForm({
        fullAddress: '',
        street: '',
        city: '',
      });
    }
  }, [mode, data, visible]);

  const handleChange = (key, val) => setForm(prev => ({...prev, [key]: val}));

  const handleUpdate = () => {
    onUpdate(form);
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={styles.modal}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {mode === 'edit' ? 'Edit Address' : 'Add Address'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={icons.cross} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        {/* Current Address */}
        <Text style={styles.sectionTitle}>Current Address</Text>
        <View style={styles.addressContainer}>
          <View style={styles.addressLeft}>
            <View style={styles.addressIconContainer}>
              <Image
                source={icons.location}
                style={styles.addressIcon}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {address[0]?.address || 'No address available'}
              </Text>
            </View>
          </View>
          <Image
            source={images.mapImage}
            resizeMode="contain"
            style={styles.arrowIcon}
          />
        </View>
        <View style={{height: width(4)}} />

        {/* Form Fields */}
        <CustomInput
          title="Full Address"
          value={form.fullAddress}
          onChangeText={txt => handleChange('fullAddress', txt)}
          placeholder="Enter Full Address"
          multiline
          maxLength={250}
        />
        <View style={{height: width(4)}} />
        <CustomInput
          title="Street Number"
          value={form.street}
          onChangeText={txt => handleChange('street', txt)}
          placeholder="Enter Street Number"
        />
        <View style={{height: width(4)}} />
        <CustomInput
          title="City"
          value={form.city}
          onChangeText={txt => handleChange('city', txt)}
          placeholder="Enter City"
        />

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>
            {mode === 'edit' ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ChangeAddressModal;

const styles = StyleSheet.create({
  modal: {margin: 0, justifyContent: 'flex-end'},
  container: {
    backgroundColor: '#fff',
    padding: width(5),
    borderTopLeftRadius: width(10),
    borderTopRightRadius: width(10),
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {fontSize: 18, fontWeight: 'bold'},
  closeIcon: {width: width(6), height: width(6)},
  sectionTitle: {marginTop: 20, fontWeight: '600'},
  updateButton: {
    marginTop: 30,
    backgroundColor: Colors.black,
    paddingVertical: 14,
    borderRadius: 12,
  },
  updateButtonText: {color: 'white', textAlign: 'center', fontSize: 16},
  // Address styles
  addressContainer: {
    marginTop: width(4),
    height: width(16),
    backgroundColor: Colors.clay,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  addressIconContainer: {
    height: width(10),
    width: width(10),
    borderRadius: 50,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressIcon: {height: width(5), width: width(5)},
  addressTitle: {fontFamily: fontFamily.poppinBold},
  addressText: {
    fontFamily: fontFamily.poppinRegular,
    color: Colors.graydark,
    fontSize: 12,
    width: width(60),
  },
  arrowIcon: {height: 30, width: 30},
});
