import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {colors} from '../../../constants/index';
import {width} from 'react-native-dimension';
import {getAllFAQs} from '../../../services/allergies';
import Header from '../../../components/header';
import {FlatList} from 'react-native-gesture-handler';
import OverLayLoader from '../../../components/loader';

const Faq = () => {
  const [isLoading,setIsLoading]=useState(false)
  const [allFaq, setAllFaq] = useState([]);
  useEffect(() => {
    handleGetFaqs();
  }, []);
  const handleGetFaqs = () => {
    setIsLoading(true)
    getAllFAQs()
      .then(response => {
        setIsLoading(false)
        if (response?.data?.status == 'ok') {
          console.log(response?.data, 'responseresponse ok');
          let data = response?.data?.data;
          setAllFaq(data);
        } else {
          console.log(response?.data, 'errror');
        }
      })
      .catch(error => {
        setIsLoading(true)
        console.log(error, 'error');
      });
  };

  return (
    <>
    <OverLayLoader isloading={isLoading}/>
    <SafeAreaView style={{flex: 1,backgroundColor:colors.white,marginBottom:width(15)}}>
      <Header text="FAQ's" drawer={true} />
      <View>
        {allFaq.length > 0 ?
        <FlatList
          data={allFaq}
          renderItem={({item}) => (
            <View>
              <View
                style={{
                  backgroundColor: colors.yellow,
                  marginHorizontal: width(2),
                  marginVertical: width(3),
                  borderRadius: 8,
                  elevation:5
                }}>
                <View
                  style={{
                    paddingHorizontal: width(3),
                    paddingVertical: width(3),
                  }}>
                  <Text
                    style={{
                      color: colors.black,
                      fontWeight: '500',
                      fontSize: 16,
                    }}>
                    {item?.question}
                  </Text>
                  <Text style={{color: colors.black, fontSize: 14}}>
                    {item?.answer}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
        :
        <View style={{justifyContent: 'center',marginTop:width(50)}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: width(2),
            color: 'black',
            textAlign: 'center',
          }}>
          No data found 
        </Text>
      </View>
    }
      </View>
      
    </SafeAreaView>
    </>
  );
};
export default Faq;
