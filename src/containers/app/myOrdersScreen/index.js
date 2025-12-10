import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {images} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import AppHeader from '../../../components/headerComponent';
import HistoryCard from '../../../components/historyCard';
import OverLayLoader from '../../../components/loader';
import {colors, Colors} from '../../../constants';
import {getAllOrdersByCustomerId} from '../../../services/order';

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const [allOrders, setAllOrders] = useState([]);
  console.log(allOrders, 'allOrdersallOrdersallOrdersallOrdersallOrders');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(state => state.LoginSlice.user);

  const handleGetAllOrders = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      const response = await getAllOrdersByCustomerId(user?._id);
      const data = response?.data?.data || [];

      setAllOrders(data);
    } catch (error) {
      console.log(error, 'Error fetching orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllOrders();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    handleGetAllOrders(true);
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.noOrders} style={styles.emptyImage} />
      <Text style={styles.emptyText}>
        {user
          ? 'No Orders Found'
          : 'No orders found, Please login first to see your orders history.'}
      </Text>
      {!user && (
        <View style={{width: width(30), marginLeft: 10, marginTop: width(2)}}>
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
      <AppHeader goBack={true} cartIcon={true} text="History" />

      <FlatList
        data={allOrders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <HistoryCard item={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && renderEmptyComponent()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Loader */}
      <OverLayLoader isloading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default MyOrdersScreen;
