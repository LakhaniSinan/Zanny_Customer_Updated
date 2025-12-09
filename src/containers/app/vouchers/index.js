import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons} from '../../../assets';
import AppHeader from '../../../components/headerComponent';
import {colors, Colors} from '../../../constants';
import ActionBuuton from '../../../components/actionButton';
import {getAllPromo} from '../../../services/order';
import OverLayLoader from '../../../components/loader';

const AllVouchers = () => {
  const [allPromoCodes, setAllPromoCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllPromos();
  }, []);

  const fetchAllPromos = async () => {
    try {
      if (!refreshing) setIsLoading(true);
      const response = await getAllPromo();
      if (response.status === 200 || response.status === 201) {
        setAllPromoCodes(response?.data?.data || []);
      } else {
        Alert.alert('Error', response?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching promos:', error);
      Alert.alert('Error', 'Unable to fetch vouchers');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllPromos();
  };

  const renderItem = useCallback(
    ({item}) => (
      <View style={styles.cardContainer}>
        <View style={styles.leftSection}>
          <View style={styles.iconWrapper}>
            <Image
              source={icons.Ticket}
              style={styles.icon}
              resizeMode="contain"
              tintColor={colors.red}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>{item?.promoCode || 'N/A'}</Text>
            <Text style={styles.description}>{item?.description || ''}</Text>
          </View>
        </View>
        {/* <View style={styles.buttonWrapper}>
          <ActionBuuton
            bgcColor={item?.isClaimed ? colors.gray : colors.redish}
            fontColor={colors.white}
            name={item?.isClaimed ? 'Claimed' : 'Claim'}
            disabled={item?.isClaimed}
            // onPress={() => handleClaimPromo(item)}
          />
        </View> */}
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <AppHeader goBack={true} text="Vouchers" />
      {isLoading && <OverLayLoader />}
      <FlatList
        data={allPromoCodes}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: width(5)}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default AllVouchers;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginHorizontal: width(3),
    marginTop: width(2),
    paddingVertical: width(3),
  },
  leftSection: {flexDirection: 'row', alignItems: 'center'},
  iconWrapper: {
    height: width(12),
    width: width(12),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    elevation: 3,
  },
  icon: {height: width(6), width: width(6)},
  textWrapper: {marginLeft: width(2)},
  title: {fontFamily: fontFamily.poppinSemiBold, fontSize: 14},
  description: {fontFamily: fontFamily.poppinRegular, fontSize: 12},
  buttonWrapper: {width: width(25)},
});
