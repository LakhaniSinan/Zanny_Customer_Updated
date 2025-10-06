import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../../constants/index';
import Button from '../../../components/button/index';
import QuestionsContent from '../../../components/questionsContent';
import {useNavigation} from '@react-navigation/native';
import CommonModal from './../../../components/modal/index';
import FinalStep from './finalStep';
import {useDispatch} from 'react-redux';
import {setUserQuestions} from './../../../redux/slices/Questions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {addDietRequirements} from '../../../services/dietRequirement';
const data = [
  {
    id: 1,
    name: 'Atkins Diet',
    selected: false,
  },
  {
    id: 2,
    name: 'The Zone Diet',
    selected: false,
  },
  {
    id: 3,
    name: 'Ketogenic Diet',
    selected: false,
  },
  {
    id: 4,
    name: 'Vegetarian Diet',
    selected: false,
  },
  {
    id: 5,
    name: 'Vegan Diet',
    selected: false,
  },
  {
    id: 6,
    name: 'Weight Watchers Diet',
    selected: false,
  },
  {
    id: 7,
    name: 'South Beach Diet',
    selected: false,
  },
  {
    id: 8,
    name: 'Raw food Diet',
    selected: false,
  },
  {
    id: 9,
    name: 'Others',
    selected: false,
  },
];

const DietryRequirements = ({route}) => {
  let previoudData = route.params.data;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  let user = useSelector(state => state.LoginSlice.user);
  const [checkboxVal, setCheckboxVal] = useState(data);
  const [showContent, setShowContent] = useState(false);
  const [finalData, setFinalData] = useState(null);
  const ref = useRef();

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
      dietryRequirements: [],
    };
    setFinalData(newObj);
    ref.current.isVisible();
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
      dietryRequirements: checkboxVal,
    };

    if (tempArr.length < 1) {
      alert('Please select atleast one dietry requirement');
    } else {
      setFinalData(newObj);
      ref.current.isVisible();
    }
  };

  const handleCancel = () => {
    AsyncStorage.setItem('allQuestions', JSON.stringify(finalData));
    navigation.navigate('Restaurants');
    ref.current.hide();
  };
  const handleSave = () => {
    AsyncStorage.setItem('allQuestions', JSON.stringify(finalData));
    let payload = {
      allRequirements: finalData,
      customerId: user._id,
    };
    addDietRequirements(payload)
      .then(res => {
        dispatch(setUserQuestions(res?.data?.data));
        navigation.navigate('Restaurants');
        ref.current.hide();
      })
      .catch(err => {});
    return;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {showContent ? (
        <QuestionsContent
          data={data}
          tagLine={'These may include'}
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
          <Text style={styles.quesHead}>
            Do you have any other Dietary Requirements?
          </Text>
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

      <CommonModal ref={ref} type="questions">
        <FinalStep handleCancel={handleCancel} handleSave={handleSave} />
      </CommonModal>
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

export default DietryRequirements;
