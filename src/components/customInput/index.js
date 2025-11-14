import React, {useState, memo} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {Colors} from '../../constants';
import {width} from 'react-native-dimension';

const CustomInput = ({
  title,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  Icon,
  secureTextEntry,
  editable = true,
  multiline = false,
  maxLength,
  onIconPress,
  autoCapitalize = 'none',
}) => {
  const [hide, setHide] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.label}>{title}</Text>}

      <View
        style={[
          styles.inputWrapper,
          {height: multiline ? 120 : 58},
          multiline && styles.multilineAlign,
        ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.grayyy}
          keyboardType={keyboardType}
          secureTextEntry={hide}
          editable={editable}
          multiline={multiline}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          style={[
            styles.input,
            multiline && styles.multilinePadding,
            !editable && styles.disabledInput,
          ]}
        />

        {Icon && (
          <TouchableOpacity
            onPress={secureTextEntry ? () => setHide(!hide) : onIconPress}
            style={styles.iconWrapper}>
            <Image source={Icon} resizeMode="contain" style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(CustomInput);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.black,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.softgray,
    alignItems: 'center',
    paddingHorizontal: width(2),
  },
  multilineAlign: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    paddingLeft: 20,
    color: Colors.black,
  },
  multilinePadding: {
    paddingTop: 15,
  },
  disabledInput: {
    opacity: 0.6,
  },
  iconWrapper: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  icon: {
    height: 18,
    width: 18,
    tintColor: Colors.gray,
  },
});
