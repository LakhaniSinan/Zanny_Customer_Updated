import {Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons, images} from '../../assets';
import {colors} from '../../constants';

const CustomRating = ({rating = 0, starSize = 12, maxStars = 5}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const starWidth = width(starSize / 4);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
      {[...Array(maxStars)].map((_, index) => {
        if (index < fullStars) {
          // Filled star
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
              }}
              resizeMode="contain"
            />
          );
        } else if (index === fullStars && hasHalfStar) {
          // Half star (showing as filled with reduced opacity)
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
                opacity: 0.6,
              }}
              resizeMode="contain"
            />
          );
        } else {
          return (
            <Image
              key={index}
              source={icons.yellowStar}
              style={{
                height: starWidth,
                width: starWidth,
                marginRight: 2,
                opacity: 0.2,
              }}
              resizeMode="contain"
            />
          );
        }
      })}
    </View>
  );
};

const ReviewsCard = () => {
  return (
    <View
      style={{
        height: width(45),
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        marginTop: width(4),
        marginHorizontal: width(3),
        borderWidth: 1,
        borderColor: colors.border,
        padding: width(4),
      }}>
      <CustomRating rating={4.8} starSize={15} />
      <Text
        style={{
          fontFamily: fontFamily.poppinRegular,
          color: colors.black,
          fontSize: 10,
          marginTop: width(2),
        }}>
        He’s a good chef, keeps to time with very good hygiene. The chef was
        very friendly and nice and pays attention to details. I will definitely
        recommend him to anyone.
      </Text>
      <View
        style={{
          padding: width(1),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: width(14),
            borderRadius: 100,
            height: width(14),
            marginTop: width(2),
            backgroundColor: colors.border,
          }}>
          <Image
            source={images.cheif}
            style={{height: '100%', width: '100%'}}
            resizeMode="contain"
          />
        </View>
        <View style={{marginLeft: width(2)}}>
          <Text
            style={{
              fontSize: 12,
              marginTop: width(2),
              color: colors.redish,
              fontFamily: fontFamily.poppinSemiBold,
            }}>
            Jane
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamily.poppinRegular,
              color: colors.graydark,
            }}>
            Monday, 14 OCt 2025, 12:30PM
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewsCard;
