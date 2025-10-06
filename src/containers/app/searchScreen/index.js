import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '../../../components/header';
import {getSearchdMerchants} from '../../../services/merchant';
import CartImage from '../../../components/cartImage';
import {width} from 'react-native-dimension';
import {colors} from '../../../constants';
import {useFocusEffect} from '@react-navigation/native';
import {helper} from '../../../helper';
import OverLayLoader from '../../../components/loader';

const SearchScreen = ({route, navigation}) => {
  const name = route?.params?.data;
  const [filteredData, setFilteredData] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      handleSearch();
    }, []),
  );
  const handleSearch = async () => {
    setIsLoading(true);
    let location = await helper.getCurrentLocation();
    let latitude = location?.coords.latitude;
    let longitude = location?.coords.longitude;
    let params = {
      lat: latitude,
      long: longitude,
    };
    getSearchdMerchants(name, params)
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status == 'ok') {
          let data = response?.data?.data;
          setFilteredData(data);
        } else {
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'erorr======>');
      });
  };

  const navigateToDetail = val => {
    navigation.navigate('Products', {
      details: val,
    });
  };
  return (
    <>
      <OverLayLoader isloading={isloading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text="Search Result" goBack={true} />
        <View style={{marginVertical: width(1), marginHorizontal: width(3)}}>
          <Text style={{color: colors.black, fontSize: 18}}>
            All Restaurants
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          {filteredData?.length > 0 ? (
            filteredData?.map((item, ind) => (
              <View key={ind} style={{marginVertical: width(3)}}>
                <TouchableOpacity
                  style={{marginHorizontal: 10}}
                  onPress={() => navigateToDetail(item)}>
                  <View>
                    <CartImage
                      imageUrl={item.merchantImage}
                      imgContainer={styles.imgview}
                      imgStyle={styles.imageStyles}
                    />
                  </View>
                  <View>
                    <Text style={styles.txt}>{item?.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{fontSize: 18, fontWeight: '600', color: colors.black}}>
                No Record Found
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyles: {
    height: width(40),
    width: null,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  images: {
    height: width(40),
    width: width(60),
    resizeMode: 'cover',
    borderRadius: 5,
  },
  txt: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  priceTypo: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
  },
  timeview: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 10,
    width: '20%',
    left: '2%',
    borderRadius: 30,
    alignItems: 'center',
  },
  timetext: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
  },
  inputStyle: {
    borderRadius: 5,
    marginVertical: width(2),
    marginHorizontal: width(2),
    backgroundColor: colors.white,
    paddingHorizontal: width(1),
    paddingVertical: width(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SearchScreen;
