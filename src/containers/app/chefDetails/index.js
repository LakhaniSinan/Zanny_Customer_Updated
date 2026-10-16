import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, icons} from '../../../assets';
import CustomModal from '../../../components/customModal';
import FoodCard from '../../../components/foodCard';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import {helper} from '../../../helper';
import {setCartData} from '../../../redux/slices/Cart';
import {addToFavFun} from '../../../services/favourite';
import {getMerchantProAndDetails} from '../../../services/merchant';

const ChefDetails = ({route}) => {
  const {merchantId} = route.params;

  const {user} = useSelector(state => state.LoginSlice);
  const dispatch = useDispatch(null);
  const {cartData} = useSelector(state => state.CartSlice);
  const {currentLocation} = useSelector(state => state.LocationSlice);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    name: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(null);

  console.log(details , 'details=====================>')

  useEffect(() => {
    fetchMerchantDetails();
  }, []);

  const fetchMerchantDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getMerchantProAndDetails(merchantId, user?._id);
      if (response.status === 200 || response.status === 201) {
        setDetails(response.data);
      }
    } catch (error) {
      console.error('Fetch merchant details error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async selectedItem => {
    if (!user)
      return showModal('error', 'Please login first to add items in your cart');

    try {
      let tempArr = [...cartData];
      const findIndex = tempArr.findIndex(i => i._id === selectedItem._id);

      if (
        cartData.length === 0 ||
        cartData[0].merchantId === selectedItem.merchantId
      ) {
        if (findIndex !== -1) {
          tempArr[findIndex] = {
            ...tempArr[findIndex], // ❗ unfreeze object
            selectedQty: (tempArr[findIndex].selectedQty || 1) + 1,
          };
        } else {
          tempArr.push({...selectedItem, selectedQty: 1});
        }

        dispatch(setCartData(tempArr));
        await AsyncStorage.setItem('cartData', JSON.stringify(tempArr));
        showModal('success', 'Item added to cart successfully');
      } else {
        showModal(
          'error',
          'You can only add items from one restaurant at a time',
        );
      }
    } catch (err) {
      console.log('Add to Cart Error:', err);
      showModal('error', 'Something went wrong while adding to cart');
    }
  };

  const showModal = (type, message) => {
    setModalData({
      Icon: type === 'success' ? icons.check : icons.cross,
      name: type === 'success' ? 'Success' : 'Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const handleFavToggle = async item => {
    console.log(item, 'itemitemitemitemitemasdasdsd');

    if (!user)
      return showModal('error', 'Please login first to manage favorites');

    setIsLoading(true);
    try {
      const payload = {
        userId: user._id,
        restaurantId: item?.merchantId,
        foodId: item?._id,
      };

      const res = await addToFavFun(payload);
      const updatedIsFav = res?.data?.isFav;
      console.log(updatedIsFav, 'updatedIsFavupdatedIsFavupdatedIsFavasdsad');

      if (res.status == 200 || res.status == 201) {
        // setFavoritesData(prev =>
        //   prev.map(p => (p._id === item._id ? {...p, isFav: updatedIsFav} : p)),
        // );
        await fetchMerchantDetails();
        showModal('success', res?.data?.message);
      } else {
        showModal('error', res?.data?.message);
      }
    } catch (err) {
      console.log('Fav Toggle Error:', err);
      showModal('error', 'Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };
  //   const renderRecommendedItem = useCallback(
  //     ({item}) => {
  //       console.log(item, 'adnklasndaksndlasdnalsdnaklsdn');

  //       return (
  //         <TouchableOpacity
  //           style={styles.recommendedCard}
  //           onPress={() =>
  //             navigation.navigate('ProductDetail', {
  //               data: item,
  //               productId: item?._id,
  //               type: 'normal',
  //             })
  //           }>
  //           <Image source={{uri: item?.image}} style={styles.foodImage} />

  //           <View style={styles.foodTextContainer}>
  //             <View style={styles.foodHeader}>
  //               <Text style={styles.foodName}>{item?.name}</Text>
  //               <Text style={styles.foodPrice}>£{item?.price}</Text>
  //             </View>

  //             <Text numberOfLines={2} style={styles.foodDetail}>
  //               {item?.description}
  //             </Text>

  //             <View style={styles.foodRatingRow}>
  //               <Text style={styles.foodRatingText}>4.8 (120+) • 2.8km</Text>
  //             </View>

  //             <View style={styles.chefContainer}>
  //               <Image
  //                 source={{uri: details?.merchant?.merchantImage}}
  //                 style={styles.chefImage}
  //               />
  //               <View style={{marginLeft: width(2)}}>
  //                 <Text style={styles.chefLabel}>Chef</Text>
  //                 <Text style={styles.chefName}>{details?.merchant?.name}</Text>
  //               </View>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     },
  //     [navigation],
  //   );

  return (
    <>
      <AppHeader goBack={true} text={'More Products By Chef'} />
      <ScrollView style={styles.container}>
        <OverLayLoader isloading={isLoading} />

        <View style={styles.headerContainer}>
          <Image
            resizeMode="contain"
            style={styles.merchantImage}
            source={{uri: details?.merchant?.merchantImage}}
          />
          <Text style={styles.merchantName}>{details?.merchant?.name}</Text>
          <Text style={styles.merchantEmail}>{details?.merchant?.email}</Text>

          {details?.merchant?.additionalInfo ? (
            <View style={styles.additionalInfoContainer}>
              <Text style={styles.additionalInfoText}>
                {details?.merchant?.additionalInfo}
              </Text>
            </View>
          ) : null}
        </View>

       <View style={{marginBottom: width(3)}}>
  <Text style={styles.foodImagesTitle}>Food Images</Text>

  {details?.merchant?.foodImages &&
  details.merchant.foodImages.length > 0 ? (
    <FlatList
      data={details.merchant.foodImages}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <Image
          source={{uri: item}}
          style={styles.foodImageItem}
        />
      )}
    />
  ) : (
    <Text style={styles.noFoodImagesText}>
      Food Images Not Found
    </Text>
  )}
</View>


        <FlatList
          ListHeaderComponent={
            <Text
              style={{
                fontFamily: fontFamily.poppinBold,
                fontSize: 14,
                color: colors.black,
                textAlign: 'center',
                paddingLeft: width(3),
              }}>
              All Products By Chef
            </Text>
          }
          data={details?.products || []}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <FoodCard
                item={item}
                handleAddToCart={handleAddToCart}
                onFavPress={handleFavToggle}
                handleShareProduct={item => {
                  if (!item?._id) {
                    return;
                  }

                  const productLink = `https://zannysfood.com/app/ProductDetail/${item?._id}`;
                  const deepLink = `zannysfood://app/ProductDetail/${item?._id}`;

                  helper.handleShare(
                    `Check out ${item?.name || 'this product'}`,
                    {
                      title: item?.name,
                      webLink: productLink,
                      deepLink,
                    },
                  );
                }}
                currentLocation={currentLocation}
              />
            );
          }}
          keyExtractor={item => item._id}
          contentContainerStyle={
            details?.products.length === 0 ? {flex: 1} : {paddingBottom: 20}
          }
        />
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        Icon={modalData.Icon}
        name={modalData.name}
        detail={modalData.detail}
        buttonName={modalData.buttonName}
        onPress={modalData.onPress}
        close={() => setModalVisible(false)}
      />
    </>
  );
};

export default ChefDetails;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},

  headerContainer: {alignItems: 'center', paddingBottom: width(5)},

  merchantImage: {
    height: width(30),
    width: width(30),
    borderRadius: width(15),
    overflow: 'hidden',
    marginTop: width(3),
    marginBottom: width(2),
  },

  merchantName: {
    fontSize: 15,
    fontFamily: fontFamily.poppinBold,
    color: colors.black,
  },

  merchantEmail: {
    fontFamily: fontFamily.poppinSemiBold,
    color: colors.black,
    marginBottom: width(3),
  },

  additionalInfoContainer: {
    padding: width(3),
    marginHorizontal: width(3),
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: width(3),
  },

  additionalInfoText: {
    fontFamily: fontFamily.poppinRegular,
    color: colors.gray,
  },

  recommendedCard: {
    marginVertical: 6,
    marginHorizontal: width(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  foodImagesTitle: {
  fontFamily: fontFamily.poppinBold,
  fontSize: 14,
  alignSelf: 'center',
  color: colors.black,
  marginLeft: width(3),
  marginBottom: width(2),
},

foodImageItem: {
  height: width(28),
  width: width(28),
  borderRadius: 12,
  marginLeft: width(3),
  backgroundColor: colors.graylight,
},

noFoodImagesText: {
  fontFamily: fontFamily.poppinBold,
  fontSize: 12,
  color: colors.gray,
  alignSelf: 'center'
  // marginLeft: width(3),
},



  foodImage: {width: '100%', height: 132, borderRadius: 12},

  foodTextContainer: {marginTop: 6},

  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  foodName: {fontSize: 14, fontWeight: '600', color: colors.black},

  foodPrice: {fontSize: 16, fontWeight: '600', color: colors.redish},

  foodDetail: {fontSize: 12, color: colors.gray, marginTop: 4},

  foodRatingRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},

  foodRatingText: {fontSize: 12, color: colors.graydark},

  chefContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  chefImage: {height: 34, width: 34, borderRadius: 17},
  chefLabel: {fontSize: 11, color: colors.primaryOrange, fontWeight: '500'},
  chefName: {fontSize: 13, fontWeight: '600', color: colors.black},
});
