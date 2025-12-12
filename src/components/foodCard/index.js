import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons, images} from '../../assets';
import {Colors, colors} from '../../constants';
import ActionBuuton from '../actionButton';
import BackButton from '../backIcon';

const FoodCard = ({item, handleAddToCart, onFavPress, handleShareProduct}) => {
  const navigation = useNavigation();
  // Map your API response properly
  const foodData = {
    foodImage: item.foodId?.image
      ? {uri: item.foodId.image}
      : item.image
      ? {uri: item.image}
      : images.meal,
    foodName: item.foodId?.name || item.name,
    foodRating: '4.8 (120+)  2.8 km away', // default
    price:
      item.foodId?.price !== undefined
        ? `£${item.foodId.price}`
        : item.price !== undefined
        ? `£${item.price}`
        : '0',
    offPrice:
      item.foodId?.discount !== undefined
        ? `£${item.foodId.discount}`
        : item.discount !== undefined
        ? `£${item.discount}`
        : null,
    time:
      item.foodId?.deliveryTime !== undefined
        ? `${item.foodId.deliveryTime} mins`
        : item.time || '20 mins',
    cheifName: item.restaurantId?.name || item.cheifName || 'Leanne Wayne',
    isFavourite: item.isFav === true, // always boolean
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
      {/* Top Row: Image + Details */}
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
          <View style={{flexDirection: 'row', marginTop: 10, gap: width(2)}}>
            <View style={{width: width(28)}}>
              <ActionBuuton
                bgcColor={colors.black}
                fontColor={colors.white}
                name="View Details"
                onPress={() =>
                  // navigation.navigate('ProductDetail', {
                  //   productId: item?.foodId?._id || item._id,
                  // })
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

        {/* Heart & Share Icons */}
        <View style={{marginLeft: 8, alignItems: 'center', gap: 5}}>
          <BackButton
            icon={foodData.isFavourite ? icons.fillHeart : icons.heartBrown}
            border={1}
            onPress={() => onFavPress(item)}
          />
          {/* <BackButton
            icon={icons.share}
            border={1}
            onPress={() => handleShareProduct(item)}
          /> */}
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
            item?.merchant?.merchantImage
              ? {uri: item?.merchant?.merchantImage}
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
            {item?.merchant?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FoodCard;
