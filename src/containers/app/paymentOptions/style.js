import {StyleSheet} from 'react-native';
import {colors} from '../../../constants';
import {width} from 'react-native-dimension';

const styles = StyleSheet.create({
  // ----------------------------------------
  // Generic
  // ----------------------------------------
  subView: {
    flexDirection: 'row',
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

  // ----------------------------------------
  // Payment Method Row
  // ----------------------------------------
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width(3),
    paddingHorizontal: width(4),
  },
  iconWrapper: {
    width: width(10),
    height: width(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  methodIcon: {
    height: width(7),
    width: width(7),
  },

  methodLabel: {
    flex: 1,
    marginLeft: width(3),
    fontSize: 16,
    color: colors.black,
    fontWeight: '600',
  },

  // ----------------------------------------
  // Radio Styles (Reusable)
  // ----------------------------------------
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: colors.yellow,
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.yellow,
  },

  // ----------------------------------------
  // Cards List Row
  // ----------------------------------------
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width(2),
    marginVertical: width(2),
    width: '100%',
  },

  cardBox: {
    width: width(88),
    borderRadius: 8,
    elevation: 5,
    marginRight: width(2),
    backgroundColor: colors.orangeColor,
  },

  radioWrap: {
    borderWidth: 0.6,
    borderRadius: 50,
    padding: 4,
  },

  radioSmall: {
    height: width(3),
    width: width(3),
    borderRadius: 50,
  },

  // ----------------------------------------
  // Extra UI
  // ----------------------------------------
  noCardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noCardText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.black,
    marginBottom: width(2),
    textAlign: 'center',
  },

  addCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: width(3),
    marginTop: width(4),
    paddingVertical: width(2),
  },

  codBtn: {
    width: width(88),
    backgroundColor: colors.orangeColor,
    borderRadius: 8,
    paddingVertical: width(4),
    alignSelf: 'center',
    marginTop: width(5),
    elevation: 5,
  },

  codText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default styles;
