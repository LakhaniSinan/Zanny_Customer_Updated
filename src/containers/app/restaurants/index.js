import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
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
import { width } from 'react-native-dimension';
import Carousel from 'react-native-snap-carousel';
import { icons, images } from '../../../assets';
import Category from '../../../components/categoryCard';
import HireCheifCard from '../../../components/hireChefCard';
import SectionHeader from '../../../components/sectionHeader';
import { Colors } from '../../../constants';
import { getHomeData } from '../../../services/home';

const Restaurants = ({ navigation }) => {
  const carouselRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [homeData, setHomedata] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const chefs = [
    {
      id: '1',
      thumnail: images.veggie,
      cheifProfileImage: images.cheif,
      cheifName: 'Leanne Wayne',
      place: 'American. Californian',
      services: '3.7',
      rating: '91%',
    },
    {
      id: '2',
      thumnail: images.veggie,
      cheifProfileImage: images.cheif,
      cheifName: 'Leanne Wayne',
      place: 'American. Californian',
      services: '3.7',
      rating: '91%',
    },
  ];

  useEffect(() => {
    handleFetchHomeData();
  }, []);

  const handleFetchHomeData = async () => {
    try {
      setIsLoading(true);
      const response = await getHomeData();
      if (response.status == 200 || response.status == 201) {
        setHomedata(response?.data?.data);
      } else {
        Alert.alert('Error', 'Some thing went wrrong');
      }
    } catch (error) {
      console.log(error, 'Home Data Error');
    } finally {
      setIsLoading(false);
    }
  };
  const renderStars = rating => {
    const rounded = Math.round(rating);
    const stars = [];

    for (let i = 1; i <= 1; i++) {
      stars.push(
        <Text key={i} style={{ fontSize: 14, color: Colors.orange }}>
          {i <= rounded ? '★' : '☆'}
        </Text>,
      );
    }

    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const renderRecommendedItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ width: width(65), marginHorizontal: 10, marginLeft: width(4) }}
        onPress={() => navigation.navigate('ProductDetail',
          { data: item, productId: item._id, type: "normal" })}
      >
        <Image source={{ uri: item?.image }} style={styles.foodImage} />
        <View style={styles.foodTextContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.foodName}>{item?.name}</Text>
            <Text style={styles.foodPrice}>£{item?.price}</Text>
          </View>

          <Text numberOfLines={2} style={styles.foodDetail}>
            {item?.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {renderStars(5 || 0)}
            <Text
              style={{
                fontSize: 12,
                color: Colors.graydark,
                marginLeft: width(2),
              }}>
              4.8 (120+) 2.8 km away
            </Text>
          </View>
          <View style={styles.chefContainer}>
            <Image
              source={{ uri: item?.merchantImage }}
              style={styles.chefImage}
              resizeMode="cover"
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.chefLabel}>Chef</Text>
              <View style={styles.chefNameContainer}>
                <Text style={styles.chefName}>{item?.merchantName}</Text>
                <Image
                  source={icons.objects}
                  style={styles.objectsIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCarousel = useCallback(
    ({ item }) => {
      console.log(item, "itemitemitemitemitem_CAARRASD");

      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail',
            { data: item, productId: item.productId, type: "banner" })}
        >
          <ImageBackground
            source={{ uri: item?.image }}
            style={styles.promoBanner}
            imageStyle={styles.promoImage}>
            {/* {item?.discountedPrice > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discountedPrice}% OFF</Text>
          </View>
        )} */}

            {/* <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>
            Let's grab your breakfast promo!
          </Text>
          <View style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Order Now</Text>
          </View>
        </View> */}
          </ImageBackground>
        </TouchableOpacity>
      )
    },
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Image source={icons.MagnifyingGlass} style={styles.searchIcon} />
          <TextInput
            placeholder="Search food"
            placeholderTextColor={Colors.gray}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.headerIconButton}>
          <Image source={icons.Ticket} style={styles.headerIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ShoppingCart')}
          style={styles.headerIconButton}>
          <Image source={icons.ShoppingCart} style={styles.headerIcon} />
        </TouchableOpacity>


      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleFetchHomeData}
            colors={[Colors.orange]}
            tintColor={Colors.orange}
          />
        }>
        <View style={{}}>
          <Carousel
            ref={carouselRef}
            data={homeData?.banners || []}
            renderItem={renderCarousel}
            sliderWidth={width(100)}
            itemWidth={width(100)}
            inactiveSlideOpacity={0.7}
            inactiveSlideScale={0.5}
            loop
            autoplay
            autoplayInterval={5000}
            onSnapToItem={index => {
              setActiveIndex(index);
            }}
          />
          <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              {homeData?.banners?.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 5,
                    backgroundColor:
                      activeIndex === index ? Colors.white : 'gray',
                  }}
                />
              ))}
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: width(3) }}>
          <SectionHeader
            name="Delicacies"
            action="See All"
            onPress={() => navigation.navigate('AllFoodScreen')}
            color={Colors.redish}
          />
        </View>

        <FlatList
          data={homeData?.products || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderRecommendedItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingRight: width(4) }}
        />
        <View style={{ paddingHorizontal: width(3) }}>
          <SectionHeader name="Category" action="See All" />
          <FlatList
            data={homeData?.foodCategories}
            renderItem={({ item }) => <Category item={item} />}
            keyExtractor={item => item.id}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.categoryList}
          />
        </View>
        <View style={{ paddingHorizontal: width(3) }}>
          <SectionHeader name="Hire a Chef" action="See All" />
        </View>
        <FlatList
          data={chefs}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <HireCheifCard item={item} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          contentContainerStyle={{
            paddingHorizontal: width(3),
            paddingBottom: width(4),
            flexGrow: 1,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default memo(Restaurants);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 12,
    marginTop: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    height: 44,
    width: 231,
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.border,
    paddingHorizontal: 10,
  },
  searchIcon: { height: 24, width: 24, tintColor: Colors.gray },
  searchInput: { flex: 1, fontSize: 14, color: Colors.black },
  headerIconButton: {
    height: 44,
    width: 44,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: { height: 24, width: 24 },
  promoBanner: {
    height: width(45),
    marginHorizontal: width(2),
    borderRadius: 12,
    overflow: 'hidden',
  },
  promoImage: { borderRadius: 12 },
  promoTextContainer: { top: 18, left: 20, gap: 16 },
  promoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
    width: 160,
  },
  orderButton: {
    backgroundColor: Colors.orange,
    height: 40,
    width: 126,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonText: { fontSize: 12, fontWeight: '600', color: Colors.black },

  foodImage: { width: 269, height: 132, borderRadius: 12 },
  foodInfoContainer: {
    width: 269,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  foodTextContainer: { gap: 6 },
  foodName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    width: width(50),
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starIcon: { height: 14, width: 14 },
  foodDetail: { fontSize: 12, color: Colors.gray },
  chefContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  chefImage: { height: 34, width: 34, borderRadius: 17 },
  chefLabel: { fontSize: 11, fontWeight: '500', color: Colors.primaryOrange },
  chefNameContainer: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  chefName: { fontSize: 13, fontWeight: '600', color: Colors.black },
  objectsIcon: { height: 15, width: 15 },
  foodPrice: { fontSize: 16, fontWeight: '500', color: Colors.redish },

  categoryList: { paddingHorizontal: width(3), gap: 10, paddingBottom: 10 },
  columnWrapper: { flexWrap: 'wrap', gap: 10 },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.85)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    zIndex: 10,
  },

  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
