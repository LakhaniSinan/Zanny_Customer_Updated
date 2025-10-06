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
    name: 'Gluten',
    selected: false,
  },
  {
    id: 2,
    name: 'Celery',
    selected: false,
  },
  {
    id: 3,
    name: 'Mustard',
    selected: false,
  },
  {
    id: 4,
    name: 'Eggs',
    selected: false,
  },
  {
    id: 5,
    name: 'Milk',
    selected: false,
  },
  {
    id: 6,
    name: 'Sesame',
    selected: false,
  },
  {
    id: 7,
    name: 'Fish',
    selected: false,
  },
  {
    id: 8,
    name: 'Crustaceans',
    selected: false,
  },
  {
    id: 9,
    name: 'Molluscs',
    selected: false,
  },
  {
    id: 10,
    name: 'Soya',
    selected: false,
  },
  {
    id: 11,
    name: 'Sulphites',
    selected: false,
  },
  {
    id: 12,
    name: 'Lupin',
    selected: false,
  },
  {
    id: 13,
    name: 'Peanuts',
    selected: false,
  },
  {
    id: 14,
    name: 'Tree Nuts',
    selected: false,
  },
  {
    id: 15,
    name: 'Others',
    selected: false,
  },
];

const FoodAllergies = ({route}) => {
  let previoudData = route.params.data;
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
      ...previoudData,
      foodAllergies: [],
    };
    navigation.navigate('HealthProblems', {data: newObj});
    ChangeScreen(2);
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
      ...previoudData,
      foodAllergies: checkboxVal,
    };

    if (tempArr.length < 1) {
      alert('Please select atleast one allergy');
    } else {
      navigation.navigate('HealthProblems', {data: newObj});
      ChangeScreen(2);
    }
  };

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
      {showContent ? (
        <QuestionsContent
          data={data}
          tagLine={'Please select the items You are Allergic to'}
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
          <Text style={styles.quesHead}>Do you have any Food Allergies?</Text>
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

export default FoodAllergies;
