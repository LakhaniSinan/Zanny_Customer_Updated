import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import Modal from 'react-native-modal';
import {icons} from '../../assets';
import {Colors} from '../../constants';
import CustomInput from '../customInput';
import GooglePlacesInput from '../googlePlaceInput';

const ChangeAddressModal = ({
  visible,
  onClose = () => {},
  onUpdate = () => {},
  mode = 'add',
  data = null,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [form, setForm] = useState({
    street: '',
    city: '',
  });

  useEffect(() => {
    if (data && mode == 'edit') {
      setSelectedLocation({
        userAddress: data?.address,
        latLng: {
          lat: data?.latitude,
          lng: data?.longitude,
        },
      });
      setForm({
        street: data?.street,
        city: data?.city,
      });
    } else {
      resetForm();
    }
  }, [data, mode == 'edit', visible]);

  const resetForm = () => {
    setSelectedLocation(null);
    setForm({street: '', city: ''});
  };

  const handleChange = (key, val) => setForm(prev => ({...prev, [key]: val}));

  const handleUpdate = () => {
    onUpdate({...selectedLocation, ...form, type: mode, ...data});
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={handleClose}
      style={styles.modal}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {mode === 'edit' ? 'Edit Address' : 'Add Address'}
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <Image source={icons.cross} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        {/* Current Address */}
        <Text style={styles.sectionTitle}>Current Address</Text>
        <View style={{height: width(2)}} />

        <GooglePlacesInput
          showLeftIcon
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          placeholder="Select your location"
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
});
