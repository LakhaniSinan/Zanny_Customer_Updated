import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View, useWindowDimensions} from 'react-native';
import {width} from 'react-native-dimension';
import RenderHtml from 'react-native-render-html';
import {fontFamily} from '../../../assets';
import AppHeader from '../../../components/headerComponent';
import {colors} from '../../../constants';
import {getAdminSettings} from '../../../services/adminSettings';

const PrivacyPolicy = () => {
  const {width: screenWidth} = useWindowDimensions();
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const res = await getAdminSettings();
      if (res.status === 200) {
        setHtmlContent(res.data.data.privacyPolicy);
      }
    } catch (error) {
      console.error('Failed to fetch Privacy & Policy ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <AppHeader goBack={true} text={'Privacy & Policy'} />
      <View style={{paddingHorizontal: width(3), paddingVertical: width(5)}}>
        {loading ? (
          <Text
            style={{
              color: colors.black,
              fontFamily: fontFamily.poppinRegular,
            }}>
            Loading...
          </Text>
        ) : (
          <RenderHtml
            contentWidth={screenWidth}
            source={{html: htmlContent}}
            baseStyle={{
              color: colors.black,
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 16,
              lineHeight: 22,
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;
