import { StyleSheet } from 'react-native';
import { height, width } from 'react-native-dimension';
import { colors } from './../../../constants/index';

const styles = StyleSheet.create({
  image: {
    height: height(34),
    width: width(100),
    marginBottom: 15,
    elevation: 10,
    resizeMode: 'contain',
    borderBottomRightRadius: 150 / 8,
    borderBottomLeftRadius: 150 / 8,
  },
  text: {
    color: 'grey',
  },

  headingview: {
    marginVertical: height(2),
  },

  productname: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  pricestyle: {
    marginLeft: width(12),
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    width: '25%',
  },
  discriptionstyle: {
    marginLeft: width(2),
    fontSize: 14,
    color: 'black',
  },
  categoryview: {
    marginHorizontal: width(3),
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
    marginVertical: height(2),
  },
  categorystyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textstyle: {
    marginLeft: width(5),
    fontSize: 17,
    color: 'black',
    fontWeight: '500',
  },
  categtext: {
    marginLeft: width(18),
    fontSize: 16,
    color: 'black',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: width(1),
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Cart Style

  cardview: {
    backgroundColor: 'white',
    marginHorizontal: width(3),
    marginTop: width(4),
    borderRadius: 8,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 30,
  },
  innerview: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginTop: width(2),
  },
  imgview: {
    flexWrap: 'wrap',
    width: '30%',
    marginLeft: '4%',
    marginTop: '4%',
    marginBottom: '4%',
  },
  img: {
    height: height(12),
    width: width(25),
    borderRadius: 10,
  },
  txtview: {
    width: '60%',
    marginLeft: '4%',
  },
  nameview: {
    flexDirection: 'row',
  },
  txtname: {
    fontSize: 14,
    color: colors.yellow,
    flexWrap: 'wrap',
    width: '80%',
  },

  txtstyle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
    width: '40%',
  },
  txtdate: {
    color: 'black',
    marginLeft: '4%',
    marginBottom: '4%',
  },
  btnview: {
    backgroundColor: colors.pinkColor,
    marginLeft: '34%',
    borderRadius: 10,
    padding: 2,
    marginTop: '2%',
    width: '80%',
  },
  btntxt: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
  quantity: {
    color: 'black',
  },

  innerview: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginTop: width(2),
  },
  imgview: {
    flexWrap: 'wrap',
    width: '30%',
    marginLeft: '4%',
    marginTop: '4%',
    marginBottom: '4%',
  },
  img: {
    height: height(12),
    width: width(25),
    borderRadius: 10,
  },

  // Cart Calculation Style

  subtotal: {
    flexDirection: 'row',
    marginTop: width(5),
    justifyContent: 'space-between',
  },
  subtotalText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  subtotalPrice: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  deliveryfee: {
    flexDirection: 'row',
    marginTop: width(5),
    justifyContent: 'space-between',
  },
  total: {
    flexDirection: 'row',
    marginTop: width(5),
    justifyContent: 'space-between',
  },
  deliveryfeeText: {
    color: 'black',
    fontSize: 14,
  },
  deliveryfeePrice: {
    color: 'black',
    fontSize: 14,
    marginRight: width(2),
  },

  // Order Sumary Style

  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    marginTop: width(3),
    paddingVertical: 10,
    marginHorizontal: width(3),
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  heading: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: width(2),
  },
});

export default styles;
