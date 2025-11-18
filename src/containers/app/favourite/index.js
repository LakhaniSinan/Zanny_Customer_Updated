import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {fontFamily, icons, images} from '../../../assets';
import BackButton from '../../../components/backIcon';
import FoodCard from '../../../components/foodCard';
import {Colors} from '../../../constants';

const foodCardData = [
  {
    foodImage: images.meal,
    foodName: 'Caramello Spaghetti',
    foodRating: '4.8 (120+)  2.8 km away',
    price: '£78',
    offPrice: '£2.99',
    time: '20mins',
    cheifName: 'Leanne Wayne',
    isFavourite: true,
  },
  {
    foodImage: images.meal1,
    foodName: 'Caramello Spaghetti',
    foodRating: '4.8 (120+)  2.8 km away',
    price: '£78',
    offPrice: '£2.99',
    time: '20mins',
    cheifName: 'Leanne Wayne',
    isFavourite: true,
  },
  {
    foodImage: images.meal2,
    foodName: 'Caramello Spaghetti',
    foodRating: '4.8 (120+)  2.8 km away',
    price: '£78',
    offPrice: '£2.99',
    time: '20mins',
    cheifName: 'Leanne Wayne',
    isFavourite: true,
  },
  {
    foodImage: images.veggie,
    foodName: 'Caramello Spaghetti',
    foodRating: '4.8 (120+)  2.8 km away',
    price: '£78',
    offPrice: '£2.99',
    time: '20mins',
    cheifName: 'Leanne Wayne',
    isFavourite: true,
  },
];

const Favourite = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}>
      <View
        style={{
          backgroundColor: Colors.white,
          paddingBottom: 18,
          elevation: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <BackButton
              height={20}
              icon={icons.ArrowLeft}
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                fontFamily: fontFamily.poppinRegular,
                fontSize: 18,
                fontWeight: 500,
                color: Colors.redish,
              }}>
              Favorites
            </Text>
          </View>
          <View style={{marginRight: 12}}>
            <BackButton icon={icons.ShoppingCart} border={1} />
          </View>
        </View>
      </View>
      <FlatList
        data={foodCardData}
        renderItem={({item, index}) => (
          <FoodCard
            item={item}
            heartIcon={item.isFavourite ? icons.fillHeart : icons.heartBrown}
          />
        )}
      />
    </View>
  );
};

export default Favourite;
