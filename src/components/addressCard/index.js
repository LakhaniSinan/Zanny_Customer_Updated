import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../constants/index';
import styles from './style';

const AddressCard = ({
  address,
  onPressEdit,
  onPressdelete,
  handleAddressChange,
  item,
}) => {
  const currentLocation = useSelector(
    state => state.LocationSlice.currentLocation,
  );

  const user = useSelector(state => state.LoginSlice.user);
  const dispatch = useDispatch();

  return (
    <View style={styles.mainview}>
      <TouchableOpacity
        style={{
          marginLeft: width(2),
          width: width(5),
          height: width(5),
          borderColor: colors.yellow,
          borderWidth: 0.5,
          borderRadius: 50,
          // backgroundColor:
          //   item.label == currentLocation.label ? colors.yellow : '',
        }}
        onPress={() => handleAddressChange(item)}></TouchableOpacity>
      <View
        style={{
          marginHorizontal: width(3),
          width: width(60),
        }}>
        <Text style={styles.address}>{address}</Text>
      </View>
      <View style={styles.addressview}>
        <View style={styles.addressinner}>
          <AntDesign
            name="delete"
            color={colors.yellow}
            size={20}
            onPress={onPressdelete}
          />
          <AntDesign
            name="edit"
            style={{marginLeft: width(4)}}
            color={colors.yellow}
            size={20}
            onPress={onPressEdit}
          />
        </View>
      </View>
    </View>
  );
};
export default AddressCard;
