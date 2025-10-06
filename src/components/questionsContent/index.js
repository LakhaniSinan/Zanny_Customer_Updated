import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Button from './../button/index';
import {width} from 'react-native-dimension';
import CheckBox from '@react-native-community/checkbox';
import {colors} from './../../constants/index';

const QuestionsContent = ({
  tagLine,
  data,
  handleSetItems,
  handleCancel,
  handlePressNext,
  type,
  handleUpdate,
}) => {
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingLeft: width(2), height: width(100)}}>
        <Text style={styles.heading}>{tagLine}</Text>

        {data?.map((item, ind) => {
          return (
            // <TouchableOpacity
            //   key={item.id}
            //   // onPress={() => handleSetItems(item, ind)}
            //   >
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={item.selected}
                tintColors={{true: '#f68843', false: 'black'}}
                style={{height: 25, width: 25}}
                onValueChange={newValue => handleSetItems(item, ind, newValue)}
              />
              <Text style={styles.label}>{item.name}</Text>
            </View>
            // </TouchableOpacity>
          );
        })}
      </ScrollView>

      {type == 'edit' ? (
        <View style={{marginVertical: width(2)}}>
          <Button
            heading="Update"
            color={colors.pinkColor}
            style={{width: '100%'}}
            onPress={handleUpdate}
          />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: width(2),
          }}>
          <View style={{width: '50%'}}>
            <Button
              heading="Cancel"
              color={colors.pinkColor}
              style={{width: '100%'}}
              onPress={handleCancel}
            />
          </View>
          <View
            style={{
              width: '50%',
            }}>
            <Button
              heading="Next"
              color={colors.pinkColor}
              style={{width: '100%'}}
              onPress={handlePressNext}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginVertical: width(2),
    paddingVertical: width(4),
    borderTopColor: '#dde2e6',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dde2e6',
    color: '#5a5e65',
    fontWeight: '500',
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    marginLeft: width(2),
  },
});

export default QuestionsContent;
