import {Platform, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MyButton from '../../components/buttons/MyButton';
import Google from '../../components/icons/Google';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {ShowAlert} from '../../utils/alert';
import {login, setIsAuthenticated} from '../../redux/features/auth/authSlice';
import {useNavigation} from '@react-navigation/native';
import {
  changeAppMode,
  setFirstLaunched,
} from '../../redux/features/app/appSlice';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {api_socialLogin} from '../../api/auth';
import {LoginResponseType} from '../../types/apiResponse';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../naviagtion/types';
import {fetchFcmTokenFromLocal} from '../../utils/fetchFcmTokenFromLocal';

GoogleSignin.configure({
  webClientId:
    Platform.OS === 'ios'
      ? '124903365878-q4u75lk6brdm20ghe4c466a8mc18l2mv.apps.googleusercontent.com'
      : '124903365878-1fpcrpftt9k5a3lsvvvgv01dkak3nfkb.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

const GoogleButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const onSubmit = async (
    email: string,
    fullname: string,
    socialId: string,
  ) => {
    try {
      setLoading(true);
      let fcmToken = await fetchFcmTokenFromLocal();
      const res = (await api_socialLogin({
        account_type: 1,
        fullname: fullname,
        socialId: socialId,
        email: email,
        fcmToken,
      })) as LoginResponseType;
      console.log(res);
      ShowAlert({textBody: res.message});
      dispatch(login({...res.data, token: res.token}));
      // not verfied
      if (res?.data?.profile_status !== 2) {
        navigation.navigate('CompleteYourProfile', {
          authToken: res.token,
        });
        return;
      }
      // verfied or active
      if (res.data.account_status === 2) {
        dispatch(changeAppMode('USER'));
        dispatch(setIsAuthenticated(true));
        dispatch(setFirstLaunched(false));
      }
      if (res.data.account_status === 3) {
        ShowAlert({textBody: 'Account is Blocked!', type: ALERT_TYPE.DANGER});
      }
      if (res.data.account_status === 4) {
        ShowAlert({textBody: 'Account is Deleted!', type: ALERT_TYPE.DANGER});
      }
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    console.log('GOOGLE');
    signOut();
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const res = await GoogleSignin.signIn();
      const {idToken} = res;
      console.log(res);
      const email = res.user.email;
      const name = res.user.name || '';
      const socialId = res.user.id;
      onSubmit(email, name, socialId);
      // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    } catch (error) {
      console.log(error, 'error ');
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <MyButton
      loading={loading}
      onPress={onGooglePress}
      text="Continue with Google"
      leftComp={() => <Google />}
    />
  );
};

export default GoogleButton;

const styles = StyleSheet.create({});
