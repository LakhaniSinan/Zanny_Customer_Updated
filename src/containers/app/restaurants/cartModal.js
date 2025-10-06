import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image,ActivityIndicator } from 'react-native';
import { height, width } from 'react-native-dimension';
import { colors } from './../../../constants/index';
import LinearGradient from 'react-native-linear-gradient';

const CartModal = ({
  selectedItem,
  productsList,
  handleDecrease,
  handleIncrease,
  handleAddToCart,
}) => {

  const [imageLoading, setImageLoading] = useState(true)
  return (
    <View style={{ flex: 1, marginBottom: width(5) }}>
      <View style={{ height: width(50),}}>
        {imageLoading &&
        <View style={{justifyContent:"center",alignItems:"center",height:"100%"}}>
          <ActivityIndicator
            size="large"
            color={colors.yellow}
            
          />
          </View>
        }
        <Image
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            width: '100%',
            height:width(50)
          }}
          onLoadEnd={() => setImageLoading(false)}
          resizeMode="stretch"
          source={{ uri: selectedItem.image }}
        />

      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: width(4.5),
          marginTop: width(2),
        }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: 'black' }}>
          {selectedItem.name}
        </Text>
        <Text style={{ fontWeight: '700', fontSize: 16, color: 'black' }}>
          £
          {selectedItem.discount > 0
            ? selectedItem.discount
            : selectedItem.price}
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: width(4.5),
        }}>
        <Text style={{ fontWeight: '300', fontSize: 12, color: '#b4b0b0' }}>
          {selectedItem.description}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'row',
          width: '100%',
          marginBottom: width(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={handleDecrease}>
            <View
              style={{
                width: width(10),
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: width(4),
                backgroundColor:
                  productsList[selectedItem?.index]?.userQuantity < 1
                    ? '#cdcaca'
                    : colors.orangeColor,
                height: width(10),
              }}
              >
              <Text style={{ color: 'white', fontSize: 20 }}>-</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>
            {selectedItem.selectedQty}
          </Text>
          <TouchableOpacity onPress={handleIncrease}>
            <View
              style={{
                width: width(10),
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: width(4),
                backgroundColor: colors.orangeColor,
                height: width(10),
              }}
              >
              <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginRight: width(3) }}>
          <TouchableOpacity onPress={handleAddToCart}>
            <View
              style={{
                borderRadius: 5,
                paddingVertical: width(3),
                backgroundColor: colors.orangeColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                Add to cart
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default CartModal;
