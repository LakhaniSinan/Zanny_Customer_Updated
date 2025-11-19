import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {icons} from '../../../assets';
import FoodCard from '../../../components/foodCard';
import AppHeader from '../../../components/headerComponent';
import {colors} from '../../../constants';
import {setCartData} from '../../../redux/slices/Cart';
import {getAllProducts} from '../../../services/product';

const AllFoodScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state.LoginSlice);
  const {cartData} = useSelector(state => state.CartSlice);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await getAllProducts(page);
      const newProducts = res.data.data; // Assuming your API returns { data: { data: [...] } }

      setProducts(prev => [...prev, ...newProducts]);
      setHasMore(page < res.data.totalPages || newProducts.length > 0);
      setPage(prev => prev + 1);
    } catch (error) {
      console.log('Fetch Error: ', error);
    }
    setLoading(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <ActivityIndicator
        size="large"
        color={colors.redish}
        style={{margin: 20}}
      />
    );
  };
  const handleAddToCart = async selectedItem => {
    if (!user) {
      Alert.alert('Alert', 'Please login first to add items in your cart', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => navigation.navigate('AuthStack')},
      ]);
      return;
    }

    try {
      // Clone cart data
      let tempArr = [...cartData];
      let findIndex = tempArr.findIndex(item => item._id === selectedItem._id);

      if (
        cartData.length === 0 ||
        cartData[0].merchantId === selectedItem.merchantId
      ) {
        if (findIndex !== -1) {
          tempArr[findIndex] = {
            ...tempArr[findIndex],
            selectedQty: (tempArr[findIndex].selectedQty || 1) + 1,
          };
        } else {
          tempArr.push({...selectedItem, selectedQty: 1});
        }

        dispatch(setCartData(tempArr));
        await AsyncStorage.setItem('cartData', JSON.stringify(tempArr));

        Alert.alert('Success', 'Item added to cart successfully');
      } else {
        Alert.alert(
          'Warning',
          'You can only add items in cart from one restaurant at a time',
        );
      }
    } catch (err) {
      console.log(err, 'err');
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader goBack={true} cartIcon={true} text="Delicacies" />
      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({item}) => (
          <FoodCard
            item={item}
            handleAddToCart={handleAddToCart}
            heartIcon={item.isFavourite ? icons.fillHeart : icons.heartBrown}
          />
        )}
        onEndReached={fetchProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default AllFoodScreen;
