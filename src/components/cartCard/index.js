import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, icons, images} from '../../assets';
import {colors} from '../../constants';
import {setCartData} from '../../redux/slices/Cart';
import BackButton from '../backIcon';
import CustomModal from '../customModal';

const CartCard = ({item, index}) => {
  console.log(item, 'itemitemitemitemitemitemitem');

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {cartData} = useSelector(state => state.CartSlice);
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [modalData, setModalData] = useState({
    type: 'default',
    Icon: null,
    name: '',
    detail: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const openDeleteModal = itemToRemove => {
    setDeleteItem(itemToRemove);

    setModalData({
      type: 'confirmation',
      Icon: icons.alertIcon,
      name: 'Confirmation',
      detail: 'Are you sure you want to remove this item?',
      onConfirm: confirmDelete,
      onCancel: () => setModalVisible(false),
    });

    setModalVisible(true);
  };

  const confirmDelete = () => {
    // close modal immediately to avoid UI overlap or touch issues
    setModalVisible(false);
    let updatedCart = [];
    try {
      if (deleteItem && (deleteItem._id || deleteItem.id)) {
        const idKey = deleteItem._id ? '_id' : 'id';
        updatedCart = cartData.filter(
          cartItem => cartItem[idKey] !== deleteItem[idKey],
        );
      } else if (deleteItem && deleteItem.foodId) {
        // if item stores nested foodId
        const fid =
          typeof deleteItem.foodId === 'object'
            ? deleteItem.foodId._id || deleteItem.foodId
            : deleteItem.foodId;
        updatedCart = cartData.filter(cartItem => {
          const cartFid =
            cartItem.foodId &&
            (typeof cartItem.foodId === 'object'
              ? cartItem.foodId._id || cartItem.foodId
              : cartItem.foodId);
          return cartFid !== fid;
        });
      } else {
        // fallback to reference equality
        updatedCart = cartData.filter(cartItem => cartItem !== deleteItem);
      }

      dispatch(setCartData(updatedCart));
      AsyncStorage.setItem('cartData', JSON.stringify(updatedCart));
      // clear deleteItem reference
      setDeleteItem(null);
    } catch (err) {
      console.log('confirmDelete error', err);
    }
  };

  const foodName = item?.name || 'Delicious Food';
  const foodImage = item?.image ? {uri: item.image} : images.meal;
  const price = item?.price ? `£${item?.price}` : `£${item?.foodId?.price}`;
  const offPrice = item?.offPrice ? `£${item.offPrice}` : null;
  const time = item?.time || '20mins';
  const rating = item?.rating || 4.8;
  const ratingCount = item?.ratingCount ? `(${item.ratingCount}+)` : '(120+)';
  const distance = item?.distance || '2.8 km away';
  const cheifName = item?.cheifName || 'Chef';

  const updateCartQuantity = newQty => {
    const updatedCart = [...cartData];
    updatedCart[index] = {
      ...updatedCart[index],
      quantity: newQty,
    };
    dispatch(setCartData(updatedCart));
    AsyncStorage.setItem('cartData', JSON.stringify(updatedCart));
    setQuantity(newQty);
  };

  const handleIncrease = () => updateCartQuantity(quantity + 1);

  const handleDecrease = () => {
    if (quantity <= 1) {
      Alert.alert('Quantity cannot be less than 1');
    } else {
      updateCartQuantity(quantity - 1);
    }
  };

  return (
    <View
      style={{
        marginTop: width(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        paddingBottom: width(5),
        marginHorizontal: width(4),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFF',
          borderRadius: width(2),
          paddingRight: width(2),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Image
            source={foodImage}
            resizeMode="cover"
            style={{
              height: width(22),
              width: width(22),
              borderRadius: width(2),
            }}
          />
          <View style={{marginLeft: 8, flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                color: colors.redish,
                fontFamily: fontFamily.poppinBold,
              }}>
              {foodName}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginTop: 6,
              }}>
              <Image
                source={icons.yellowStar}
                resizeMode="contain"
                style={{height: width(3), width: width(3)}}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.black,
                  fontFamily: fontFamily.poppinMedium,
                }}>
                {rating} {ratingCount}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.grey,
                  fontFamily: fontFamily.poppinMedium,
                }}>
                · {distance}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 6,
              }}>
              <Text
                style={{
                  color: colors.red,
                  fontFamily: fontFamily.poppinBold,
                }}>
                {price}
              </Text>
              {offPrice && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fontFamily.poppinBold,
                    textDecorationLine: 'line-through',
                    color: colors.grey,
                  }}>
                  {offPrice}
                </Text>
              )}
              <Image
                source={icons.clock}
                resizeMode="contain"
                style={{height: width(3.2), width: width(3.2), marginLeft: 2}}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.grey,
                  fontFamily: fontFamily.poppinMedium,
                }}>
                {time}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F2F2F2',
                borderRadius: 100,
                paddingHorizontal: width(2),
                paddingVertical: width(1.2),
                marginTop: width(2),
                width: width(40),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={handleDecrease}
                activeOpacity={0.8}
                style={{
                  height: width(8),
                  width: width(8),
                  borderRadius: width(10),
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.red,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.red,
                    fontSize: 18,
                    fontFamily: fontFamily.poppinBold,
                  }}>
                  -
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 16,
                  color: colors.black,
                  fontFamily: fontFamily.poppinBold,
                }}>
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={handleIncrease}
                activeOpacity={0.8}
                style={{
                  height: width(8),
                  width: width(8),
                  borderRadius: width(10),
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.red,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.red,
                    fontSize: 18,
                    fontFamily: fontFamily.poppinBold,
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{gap: 8, alignItems: 'center'}}>
          <BackButton
            icon={icons.deleteIcon}
            border={1}
            onPress={() => openDeleteModal(item)}
          />
          <BackButton icon={icons.share} border={1} />
        </View>
      </View>

      <Text
        style={{
          fontSize: 12,
          fontFamily: fontFamily.poppinBold,
          color: colors.black,
          paddingVertical: width(2),
        }}>
        Made by
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={images.cheif}
          resizeMode="cover"
          style={{height: width(10), width: width(10), borderRadius: width(5)}}
        />
        <View style={{marginLeft: 8}}>
          <Text
            style={{
              fontSize: 10,
              fontFamily: fontFamily.poppinBold,
              color: colors.primaryOrange,
            }}>
            Chef
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamily.poppinBold,
                color: colors.black,
              }}>
              {cheifName}
            </Text>
            <Image
              source={icons.objects}
              resizeMode="contain"
              style={{
                height: width(4),
                width: width(4),
                marginBottom: width(1),
              }}
            />
          </View>
        </View>
      </View>
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

export default CartCard;
