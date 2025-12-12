import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../../assets';
import CustomModal from '../../../components/customModal';
import AppHeader from '../../../components/headerComponent';
import HireCheifCard from '../../../components/hireChefCard';
import {colors, Colors} from '../../../constants';
import {getAllMerchants} from '../../../services/merchant';
import CustomInput from '../../../components/customInput';

const AllChefs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    type: 'default',
    Icon: null,
    name: '',
    detail: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const showModal = (type, message) => {
    setModalData({
      type,
      name: type === 'error' ? 'Error' : 'Success',
      detail: message,
    });
    setModalVisible(true);
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);

      const response = await getAllMerchants();

      if (response.status === 200 && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
        showModal('error', response.data.message || 'Failed to fetch chefs');
      }
    } catch (error) {
      console.log('Error fetching merchants:', error);
      showModal('error', 'Something went wrong while fetching chefs');
    } finally {
      if (showLoader) setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMerchants(false);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(item => item?.name?.toLowerCase().includes(query));
  }, [data, searchQuery]);

  return (
    <View style={styles.container}>
      <AppHeader goBack={true} text="All Chefs" />

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>Search By Chef Name</Text>
        <CustomInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search chefs"
          placeholderTextColor={Colors.graydark}
          style={styles.searchInput}
        />
      </View>

      {/* Loader */}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.orange} />
        </View>
      )}

      {/* Empty State */}
      {!isLoading && filteredData.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No chefs match your search.'
              : 'No chefs available at the moment.'}
          </Text>
        </View>
      )}

      {/* LIST */}
      {!isLoading && (
        <FlatList
          data={filteredData}
          renderItem={({item}) => <HireCheifCard item={item} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item?._id || index.toString()}
          columnWrapperStyle={styles.rowWrapper}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews
        />
      )}

      <CustomModal
        visible={modalVisible}
        type={modalData.type}
        Icon={modalData.Icon}
        name={modalData.name}
        detail={modalData.detail}
        onConfirm={modalData.onConfirm}
        onCancel={modalData.onCancel}
        close={() => setModalVisible(false)}
      />
    </View>
  );
};

export default AllChefs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    paddingHorizontal: width(3),
    paddingTop: width(3),
  },
  searchLabel: {
    fontFamily: fontFamily.poppinBold,
    fontSize: 12,
    color: Colors.black,
    paddingLeft: width(1),
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    fontFamily: fontFamily.poppinRegular,
    color: Colors.black,
    backgroundColor: Colors.white,
    marginTop: 5,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  contentContainer: {
    gap: width(5),
    paddingVertical: width(5),
    paddingBottom: 100,
  },
  loaderContainer: {
    paddingTop: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontFamily: fontFamily.poppinRegular,
    color: Colors.graydark,
    fontSize: 14,
  },
});
