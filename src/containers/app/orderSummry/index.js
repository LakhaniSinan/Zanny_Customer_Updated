import {Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../../constants';
import AppHeader from '../../../components/headerComponent';
import {fontFamily, icons} from '../../../assets';
import moment from 'moment';

const OrderSummry = ({route}) => {
  const data = route.params;
  console.log(route, 'datadatadatadatadatadatadataasdasdaa222');

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader text="Select Meals" goBack cartIcon />
      <View style={{padding: width(3)}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.poppinSemiBold,
            color: colors.redish,
          }}>
          Date of Event
        </Text>
        <View
          style={{
            height: width(30),
            backgroundColor: colors.white,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamily.poppinSemiBold,
              color: colors.gray,
            }}>
            {data?.date}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderSummry;
