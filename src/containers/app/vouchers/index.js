import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, icons} from '../../../assets';
import ActionBuuton from '../../../components/actionButton';
import AppHeader from '../../../components/headerComponent';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import {setCopiedCodeData} from '../../../redux/slices/ClaimedPromo';
import {getPromoStatus} from '../../../services/order';

const AllVouchers = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);

  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPromoId, setSelectedPromoId] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchPromos();
    }
  }, [user]);

  const fetchPromos = async () => {
    try {
      const response = await getPromoStatus(user._id);

      if (response?.status === 200) {
        setPromos(response?.data?.data || []);
      } else {
        Alert.alert('Error', response?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch vouchers');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPromos();
  };

  const handleClaimCode = item => {
    if (selectedPromoId === item._id) {
      setSelectedPromoId(null);
      dispatch(setCopiedCodeData(null));
      return;
    }

    setSelectedPromoId(item._id);
    dispatch(setCopiedCodeData(item));
  };

  const renderItem = useCallback(
    ({item}) => {
      const isClaimed = selectedPromoId === item._id || item.used === true;

      return (
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
              <Text style={styles.title}>{item.promoCode}</Text>
              <Text style={styles.description}>
                {item.description || 'No description'}
              </Text>
            </View>
          </View>

          <ActionBuuton
            bgcColor={isClaimed ? colors.white : colors.redish}
            fontColor={isClaimed ? colors.black : colors.white}
            name={isClaimed ? 'Claimed' : 'Claim to checkout'}
            disabled={isClaimed}
            onPress={() => handleClaimCode(item)}
            fontWeight={fontFamily.poppinRegular}
            customStyle={{
              paddingHorizontal: width(5),
              borderColor: colors.redish,
            }}
          />
        </View>
      );
    },
    [selectedPromoId],
  );

  const renderEmptyComponent = () => {
    if (isLoading) return null;

    return (
      <View style={styles.centerView}>
        <Text style={styles.emptyText}>No promo found</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader goBack text="Vouchers" />

      {isLoading && (
        <View style={styles.centerView}>
          <OverLayLoader />
          <Text style={styles.loadingText}>Fetching vouchers...</Text>
        </View>
      )}

      <FlatList
        data={promos}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={
          promos.length === 0 && !isLoading ? {flex: 1} : null
        }
      />
    </View>
  );
};

export default AllVouchers;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},

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

  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontFamily: fontFamily.poppinMedium,
    fontSize: 14,
    color: colors.gray,
  },

  loadingText: {
    marginTop: 10,
    fontFamily: fontFamily.poppinRegular,
    fontSize: 13,
    color: colors.gray,
  },
});
