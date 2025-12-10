import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {icons} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import CustomModal from '../../../components/customModal';
import FoodCard from '../../../components/foodCard';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import {colors, Colors} from '../../../constants';
import {helper} from '../../../helper';
import {setCartData} from '../../../redux/slices/Cart';
import {addToFavFun, getUserFavProFun} from '../../../services/favourite';

const Favourite = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);
  const {cartData} = useSelector(state => state.CartSlice);

  const [favoritesData, setFavoritesData] = useState([]);
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
      Icon: type === 'success' ? icons.check : icons.cross,
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
    let params = {
      ...selectedItem?.foodId,
      merchant: selectedItem?.restaurantId,
    };

    if (!user) {
      showModal('error', 'Please login first to add items in your cart');
      return;
    }

    try {
      let tempArr = [...cartData];
      const findIndex = tempArr.findIndex(i => i._id === params._id);

      if (
        cartData.length === 0 ||
        cartData[0].merchantId === params.merchantId
      ) {
        if (findIndex !== -1)
          tempArr[findIndex].selectedQty =
            (tempArr[findIndex].selectedQty || 1) + 1;
        else tempArr.push({...params, selectedQty: 1});

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

  const handleFavToggle = async item => {
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

  // 🔹 Empty Component Centered
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {user
          ? 'No Favourite Products Found'
          : 'Please login first to see your favorite meals.'}
      </Text>
      {!user && (
        <View style={styles.buttonWrapper}>
          <ActionBuuton
            name="Login"
            height={50}
            fontSize={14}
            bgcColor={colors.redish}
            fontColor={colors.white}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      )}
    </View>
  );

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
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && renderEmptyComponent()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={
          favoritesData.length === 0 ? {flex: 1} : {paddingBottom: 20}
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

      <OverLayLoader isloading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonWrapper: {
    width: width(30),
  },
});

export default Favourite;
