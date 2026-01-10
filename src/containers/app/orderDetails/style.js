import {StyleSheet} from 'react-native';
import {height, width} from 'react-native-dimension';
import {colors} from '../../../constants/index';
import {fontFamily} from '../../../assets';

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
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
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
    paddingHorizontal: width(2),
    paddingVertical: width(1),
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
  // New styles for updated UI
  statusBanner: {
    paddingVertical: width(5),
    paddingHorizontal: width(4),
    marginHorizontal: width(4),
    marginTop: width(2),
    position: 'relative',
    overflow: 'hidden',
    borderRadius: width(4),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: width(4),
    paddingVertical: width(2),
    borderRadius: 999,
    marginBottom: width(2.5),
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: fontFamily.poppinBold,
  },
  deliveryDateTime: {
    color: 'white',
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
  },
  orderCard: {
    marginHorizontal: width(4),
    marginTop: width(3),
    paddingVertical: width(4),
    paddingHorizontal: width(4),
    borderRadius: width(2),
    overflow: 'hidden',
  },
  orderCardImage: {
    borderRadius: width(2),
    resizeMode: 'cover',
  },
  orderNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width(3),
  },
  orderNumberLabel: {
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: 'black',
    marginRight: width(2),
  },
  orderNumberText: {
    fontSize: 14,
    fontFamily: fontFamily.poppinBold,
    color: 'black',
  },
  orderItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: width(3),
    marginBottom: width(3),
  },
  orderItemImage: {
    width: width(22),
    height: width(22),
    borderRadius: width(1.5),
    marginRight: width(3),
  },
  orderItemDetails: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  orderItemName: {
    fontSize: 15,
    fontFamily: fontFamily.poppinBold,
    color: 'black',
    marginBottom: width(1),
  },
  orderItemPrice: {
    fontSize: 15,
    fontFamily: fontFamily.poppinBold,
    color: '#FF0000',
    marginBottom: width(0.5),
  },
  orderItemQty: {
    fontSize: 13,
    fontFamily: fontFamily.poppinRegular,
    color: '#808080',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: width(2),
  },
  chefSection: {
    marginTop: width(4),
    marginBottom: width(3),
  },
  chefLabel: {
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: 'black',
    marginBottom: width(2),
  },
  chefInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefProfileImage: {
    width: width(14),
    height: width(14),
    borderRadius: width(7),
    marginRight: width(2.5),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chefName: {
    fontSize: 15,
    fontFamily: fontFamily.poppinBold,
    color: 'black',
    flex: 1,
  },
  chefCheckIcon: {
    width: width(5),
    height: width(5),
    tintColor: '#FF0000',
  },
  deliveryAddressContainer: {
    marginTop: width(3),
    backgroundColor: '#F5F5F5',
    padding: width(3.5),
    borderRadius: width(2.5),
  },
  deliveryAddressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width(2),
  },
  locationIcon: {
    width: width(5),
    height: width(5),
    tintColor: '#FF0000',
    marginRight: width(2),
  },
  deliveryAddressLabel: {
    fontSize: 14,
    fontFamily: fontFamily.poppinBold,
    color: 'black',
  },
  deliveryAddressText: {
    fontSize: 13,
    fontFamily: fontFamily.poppinRegular,
    color: 'black',
    marginLeft: width(7),
    lineHeight: 20,
  },
  costBreakdownContainer: {
    marginTop: width(4),
    marginBottom: width(3),
    paddingVertical: width(2),
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: width(1),
    paddingHorizontal: width(1),
  },
  costLabel: {
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: 'black',
  },
  costValue: {
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: '#808080',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: width(2.5),
    marginHorizontal: width(1),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width(1),
    marginTop: width(1),
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fontFamily.poppinBold,
    color: 'black',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: fontFamily.poppinBold,
    color: 'black',
  },
  receiptEdge: {
    height: 15,
    marginTop: width(3),
    marginHorizontal: width(1),
    borderBottomWidth: 2,
    borderBottomColor: '#D0D0D0',
    borderStyle: 'dashed',
  },
  bottomButtonContainer: {
    paddingHorizontal: width(4),
    paddingVertical: width(3),
    paddingBottom: width(4),
    backgroundColor: 'white',
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: width(4),
    paddingVertical: width(2),
    borderRadius: width(100),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#DDDECF',
  },

  addressIconContainer: {
    height: width(10),
    width: width(10),
    borderRadius: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addressIcon: {height: width(5), width: width(5)},

  addressTitle: {fontFamily: fontFamily.poppinBold},
  addressText: {
    fontFamily: fontFamily.poppinRegular,
    color: colors.graydark,
    fontSize: 12,
    width: width(60),
  },

  arrowIcon: {height: 20, width: 20},
});

export default styles;
