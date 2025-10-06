import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { width } from 'react-native-dimension';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../components/button';
import Header from '../../../components/header';
import { colors } from '../../../constants';

const TermsAndConditions = ({ handleAccepted }) => {

  //   useEffect(()=>{
  //     handleNaigation();
  // },[])

  const handleAccept = () => {
    let termsAccepted = "yes"
    AsyncStorage.setItem('termsAccepted', JSON.stringify(termsAccepted));
    handleAccepted()
    // navigation.navigate("Login")
  };
  //   const handleNaigation=async()=>{
  //     let data = await AsyncStorage.getItem('termsAccepted')
  //     if (data) {
  //       navigation.navigate("Login")
  //       setIsLoading(false)
  //     }
  //     else{
  //       setIsLoading(false)
  //     }
  //   }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View
        style={{
          height: 60,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: width(3),
          backgroundColor: colors.orangeColor
        }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              color: colors.white,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {"Terms And Conditions"}
          </Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ margin: width(3) }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.black }}>
            Terms and Conditions
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'justify',
              fontWeight: '300',
              marginTop: 10,
              fontSize: 15
            }}>
            These Terms of Use (“Terms”) govern your use of the websites and
            mobile applications provided by zannys food (or referred to as “us”)
            (collectively the “Platforms”).
            Please read these Terms carefully.
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'justify',
              fontWeight: '300',
              marginTop: 5,
              fontSize: 15,
            }}>
            {`\u25CF`} By accessing and using the Platforms, you agree that you have read,
            understood and accepted the Terms including any additional terms and
            conditions and any policies referenced herein, available on the
            Platforms or available by hyperlink.
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'justify',
              fontWeight: '300',
              marginTop: 5,
              fontSize: 15
            }}>
            {`\u25CF`} natural persons who have reached 18 years of age and
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'justify',
              fontWeight: '300',
              marginTop: 5,
              fontSize: 15
            }}>
            {`\u25CF`} If you do not agree or fall
            within the Terms, please do not use the Platforms. The Platforms may
            be used by:
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'justify',
              fontWeight: '300',
              marginTop: 5,
              fontSize: 15
            }}>
            {`\u25CF`} corporate legal entities, e.g companies. Where applicable, these
            Terms shall be subject to country-specific provisions as set out
            herein. Users below the age of 18 must obtain consent from parent(s)
            or legal guardian(s), who by accepting these Terms shall agree to take
            responsibility for your actions and any charges associated with your
            use of the Platforms and/or purchase of Goods.
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'justify',
              fontWeight: '300',
              marginTop: 5,
              fontSize: 15
            }}>
            {`\u25CF`} If you do not have
            consent from your parent(s) or legal guardian(s), you must stop
            using/accessing the Platforms immediately. zannys food reserves the
            right to change or modify these Terms.
            {/* (including our policies which */}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: width(15),
            marginVertical: width(2)
          }}>
          <Button
            heading="Accept"
            color={colors.themeColor}
            style={{ width: '100%', }}
            onPress={handleAccept}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;
