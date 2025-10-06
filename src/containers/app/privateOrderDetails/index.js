import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Header from '../../../components/header';
import Button from '../../../components/button';
import {colors} from './../../../constants/index';
import styles from './style';
import {width} from 'react-native-dimension';
import { updatePrivateOrderStatus } from '../../../services/privateOrder';
 

const PrivateOrderDetail = ({navigation, route}) => {
  const data = route.params.detail;
  const [subTotal, setSubTotal] = useState(0);
  const [prepareTime, setPrepareTime] = useState('');

  useEffect(() => {
    let total = 0;
    data.order.map(item => {
      total += item.selectedQty * item.price;
    });
    setSubTotal(total);
  }, []);

  const handleAccept = () => {
    if (prepareTime == '') {
      alert('Please enter preparation time');
    } else {
      alert('Order accepted successfully');
      setPrepareTime('');
    }
  };

  const handleCancelOrder=()=>{
    let payload={
      Id:data?._id,
      status:"Rejected"
    }
    updatePrivateOrderStatus(payload).then((response)=>{
      if (response?.data?.status == "ok") {
        alert(response?.data?.message)
        navigation.goBack()
      } else {
        alert(response?.data?.message)
      }
    }).catch((error)=>{
        console.log(error,"error");
    })
  }

  const cofirmAlert=()=>{
    Alert.alert('Are you sure?','You want to cancel this order?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => handleCancelOrder()},
    ]);
  }
  console.log(data?.totalBill,"data====>");
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header text="Order Details" goBack={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: data.merchantDetails.merchantImage,
          }}
          style={styles.imageStyle}
          resizeMode="cover"
        />
        {/* <Text style={styles.orderheading}>Order Details</Text> */}
        <View style={styles.borderstyle}>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order number</Text>
            <Text style={styles.oredernotxt}>{data.orderId}</Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order Status</Text>
            <Text style={styles.oredernotxt}>{data.status}</Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order from</Text>
            <Text style={styles.orderfromtxt}>{data.merchantDetails.name}</Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery address:</Text>
            <Text style={styles.deliverytxt}>{data.address}</Text>
          </View>
        </View>

        <View style={styles.borderstyle}>
          {data.order.map((item, ind) => {
            return (
              <View key={ind} style={styles.ordertxtview}>
                <Text style={styles.subheading}>
                  {item.selectedQty}x {item.name}
                </Text>
                <Text style={styles.pricetxt}>£ {item.price}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.borderstyle}>
          {/* <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery fee</Text>
            <Text style={styles.pricetxt}>
              £ {data.deliveryCharges ? data.deliveryCharges : 0}
            </Text>
          </View> */}
          {/* <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Discount</Text>
            <Text style={styles.pricetxt}>£ {data.discount}</Text>
          </View> */}
          {data?.selectedDates.map((item,ind)=>{
            return(
              <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Date & Time</Text>
              <Text style={styles.pricetxt}>{item?.time}</Text>
            </View>
            )
          })}
         
          <View style={styles.ordertxtview}>
            <Text style={styles.subtotaltxt}>Total</Text>
            <Text style={styles.pricetxt}>
              £{' '}
              {data?.totalBill}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={{marginTop: width(2), marginBottom: width(2)}}>
        {data.status == 'Pending' ? (
          <Button
            onPress={cofirmAlert}
            heading={'Cancel Order'}
            color={colors.pinkColor}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default PrivateOrderDetail;
