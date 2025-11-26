import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {icons} from '../../../assets';
import CustomModal from '../../../components/customModal';
import FoodCard from '../../../components/foodCard';
import AppHeader from '../../../components/headerComponent';
import {colors} from '../../../constants';
import {setCartData} from '../../../redux/slices/Cart';
import {addToFavFun} from '../../../services/favourite';
import {getAllProducts} from '../../../services/product';

const AllFoodScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);
  const {cartData} = useSelector(state => state.CartSlice);

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const fetchProducts = useCallback(
    async (reset = false) => {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const res = await getAllProducts(user?._id, page);
        if (res.status === 200 || res.status === 201) {
          const newProducts = res?.data?.data || [];
          const totalPages = res?.data?.totalPages || 1;

          if (reset) setProducts(newProducts);
          else setProducts(prev => [...prev, ...newProducts]);

          if (page >= totalPages || newProducts.length === 0) setHasMore(false);
          else setPage(prev => prev + 1);
        }
      } catch (error) {
        console.log('Fetch Error:', error);
        showModal('error', 'Failed to fetch products!');
      }
      setLoading(false);
    },
    [page, loading, hasMore, user?._id],
  );

  useEffect(() => {
    fetchProducts(true);
  }, []);

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
        if (findIndex !== -1)
          tempArr[findIndex].selectedQty =
            (tempArr[findIndex].selectedQty || 1) + 1;
        else tempArr.push({...selectedItem, selectedQty: 1});

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

      // Update product in state
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

  const renderFooter = () =>
    loading ? (
      <ActivityIndicator
        size="large"
        color={colors.redish}
        style={{margin: 20}}
      />
    ) : null;

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader goBack={true} cartIcon={true} text="Delicacies" />

      <FlatList
        data={products}
        keyExtractor={(item, index) => item?._id || index.toString()}
        renderItem={({item}) => (
          <FoodCard
            item={item}
            handleAddToCart={handleAddToCart}
            onFavPress={onFavPress}
          />
        )}
        ListFooterComponent={renderFooter}
        onEndReached={() => fetchProducts()}
        onEndReachedThreshold={0.5}
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
