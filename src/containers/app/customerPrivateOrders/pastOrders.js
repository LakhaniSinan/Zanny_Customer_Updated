import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { gePrivatetOrderByCustomer } from '../../../services/privateOrder';
import { useFocusEffect } from '@react-navigation/native';
import { width } from 'react-native-dimension';
import styles from './style';
import CartImage from '../../../components/cartImage';
import { useSelector } from 'react-redux';
import { template } from '@babel/core';
import OverLayLoader from '../../../components/loader';
import { colors } from '../../../constants';

const PrivatePastOrders = ({ navigation, route }) => {
  let user = useSelector(state => state.LoginSlice.user);
  const [isLoading, setIsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);

  const getOrders = async () => {
    setIsLoading(true);
    gePrivatetOrderByCustomer(user._id)
      .then(res => {
        if (res?.data?.status == "ok") {
          let tempArr = []
          setIsLoading(false)
          let data = res?.data?.data.reverse()
          data.map((item, index) => {
            console.log(item?.status, "stattssttst");
            if (item?.status == "Rejected" || item?.status == "Completed") {
              tempArr.push(item)
            }
          })
          setAllOrders(tempArr)
        } else {
          setIsLoading(false)
          console.log(res?.data, "else ressssss");
        }
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getOrders();
    }, []),
  );

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        {allOrders?.length > 0 ? (
          <FlatList
            data={allOrders}
            style={{ marginTop: width(2), marginBottom: width(5) }}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PrivateOrderDetail', {
                      detail: item,
                    })
                  }
                  style={styles.cardview}>
                  <View style={styles.innerview}>
                    <CartImage
                      imageUrl={item?.merchantDetails?.merchantImage}
                      imgContainer={styles.imgview}
                      imgStyle={styles.img}
                    />
                    <View style={styles.txtview}>
                      <Text style={styles.txtdate}>Status: {item.status}</Text>
                      <Text style={styles.txtdate}>
                        Total Bill: £ {item.totalBill}
                      </Text>
                      <Text style={styles.txtdate}>Date: {item.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={{ justifyContent: 'center', marginTop: width(50) }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                marginBottom: width(2),
                color: 'black',
                textAlign: 'center',
              }}>
              No past orders right now,
            </Text>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: width(2),
              color: 'black',
              textAlign: 'center',
            }}>
              Place order to see
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default PrivatePastOrders;
