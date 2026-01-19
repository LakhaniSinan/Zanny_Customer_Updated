import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {width} from 'react-native-dimension';

const RestaurantsSkeleton = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.searchSkeleton} />
        <View style={styles.iconSkeleton} />
        <View style={styles.iconSkeleton} />
      </View>

      {/* BANNER */}
      <View style={styles.bannerSkeleton} />

      {/* DELIVERY ADDRESS */}
      <View style={styles.addressSkeleton}>
        <View style={styles.addressIconSkeleton} />
        <View style={{flex: 1, marginLeft: 12}}>
          <View style={styles.addressLineSkeleton} />
          <View style={styles.addressLineSkeleton} />
        </View>
      </View>

      {/* DELICACIES SECTION */}
      <View style={styles.sectionHeaderSkeleton} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginTop: 10}}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={styles.recommendedCardSkeleton}>
            <View style={styles.foodImageSkeleton} />
            <View style={{marginTop: 6}}>
              <View style={styles.foodLineSkeleton} />
              <View
                style={[styles.foodLineSkeleton, {width: '40%', marginTop: 4}]}
              />
              <View
                style={[styles.foodLineSkeleton, {height: 12, marginTop: 4}]}
              />
              <View
                style={[
                  styles.foodLineSkeleton,
                  {width: '50%', height: 12, marginTop: 4},
                ]}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* CATEGORIES SECTION */}
      <View style={[styles.sectionHeaderSkeleton, {marginTop: 20}]} />
      <View style={styles.categoryRow}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.categoryCardSkeleton} />
        ))}
      </View>

      {/* CHEF CARDS */}
      <View style={[styles.sectionHeaderSkeleton, {marginTop: 20}]} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginTop: 10, paddingLeft: width(3)}}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={styles.hireChefSkeleton} />
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export default RestaurantsSkeleton;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: width(3),
    marginTop: 16,
    gap: 12,
  },
  searchSkeleton: {
    flex: 1,
    height: 44,
    borderRadius: 100,
    backgroundColor: '#E0E0E0',
  },
  iconSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E0E0',
  },
  bannerSkeleton: {
    width: width(95),
    height: width(45),
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginTop: 10,
  },
  addressSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width(4),
    marginHorizontal: width(3),
    height: width(16),
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
  },
  addressIconSkeleton: {
    width: width(10),
    height: width(10),
    borderRadius: width(5),
    backgroundColor: '#C0C0C0',
  },
  addressLineSkeleton: {
    width: '80%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#C0C0C0',
    marginBottom: 4,
  },
  sectionHeaderSkeleton: {
    width: '30%',
    height: 20,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginTop: 20,
    marginLeft: width(3),
  },
  recommendedCardSkeleton: {
    width: width(65),
    marginHorizontal: 10,
  },
  foodImageSkeleton: {
    width: '100%',
    height: 132,
    borderRadius: 12,
    backgroundColor: '#C0C0C0',
  },
  foodLineSkeleton: {
    width: '60%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: width(3),
    marginTop: 10,
  },
  categoryCardSkeleton: {
    width: width(28),
    height: width(28),
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  hireChefSkeleton: {
    width: width(40),
    height: width(50),
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
});
