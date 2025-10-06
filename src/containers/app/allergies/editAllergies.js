import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../components/header';
import QuestionsContent from './../../../components/questionsContent/index';
import {useDispatch, useSelector} from 'react-redux';
import {setUserQuestions} from '../../../redux/slices/Questions';
import {useFocusEffect} from '@react-navigation/native';
import {updateDietRequirements} from '../../../services/dietRequirement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../constants';

const EditAllergies = ({route, navigation}) => {
  const dispatch = useDispatch();
  let {data, heading, key, id} = route.params;
  const allergiesData = useSelector(
    state => state.QuestionsSlice.userQuestions,
  );
  const [checkboxVal, setCheckboxVal] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setCheckboxVal(data);
    }, []),
  );

  const handleSetItems = (item, ind, newValue) => {
    let tempArr = [...checkboxVal];

    tempArr.map(val => {
      tempArr[ind].selected = !tempArr[ind].selected;
    });
    setCheckboxVal(tempArr);
  };

  const handleUpdate = () => {
    let newObj = {
      ...allergiesData,
      [key]: checkboxVal,
    };

    let payload = {
      ...newObj,
    };

    return;
    updateDietRequirements(id, payload)
      .then(res => {
        return;
        dispatch(setUserQuestions(res?.data?.data));
        AsyncStorage.setItem('allQuestions', JSON.stringify(res?.data?.data));
        alert(res.data.message);
        navigation.goBack();
      })
      .catch(err => {
        alert(err?.message);
      });
    return;
  };

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
      <Header goBack text={`Edit ${heading}`} />

      <QuestionsContent
        data={checkboxVal}
        tagLine={heading}
        handleSetItems={handleSetItems}
        handleUpdate={handleUpdate}
        type="edit"
      />
    </SafeAreaView>
  );
};

export default EditAllergies;
