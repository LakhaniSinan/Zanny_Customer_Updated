// import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';
// import {useFocusEffect} from '@react-navigation/native';
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {width} from 'react-native-dimension';
// import {ScrollView} from 'react-native-gesture-handler';
// import {AirbnbRating} from 'react-native-ratings';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {useDispatch, useSelector} from 'react-redux';
// import {images} from '../../../assets';
// import CartImage from '../../../components/cartImage';
// import OverLayLoader from '../../../components/loader';
// import CommonModal from '../../../components/modal';
// import {helper} from '../../../helper';
// import {handelGetAddress} from '../../../redux/slices/Address';
// import {setCurrentLocation} from '../../../redux/slices/Location';
// import {setOrderType} from '../../../redux/slices/OrderType';
// import {getAddress} from '../../../services/address';
// import {
//   getAllMerchantByCurrentLocation,
//   getAllMerchantByCurrentLocationPickUp,
// } from '../../../services/merchant';
// import Header from './../../../components/header/index';
// import {colors} from './../../../constants/index';

// const Restaurants = ({navigation}) => {
//   const ref = useRef();
//   const dispatch = useDispatch();
//   const userAddress = useSelector(state => state.AddressSlice.address);
//   const {orderType} = useSelector(state => state.OrderType);
//   const [merchants, setMerchants] = useState([]);
//   const [searchVal, setSearchVal] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [merchantByType, setMerchantByType] = useState([]);
//   const [isVisible, setIsVisible] = useState(false);
//   const [address, setAddress] = useState([]);
//   const user = useSelector(state => state.LoginSlice.user);
//   const navigateToDetail = val => {
//     navigation.navigate('Products', {
//       details: val,
//     });
//   };
//   const currentLocation = useSelector(
//     state => state.LocationSlice.currentLocation,
//   );

//   const [customerLocation, setCustomerLocation] = useState({
//     longitude: 0,
//     latitude: 0,
//   });

//   useFocusEffect(
//     React.useCallback(() => {
//       getAllergies();
//     }, []),
//   );

//   useEffect(() => {
//     handleNotification();
//   }, []);

//   const handleNotification = () => {
//     if (user != null) {
//       messaging()
//         .getInitialNotification()
//         .then(res => {
//           // navigation.navigate(res?.data?.screenName);
//         })
//         .catch(error => {
//           console.log(error, 'errror======>');
//         });
//     }
//   };

//   useEffect(() => {
//     messaging().onMessage(async data => {
//       console.log(data, 'remoteMessageremoteMessageremoteMessage_accept');
//       helper.notificationCall(
//         data?.notification?.title,
//         data?.notification?.body,
//       );
//     });
//   }, []);

//   const getAllergies = async () => {
//     let data = await AsyncStorage.getItem('allergies');
//     data = JSON.parse(data);
//   };

//   const checkCurrentLocation = async () => {
//     let permissions = await helper.checkLocation();
//     let location = await helper.getCurrentLocation();
//     let latitude = location?.coords.latitude;
//     let longitude = location?.coords.longitude;

//     let getFormattedAddress = await helper.getLocationAddress(
//       latitude,
//       longitude,
//     );
//     let formattedAddress = getFormattedAddress.results[0].formatted_address;
//     let params = {
//       latitude: latitude,
//       longitude: longitude,
//       placeType: '',
//       address: formattedAddress,
//       floor: '',
//       street: '',
//     };
//     AsyncStorage.setItem('userCurrentAddress', JSON.stringify(params));
//     dispatch(setCurrentLocation(params));
//     if (orderType == 'pickup') {
//       getAllRestaurantsForPickUp(params);
//     } else if (orderType == 'delivery') {
//       getAllRestaurantsForDelivery(params);
//     } else {
//     }
//   };

//   const getAllRestaurantsForDelivery = async item => {
//     ref.current.hide();
//     let address = {
//       latitude: item?.latitude,
//       longitude: item?.longitude,
//       placeType: item?.label,
//       address: item?.address,
//       floor: item?.address,
//       street: item?.street,
//     };
//     let payload = {
//       longitude: item?.longitude,
//       latitude: item?.latitude,
//     };
//     dispatch(setCurrentLocation(address));

//     setIsVisible(true);
//     getAllMerchantByCurrentLocation(payload)
//       .then(res => {
//         let data = res?.data?.data;
//         setIsVisible(false);
//         setMerchants(data?.allRest);
//         setFilteredData(data?.allRest);
//         setMerchantByType(data?.restByType);
//         AsyncStorage.setItem('userCurrentAddress', JSON.stringify(address));
//       })
//       .catch(err => {
//         setIsVisible(false);
//       });
//   };

//   const getAllRestaurantsForPickUp = async item => {
//     ref.current.hide();
//     let address = {
//       latitude: item?.latitude,
//       longitude: item?.longitude,
//       placeType: item?.label,
//       address: item?.address,
//       floor: item?.address,
//       street: item?.street,
//     };
//     let payload = {
//       longitude: item?.longitude,
//       latitude: item?.latitude,
//     };
//     dispatch(setCurrentLocation(address));

//     setIsVisible(true);
//     getAllMerchantByCurrentLocationPickUp(payload)
//       .then(res => {
//         setIsVisible(false);
//         setMerchants(res?.data?.data?.allRest);
//         setFilteredData(res?.data?.data?.allRest);
//         setMerchantByType(res?.data?.data?.restByType);
//         AsyncStorage.setItem('userCurrentAddress', JSON.stringify(address));
//       })
//       .catch(err => {
//         setIsVisible(false);
//       });
//   };

//   // let currentAddress=AsyncStorage.getItem("userCurrentAddress")
//   // currentAddress=JSON.parse(currentAddress)
//   useEffect(() => {
//     if (user) {
//       addressGet();
//     }
//     let filterArray = merchants?.filter(item => {
//       return item?.name?.toLowerCase().includes(searchVal.toLowerCase());
//     });
//     setFilteredData(filterArray);
//   }, [orderType]);

//   useEffect(() => {
//     checkAddress();
//     if (user) {
//       dispatch(handelGetAddress('home'));
//     }
//   }, [orderType]);

//   const checkAddress = async () => {
//     let address = await AsyncStorage.getItem('userCurrentAddress');
//     address = JSON.parse(address);
//     if (address != null) {
//       let params = {
//         latitude: address?.latitude,
//         longitude: address?.longitude,
//         placeType: address?.label,
//         address: address?.address,
//         floor: address?.address,
//         street: address?.street,
//       };
//       if (orderType == 'pickup') {
//         getAllRestaurantsForPickUp(params);
//       } else if (orderType == 'delivery') {
//         getAllRestaurantsForDelivery(params);
//       } else {
//       }
//     } else {
//       checkCurrentLocation();
//     }
//   };

//   const addressGet = () => {
//     setIsVisible(true);
//     getAddress(user._id)
//       .then(response => {
//         setIsVisible(false);
//         if (response?.data?.status == 'ok') {
//           let data = response?.data?.data;
//           setAddress(data);
//         } else {
//           console.log(response?.data, 'else data=====>');
//         }
//       })
//       .catch(error => {
//         setIsVisible(false);
//         console.log(error, 'error');
//       });
//   };

//   const handleAddLocationBtn = () => {
//     ref.current.hide();
//     navigation.navigate('AddEditAddress', {
//       type: 'Select',
//     });
//   };

//   const renderItem = ({item, index}) => {
//     if (item == 'Selected') {
//       return <RenderFilteredData index={index} />;
//     } else {
//       return <RenderAllData index={index} />;
//     }
//   };

//   const RenderFilteredData = ({index}) => {
//     return (
//       <FlatList
//         data={merchantByType}
//         key={index}
//         ListHeaderComponent={
//           orderType && (
//             <View
//               style={{
//                 alignItems: 'center',
//                 padding: width(2),
//               }}>
//               {orderType === 'delivery' && (
//                 <View
//                   style={{
//                     shadowColor: '#000',
//                     shadowOffset: {
//                       width: 0,
//                       height: 2,
//                     },
//                     shadowOpacity: 0.25,
//                     shadowRadius: 3.84,
//                     borderRadius: 12,
//                     height: width(50),
//                     width: '100%',
//                     backgroundColor: colors.white,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     elevation: 3,
//                     padding: width(3),
//                     margin: width(5),
//                   }}>
//                   <View
//                     style={{
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       width: width(40),
//                     }}>
//                     <Text
//                       style={{
//                         color: colors.black,
//                         textAlign: 'center',
//                         fontWeight: '800',
//                         fontSize: 22,
//                       }}>
//                       Food Delivery
//                     </Text>
//                     <Text
//                       style={{
//                         color: colors.black,
//                         textAlign: 'center',
//                       }}>
//                       Deliciousness At Your Doorstep!
//                     </Text>
//                     <TouchableOpacity
//                       onPress={() => dispatch(setOrderType('pickup'))}
//                       style={{
//                         height: width(10),
//                         marginTop: width(3),
//                         width: width(35),
//                         borderRadius: width(4),
//                         backgroundColor: colors.orangeColor,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}>
//                       <Text
//                         style={{
//                           color: colors.white,
//                           textAlign: 'center',
//                           fontWeight: '800',
//                         }}>
//                         Switch
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                   <View
//                     style={{
//                       width: width(45),
//                     }}>
//                     <Image
//                       source={images.deliveryImage}
//                       resizeMode="contain"
//                       style={{height: '100%', width: '100%'}}
//                     />
//                   </View>
//                 </View>
//               )}
//               {orderType === 'pickup' && (
//                 <View
//                   style={{
//                     borderRadius: 12,
//                     height: width(50),
//                     width: '100%',
//                     backgroundColor: colors.white,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     shadowColor: '#000',
//                     shadowOffset: {
//                       width: 0,
//                       height: 2,
//                     },
//                     shadowOpacity: 0.25,
//                     shadowRadius: 3.84,

//                     elevation: 5,
//                     padding: width(3),
//                     marginHorizontal: width(4),
//                   }}>
//                   <View
//                     style={{
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       width: width(40),
//                     }}>
//                     <Text
//                       style={{
//                         color: colors.black,
//                         textAlign: 'center',
//                         fontWeight: '800',
//                         fontSize: 22,
//                       }}>
//                       Food Pick Up
//                     </Text>
//                     <Text
//                       style={{
//                         color: colors.black,
//                         textAlign: 'center',
//                       }}>
//                       Convenient Pickup for Your Cravings!
//                     </Text>
//                     <TouchableOpacity
//                       onPress={() => dispatch(setOrderType('delivery'))}
//                       style={{
//                         height: width(10),
//                         marginTop: width(3),
//                         width: width(35),
//                         borderRadius: width(4),
//                         backgroundColor: colors.orangeColor,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}>
//                       <Text
//                         style={{
//                           color: colors.white,
//                           textAlign: 'center',
//                           fontWeight: '800',
//                         }}>
//                         Switch
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                   <View
//                     style={{
//                       width: width(45),
//                     }}>
//                     <Image
//                       source={images.pickupiImage}
//                       resizeMode="contain"
//                       style={{height: '100%', width: '100%'}}
//                     />
//                   </View>
//                 </View>
//               )}
//             </View>
//           )
//         }
//         renderItem={({item, index}) => {
//           return (
//             <View key={index}>
//               <View
//                 style={{marginHorizontal: width(4), marginVertical: width(2)}}>
//                 <Text
//                   style={{
//                     color: colors.black,
//                     fontSize: 18,
//                     fontWeight: '600',
//                   }}>
//                   {item?.name}
//                 </Text>
//               </View>
//               <FlatList
//                 showsHorizontalScrollIndicator={false}
//                 data={item.rest}
//                 horizontal
//                 renderItem={({item, index}) => {
//                   return (
//                     <View key={index + 1}>
//                       <TouchableOpacity
//                         style={{marginHorizontal: 10}}
//                         onPress={() => navigateToDetail(item)}>
//                         <View>
//                           <CartImage
//                             imageUrl={item.merchantImage}
//                             imgStyle={styles.images}
//                           />
//                           <Text
//                             style={{
//                               color: colors.black,
//                               fontSize: 16,
//                               fontWeight: '600',
//                             }}>
//                             {item?.name}
//                           </Text>
//                           {renderRating(item)}
//                         </View>
//                       </TouchableOpacity>
//                     </View>
//                   );
//                 }}
//               />
//             </View>
//           );
//         }}
//       />
//     );
//   };

//   const renderRating = details => {
//     let count = 0;
//     details?.reviews?.map(item => {
//       count = count + item.rating;
//     });
//     let result = count / details?.reviews?.length;
//     if (isNaN(result)) {
//       result = 0;
//     }
//     return (
//       <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
//         <AirbnbRating
//           defaultRating={details?.reviews?.length == 0 ? 5 : result}
//           size={15}
//           count={5}
//           showRating={false}
//           isDisabled
//           selectedColor={colors.orangeColor}
//         />
//       </View>
//     );
//   };

//   const RenderAllData = ({index}) => {
//     return (
//       <View key={index}>
//         <View style={{marginTop: width(2), marginHorizontal: width(4)}}>
//           <Text style={{color: colors.black, fontSize: 16}}>
//             All Restaurants/ Cafe/ Home Chefs
//           </Text>
//         </View>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{flexGrow: 1}}>
//           {filteredData?.length > 0 ? (
//             filteredData?.map((item, ind) => (
//               <View key={ind} style={{marginVertical: width(3)}}>
//                 <TouchableOpacity
//                   style={{marginHorizontal: 10}}
//                   onPress={() => navigateToDetail(item)}>
//                   <View>
//                     <CartImage
//                       imageUrl={item.merchantImage}
//                       imgContainer={styles.imgview}
//                       imgStyle={styles.imageStyles}
//                     />
//                   </View>
//                   <View>
//                     <Text style={styles.txt}>{item?.name}</Text>
//                     {renderRating(item)}
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             ))
//           ) : (
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <Text
//                 style={{fontSize: 18, fontWeight: '600', color: colors.black}}>
//                 No Record Found
//               </Text>
//             </View>
//           )}
//         </ScrollView>
//       </View>
//     );
//   };

//   const renderSelectType = () => {
//     return (
//       <View
//         style={{
//           alignItems: 'center',
//           paddingHorizontal: width(2),
//           shadowColor: '#000',
//           shadowOffset: {
//             width: 0,
//             height: 2,
//           },
//           shadowOpacity: 0.25,
//           shadowRadius: 3.84,

//           elevation: 5,
//         }}>
//         <TouchableOpacity
//           onPress={() => dispatch(setOrderType('delivery'))}
//           style={{
//             borderRadius: 12,
//             height: width(50),
//             width: '100%',
//             backgroundColor: colors.white,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             elevation: 3,
//             padding: width(3),
//             margin: width(5),
//           }}>
//           <View
//             style={{
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: width(40),
//             }}>
//             <Text
//               style={{
//                 color: colors.black,
//                 textAlign: 'center',
//                 fontWeight: '800',
//                 fontSize: 22,
//               }}>
//               Food Delivery
//             </Text>
//             <Text
//               style={{
//                 color: colors.black,
//                 textAlign: 'center',
//               }}>
//               Deliciousness At Your Doorstep!
//             </Text>
//           </View>
//           <View
//             style={{
//               width: width(45),
//             }}>
//             <Image
//               source={images.deliveryImage}
//               resizeMode="contain"
//               style={{height: '100%', width: '100%'}}
//             />
//           </View>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => dispatch(setOrderType('pickup'))}
//           style={{
//             borderRadius: 12,
//             height: width(50),
//             width: '100%',
//             backgroundColor: colors.white,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             elevation: 3,
//             padding: width(3),
//             marginHorizontal: width(4),
//           }}>
//           <View
//             style={{
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: width(40),
//             }}>
//             <Text
//               style={{
//                 color: colors.black,
//                 textAlign: 'center',
//                 fontWeight: '800',
//                 fontSize: 22,
//               }}>
//               Food Pick Up
//             </Text>
//             <Text
//               style={{
//                 color: colors.black,
//                 textAlign: 'center',
//               }}>
//               Convenient Pickup for Your Cravings!
//             </Text>
//           </View>
//           <View
//             style={{
//               width: width(45),
//             }}>
//             <Image
//               source={images.pickupiImage}
//               resizeMode="contain"
//               style={{height: '100%', width: '100%'}}
//             />
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <>
//       {/* <OverLayLoader isloading={isVisible} /> */}
//       <SafeAreaView style={styles.container}>
//         {currentLocation !== null ? (
//           <Header
//             address={currentLocation?.address}
//             cart={true}
//             drawer={true}
//             onPressAddress={() => {
//               if (user) {
//                 ref.current.isVisible({});
//               }
//             }}
//           />
//         ) : (
//           <Header text="Restaurants" cart={true} drawer={true} />
//         )}
//         {orderType && (
//           <View style={styles.inputStyle}>
//             <TextInput
//               placeholder="Search Restaurant"
//               value={searchVal}
//               onChangeText={e => setSearchVal(e)}
//               placeholderTextColor={colors.grey}
//               style={{color: colors.black}}
//               onSubmitEditing={() =>
//                 navigation.navigate('SearchScreen', {
//                   data: searchVal,
//                 })
//               }
//             />
//             <AntDesign
//               name="search1"
//               color={colors.yellow}
//               size={20}
//               style={{marginRight: width(1)}}
//               onPress={() =>
//                 navigation.navigate('SearchScreen', {
//                   data: searchVal,
//                 })
//               }
//             />
//           </View>
//         )}

//         {!orderType ? (
//           renderSelectType()
//         ) : (
//           <FlatList data={['Selected', 'All']} renderItem={renderItem} />
//         )}

//         <CommonModal ref={ref}>
//           <View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <Text
//                 style={{
//                   color: colors.yellow,
//                   fontSize: 18,
//                   fontWeight: '600',
//                   padding: width(4),
//                 }}>
//                 Select Location
//               </Text>
//             </View>
//             {userAddress.length > 0 ? (
//               userAddress.map((item, ind) => {
//                 return (
//                   <ScrollView>
//                     <TouchableOpacity
//                       style={{
//                         backgroundColor: colors.yellow,
//                         marginVertical: width(2),
//                         marginHorizontal: width(3),
//                         borderRadius: 8,
//                         paddingVertical: width(2),
//                         paddingHorizontal: width(2),
//                       }}
//                       onPress={() => getAllRestaurantsForDelivery(item)}>
//                       <Text style={{color: colors.white, fontWeight: '600'}}>
//                         {item?.label}
//                       </Text>
//                       <Text style={{color: colors.white}}>{item?.address}</Text>
//                     </TouchableOpacity>
//                   </ScrollView>
//                 );
//               })
//             ) : (
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: colors.yellow,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginHorizontal: width(8),
//                   marginVertical: width(5),
//                   borderRadius: 8,
//                   paddingVertical: width(2),
//                 }}
//                 onPress={handleAddLocationBtn}>
//                 <Text
//                   style={{
//                     color: colors.white,
//                     fontSize: 18,
//                     fontWeight: '600',
//                   }}>
//                   Add New Address
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </CommonModal>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   imageStyles: {
//     height: width(40),
//     width: null,
//     resizeMode: 'cover',
//     borderRadius: 5,
//   },
//   images: {
//     height: width(40),
//     width: width(60),
//     resizeMode: 'cover',
//     borderRadius: 5,
//   },
//   txt: {
//     color: 'black',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   priceTypo: {
//     color: 'black',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   timeview: {
//     backgroundColor: 'white',
//     position: 'absolute',
//     bottom: 10,
//     width: '20%',
//     left: '2%',
//     borderRadius: 30,
//     alignItems: 'center',
//   },
//   timetext: {
//     color: 'black',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   inputStyle: {
//     borderRadius: 5,
//     marginVertical: width(2),
//     marginHorizontal: width(3),
//     backgroundColor: colors.white,
//     paddingHorizontal: width(1),
//     paddingVertical: width(2),
//     borderWidth: 0.3,
//     borderColor: colors.black,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
// });

// export default Restaurants;
// //Switch Seamlessly: Change Your Order Type to Pickup or Delivery in a Tap!
import React, {memo} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {icons, images} from '../../../assets';
import Category from '../../../components/categoryCard';
import HireCheifCard from '../../../components/hireChefCard';
import SectionHeader from '../../../components/sectionHeader';
import {Colors} from '../../../constants';

const Restaurants = ({navigation}) => {
  const recommendedData = [
    {
      id: '1',
      name: 'Caramello Spaghetti',
      image: images.foodImage,
      rate: icons.yellowStar,
      price: '£28',
      detail: '4.8 (120+) 2.8 km away',
      chef: 'Leanne Wayne',
    },
    {
      id: '2',
      name: 'Caramello Spaghetti',
      image: images.foodImage,
      rate: icons.yellowStar,
      price: '£28',
      detail: '4.8 (120+) 2.8 km away',
      chef: 'Leanne Wayne',
    },
  ];

  const categories = [
    {id: '1', cateIcon: icons.Bottle, cateName: 'Beverages'},
    {id: '2', cateIcon: icons.coffee, cateName: 'Coffee'},
    {id: '3', cateIcon: icons.Cookie, cateName: 'Bakery'},
    {id: '4', cateIcon: icons.IceCream, cateName: 'Sweets'},
    {id: '5', cateIcon: icons.seafood, cateName: 'Seafood'},
    {id: '6', cateIcon: icons.rice, cateName: 'Rice'},
  ];

  const chefs = [
    {
      id: '1',
      thumnail: images.veggie,
      cheifProfileImage: images.cheif,
      cheifName: 'Leanne Wayne',
      place: 'American. Californian',
      services: '3.7',
      rating: '91%',
    },
    {
      id: '2',
      thumnail: images.veggie,
      cheifProfileImage: images.cheif,
      cheifName: 'Leanne Wayne',
      place: 'American. Californian',
      services: '3.7',
      rating: '91%',
    },
  ];

  const renderRecommendedItem = ({item}) => (
    <TouchableOpacity style={styles.recommendedCard}>
      <Image source={item.image} style={styles.foodImage} />
      <View style={styles.foodInfoContainer}>
        <View style={styles.foodTextContainer}>
          <Text style={styles.foodName}>{item.name}</Text>

          <View style={styles.ratingContainer}>
            <Image
              source={item.rate}
              style={styles.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.foodDetail}>{item.detail}</Text>
          </View>

          <View style={styles.chefContainer}>
            <Image
              source={images.cheif}
              style={styles.chefImage}
              resizeMode="contain"
            />
            <View style={{marginLeft: 8}}>
              <Text style={styles.chefLabel}>Chef</Text>
              <View style={styles.chefNameContainer}>
                <Text style={styles.chefName}>{item.chef}</Text>
                <Image
                  source={icons.objects}
                  style={styles.objectsIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.foodPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Image source={icons.MagnifyingGlass} style={styles.searchIcon} />
          <TextInput
            placeholder="Search food"
            placeholderTextColor={Colors.gray}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ShoppingCart')}
          style={styles.headerIconButton}>
          <Image source={icons.ShoppingCart} style={styles.headerIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerIconButton}>
          <Image source={icons.Ticket} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={images.first}
          style={styles.promoBanner}
          imageStyle={styles.promoImage}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>
              Let's grab your breakfast promo!
            </Text>
            <TouchableOpacity style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <SectionHeader
          name="Delicacies"
          action="See All"
          onPress={() => navigation.navigate('Delicacies')}
          color={Colors.redish}
        />
        <FlatList
          data={recommendedData}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderRecommendedItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.recommendedList}
        />

        <SectionHeader name="Category" action="See All" />
        <FlatList
          data={categories}
          renderItem={({item}) => <Category item={item} />}
          keyExtractor={item => item.id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.categoryList}
        />

        <SectionHeader name="Hire a Chef" action="See All" />
        <FlatList
          data={chefs}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => <HireCheifCard item={item} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{width: 10}} />}
          contentContainerStyle={{paddingHorizontal: width(3)}}
        />

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
};

export default memo(Restaurants);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  header: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 12,
    marginTop: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    height: 44,
    width: 231,
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.border,
    paddingHorizontal: 10,
  },
  searchIcon: {height: 24, width: 24, tintColor: Colors.gray},
  searchInput: {flex: 1, fontSize: 14, color: Colors.black},
  headerIconButton: {
    height: 44,
    width: 44,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {height: 24, width: 24},
  promoBanner: {
    height: 150,
    marginTop: 23,
    marginHorizontal: width(2),
    borderRadius: 12,
    overflow: 'hidden',
  },
  promoImage: {borderRadius: 12},
  promoTextContainer: {top: 18, left: 20, gap: 16},
  promoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
    width: 160,
  },
  orderButton: {
    backgroundColor: Colors.orange,
    height: 40,
    width: 126,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonText: {fontSize: 12, fontWeight: '600', color: Colors.black},

  recommendedList: {paddingHorizontal: width(3), gap: 10},
  recommendedCard: {marginRight: width(3)},
  foodImage: {width: 269, height: 132, borderRadius: 12},
  foodInfoContainer: {
    width: 269,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  foodTextContainer: {gap: 6},
  foodName: {fontSize: 14, fontWeight: '500', color: Colors.black},
  ratingContainer: {flexDirection: 'row', alignItems: 'center', gap: 4},
  starIcon: {height: 14, width: 14},
  foodDetail: {fontSize: 12, color: Colors.gray},
  chefContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  chefImage: {height: 34, width: 34, borderRadius: 17},
  chefLabel: {fontSize: 11, fontWeight: '500', color: Colors.primaryOrange},
  chefNameContainer: {flexDirection: 'row', alignItems: 'center', gap: 3},
  chefName: {fontSize: 13, fontWeight: '600', color: Colors.black},
  objectsIcon: {height: 15, width: 15},
  foodPrice: {fontSize: 16, fontWeight: '500', color: Colors.redish},

  categoryList: {paddingHorizontal: width(3), gap: 10, paddingBottom: 10},
  columnWrapper: {flexWrap: 'wrap', gap: 10},
});
