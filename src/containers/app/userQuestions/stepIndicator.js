import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {colors} from './../../../constants/index';

const StepsIndicator = forwardRef((props, ref) => {
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 25,
    separatorStrokeWidth: 6,
    currentStepStrokeWidth: 1.5,
    stepStrokeWidth: 1.5,
    stepStrokeFinishedColor: '#f68843',
    separatorFinishedColor: '#f68843',
    separatorUnFinishedColor: colors.gray2,
    stepIndicatorFinishedColor: '#f68843',
    stepIndicatorUnFinishedColor: colors.gray2,
    stepIndicatorCurrentColor: '#f68843',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: colors.white,
    stepIndicatorLabelFinishedColor: colors.white,
    stepIndicatorLabelUnFinishedColor: colors.darkBlue,
    stepStrokeCurrentColor: colors.primaryColor,
    stepStrokeUnFinishedColor: colors.lightGray,
    labelSize: 11,
    currentStepLabelColor: '#f68843',
  };

  const {steps, labels} = props;
  const [currentStep, setCurrentStep] = useState(0);

  React.useImperativeHandle(ref, () => ({
    changeScreen(position) {
      setCurrentStep(position);
    },
  }));

  return (
    <View style={{}}>
      <StepIndicator
        stepCount={steps}
        currentPosition={currentStep}
        labels={labels}
        customStyles={customStyles}
      />
    </View>
  );
});

export default StepsIndicator;
