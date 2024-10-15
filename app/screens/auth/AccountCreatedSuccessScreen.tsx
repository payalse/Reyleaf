import {TouchableOpacity, View, Platform, Linking, Image} from 'react-native';
import React from 'react';
import LayoutBG from '../../components/layout/LayoutBG';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import GradientBox from '../../components/GradientBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import AcCreated from '../../../assets/svg/illustrations/AcCreated.svg';
import VendorAcCreated from '../../../assets/svg/illustrations/vendor.svg';
import {MyText} from '../../components/MyText';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {setIsAuthenticated} from '../../redux/features/auth/authSlice';
import {
  changeAppMode,
  setFirstLaunched,
} from '../../redux/features/app/appSlice';
const AccountCreatedSuccessScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((s: RootState) => s.auth);

  const openAppStore = () => {
    const url = Platform.select({
      ios: 'https://apps.apple.com/us/app/facebook/id284882215', // Dummy iOS app URL (Facebook)
      android:
        'https://play.google.com/store/apps/details?id=com.facebook.katana', // Dummy Android app URL (Facebook)
    });
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };

  return (
    <LayoutBG type="bg-leaf">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        {user?.role == 2 ? (
          <VendorAcCreated style={{marginBottom: 60}} />
        ) : (
          <AcCreated style={{marginBottom: 60}} />
        )}

        <MyText
          bold={FONT_WEIGHT.bold}
          size={FONT_SIZE['3xl']}
          style={{textAlign: 'center'}}>
          {user?.role == 2
            ? 'Business Account has been created Successfully'
            : 'Your Account Created Successfully'}
        </MyText>
        <MyText
          center
          color={COLORS.grey}
          style={{paddingHorizontal: 20, marginTop: 20}}>
          Your account has been successfully created. You can now explore all
          the features available to you. If you have any questions, feel free to
          reach out to our support team.
        </MyText>
      </View>
      <View
        style={{
          paddingBottom: 40,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
        }}>
        <PrimaryBtn
          onPress={() => {
            dispatch(changeAppMode(user?.role == 2 ? 'VENDOR' : 'USER'));
            dispatch(setFirstLaunched(false));
            dispatch(setIsAuthenticated(true));
          }}
          text="Let's get Started"
        />
        <TouchableOpacity onPress={openAppStore}>
          <GradientBox
            conatinerStyle={{
              width: 50,
              height: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/img/icons/Group.png')}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
          </GradientBox>
        </TouchableOpacity>
      </View>
    </LayoutBG>
  );
};

export default AccountCreatedSuccessScreen;
