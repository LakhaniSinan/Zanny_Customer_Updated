import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {width, height} from 'react-native-dimension';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../constants';
import {fontFamily} from '../../assets';

const CustomPicker = forwardRef(
  (
    {
      label,
      labelll,
      value,
      listData,
      handleSelectValue,
      name,
      handleOpenModal,
      hideEndIcon,
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      show() {
        setIsVisible(true);
      },
      hide() {
        setIsVisible(false);
      },
    }));

    const getLabel = () => {
      if (value) return value;
      return labelll;
    };

    return (
      <>
        <Text style={styles.label}>{label}</Text>

        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.7}
          onPress={handleOpenModal}>
          <Text
            style={[
              styles.dropdownText,
              {color: value ? colors.black : colors.graydark},
            ]}>
            {getLabel()}
          </Text>

          {!hideEndIcon && (
            <MaterialIcons
              name={isVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={colors.black}
            />
          )}
        </TouchableOpacity>

        <Modal
          isVisible={isVisible}
          backdropOpacity={0.4}
          onBackdropPress={() => ref.current.hide()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{labelll}</Text>
              <TouchableOpacity onPress={() => ref.current.hide()}>
                <MaterialIcons name="close" size={24} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={listData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    value === item.name && styles.optionActive,
                  ]}
                  onPress={() => {
                    handleSelectValue(name, item);
                    ref.current.hide();
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      value === item.name && {color: colors.white},
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </>
    );
  },
);

export default CustomPicker;

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.poppinBold,
    fontSize: 13,
    color: colors.black,
    marginBottom: width(1.5),
  },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: width(3.5),
    paddingHorizontal: width(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  dropdownText: {
    fontFamily: fontFamily.poppinRegular,
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    maxHeight: height(55),
    paddingVertical: width(4),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width(4),
    marginBottom: width(3),
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fontFamily.poppinBold,
  },
  option: {
    paddingVertical: width(3),
    paddingHorizontal: width(5),
    marginHorizontal: width(3),
    borderRadius: 30,
    marginBottom: width(2),
    backgroundColor: colors.white,
  },
  optionActive: {
    backgroundColor: colors.black,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fontFamily.poppinMedium,
    color: colors.black,
  },
});
