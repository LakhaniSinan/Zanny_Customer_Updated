import {StyleSheet} from 'react-native';
import {height, width} from 'react-native-dimension';
import {colors} from '../../../constants/index';

const styles = StyleSheet.create({
  mainvie: {
    flex: 1,
  },

  imageStyle: {
    height: height(25),
    width: width(100),
    borderRadius: 1,
  },
  orderheading: {
    marginLeft: '3%',
    marginTop: '3%',
    marginRight: '3%',
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  subheading: {
    color: 'black',
    width: '40%',
  },
  ordertxtview: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: width(2),
    marginBottom: width(2),
    marginHorizontal: '3%',
  },
  borderstyle: {
    borderBottomWidth: 0.5,
    borderColor: 'grey',
  },

  oredernotxt: {
    marginTop: '2%',
    color: 'black',
    fontWeight: '700',
    backgroundColor: 'grey',
    borderRadius: 30,
    opacity: 0.6,
    textAlign: 'center',
    paddingLeft: '4%',
    paddingRight: '4%',
    width: '40%',
    marginLeft: '20%',
  },
  orderfromtxt: {
    marginTop: '2%',
    color: colors.yellow,
    fontWeight: '700',
    width: '60%',
    textAlign: 'right',
  },
  deliverytxt: {
    marginTop: '2%',
    color: 'black',
    fontWeight: '600',
    width: '58%',
    flexWrap: 'wrap',
    textAlign: 'right',
  },
  pricetxt: {
    color: 'grey',
    fontWeight: '600',
    width: '65%',
    textAlign: 'right',
    flexWrap: 'wrap',
    fontSize: 14,
    paddingRight: 15,
  },
  totaltxt: {
    color: 'black',
    paddingTop: '2%',
    width: '40%',
    fontWeight: '700',
    fontSize: 17,
  },
  subtotaltxt: {
    color: 'black',
    paddingTop: '2%',
    width: '40%',
    fontWeight: '700',
    fontSize: 17,
  },
  btnview: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: '4%',
  },
});

export default styles;