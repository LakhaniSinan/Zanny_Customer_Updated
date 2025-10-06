import {StyleSheet} from 'react-native';
import {height, width} from 'react-native-dimension';
import {colors} from './../../../constants/index';

const profileStyles = StyleSheet.create({
  cardStyle: {
    backgroundColor: 'white',
    marginVertical: width(2),
    paddingVertical: width(6),
    marginHorizontal: width(1),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width(3),
    elevation:5,
  },
  iconStyle: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orangeColor,
    borderRadius: 200,
  },
});

export default profileStyles;
