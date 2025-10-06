import React, {useState, useRef} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../../constants/index';
import Button from '../../../components/button/index';

const FinalStep = ({handleCancel, handleSave}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f7',
        marginHorizontal: width(4),
        padding: width(5),
      }}>
      <Text style={styles.quesHead}>
        Finally, Would you like this information to be saved for future orders??
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
            onPress={handleCancel}
          />
        </View>
        <View style={{width: '50%'}}>
          <Button
            heading="Yes"
            color={colors.pinkColor}
            style={{width: '100%'}}
            onPress={handleSave}
          />
        </View>
      </View>
    </View>
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

export default FinalStep;
