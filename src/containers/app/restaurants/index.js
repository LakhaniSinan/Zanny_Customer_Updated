import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import Carousel from 'react-native-snap-carousel';

import {getMessaging} from '@react-native-firebase/messaging';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, icons} from '../../../assets';
import Category from '../../../components/categoryCard';
import CustomModal from '../../../components/customModal';
import HireCheifCard from '../../../components/hireChefCard';
import SectionHeader from '../../../components/sectionHeader';
import {Colors, colors} from '../../../constants';
import {helper} from '../../../helper';
import {handleFetchHomeData} from '../../../redux/slices/HomeData';

const Restaurants = ({navigation}) => {
  const dispatch = useDispatch();
  const carouselRef = useRef();
  const {user} = useSelector(state => state.LoginSlice);
  const [isLoading, setIsLoading] = useState(false);
  const {currentLocation} = useSelector(state => state.LocationSlice);
  const [searchQuery, setSearchQuery] = useState('');
  const {homeData} = useSelector(state => state.HomeDataSlice);
  console.log(currentLocation, 'homeDatahomeDatahomeDatahomeDatahomeData');
  // ✅ Custom Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: null,
    title: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  // ✅ SHOW "COMING SOON" MODAL
  const showComingSoon = () => {
    setModalData({
      Icon: null,
      title: '🚧 Feature Coming Soon',
      detail:
        'We’re working hard to bring this feature to you.\n\nPlease stay tuned — it will be available in an upcoming update!',
      buttonName: 'Got it',
      onPress: () => setModalVisible(false),
    });
    setModalVisible(true);
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const {cartData} = useSelector(state => state.CartSlice);

  useEffect(() => {
    getMessaging().onMessage(async data => {
      console.log(data, 'remoteMessageremoteMessageremoteMessage_accept');
      if (data?.data?.type == 'NewOrder') {
        helper.notificationCall(data?.data?.title, data?.data?.body);
      } else {
        helper.notificationCall(data?.data?.title, data?.data?.body);
      }
    });
  }, []);

  const getHomeData = async () => {
    setIsLoading(true);
    let data = {
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
    };
    await dispatch(handleFetchHomeData(data));
    setIsLoading(false);
  };

  const renderStars = useCallback((rating = 5) => {
    const rounded = Math.round(rating);
    return (
      <View style={styles.starContainer}>
        <Text style={styles.starText}>{rounded ? '★' : '☆'}</Text>
      </View>
    );
  }, []);

  const renderRecommendedItem = useCallback(
    ({item}) => {
      console.log(item, 'itemitemitemitemitemitemitem');

      return (
        <TouchableOpacity
          style={styles.recommendedCard}
          onPress={() =>
            navigation.navigate('ProductDetail', {
              data: item,
              productId: item?._id,
              type: 'normal',
            })
          }>
          <Image source={{uri: item?.image}} style={styles.foodImage} />

          <View style={styles.foodTextContainer}>
            <View style={styles.foodHeader}>
              <Text style={styles.foodName}>{item?.name}</Text>
              {item?.discount > 0 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.foodPrice}>£{item?.discount}</Text>

                  <Text
                    style={[
                      styles.foodPrice,
                      {
                        marginLeft: 6,
                        color: colors.gray,
                        textDecorationLine: 'line-through',
                      },
                    ]}>
                    £{item?.price}
                  </Text>
                </View>
              ) : (
                <Text style={styles.foodPrice}>£{item?.price}</Text>
              )}
            </View>

            <Text numberOfLines={2} style={styles.foodDetail}>
              {item?.description}
            </Text>

            <View style={styles.foodRatingRow}>
              {renderStars(5)}
              <Text style={styles.foodRatingText}>4.8 (120+) • 2.8km</Text>
            </View>

            <View style={styles.chefContainer}>
              <Image
                source={{uri: item?.merchantImage}}
                style={styles.chefImage}
              />
              <View style={{marginLeft: width(2)}}>
                <Text style={styles.chefLabel}>Chef</Text>

                <View style={styles.chefNameContainer}>
                  <Text style={styles.chefName}>{item?.merchantName}</Text>
                  <Image source={icons.objects} style={styles.objectsIcon} />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [renderStars],
  );

  // Banner Carousel
  const renderCarousel = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={{alignItems: 'center'}}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            data: item,
            productId: item?.productId,
            type: 'banner',
          })
        }>
        <ImageBackground
          source={{uri: item?.image}}
          style={styles.promoBanner}
          imageStyle={styles.promoImage}
        />
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Image source={icons.MagnifyingGlass} style={styles.searchIcon} />
          <TextInput
            placeholder="Search food"
            placeholderTextColor={Colors.gray}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search" // ✅ Show search button on keyboard
            onSubmitEditing={() => {
              if (searchQuery.trim() !== '') {
                navigation.navigate('AllFoodScreen', {search: searchQuery});
              }
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => navigation.navigate('AllVouchers')}>
          <Image source={icons.Ticket} style={styles.headerIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('CartScreen')}
          style={styles.headerIconButton}>
          <Image source={icons.ShoppingCart} style={styles.headerIcon} />
        </TouchableOpacity>
        {cartData?.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartData.length}</Text>
          </View>
        )}
      </View>

      {/* MAIN SCROLL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getHomeData}
            colors={[Colors.orange]}
          />
        }>
        {/* Banner Slider */}
        <View style={{}}>
          <Carousel
            ref={carouselRef}
            data={homeData?.banners || []}
            renderItem={renderCarousel}
            sliderWidth={width(100)}
            itemWidth={width(100)}
            loop
            autoplay
            autoplayInterval={5000}
            inactiveSlideOpacity={0.7}
            inactiveSlideScale={0.8}
            onSnapToItem={index => setActiveIndex(index)}
          />

          <View style={styles.paginationDots}>
            {(homeData?.banners || []).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      activeIndex === index ? Colors.white : 'gray',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Delivery Address */}
        <TouchableOpacity
          onPress={
            user
              ? () => navigation.navigate('Address')
              : () => navigation.navigate('Profile')
          }
          style={styles.addressContainer}>
          <View style={styles.addressLeft}>
            <View style={styles.addressIconContainer}>
              <Image
                source={icons.location}
                style={styles.addressIcon}
                resizeMode="contain"
              />
            </View>

            <View>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {currentLocation?.address || 'No address available'}
              </Text>
            </View>
          </View>

          <Image source={icons.CaretRight} style={styles.arrowIcon} />
        </TouchableOpacity>

        {/* Delicacies */}
        <View style={styles.sectionWrapper}>
          <SectionHeader
            name="Delicacies"
            action="See All"
            onPress={() => navigation.navigate('AllFoodScreen')}
            color={Colors.redish}
          />
        </View>

        <FlatList
          data={homeData?.products?.slice(0, 6) || []} // take first 6 items
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderRecommendedItem}
        />

        {/* Categories */}
        <View style={styles.sectionWrapper}>
          <SectionHeader
            name="Category"
            action="See All"
            onPress={() =>
              navigation.navigate('AllCategories', homeData?.foodCategories)
            }
          />

          <FlatList
            data={homeData?.foodCategories?.slice(0, 6) || []}
            renderItem={({item}) => (
              <Category
                item={item}
                onPress={item => navigation.navigate('AllFoodScreen', item)}
              />
            )}
            keyExtractor={item => item?.id}
            numColumns={3}
            columnWrapperStyle={styles.categoryRow}
          />
        </View>

        <View style={styles.sectionWrapper}>
          <SectionHeader
            name="Hire a Chef"
            action="See All"
            onPress={() => navigation.navigate('AllChefs')}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: width(3),
            paddingBottom: width(3),
            paddingRight: width(50),
            gap: width(3),
          }}>
          {homeData?.merchants?.map((item, index) => (
            <HireCheifCard
              key={item?._id || item?.id || index}
              item={item}
              handleHireChef={showComingSoon}
            />
          ))}
        </ScrollView>
        <CustomModal
          visible={modalVisible}
          Icon={modalData.Icon}
          name={modalData.title}
          detail={modalData.detail}
          buttonName={modalData.buttonName}
          onPress={modalData.onPress}
          close={() => setModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default memo(Restaurants);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},

  header: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: width(3),
  },

  searchContainer: {
    flex: 1,
    height: 44,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  searchIcon: {height: 24, width: 24, tintColor: Colors.gray},
  searchInput: {flex: 1, fontSize: 14, color: Colors.black},

  headerIconButton: {
    height: 44,
    width: 44,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIcon: {height: 24, width: 24},

  // Banner
  promoBanner: {
    width: width(95),
    height: width(45),
    borderRadius: 12,
    marginTop: 10,
  },

  promoImage: {borderRadius: 12},

  paginationDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // Address
  addressContainer: {
    marginTop: width(4),
    marginHorizontal: width(3),
    height: width(16),
    backgroundColor: Colors.clay,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  addressLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},

  addressIconContainer: {
    height: width(10),
    width: width(10),
    borderRadius: 50,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addressIcon: {height: width(5), width: width(5)},

  addressTitle: {fontFamily: fontFamily.poppinBold},
  addressText: {
    fontFamily: fontFamily.poppinRegular,
    color: Colors.graydark,
    fontSize: 12,
    width: width(60),
  },

  arrowIcon: {height: 20, width: 20},

  // Section Wrappers
  sectionWrapper: {paddingHorizontal: width(3), marginTop: width(4)},

  // Food Items
  recommendedCard: {
    width: width(65),
    marginHorizontal: 10,
    marginLeft: width(4),
  },

  foodImage: {width: '100%', height: 132, borderRadius: 12},

  foodTextContainer: {marginTop: 6},

  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },

  foodPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.redish,
  },

  foodDetail: {fontSize: 12, color: Colors.gray, marginTop: 4},

  foodRatingRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},

  starContainer: {flexDirection: 'row'},

  starText: {color: Colors.orange, fontSize: 15},

  foodRatingText: {
    fontSize: 12,
    color: Colors.graydark,
    marginLeft: 6,
  },

  // Chef Info
  chefContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  chefImage: {height: 34, width: 34, borderRadius: 17},

  chefLabel: {fontSize: 11, color: Colors.primaryOrange, fontWeight: '500'},

  chefNameContainer: {flexDirection: 'row', alignItems: 'center', gap: 4},
  chefName: {fontSize: 13, fontWeight: '600', color: Colors.black},

  objectsIcon: {height: 15, width: 15},

  // Category Grid
  categoryRow: {flexWrap: 'wrap', gap: 10},
  chefList: {paddingHorizontal: width(3), paddingBottom: width(4)},
  badge: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: colors.redish,
    width: width(4),
    height: width(4),
    borderRadius: width(2),
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.poppinBold,
  },
});
