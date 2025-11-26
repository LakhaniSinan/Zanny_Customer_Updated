import {useNavigation, useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {FlatList, View, RefreshControl} from 'react-native';
import {images} from '../../../assets';
import AppHeader from '../../../components/headerComponent';
import HistoryCard from '../../../components/historyCard';
import {Colors} from '../../../constants';
import {useSelector} from 'react-redux';
import {getAllOrdersByCustomerId} from '../../../services/order';
import OverLayLoader from '../../../components/loader';

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const [allOrders, setAllOrders] = useState([]);
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

  // 🔥 Pull to Refresh
  const onRefresh = () => {
    setRefreshing(true);
    handleGetAllOrders(true);
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <AppHeader goBack={true} cartIcon={true} text="History" />

      <FlatList
        data={allOrders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <HistoryCard item={item} />}
        showsVerticalScrollIndicator={false}
        // Pull To Refresh Setup
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <OverLayLoader isloading={loading} />
    </View>
  );
};

export default MyOrdersScreen;
