import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { width } from 'react-native-dimension';
import { fontFamily } from '../../../assets';
import AllChefsCard from '../../../components/allChefsCard';
import CustomModal from '../../../components/customModal';
import AppHeader from '../../../components/headerComponent';
import { colors, Colors } from '../../../constants';
import { getAllMerchants } from '../../../services/merchant';
import FilterModal from '../../../components/filterModal';

const AllChefs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    type: 'default',
    Icon: null,
    name: '',
    detail: '',
    onConfirm: () => { },
    onCancel: () => { },
  });

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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

  const handleApplyFilter = filterData => {
    console.log('Applied filters:', filterData);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        goBack={true}
        text="Hire Chef"
        cartIcon={true}
        showfilter={true}
        onFilterPress={() => setFilterModalVisible(true)}
      />

      <FlatList
        data={data}
        renderItem={({ item }) => <AllChefsCard item={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item?._id || index.toString()}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text
            style={{
              fontFamily: fontFamily.poppinBold,
              color: colors.gray,
            }}>
            No Merchant found
          </Text>
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews
      />

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

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
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
    gap: width(3),
  },
  contentContainer: {
    gap: width(5),
    paddingVertical: width(5),
    paddingBottom: 100,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
