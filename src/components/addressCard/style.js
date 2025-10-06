import {StyleSheet} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../constants/index';

const styles = StyleSheet.create({
  mainview: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: width(3),
    borderRadius: 12,
    margin: width(3),
    minHeight: width(30),
    elevation: 3,
  },

  locicon: {
    justifyContent: 'flex-start',
    marginTop: '5%',
    marginLeft: '5%',
  },
  addressview: {},

  addressinner: {
    flexDirection: 'row',
  },
  addressname: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
  },
  address: {
    color: 'black',
    paddingBottom: width(3),
  },
});

export default styles;
