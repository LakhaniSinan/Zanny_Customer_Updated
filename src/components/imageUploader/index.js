import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {colors} from '../../constants/index';
import {helper} from '../../helper/index';
import Styles from './style';

const ImageUploader = ({
  subtext,
  viewStyle,
  getImage,
  image,
  type,
  imageStyle,
}) => {
  const [isloading, setIsLoading] = useState(false);

  const handleChangeIdImage = async () => {
    let resssss = await ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });

    let params = {
      uri: resssss.path,
      type: resssss.mime,
      name: resssss.path,
    };

    uploadFunction(params);

    const uploadFunction = async params => {
      setIsLoading(true);
      try {
        let imageUrl = await helper.ImageUploadService(params);
        getImage(imageUrl, type);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error, 'error');
      }
    };
  };

  const CheckImage = () => {
    if (isloading) {
      return (
        <View style={imageStyle}>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
            }}>
            <ActivityIndicator size={'large'} color={colors.yellow} />
          </View>
        </View>
      );
    } else {
      if (image) {
        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={{uri: image}} style={imageStyle} />
          </View>
        );
      } else {
        return (
          <>
            <View style={viewStyle}>
              {/* <Entypo name="camera" size={30} color="black" /> */}
            </View>
            <Text style={Styles.iconViewText}>{subtext}</Text>
          </>
        );
      }
    }
  };
  return (
    <View>
      <TouchableOpacity
        style={{justifyContent: 'center', alignItems: 'center'}}
        onPress={handleChangeIdImage}>
        {CheckImage()}
      </TouchableOpacity>
    </View>
  );
};

export default ImageUploader;
