import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons, images} from '../../assets';
import {Colors, colors} from '../../constants';
import {helper} from '../../helper';
import ActionBuuton from '../actionButton';
import BackButton from '../backIcon';

const FoodCard = ({
  item,
  handleAddToCart,
  onFavPress,
  handleShareProduct,
  currentLocation,
}) => {
  const navigation = useNavigation();
  const [distance, setDistance] = useState(null);
  console.log(item, 'itemitemitemitemitemitemitem');

  // ✅ Calculate distance
  useEffect(() => {
    const calculateDistance = async () => {
      const userLat = Number(currentLocation?.latitude);
      const userLng = Number(currentLocation?.longitude);

      const merchantLat =
        Number(item?.merchant?.latitude) ||
        Number(item?.restaurantId?.latitude);
      const merchantLng =
        Number(item?.merchant?.longitude) ||
        Number(item?.restaurantId?.longitude);

      if (userLat && userLng && merchantLat && merchantLng) {
        try {
          const dist = await helper.getDistanceInKm(
            userLat,
            userLng,
            merchantLat,
            merchantLng,
          );
          setDistance(dist);
        } catch (err) {
          console.log('Distance calculation error:', err);
          setDistance(0);
        }
      } else {
        setDistance(0);
      }
    };

    calculateDistance();
  }, [currentLocation, item]);

  const originalPrice = item.foodId?.price ?? item.price ?? 0;
  const discountedPrice = item.foodId?.discount ?? item.discount ?? 0;

  const foodData = {
    foodImage: item.foodId?.image
      ? {uri: item.foodId.image}
      : item.image
      ? {uri: item.image}
      : images.meal,

    foodName: item.foodId?.name || item.name,

    foodRating:
      distance !== null ? `5.0  ${distance} km away` : 'Calculating...',

    price: discountedPrice > 0 ? `£${discountedPrice}` : `£${originalPrice}`,
    offPrice: discountedPrice > 0 ? `£${originalPrice}` : null,

    time: item.foodId?.deliveryTime
      ? `${item.foodId.deliveryTime} mins`
      : item?.merchant?.deliveryTime
      ? `${item?.merchant?.deliveryTime} mins`
      : `${item?.restaurantId?.deliveryTime || 20} mins`,

    cheifName: item.restaurantId?.name || item.cheifName || 'Leanne Wayne',
    isFavourite: item.isFav === true,
  };

  return (
    <View
      style={{
        marginVertical: width(2),
        marginHorizontal: width(4),
        padding: width(3),
        backgroundColor: colors.white,
        borderRadius: width(2),
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayyy,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <Image
          source={foodData.foodImage}
          style={{height: width(20), width: width(20), borderRadius: 8}}
          resizeMode="cover"
        />
        <View style={{flex: 1, marginLeft: width(3)}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontFamily.poppinBold,
              color: colors.redish,
            }}>
            {foodData.foodName}
          </Text>

          {/* Rating */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
              gap: 4,
            }}>
            <Image
              source={icons.yellowStar}
              style={{height: width(3), width: width(3)}}
            />
            <Text style={{fontSize: 12, fontFamily: fontFamily.poppinRegular}}>
              {foodData.foodRating}
            </Text>
          </View>

          {/* Price & Time */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 6,
              gap: 10,
            }}>
            <Text
              style={{fontFamily: fontFamily.poppinBold, color: colors.red}}>
              {foodData.price}
            </Text>
            {foodData.offPrice && (
              <Text
                style={{
                  fontFamily: fontFamily.poppinBold,
                  fontSize: 12,
                  textDecorationLine: 'line-through',
                  color: colors.grey,
                }}>
                {foodData.offPrice}
              </Text>
            )}
            <Image
              source={icons.clock}
              style={{height: width(3), width: width(3)}}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamily.poppinRegular,
                color: colors.grey,
              }}>
              {foodData.time}
            </Text>
          </View>

          {/* Buttons */}
          <View
            style={{flexDirection: 'row', marginTop: width(5), gap: width(2)}}>
            <View style={{width: width(28)}}>
              <ActionBuuton
                bgcColor={colors.redish}
                fontColor={colors.white}
                name="View Details"
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    data: item,
                    productId: item?.foodId?._id || item._id,
                    type: 'normal',
                  })
                }
              />
            </View>
            <View style={{width: width(25)}}>
              <ActionBuuton
                bgcColor={colors.white}
                fontColor={colors.black}
                name="Add to cart"
                onPress={() => handleAddToCart(item)}
              />
            </View>
          </View>
        </View>

        {/* Heart & Share */}
        <View
          style={{
            marginLeft: 8,
            alignItems: 'center',
            gap: 5,
            marginBottom: 5,
          }}>
          <BackButton
            icon={foodData.isFavourite ? icons.fillHeart : icons.heartBrown}
            border={1}
            onPress={() => onFavPress(item)}
          />
          <BackButton
            icon={icons.share}
            border={1}
            onPress={() => handleShareProduct(item)}
          />
        </View>
      </View>

      {/* Chef Section */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: width(3),
        }}>
        <Image
          source={
            item?.merchant?.merchantImage || item?.restaurantId?.merchantImage
              ? {
                  uri:
                    item?.merchant?.merchantImage ||
                    item?.restaurantId?.merchantImage,
                }
              : images.cheif
          }
          style={{height: width(10), width: width(10), borderRadius: width(5)}}
          resizeMode="cover"
        />
        <View style={{marginLeft: 8}}>
          <Text
            style={{
              fontSize: 10,
              fontFamily: fontFamily.poppinBold,
              color: colors.primaryOrange,
            }}>
            Made by
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamily.poppinBold,
              color: colors.black,
            }}>
            {item?.merchant?.name || item?.restaurantId?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FoodCard;
