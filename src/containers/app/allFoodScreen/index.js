import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {icons} from '../../../assets';
import CustomModal from '../../../components/customModal';
import FoodCard from '../../../components/foodCard';
import AppHeader from '../../../components/headerComponent';
import {colors} from '../../../constants';
import {setCartData} from '../../../redux/slices/Cart';
import {addToFavFun} from '../../../services/favourite';
import {getAllProducts} from '../../../services/product';
import {helper} from '../../../helper';

const AllFoodScreen = ({route}) => {
  const data = route.params;
  console.log(data, 'datadatadatadatadata');

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);
  const {cartData} = useSelector(state => state.CartSlice);

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [initialLoading, setInitialLoading] = useState(true); // First load
  const [loading, setLoading] = useState(false); // Infinite scroll loader
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh loader
  const {currentLocation} = useSelector(state => state.LocationSlice);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    name: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });

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

  // ⭐ EMPTY VIEW
  const ListEmpty = () =>
    initialLoading ? (
      <View style={{alignItems: 'center', marginTop: 50}}>
        <View style={{height: 10}} />
        <Text style={{fontSize: 16, color: colors.black}}>
          {data?.name
            ? `Fetching products for ${data?.name}`
            : 'Fetching products'}{' '}
          ...
        </Text>
      </View>
    ) : (
      <View style={{alignItems: 'center', marginTop: 50}}>
        <Text style={{fontSize: 18, fontWeight: '600', color: colors.black}}>
          No products found
        </Text>
        <Text style={{fontSize: 14, color: colors.gray}}>
          Please try another category
        </Text>
      </View>
    );

  const fetchProducts = useCallback(
    async (reset = false) => {
      if (loading || (!hasMore && !reset)) return;

      if (reset) {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = {
          page: reset ? 1 : page,
          limit: 10,
        };

        if (data?._id) params.categoryId = data._id;
        if (user?._id) params.userId = user._id;
        if (user?._id) params.searchQuery = data?.search;

        // ✅ ADD CURRENT USER LAT/LNG
        if (currentLocation?.latitude && currentLocation?.longitude) {
          params.latitude = currentLocation.latitude;
          params.longitude = currentLocation.longitude;
        }

        console.log(params, 'paramsparamsparamsparams');

        const res = await getAllProducts(params);

        if (res.status === 200) {
          const newProducts = res?.data?.data || [];
          const totalPages = res?.data?.totalPages || 1;

          if (reset) {
            setProducts(newProducts);
            setPage(2);
          } else {
            setProducts(prev => [...prev, ...newProducts]);
            setPage(prev => prev + 1);
          }

          if (newProducts.length === 0 || page >= totalPages) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.log('Fetch Error:', error);
        showModal('error', 'Failed to fetch products!');
      } finally {
        setInitialLoading(false);
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, loading, hasMore, user?._id, currentLocation],
  );

  useEffect(() => {
    fetchProducts(true);
  }, []);

  // ⭐ REFRESH HANDLER
  const onRefresh = () => {
    fetchProducts(true);
  };

  // ⭐ FOOTER LOADER (Infinite Scroll)
  const renderFooter = () =>
    loading && !refreshing ? (
      <ActivityIndicator
        size="large"
        color={colors.redish}
        style={{margin: 20}}
      />
    ) : null;

  // ⭐ ADD TO CART
 const handleAddToCart = async selectedItem => {
  if (!user) {
    showModal('error', 'Please login first to add items in your cart');
    return;
  }

  try {
    let tempArr = [...cartData];
    const findIndex = tempArr.findIndex(i => i._id === selectedItem._id);

    if (
      cartData.length === 0 ||
      cartData[0].merchantId === selectedItem.merchantId
    ) {
      if (findIndex !== -1) {
        tempArr[findIndex].selectedQty =
          (tempArr[findIndex].selectedQty || 1) + 1;

        // ensure orderType stays regular
        tempArr[findIndex].orderType = 'regular';
      } else {
        tempArr.push({
          ...selectedItem,
          selectedQty: 1,
          orderType: 'regular',
        });
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
    console.log(err);
    showModal('error', 'Something went wrong!');
  }
};

  // ⭐ MARK FAVORITE
  const onFavPress = async item => {
    if (!user) {
      showModal('error', 'Please login first to add favorites');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: user._id,
        restaurantId: item.merchantId,
        foodId: item._id,
      };

      const res = await addToFavFun(payload);
      const updatedIsFav = res?.data?.isFav;

      setProducts(prev =>
        prev.map(p => (p._id === item._id ? {...p, isFav: updatedIsFav} : p)),
      );

      showModal('success', res.data.message);
    } catch (err) {
      console.log('Fav Error:', err);
      showModal('error', 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  // ⭐ SHARE PRODUCT
  const handleShareProduct = item => {
    if (!item?._id) {
      return;
    }

    const productLink = `https://zannysfood.com/app/ProductDetail/${item?._id}`;
    const deepLink = `zannysfood://app/ProductDetail/${item?._id}`;

    helper.handleShare(`Check out ${item?.name || 'this product'}`, {
      title: item?.name,
      webLink: productLink,
      deepLink,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader
        goBack={true}
        cartIcon={true}
        text={data?.name ? data?.name : 'Delicacies'}
      />

      <FlatList
        data={products}
        keyExtractor={(item, index) => item?._id || index.toString()}
        renderItem={({item}) => (
          <FoodCard
            item={item}
            handleAddToCart={handleAddToCart}
            onFavPress={onFavPress}
            handleShareProduct={() => handleShareProduct(item)}
            currentLocation={currentLocation}
          />
        )}
        ListEmptyComponent={<ListEmpty />}
        ListFooterComponent={renderFooter}
        onEndReached={() => fetchProducts()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <CustomModal
        visible={modalVisible}
        Icon={modalData.Icon}
        name={modalData.name}
        detail={modalData.detail}
        buttonName={modalData.buttonName}
        onPress={modalData.onPress}
        close={() => setModalVisible(false)}
      />
    </View>
  );
};

export default AllFoodScreen;
