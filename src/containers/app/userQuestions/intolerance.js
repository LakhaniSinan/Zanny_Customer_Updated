import React, {useState, useRef} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../../constants/index';
import Button from '../../../components/button/index';
import QuestionsContent from '../../../components/questionsContent';
import {useNavigation} from '@react-navigation/native';
import {ChangeScreen} from './index';

const data = [
  {
    id: 1,
    name: 'Diary (lactose)',
    selected: false,
  },
  {
    id: 2,
    name: 'Gluten',
    selected: false,
  },
  {
    id: 3,
    name: 'Caffeine',
    selected: false,
  },
  {
    id: 4,
    name: 'Salicylates',
    selected: false,
  },
  {
    id: 5,
    name: 'Amines',
    selected: false,
  },
  {
    id: 6,
    name: 'FODMAPs',
    selected: false,
  },
  {
    id: 7,
    name: 'Sulfites',
    selected: false,
  },
  {
    id: 8,
    name: 'Fructose',
    selected: false,
  },
  {
    id: 9,
    name: 'Others',
    selected: false,
  },
];

const Intolerance = () => {
  const navigation = useNavigation();
  const [checkboxVal, setCheckboxVal] = useState(data);
  const [showContent, setShowContent] = useState(false);

  const handleSetItems = (item, ind) => {
    let tempArr = [...checkboxVal];

    tempArr.map(val => {
      tempArr[ind].selected = !tempArr[ind].selected;
    });

    setCheckboxVal(tempArr);
  };

  const noPress = () => {
    let newObj = {
      intolerance: [],
    };
    navigation.navigate('FoodAllergies', {data: newObj});
    ChangeScreen(1);
  };
  const yesPress = () => {
    setShowContent(true);
  };

  const handlePressNext = () => {
    let tempArr = [];

    checkboxVal.map(item => {
      if (item.selected) {
        tempArr.push(item);
      }
    });

    let newObj = {
      intolerance: checkboxVal,
    };

    if (tempArr.length < 1) {
      alert('Please select atleast one intolerance');
    } else {
      navigation.navigate('FoodAllergies', {data: newObj});
      ChangeScreen(1);
    }
  };

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
      {showContent ? (
        <QuestionsContent
          data={data}
          tagLine={'Please select food Intolerance'}
          handleSetItems={handleSetItems}
          handlePressNext={handlePressNext}
          handleCancel={noPress}
        />
      ) : (
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f4f7',
            marginHorizontal: width(4),
            paddingVertical: width(5),
          }}>
          <Text style={styles.quesHead}>Do you have any Food Intolerance?</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: width(2),
            }}>
            <View style={{width: '50%'}}>
              <Button
                heading="No"
                color={colors.pinkColor}
                style={{width: '100%'}}
                onPress={noPress}
              />
            </View>
            <View style={{width: '50%'}}>
              <Button
                heading="Yes"
                color={colors.pinkColor}
                style={{width: '100%'}}
                onPress={yesPress}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  quesHead: {
    textAlign: 'center',
    marginVertical: width(2),
    paddingVertical: width(4),
    color: '#5a5e65',
    fontWeight: '500',
  },
});

export default Intolerance;
