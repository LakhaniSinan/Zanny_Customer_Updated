import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {icons} from '../../assets';
import {Colors} from '../../constants';
import PrimaryButton from '../primaryButton';

const HireCheifCard = ({item, handleHireChef}) => {
  const coverImage = item?.merchantImage || item?.profilePhoto;
  const displayName = item?.name || 'Chef';

  return (
    <View style={styles.card}>
      <Image
        source={{uri: coverImage}}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.profileWrapper}>
        <Image
          source={{uri: coverImage}}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.nameText}>
            {displayName}
          </Text>
          <Image source={icons.objects} style={styles.badgeIcon} />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>
            5.0
          </Text>
          <Text style={styles.statLabel}>Customer Service</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>
            100%
          </Text>
          <Text style={styles.statLabel}>Response Rate</Text>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <PrimaryButton
          name={'Hire'}
          onPress={() => handleHireChef?.(item)}
        />
      </View>
    </View>
  );
};

export default HireCheifCard;

const styles = StyleSheet.create({
  card: {
    height: 280,
    maxWidth: 180,
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 19,
    paddingBottom: width(3),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  coverImage: {
    width: '100%',
    height: 102,
  },
  profileWrapper: {
    borderRadius: 100,
    borderWidth: 3,
    width: 73,
    position: 'absolute',
    top: 65,
    left: 53,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
  },
  profileImage: {
    height: 68,
    width: 68,
    borderRadius: 100,
  },
  content: {
    marginTop: 42,
    alignItems: 'center',
    paddingHorizontal: width(2),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '100%',
  },
  nameText: {
    maxWidth: width(21),
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  badgeIcon: {
    height: 14,
    width: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 17,
    alignSelf: 'center',
    marginTop: 15,
    alignItems: 'center',
  },
  statBlock: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '400',
    color: Colors.gray,
  },
  divider: {
    height: 30,
    borderWidth: 1,
    borderColor: Colors.softgray,
  },
  buttonWrapper: {
    height: width(10),
    width: '100%',
    marginTop: width(2),
    paddingHorizontal: width(3),
  },
});
