import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons} from '../../assets';
import {colors} from '../../constants';
import ActionButton from '../actionButton';
import BackButton from '../backIcon';

const HistoryCard = ({item, handleAddToCart , orderCategoryTab}) => {
  console.log('item' , item)
  const navigation = useNavigation();
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

const days = getDaysFromCreatedAt(item?.createdAt);


  const getStatusStyle = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {bg: 'rgba(255,165,0,0.2)', color: '#FFA500'};
      case 'accepted':
        return {bg: 'rgba(30,144,255,0.2)', color: '#1E90FF'};
      case 'cancelled':
        return {bg: 'rgba(255,69,0,0.2)', color: '#FF4500'};
      case 'rejected':
        return {bg: 'rgba(255,69,0,0.2)', color: '#FF4500'};
      case 'completed':
      case 'delivered':
        return {bg: 'rgba(50,205,50,0.2)', color: '#32CD32'};
      default:
        return {bg: 'rgba(144,238,144,0.3)', color: '#32CD32'};
    }
  };

  const statusStyle = getStatusStyle(item?.status);
  const product = item?.order?.[0];
  console.log(product, 'productproductproductproductproductasd');

    const handleShareProduct = item => {
    if (!item?._id) {
      return;
    }
  };
const type = 'buyOrder'
  

  return (
    <>
    {orderCategoryTab === 'preOrder' ? (
      <>
      <View
        style={{
          backgroundColor: colors.white,
          padding: 10,
          marginHorizontal: width(4),
          // paddingVertical: width(2),
          marginTop: width(4),
          borderRadius: width(3),
          borderWidth: 1,
          borderColor: colors.border,
        }}>
           <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: width(4),
      paddingHorizontal: width(2),
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
    <View style={{ borderWidth: 0.3, borderColor: colors.border, marginVertical: 5, }}/>
        <View style={{flexDirection: 'row'}}>
         
  
  <View>

    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '38%'}}>
          <View style={{ marginLeft: width(3)}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontFamily: fontFamily.poppinBold,
                color: '#7a1f1f',
              }}>
              {product?.name}
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
                    £{product.discount}
                  </Text>
    <View
                style={{
                  backgroundColor: statusStyle.bg,
                  paddingHorizontal: width(4),
                  paddingVertical: 1,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: statusStyle.color,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fontFamily.poppinBold,
                    color: statusStyle.color,
                  }}>
                  {item?.orderCategory}
                </Text>
              </View>

            </View>
            </View>



    <View style={{ borderWidth: 0.3, borderColor: colors.border, marginVertical: 5, }}/>
            
  
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fontFamily.poppinSemiBold,
                  marginRight: 6,
                }}>
                Status
              </Text>
  
              <View
                style={{
                  backgroundColor: statusStyle.bg,
                  paddingHorizontal: width(4),
                  paddingVertical: 1,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: statusStyle.color,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fontFamily.poppinBold,
                    color: statusStyle.color,
                  }}>
                  {item?.status}
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                width: width(45),
                marginTop: width(3),
              }}>
              <ActionButton
                bgcColor="#3b0b0b"
                fontColor={colors.white}
                name="View details"
                fontSize={10}
                onPress={() => navigation.navigate('OrderDetail', item)}
              />
            </View> */}
          </View>
        </View>
    <View style={{ borderWidth: 0.3, borderColor: colors.border,marginTop: 10 }}/>

  
        <View style={{marginTop: width(4)}}>
          <Text
            style={{
              fontSize: 12,
              color: colors.black,
              fontFamily: fontFamily.poppinSemiBold,
              marginBottom: 6,
            }}>
            Made by
          </Text>
  
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: product?.merchant?.merchantImage}}
                style={{
                  width: width(9),
                  height: width(9),
                  borderRadius: width(4.5),
                }}
              />
  
              <View style={{marginLeft: 8}}>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: fontFamily.poppinBold,
                    color: colors.primaryOrange,
                  }}>
                  Chef
                </Text>
  
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: fontFamily.poppinBold,
                      color: colors.black,
                    }}>
                    {product?.merchant?.name}
                  </Text>
  
                  <Image
                    source={icons.objects}
                    style={{
                      width: 14,
                      height: 14,
                      marginLeft: 3,
                      marginBottom: 5,
                    }}
                  />
                </View>
              </View>
            </View>
       
          </View>
        </View>
    <View style={{ borderWidth: 0.3, borderColor: colors.border,marginTop: 10 }}/>

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
                onPress={() => navigation.navigate('OrderDetail', item, )}
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
      </View>
      </>
    ):(
      <>
      <View
        style={{
          backgroundColor: colors.white,
          marginHorizontal: width(4),
          paddingVertical: width(2),
          marginTop: width(4),
          borderRadius: width(3),
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
           <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: width(4),
      paddingHorizontal: width(2),
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
  
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: product?.image}}
            style={{
              width: width(35),
              height: width(35),
              borderRadius: width(3),
            }}
          />
  
          <View style={{flex: 1, marginLeft: width(3)}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontFamily: fontFamily.poppinBold,
                color: '#7a1f1f',
              }}>
              {product?.name}
            </Text>
  
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {Number(product?.discount) > 0 ? (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fontFamily.poppinBold,
                      color: '#F1A00A',
                    }}>
                    £{product.discount}
                  </Text>
  
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 13,
                      color: colors.grey,
                      textDecorationLine: 'line-through',
                    }}>
                    £{product.price}
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fontFamily.poppinBold,
                    color: colors.primaryOrange,
                  }}>
                  £{product.price}
                </Text>
              )}
            </View>
  
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fontFamily.poppinSemiBold,
                  marginRight: 6,
                }}>
                Status
              </Text>
  
              <View
                style={{
                  backgroundColor: statusStyle.bg,
                  paddingHorizontal: width(4),
                  paddingVertical: 1,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: statusStyle.color,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fontFamily.poppinBold,
                    color: statusStyle.color,
                  }}>
                  {item?.status}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: width(45),
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
        </View>
  
        <View style={{marginTop: width(4)}}>
          <Text
            style={{
              fontSize: 12,
              color: colors.black,
              fontFamily: fontFamily.poppinSemiBold,
              marginBottom: 6,
            }}>
            Made by
          </Text>
  
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: product?.merchant?.merchantImage}}
                style={{
                  width: width(9),
                  height: width(9),
                  borderRadius: width(4.5),
                }}
              />
  
              <View style={{marginLeft: 8}}>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: fontFamily.poppinBold,
                    color: colors.primaryOrange,
                  }}>
                  Chef
                </Text>
  
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: fontFamily.poppinBold,
                      color: colors.black,
                    }}>
                    {product?.merchant?.name}
                  </Text>
  
                  <Image
                    source={icons.objects}
                    style={{
                      width: 14,
                      height: 14,
                      marginLeft: 3,
                      marginBottom: 5,
                    }}
                  />
                </View>
              </View>
            </View>
            {/* <View
              style={{
                height: width(8),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
                paddingHorizontal: width(4),
                backgroundColor: colors.red,
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontFamily: fontFamily.poppinBold,
                  fontSize: 10,
                }}>
                {item?.orderCategory?.toUpperCase()}
              </Text>
            </View> */}
          </View>
        </View>
      </View>
      
      </>
    )}
    </>
  );
};

export default HistoryCard;
