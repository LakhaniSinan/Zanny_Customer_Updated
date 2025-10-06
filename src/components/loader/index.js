import Spinner from 'react-native-loading-spinner-overlay';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {colors} from '../../constants';

const OverLayLoader = ({isloading}) => {
  return (
    <Spinner
      visible={isloading}
      color={colors.yellow}
      size="normal"
      customIndicator={<ActivityIndicator size="large" color={colors.yellow} />}
    />
  );
};

export default OverLayLoader;
