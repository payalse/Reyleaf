import {
  View,
  TextInput,
  KeyboardType,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform,
  StyleProp,
  TextStyle,
} from 'react-native';
import React, {ChangeEvent, useState} from 'react';
import {COLORS} from '../../styles';
import Feather from 'react-native-vector-icons/Feather';
type Props = {
  placeholder?: string;
  keyboardType?: KeyboardType;
  isPassword?: boolean;
  onChangeText?: (e: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  value?: string;
  leftIcon?: () => React.ReactNode;
  inputStyle?: StyleProp<TextStyle>;
  hasError?: boolean;
};

const isAndroid = Platform.OS === 'android';

const MyInput = ({
  placeholder,
  keyboardType,
  isPassword,
  onBlur,
  onChangeText,
  value,
  leftIcon,
  inputStyle,
  hasError = false,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
  return (
    <View style={{flex: 1}}>
      {leftIcon && (
        <View
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            left: 20,
            top: isAndroid ? 20 : 15,
          }}>
          {leftIcon()}
        </View>
      )}
      <TextInput
        onBlur={e => {
          onBlur && onBlur(e);
          setIsFocused(false);
        }}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        placeholderTextColor={COLORS.grey}
        keyboardType={keyboardType ? keyboardType : 'default'}
        secureTextEntry={secureTextEntry}
        style={[
          {
            minHeight: 50,
            paddingVertical: 18,
            paddingRight: isPassword ? 70 : 20,
            paddingLeft: leftIcon ? 50 : 20,
            borderRadius: 50,
            fontSize: 15,
            borderWidth: hasError ? 1.5 : 1,
            borderColor: hasError
              ? COLORS.red
              : isFocused
              ? COLORS.greenDark
              : COLORS.lightgrey,
            color: COLORS.black,
            backgroundColor: 'transparent',
          },
          inputStyle,
        ]}
      />
      {isPassword ? (
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            top: isAndroid ? 10 : 5,
            right: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather
            name={secureTextEntry ? 'eye' : 'eye-off'}
            size={24}
            color={'rgba(0,0,0,0.2)'}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default MyInput;
