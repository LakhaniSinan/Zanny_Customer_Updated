import {StyleSheet} from 'react-native';
import {colors} from '../../../constants';
import {width} from 'react-native-dimension';

const styles = StyleSheet.create({
  subView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: width(1.5),
    marginHorizontal: width(3),
  },
  textStyle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cardNo: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: width(2),
  },
});

export default styles;
