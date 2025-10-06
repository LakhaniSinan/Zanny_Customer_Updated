import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, SafeAreaView, TouchableOpacity, View} from 'react-native';
import Header from './../../../components/header/index';
import {width} from 'react-native-dimension';
import {colors} from './../../../constants/index';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {getDietRequirements} from '../../../services/dietRequirement';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Allergies = ({route}) => {
  const navigation = useNavigation();
  const allergiesData = useSelector(
    state => state.QuestionsSlice.userQuestions,
  );
  const user = useSelector(state => state.LoginSlice.user);
  const [questionsData, setQuestionsData] = useState({});
  const [checkboxVal, setCheckboxVal] = useState([]);

  // const [allergiesData, setAllergiesData] = useState(data);

  // useEffect(() => {
  //   setQuestionsData(allergiesData);
  // }, [allergiesData]);

  useEffect(() => {
    getDietRequirements(user?._id)
      .then(res => {
        setQuestionsData(res.data.data);
      })
      .catch(err => {});
  }, []);

  // const handleAllergens = (item, ind) => {
  //   let tempArr = [...allergiesData];

  //   tempArr.map(val => {
  //     tempArr[ind].selected = !tempArr[ind].selected;
  //   });
  //   setAllergiesData(tempArr);
  // };

  const renderCards = (heading, data, key, id) => {
    return (
      <View style={styles.cardStyle}>
        <Text style={styles.headingStyle}>{heading}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditAllergies', {data, heading, key, id})
          }>
          <AntDesign size={18} color={'white'} name="arrowright" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header goBack text="Allergies & Dietaries" />
      {renderCards(
        'Intolerance',
        questionsData?.allRequirements?.intolerance,
        'intolerance',
        questionsData?._id,
      )}
      {renderCards(
        'Food Allergies',
        questionsData?.allRequirements?.foodAllergies,
        'foodAllergies',
        questionsData?._id,
      )}
      {renderCards(
        'Health Problems',
        questionsData?.allRequirements?.healthProblems,
        'healthProblems',
        questionsData?._id,
      )}
      {renderCards(
        'Dietary Requirements',
        questionsData?.allRequirements?.dietryRequirements,
        'dietryRequirements',
        questionsData?._id,
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  cardStyle: {
    backgroundColor:colors.white,
    shadowColor: colors.pinkColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    borderRadius: 5,
    margin: width(2),
    paddingVertical: width(5),
    paddingHorizontal: width(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingStyle: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.white,
  },
});

export default Allergies;
