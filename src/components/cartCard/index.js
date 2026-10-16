import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, icons, images} from '../../assets';
import {Colors, colors} from '../../constants';
import {helper} from '../../helper';
import {setCartData} from '../../redux/slices/Cart';
import BackButton from '../backIcon';
import CustomModal from '../customModal';
import ActionButton from '../actionButton';


const CartCard = ({item, index, total}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {cartData} = useSelector(state => state.CartSlice);
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  console.log('item====', item)

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    type: 'default',
    Icon: null,
    name: '',
    detail: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const openDeleteModal = itemToRemove => {
    setModalData({
      type: 'confirmation',
      Icon: icons.alertIcon,
      name: 'Confirmation',
      detail: 'Are you sure you want to remove this item?',
      onConfirm: () => confirmDelete(itemToRemove),
      onCancel: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const openQuantityErrorModal = () => {
    setModalData({
      type: 'default',
      Icon: icons.alertIcon,
      name: 'Warning',
      detail: 'Quantity cannot be less than 1',
      onConfirm: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const confirmDelete = async item => {
    setModalVisible(false);

    setTimeout(async () => {
      if (!item) return;

      const updatedCart = cartData.filter(
        cartItem => cartItem?._id !== item?._id,
      );

      dispatch(setCartData(updatedCart));

      await AsyncStorage.setItem('cartData', JSON.stringify(updatedCart));
    }, 250);
  };

  const updateCartQuantity = newQty => {
    const updatedCart = [...cartData];
    updatedCart[index] = {...updatedCart[index], quantity: newQty};
    dispatch(setCartData(updatedCart));
    AsyncStorage.setItem('cartData', JSON.stringify(updatedCart));
    setQuantity(newQty);
  };

  const handleIncrease = () => updateCartQuantity(quantity + 1);

  const handleDecrease = () => {
    if (quantity <= 1) {
      openQuantityErrorModal();
    } else {
      updateCartQuantity(quantity - 1);
    }
  };

  const handleShareProduct = () => {
    const productId = item?._id || item?.foodId?._id;
    if (!productId) {
      return;
    }

    const productLink = `https://zannysfood.com/app/ProductDetail/${productId}`;
    const deepLink = `zannysfood://app/ProductDetail/${productId}`;
    const productName = item?.name || item?.foodId?.name || 'Product';

    helper.handleShare(`Check out ${productName}`, {
      title: productName,
      webLink: productLink,
      deepLink,
    });
  };

  const foodName = item?.name || 'Delicious Food';
  const foodImage = item?.image ? {uri: item.image} : images.meal;
  // ===== PRICE LOGIC (FINAL & SAFE) =====
  const originalPrice = item?.foodId?.price ?? item?.price ?? 0;

  const discountedPrice = item?.foodId?.discount ?? item?.discount ?? 0;

   const orderDate = item?.createdAt ? new Date(item.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';


  const getDaysFromCreatedAt = (date) => {

  const createdDate = new Date(date);
  const today = new Date();

  const diffTime = today - createdDate;

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;

};


  // FINAL price to show
          const days = getDaysFromCreatedAt(item?.createdAt);

  const price =
    discountedPrice > 0 ? `£${discountedPrice}` : `£${originalPrice}`;

  // STRIKE price (only if discounted)
  const offPrice = discountedPrice > 0 ? `£${originalPrice}` : null;

  const time = item?.time || '20mins';
  const rating = item?.rating || 4.8;
  const ratingCount = item?.ratingCount ? `(${item.ratingCount}+)` : '(120+)';
  const distance = item?.distance || '2.8 km away';
  const cheifName = item?.cheifName || 'Chef';

  return (
    <>
    {item?.orderType === 'preorder' ? (
<>
  <View
      style={{
        marginTop: width(2),
        borderWidth: 1,
        borderColor: colors.border,
        // paddingBottom: width(8),
        padding: 15,
        borderRadius: 8,
        marginHorizontal: width(4),
      }}>
          <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
       borderBottomWidth: 1,
       paddingVertical: 4,
        borderBottomColor: colors.border,
      alignItems: 'center',
      marginBottom: width(4),
      // paddingHorizontal: width(2),
    }}>
      <View style={{paddingVertical: 7,paddingHorizontal: 7,  backgroundColor: colors.border,borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{
        fontSize: 14,
        fontFamily: fontFamily.poppinMedium,
        color: colors.black,
      }}>
        Order #{item?.orderNumber || item?._id?.slice(-6) || '29'}
      </Text>
      </View>
      <Text style={{
        fontSize: 13,
        fontFamily: fontFamily.poppinRegular,
        color: colors.black,
      }}>
        {orderDate}
      </Text>
        <BackButton
            icon={icons.share}
            border={1}
            onPress={() => handleShareProduct(item)}
          />
    </View>
  
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
          {/* <Image
            source={foodImage}
            resizeMode="cover"
            style={{
              height: width(30),
              width: width(30),
              marginBottom: 10,
              borderRadius: width(2),
            }}
          /> */}
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '38%'}}>
                    <View style={{ marginLeft: width(3)}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 16,
                          fontFamily: fontFamily.poppinBold,
                          color: '#7a1f1f',
                        }}>
                        {foodName}
                      </Text>
            
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image source={icons.days} style={{width: 14, height: 14, marginRight: 10}} />
                        <Text style={{
                          fontSize: 13,
                          fontFamily: fontFamily.poppinSemiBold,
                          marginRight: 6,
                        }}>{days} Days</Text>
                      </View>
                      </View>
          
          
              <View style={{}}>
                  <Text
                              style={{
                                fontSize: 16,
                                textAlign: 'right',
                                fontFamily: fontFamily.poppinBold,
                                color: '#BF2725',
                              }}>
                              £{total}
                            </Text>
              <View
                          style={{
                            backgroundColor: '#FFF3E2',
                            paddingHorizontal: width(4),
                            paddingVertical: 1,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: Colors.clayDark,
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: fontFamily.poppinBold,
                              color:  '#ED930E',
                            }}>
                            {item?.orderType}
                          </Text>
                        </View>
          
                      </View>
                      </View>
        </View>

        {/* <View style={{gap: 8, alignItems: 'center'}}>
          <BackButton
            icon={icons.deleteIcon}
            border={1}
            onPress={() => openDeleteModal(item)}
          />
        </View> */}
      </View>

      <Text
        style={{
          fontSize: 12,
          fontFamily: fontFamily.poppinBold,
          color: colors.black,
          marginTop: width(4),
          paddingVertical: width(2),
        }}>
        Made by
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={
            item?.merchant?.merchantImage
              ? {uri: item?.merchant?.merchantImage}
              : images.cheif
          }
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
              {item?.merchant?.name || cheifName}
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
          <View
              style={{
                width: width(40),
                marginTop: width(3),
              }}>
              <ActionButton
                // bgcColor="#3b0b0b"
                fontColor='#3b0b0b'
                name="Delete"
                fontSize={10}
               onPress={() => openDeleteModal(item)}
              />
            </View>
            
          <View
              style={{
                width: width(40),
                marginTop: width(3),
              }}>
              <ActionButton
                bgcColor="#3b0b0b"
                fontColor={colors.white}
                name="View details"
                fontSize={10}
                 onPress={() => navigation.navigate('OrderDetail', item)}
              />
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
</>
    ):(
<>
  <View
      style={{
        marginTop: width(2),
        borderWidth: 1,
        borderColor: colors.border,
        // paddingBottom: width(8),
        padding: 15,
        borderRadius: 8,
        marginHorizontal: width(4),
      }}>
          <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
       borderBottomWidth: 1,
       paddingVertical: 4,
        borderBottomColor: colors.border,
      alignItems: 'center',
      marginBottom: width(4),
      // paddingHorizontal: width(2),
    }}>
      <View style={{paddingVertical: 7,paddingHorizontal: 7,  backgroundColor: colors.border,borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{
        fontSize: 14,
        fontFamily: fontFamily.poppinMedium,
        color: colors.black,
      }}>
        Order #{item?.orderNumber || item?._id?.slice(-6) || '29'}
      </Text>
      </View>
      <Text style={{
        fontSize: 13,
        fontFamily: fontFamily.poppinRegular,
        color: colors.black,
      }}>
        {orderDate}
      </Text>
        <BackButton
            icon={icons.share}
            border={1}
            onPress={() => handleShareProduct(item)}
          />
    </View>
  
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
              height: width(30),
              width: width(30),
              marginBottom: 10,
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
                style={{color: colors.red, fontFamily: fontFamily.poppinBold}}>
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

        {/* <View style={{gap: 8, alignItems: 'center'}}>
          <BackButton
            icon={icons.deleteIcon}
            border={1}
            onPress={() => openDeleteModal(item)}
          />
        </View> */}
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
          source={
            item?.merchant?.merchantImage
              ? {uri: item?.merchant?.merchantImage}
              : images.cheif
          }
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
              {item?.merchant?.name || cheifName}
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
          <View
              style={{
                width: width(40),
                marginTop: width(3),
              }}>
              <ActionButton
                // bgcColor="#3b0b0b"
                fontColor='#3b0b0b'
                name="Delete"
                fontSize={10}
               onPress={() => openDeleteModal(item)}
              />
            </View>
            
          <View
              style={{
                width: width(40),
                marginTop: width(3),
              }}>
              <ActionButton
                bgcColor="#3b0b0b"
                fontColor={colors.white}
                name="View details"
                fontSize={10}
                onPress={() => navigation.navigate('OrderDetail', item)}
              />
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
</>
    )}
  
    </>
  );
};

export default CartCard;
