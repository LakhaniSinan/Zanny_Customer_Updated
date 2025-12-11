import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { width } from 'react-native-dimension';
import { useDispatch, useSelector } from 'react-redux';
import { icons } from '../../../assets';
import ActionButton from '../../../components/actionButton';
import ChefsCard from '../../../components/chefsCard';
import CustomModal from '../../../components/customModal';
import OverLayLoader from '../../../components/loader';
import ProgressCard from '../../../components/progressCard';
import SectionHeader from '../../../components/sectionHeader';
import SegmentedButtons from '../../../components/SegmentedButtons';
import { Colors } from '../../../constants';
import { helper } from '../../../helper';
import { setCartData } from '../../../redux/slices/Cart';
import { addToFavFun } from '../../../services/favourite';
import { getProductDetailById } from '../../../services/product';

const ProductDetail = ({ navigation, route }) => {
  const productId = route.params.productId;
  const dispatch = useDispatch();
  const navigationType = route.params.type;
  const productData = route.params.data;

  const { user } = useSelector(state => state.LoginSlice);
  const [productDetails, setProductDetails] = useState(null);
  console.log(productDetails, "productDataproductDataproductDataproductData");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Nutrition');
  const { cartData } = useSelector(state => state.CartSlice);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    name: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

  const deliveryData = [
    { icon: icons.package, name: 'Delivery' },
    { icon: icons.clock, name: '20mins' },
    { icon: icons.yellowStar, name: '4.8 Rating' },
  ];

  const AllergiesData = [{ name: 'Vegan' }, { name: 'Vegetarian' }];

  useEffect(() => {
    if (productId) fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getProductDetailById(productId, user?._id);

      if (response.status === 200 || response.status === 201) {
        setProductDetails(response?.data?.data);
      } else {
        showModal('error', 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      showModal('error', 'Something went wrong while fetching product details');
    } finally {
      setIsLoading(false);
    }
  };

  const getFinalPrice = useCallback((price, discount) => {
    if (navigationType == 'normal') {
      if (!discount) return price;
      const final = price - (price * discount) / 100;
      return Number(final.toFixed(2));
    } else {
      return productData?.discountedPrice;
    }
  }, []);

  if (!productDetails) return <OverLayLoader isloading={true} />;

  const handleShareProduct = () => {
    helper.handleShare(
      `Check this product: https://zannysfood.com/app/ProductDetail/${productId}`,
    );
  };

  const onFavIconPress = async item => {
    if (!user)
      return showModal(
        'error',
        'Please login first to add items in your favourite list',
      );
    setIsLoading(true);
    try {
      let payload = {
        userId: user?._id,
        restaurantId: item?.merchantId,
        foodId: item?._id,
      };
      const response = await addToFavFun(payload);
      if (response?.status == 200 || response?.status == 201) {
        fetchProductDetails();
      } else {
        return showModal('error', response.data?.message);
      }
    } catch (error) {
      console.log(error, 'errorerrorerrorasndalskdndaas');
      showModal('error', 'Something went wrong while adding to favourite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user)
      return showModal('error', 'Please login first to add items in your cart');
    try {
      let tempArr = [...cartData];
      const findIndex = tempArr.findIndex(i => i._id === productData._id);
      if (
        cartData.length === 0 ||
        cartData[0].merchantId === productData.merchantId
      ) {
        if (findIndex !== -1) {
          // Copy the object before modifying
          tempArr[findIndex] = {
            ...tempArr[findIndex],
            selectedQty: (tempArr[findIndex].selectedQty || 1) + 1,
          };
        } else {
          tempArr.push({ ...productDetails, selectedQty: 1 });
        }
        dispatch(setCartData(tempArr));
        await AsyncStorage.setItem('cartData', JSON.stringify(tempArr));
        navigation.navigate('CartScreen');
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
      Icon:
        type === 'success'
          ? require('../../../assets/icons/check.png')
          : require('../../../assets/icons/cross.png'),
      name: type === 'success' ? 'Success' : 'Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const BottomButtons = () => (
    <View style={styles.bottomBar}>
      <View style={{ width: width(45) }}>
        <ActionButton
          onPress={() => showModal('error', 'This Feature Will Enable Soon')}
          height={46}
          width={width(45)}
          name={'Pre-order'}
          fontColor={Colors.black}
        />
      </View>
      <View style={{ width: width(45) }}>
        <ActionButton
          height={46}
          width={width(45)}
          name={'Buy Now'}
          bgcColor={Colors.black}
          fontColor={Colors.white}
          onPress={handleAddToCart}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView>
        {/* IMAGE */}
        <Image
          source={{ uri: productDetails?.image }}
          style={{ height: width(100), width: '100%', marginTop: -45 }}
          resizeMode="cover"
        />

        {/* HEADER ICONS */}
        <HeaderIcons navigation={navigation} />

        {/* CONTENT AREA */}
        <View style={styles.contentContainer}>
          <TitleRow
            productDetails={productDetails}
            onShareProduct={handleShareProduct}
            onFavIconPress={onFavIconPress}
          />

          <PriceRow
            productDetails={productDetails}
            getFinalPrice={getFinalPrice}
          />

          <Location />

          <Description text={productDetails?.description} />

          <DeliveryInfo deliveryData={deliveryData} />

          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <FlatList
            data={productDetails?.nutritions}
            renderItem={({ item }) => <ProgressCard item={item} />}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ fontSize: 14, color: '#999' }}>
                  No nutrition data available
                </Text>
              </View>
            }
          />

          {/* Allergies */}
          <SectionHeader name={'Allergies'} fontSize={16} />
          <View style={styles.flexWrap}>
            {productDetails?.allergiesData?.map(item => (
              <SegmentedButtons
                item={item}
                backgroundColor={Colors.softred}
                color={Colors.red}
              />
            ))}
          </View>

          {/* Dietary */}
          <SectionHeader name={'Dietary'} fontSize={16} />
          <FlatList
            horizontal
            data={AllergiesData || []}
            renderItem={({ item }) => (
              <SegmentedButtons
                item={item}
                backgroundColor={Colors.softred}
                color={Colors.red}
              />
            )}
            ItemSeparatorComponent={<View style={{ width: 10 }} />}
          />

          <SectionHeader name={'Made by'} fontSize={16} />

          <ChefInfo merchant={productDetails?.merchant} />

          <SectionHeader
            name={'More from this chef'}
            action={'See All'}
            color={Colors.redish}
            fontSize={14}
            onPress={() => navigation.navigate('ChefDetails', productDetails)}
          />

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={productDetails?.otherProducts || []}
            renderItem={({ item }) => <ChefsCard item={item} />}
            ItemSeparatorComponent={<View style={{ width: 10 }} />}
            contentContainerStyle={{
              paddingVertical: width(2),
              paddingHorizontal: width(1),
            }}
          />
        </View>
        <BottomButtons />
        <View style={{ height: width(2) }} />
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
      <OverLayLoader isloading={isLoading} />
    </View>
  );
};

export default ProductDetail;

const HeaderIcons = ({ navigation }) => (
  <View style={styles.headerIcons}>
    <IconButton icon={icons.ArrowLeft} onPress={() => navigation.goBack()} />
    <IconButton icon={icons.ShoppingCart} />
  </View>
);

const IconButton = ({ icon, onPress }) => (
  <TouchableOpacity style={styles.iconBtn} onPress={onPress}>
    <Image source={icon} style={styles.iconSize} resizeMode='contain' />
  </TouchableOpacity>
);

const TitleRow = ({ productDetails, onShareProduct, onFavIconPress }) => {
  return (
    <View style={styles.titleRow}>
      <Text numberOfLines={2} style={styles.title}>
        {productDetails?.name}
      </Text>
      <View style={styles.titleRight}>
        <IconButton
          icon={productDetails?.isFav ? icons.fillHeart : icons.heart}
          onPress={() => onFavIconPress(productDetails)}
        />
        {/* <IconButton icon={icons.share} onPress={onShareProduct} /> */}
      </View>
    </View>
  );
};

const PriceRow = ({ productDetails, getFinalPrice }) => (
  <View style={styles.priceRow}>
    <View style={styles.priceLeft}>
      <Text style={styles.finalPrice}>
        £{getFinalPrice(productDetails?.price, productDetails?.discount)}
      </Text>

      {productDetails?.discount > 0 && (
        <Text style={styles.oldPrice}>£{productDetails?.price}</Text>
      )}
    </View>

    <View style={styles.servings}>
      <Image
        source={icons.foodIcon}
        style={styles.servingsIcon}
        resizeMode="contain"
      />
      <Text style={styles.servingsText}>
        {productDetails?.otherProducts?.length} servings
      </Text>
    </View>
  </View>
);

const Location = () => (
  <View style={styles.location}>
    <Image source={icons.map} style={styles.locationIcon} />
    <Text style={styles.locationText}>2.8 km away</Text>
  </View>
);

const Description = ({ text }) => (
  <View style={{ marginTop: width(2) }}>
    <Text style={styles.description}>{text}</Text>
  </View>
);

const DeliveryInfo = ({ deliveryData }) => (
  <View style={styles.deliveryRow}>
    {deliveryData.map((item, index) => (
      <View key={index} style={styles.deliveryItem}>
        <Image source={item.icon} style={styles.deliveryIcon} />
        <Text style={styles.deliveryText}>{item.name}</Text>
      </View>
    ))}
  </View>
);

const Tabs = ({ activeTab, setActiveTab }) => (
  <View style={styles.tabs}>
    {['Nutrition', 'Customize'].map(tab => (
      <TouchableOpacity
        key={tab}
        onPress={() => setActiveTab(tab)}
        style={[
          styles.tabButton,
          {
            backgroundColor:
              activeTab === tab ? Colors.background : 'transparent',
          },
        ]}>
        <Text
          style={[
            styles.tabText,
            { color: activeTab === tab ? Colors.black : Colors.graydark },
          ]}>
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const ChefInfo = ({ merchant }) => (
  <View style={styles.chefRow}>
    <View style={styles.chefLeft}>
      <Image
        source={{ uri: merchant?.merchantImage }}
        style={styles.chefImg}
        resizeMode="contain"
      />
      <View style={{ marginLeft: 8 }}>
        <Text style={styles.chefLabel}>Chef</Text>
        <View style={styles.chefNameRow}>
          <Text style={styles.chefName}>{merchant?.name}</Text>
          <Image source={icons.objects} style={styles.verifyIcon} />
        </View>
      </View>
    </View>
    <View style={{ width: width(20) }}>
      <ActionButton
        name={'Hire'}
        bgcColor={Colors.black}
        fontColor={Colors.white}
      />
    </View>
  </View>
);

const styles = {
  contentContainer: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 29,
    borderTopLeftRadius: 29,
    marginTop: -30,
    padding: width(6),
  },
  headerIcons: {
    position: 'absolute',
    top: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 99,
  },
  iconBtn: {
    height: width(10),
    width: width(10),
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.clayDark,
  },
  iconSize: { height: 20, width: 20 },

  /* Title */
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.redish,
    width: width(65),
  },
  titleRight: {
    width: width(25),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  /* Prices */
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: width(3),
  },
  priceLeft: { flexDirection: 'row', alignItems: 'center' },
  finalPrice: { fontSize: 30, fontWeight: '700', color: Colors.red },
  oldPrice: {
    fontSize: 16,
    marginLeft: 6,
    textDecorationLine: 'line-through',
    color: Colors.gray,
  },
  servings: { flexDirection: 'row', alignItems: 'center' },
  servingsIcon: { height: width(7), width: width(7) },
  servingsText: { marginLeft: width(2), color: Colors.black },

  /* Location */
  location: { flexDirection: 'row', alignItems: 'center', marginTop: width(1) },
  locationIcon: { height: 16, width: 16 },
  locationText: { fontSize: 12, color: Colors.grayyy, marginLeft: width(1) },

  /* Description */
  description: { fontSize: 12, color: Colors.graydark },

  /* Delivery row */
  deliveryRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: width(3),
    marginTop: width(2),
    borderColor: Colors.clayLite,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliveryIcon: { height: 16, width: 16 },
  deliveryText: { fontSize: 12, color: Colors.redish },

  /* Tabs */
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.clayDark,
    height: width(12),
    marginTop: width(3),
    borderRadius: 100,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: { fontSize: 13, fontWeight: 600 },

  /* Flex wrap */
  flexWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  /* Chef */
  chefRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chefLeft: { flexDirection: 'row', alignItems: 'center' },
  chefImg: { height: 34, width: 34, borderRadius: 100 },
  chefLabel: { fontSize: 11, color: Colors.primaryOrange },
  chefNameRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  chefName: { fontSize: 13, fontWeight: 600, color: Colors.black },
  verifyIcon: { height: 15, width: 15 },

  /* Bottom Bar */
  bottomBar: {
    width: '100%',
    backgroundColor: Colors.white,
    zIndex: 9,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
};
