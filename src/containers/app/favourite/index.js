import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {FlatList, View, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FoodCard from '../../../components/foodCard';
import AppHeader from '../../../components/headerComponent';
import CustomModal from '../../../components/customModal';
import OverLayLoader from '../../../components/loader';
import {Colors} from '../../../constants';
import {getUserFavProFun, addToFavFun} from '../../../services/favourite';
import {setCartData} from '../../../redux/slices/Cart';
import {helper} from '../../../helper';

const Favourite = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);
  const {cartData} = useSelector(state => state.CartSlice);

  const [favoritesData, setFavoritesData] = useState([]);
  console.log(favoritesData, 'favoritesDatafavoritesDatafavoritesDataasdasd');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchFavorites = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await getUserFavProFun(user._id);
      if (res.status === 200 || res.status === 201) {
        setFavoritesData(res.data.data || []);
      } else {
        showModal('error', res?.data?.message || 'Failed to fetch favorites');
      }
    } catch (err) {
      console.log('Fetch Favorites Error:', err);
      showModal('error', 'Something went wrong while fetching favorites');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

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
          tempArr[findIndex].selectedQty =
            (tempArr[findIndex].selectedQty || 1) + 1;
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

  const handleFavToggle = async item => {
    console.log(item, 'alksndjalkdnlasdlkasnd');

    if (!user)
      return showModal('error', 'Please login first to manage favorites');

    setLoading(true);
    try {
      const payload = {
        userId: user._id,
        restaurantId: item?.foodId?.merchantId,
        foodId: item?.foodId._id,
      };

      const res = await addToFavFun(payload);
      const updatedIsFav = res?.data?.isFav;
      if (res.status == 200 || res.status == 201) {
        setFavoritesData(prev =>
          prev.map(p => (p._id === item._id ? {...p, isFav: updatedIsFav} : p)),
        );
        await fetchFavorites();
        showModal('success', res?.data?.message);
      } else {
        showModal('error', res?.data?.message);
      }
    } catch (err) {
      console.log('Fav Toggle Error:', err);
      showModal('error', 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleShareProduct = item => {
    helper.handleShare(
      `Check this product: https://zannysfood.com/app/ProductDetail/${item?.foodId._id}`,
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <AppHeader goBack={true} cartIcon={true} text="Favorites" />

      <FlatList
        data={favoritesData}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <FoodCard
            item={item}
            handleAddToCart={handleAddToCart}
            onFavPress={handleFavToggle}
            handleShareProduct={handleShareProduct}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <View style={{alignItems: 'center', marginTop: 50}}>
              <Text>No favorite products found</Text>
            </View>
          )
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
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

      <OverLayLoader isloading={loading} />
    </View>
  );
};

export default Favourite;
