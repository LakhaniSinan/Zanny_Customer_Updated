import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {height, width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {fontFamily, icons, images} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import BackButton from '../../../components/backIcon';
import ChefsCard from '../../../components/chefsCard';
import AppHeader from '../../../components/headerComponent';
import PrimaryButton from '../../../components/primaryButton';
import {colors, Colors} from '../../../constants';
import {getMerchantProAndDetails} from '../../../services/merchant';
import ReviewsCard from '../../../components/reviewsCard';

const CustomRating = ({rating = 0, starSize = 12, maxStars = 5}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const starWidth = width(starSize / 4);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {[...Array(maxStars)].map((_, index) => {
        if (index < fullStars) {
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
              }}
              resizeMode="contain"
            />
          );
        } else if (index === fullStars && hasHalfStar) {
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
                opacity: 0.6,
              }}
              resizeMode="contain"
            />
          );
        } else {
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
                opacity: 0.2,
              }}
              resizeMode="contain"
            />
          );
        }
      })}
    </View>
  );
};

const AboutChef = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {user} = useSelector(state => state.LoginSlice);
  const [mealsFromMerchant, setMealsFromMerchant] = useState([]);
  const [activeTab, setActiveTab] = useState('About');
  const chefData = route?.params;
  console.log(
    mealsFromMerchant,
    'chefDatachefDatachefDatachefDatachefDatachefData',
  );
  useEffect(() => {
    fetchMerchantDetails();
  }, []);

  const fetchMerchantDetails = async () => {
    // setIsLoading(true);
    try {
      const response = await getMerchantProAndDetails(chefData?._id, user?._id);

      if (response.status === 200 || response.status === 201) {
        setMealsFromMerchant(response?.data?.products);
      }
    } catch (error) {
      console.error('Fetch merchant details error:', error);
    } finally {
      // setIsLoading(false);
    }
  };
  const calculateRating = () => {
    if (chefData?.reviews && chefData?.reviews.length > 0) {
      const totalRating = chefData?.reviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0,
      );
      return (totalRating / chefData?.reviews.length).toFixed(1);
    }
    return '4.8';
  };

  const rating = calculateRating();
  const reviewCount = chefData?.reviews?.length || 120;

  // Prepare highlights data from food images
  const highlightsData =
    chefData?.foodImages?.map((image, index) => ({
      id: index.toString(),
      image: image,
      name: `Caramello Sp${index + 1}`,
    })) || [];

  const renderTabContent = () => {
    if (activeTab === 'About') {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}>
          {/* About Chef Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Chef</Text>
            <Text style={styles.description}>
              {chefData?.additionalInfo ||
                'With years of experience in top restaurants and catering for celebrities, this chef brings exceptional culinary expertise to every dish. Known for creating unforgettable dining experiences that blend traditional techniques with modern innovation.'}
            </Text>
          </View>

          {/* Availability Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Text style={styles.availabilityText}>
              {chefData?.availability || 'Monday, Tuesday, Saturday, Sunday'}
            </Text>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <View style={styles.detailRow}>
              <Image
                source={icons.location}
                style={styles.detailIcon}
                resizeMode="contain"
              />
              <Text style={styles.detailText}>
                {chefData?.address?.split(' ').slice(-2).join(' ') ||
                  'London, LN.'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Image
                source={icons.Crown}
                style={styles.detailIcon}
                resizeMode="contain"
              />
              <Text style={styles.detailText}>
                Serving {chefData?.cateringCapacity || '23 people'} at a time
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Image
                source={icons.foodIcon}
                style={styles.detailIcon}
                resizeMode="contain"
              />
              <Text style={styles.detailText}>
                Category {chefData?.foodType || 'American meal'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Image
                source={icons.package}
                style={styles.detailIcon}
                resizeMode="contain"
              />
              <Text style={styles.detailText}>
                Work Culture{' '}
                {chefData?.serviceOffered || 'Home cooking and Event'}
              </Text>
            </View>

            {chefData?.isDelivery && (
              <View style={styles.detailRow}>
                <Image
                  source={icons.map}
                  style={styles.detailIcon}
                  resizeMode="contain"
                />
                <Text style={styles.detailText}>
                  Travel Available to Travel
                </Text>
              </View>
            )}
          </View>

          {/* Highlights Section */}
          <View style={styles.section}>
            <View style={styles.highlightsHeader}>
              <Text style={styles.sectionTitle}>Highlights</Text>
              <TouchableOpacity>
                <Text style={styles.watchAllText}>Watch all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={highlightsData}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (
                <View style={styles.highlightCardWrapper}>
                  <ChefsCard item={item} />
                  {index === 1 && (
                    <View style={styles.playIconOverlay}>
                      <Image
                        source={icons.positive}
                        style={styles.playIcon}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </View>
              )}
              contentContainerStyle={styles.highlightsList}
            />
          </View>
        </ScrollView>
      );
    } else if (activeTab === 'Portfolio') {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}>
          <Text
            style={{
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 16,
              color: colors.redish,
              marginTop: width(2),
            }}>
            Meals from this chef
          </Text>
          {mealsFromMerchant.map(item => {
            return (
              <View
                style={{
                  marginVertical: width(2),
                  padding: width(3),
                  backgroundColor: colors.white,
                  borderRadius: width(2),
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.grayyy,
                }}>
                {/* Top Row: Image + Details */}
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                  <Image
                    source={{uri: item?.image}}
                    style={{
                      height: width(30),
                      width: width(30),
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                  <View style={{flex: 1, marginLeft: width(3)}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: fontFamily.poppinBold,
                        color: colors.redish,
                      }}>
                      {item?.name}
                    </Text>

                    {/* Rating */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 4,
                        gap: 4,
                      }}>
                      <Image
                        source={icons.yellowStar}
                        style={{height: width(3), width: width(3)}}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fontFamily.poppinRegular,
                        }}>
                        4.8 (120+)
                      </Text>
                    </View>

                    {/* Price & Time */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 6,
                        gap: 10,
                      }}>
                      <Text
                        style={{
                          fontFamily: fontFamily.poppinBold,
                          color: colors.red,
                        }}>
                        {item?.price}
                      </Text>
                      {item?.discount > 0 && (
                        <Text
                          style={{
                            fontFamily: fontFamily.poppinBold,
                            fontSize: 12,
                            textDecorationLine: 'line-through',
                            color: colors.grey,
                          }}>
                          {item?.discount}
                        </Text>
                      )}
                      <Image
                        source={icons.clock}
                        style={{height: width(3), width: width(3)}}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fontFamily.poppinRegular,
                          color: colors.grey,
                        }}>
                        20 mins
                      </Text>
                    </View>

                    {/* Buttons */}
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: width(2),
                      }}>
                      <View style={{width: width(20)}}>
                        <ActionBuuton
                          bgcColor={colors.redish}
                          fontColor={colors.white}
                          fontSize={8}
                          height={width(8)}
                          name="View Details"
                          onPress={() =>
                            navigation.navigate('ProductDetail', {
                              data: item,
                              productId: item?.foodId?._id || item._id,
                              type: 'normal',
                            })
                          }
                        />
                      </View>
                      <View style={{width: width(20)}}>
                        <ActionBuuton
                          bgcColor={colors.white}
                          fontSize={8}
                          fontColor={colors.black}
                          height={width(8)}
                          name="Add to cart"
                          // onPress={() => handleAddToCart(item)}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Heart & Share Icons */}
                  <View
                    style={{
                      marginLeft: 8,
                      alignItems: 'center',
                      gap: 5,
                      marginBottom: 5,
                    }}>
                    <BackButton
                      icon={item.isFav ? icons.fillHeart : icons.heartBrown}
                      border={1}
                      // onPress={() => onFavPress(item)}
                    />
                    <BackButton
                      icon={icons.share}
                      border={1}
                      // onPress={() => handleShareProduct(item)}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      );
    } else {
      return (
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
          renderItem={({item, index}) => {
            return <ReviewsCard item={item} index={index} />;
          }}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader text="Hire Chef" goBack={true} cartIcon={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri:
                chefData?.foodImages?.[0] ||
                'https://res.cloudinary.com/dcmawlfn2/image/upload/v1760717718/dahd2hfgj0uwe5ecqipo.png',
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.profileImageContainer}>
            <Image
              source={{uri: chefData?.merchantImage}}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Chef Info Section */}
        <View style={styles.chefInfoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.chefName}>{chefData?.name}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          </View>

          {/* Cuisine Tags */}
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>British</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>American</Text>
            </View>
            {chefData?.isTopChef && (
              <View style={[styles.tag, styles.michelinTag]}>
                <Text style={styles.tagText}>Michelin star</Text>
              </View>
            )}
          </View>

          {/* Rating and Distance */}
          <View style={styles.ratingRow}>
            <Image
              source={icons.yellowStar}
              style={styles.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.ratingText}>
              {rating} ({reviewCount}+) 2.8 km away
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['About', 'Portfolio', 'Reviews'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <View style={styles.hireButton}>
          <PrimaryButton
            name="Hire"
            onPress={() => {
              // Handle hire action
              navigation.navigate('HireChefScreen');
            }}
            fontSize={16}
          />
        </View>
        <View style={styles.subscribeButton}>
          <ActionBuuton
            name="Subscribe 👑"
            fontColor={Colors.black}
            bgcColor={Colors.white}
            onPress={() => {
              // Handle subscribe action
            }}
            height={width(12)}
            fontSize={16}
            styleProps={{
              borderWidth: 1,
              borderColor: Colors.black,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AboutChef;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: width(25),
  },
  bannerContainer: {
    height: height(25),
    position: 'relative',
    marginBottom: width(8),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -width(6),
    alignSelf: 'center',
    width: width(24),
    height: width(24),
    borderRadius: width(12),
    borderWidth: 4,
    borderColor: Colors.white,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  chefInfoContainer: {
    alignItems: 'center',
    paddingTop: width(8),
    paddingHorizontal: width(5),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width(2),
  },
  chefName: {
    fontSize: 20,
    fontFamily: fontFamily.poppinBold,
    color: Colors.black,
    marginRight: width(2),
  },
  verifiedBadge: {
    width: width(5),
    height: width(5),
    borderRadius: width(2.5),
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: width(2),
    gap: width(2),
  },
  tag: {
    backgroundColor: '#FAF1EC',
    borderRadius: 100,
    paddingHorizontal: width(3),
    paddingVertical: width(1),
    borderWidth: 1,
    borderColor: colors.warn,
  },
  michelinTag: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  tagText: {
    fontSize: 10,
    fontFamily: fontFamily.poppinRegular,
    color: '#50555C',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width(1),
  },
  starIcon: {
    height: width(3),
    width: width(3),
    marginRight: width(1),
  },
  ratingText: {
    fontSize: 12,
    fontFamily: fontFamily.poppinRegular,
    color: Colors.black,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: width(2),
    marginTop: width(4),
  },
  tab: {
    flex: 1,
    paddingVertical: width(2),
    alignItems: 'center',
    marginHorizontal: width(1),
    borderRadius: 100,
    backgroundColor: colors.softgray,
  },
  activeTab: {
    backgroundColor: colors.redish,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fontFamily.poppinSemiBold,
    color: Colors.black,
  },
  activeTabText: {
    fontFamily: fontFamily.poppinBold,
    color: Colors.white,
  },
  tabContent: {
    padding: width(2),
  },
  section: {
    marginTop: width(2),
    marginBottom: width(5),
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.poppinBold,
    color: Colors.black,
    marginBottom: width(2),
  },
  description: {
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: Colors.gray,
    lineHeight: 22,
  },
  availabilityText: {
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: Colors.black,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width(3),
  },
  detailIcon: {
    height: width(5),
    width: width(5),
    marginRight: width(3),
    tintColor: Colors.black,
  },
  detailText: {
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: Colors.black,
    flex: 1,
  },
  highlightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width(3),
  },
  watchAllText: {
    fontSize: 14,
    fontFamily: fontFamily.poppinRegular,
    color: colors.red,
  },
  highlightsList: {
    paddingRight: width(5),
  },
  highlightCardWrapper: {
    position: 'relative',
  },
  playIconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -width(3)}, {translateY: -width(3)}],
    width: width(6),
    height: width(6),
    borderRadius: width(3),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  playIcon: {
    width: width(4),
    height: width(4),
    tintColor: Colors.white,
  },
  comingSoonText: {
    fontSize: 16,
    fontFamily: fontFamily.poppinRegular,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: width(10),
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: width(5),
    paddingVertical: width(4),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: width(3),
  },
  hireButton: {
    flex: 1,
    height: width(12),
  },
  subscribeButton: {
    flex: 1,
  },
});
