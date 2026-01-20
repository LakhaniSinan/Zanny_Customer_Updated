import React, {useCallback} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons} from '../../../assets';
import AppHeader from '../../../components/headerComponent';
import {Colors} from '../../../constants';

const AllCategories = ({route, navigation}) => {
  const data = route?.params || [];

  const renderItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AllFoodScreen', item)}>
        <View style={styles.iconContainer}>
          <Image source={icons.rice} resizeMode="contain" style={styles.icon} />
        </View>

        <Text style={styles.titleText}>{item?.name}</Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader goBack={true} text="More Category" />
      <FlatList
        data={data}
        renderItem={renderItem}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item?._id || index.toString()}
        columnWrapperStyle={styles.rowWrapper}
      />
    </View>
  );
};

export default AllCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  rowWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  card: {
    width: width(30),
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.orange,
  },

  iconContainer: {
    height: width(10),
    width: width(10),
    backgroundColor: Colors.white,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    height: width(8),
    width: width(8),
  },

  titleText: {
    fontFamily: fontFamily.poppinBold,
    color: Colors.black,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
});
