import React from 'react';
import {View, StyleSheet} from 'react-native';
import {width} from 'react-native-dimension';
import { colors } from '../../constants';

const HistoryCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.imageSkeleton} />

        <View style={{flex: 1, marginLeft: width(3)}}>
          <View style={styles.lineShort} />

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
            <View style={styles.lineSmall} />
            <View style={[styles.lineTiny, {marginLeft: 8}]} />
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
            <View style={styles.lineTiny} />
            <View style={[styles.statusSkeleton, {marginLeft: 8}]} />
          </View>

          <View style={[styles.buttonSkeleton, {marginTop: 10}]} />
        </View>
      </View>

      <View style={{marginTop: width(4)}}>
        <View style={styles.lineTiny} />

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
          <View style={styles.merchantImageSkeleton} />
          <View style={{marginLeft: 8, flex: 1}}>
            <View style={styles.lineTiny} />
            <View style={[styles.lineShort, {marginTop: 4}]} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryCardSkeleton;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    marginHorizontal: width(4),
    paddingVertical: width(2),
    marginTop: width(4),
    borderRadius: width(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  imageSkeleton: {
    width: width(35),
    height: width(35),
    borderRadius: width(3),
    backgroundColor: '#E0E0E0',
  },
  lineShort: {
    width: '60%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginBottom: 6,
  },
  lineSmall: {
    width: '20%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  lineTiny: {
    width: '15%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  statusSkeleton: {
    width: 60,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#C0C0C0',
  },
  buttonSkeleton: {
    width: width(45),
    height: width(10),
    borderRadius: width(2),
    backgroundColor: '#C0C0C0',
  },
  merchantImageSkeleton: {
    width: width(9),
    height: width(9),
    borderRadius: width(4.5),
    backgroundColor: '#E0E0E0',
  },
});
