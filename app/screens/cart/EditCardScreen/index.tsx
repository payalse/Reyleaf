import {Alert, SafeAreaView, ScrollView, View} from 'react-native';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import MyButton from '../../../components/buttons/MyButton';
import {COLORS} from '../../../styles';
import {CartStackParams} from '../../../naviagtion/types';
import {useState} from 'react';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {api_deleteCard} from '../../../api/payment';
import {RootState} from '../../../redux/store';
import {useSelector} from 'react-redux';

const formatMonthWithZero = (month: number) => {
  return month < 10 ? `0${month}` : month;
};

const EditCardScreen = () => {
  const navigation = useNavigation();
  const {params}: any = useRoute<RouteProp<CartStackParams>>();
  const {token: authToken} = useSelector((s: RootState) => s.auth);
  const cardParams = params?.params || {};
  const {last4, name, exp_month, exp_year} = cardParams;
  const [isDeleting, setisDeleting] = useState(false);

  const onDeleteCard = async () => {
    try {
      setisDeleting(true);
      const res: any = await api_deleteCard(authToken!, {
        cardId: cardParams?.id,
      });
      // console.log(res);
      ShowAlert({
        textBody: res?.message || 'success',
        type: ALERT_TYPE.SUCCESS,
      });
      // navigation.goBack();
    } catch (error: any) {
      console.log(error);
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setisDeleting(false);
    }
  };

  const handleDeleteCard = () => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        onPress: () => {
          onDeleteCard();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Edit Card" />
      <ScrollView contentContainerStyle={{padding: 20, marginTop: 10}}>
        <InputWrapper title="Cardholder Name">
          <MyInput placeholder="Type Here" value={name} editable={false} />
        </InputWrapper>
        <InputWrapper title="Card Number">
          <MyInput
            placeholder="Type Here"
            value={`**** **** **** ${last4}`}
            editable={false}
          />
        </InputWrapper>
        <InputWrapper title="Expiry Date">
          <MyInput
            placeholder="Type Here"
            value={`${formatMonthWithZero(exp_month)}/${exp_year}`}
            editable={false}
          />
        </InputWrapper>
      </ScrollView>
      <View style={{marginBottom: 30, gap: 10, marginHorizontal: 20}}>
        <MyButton
          text="Delete Card"
          loading={isDeleting}
          containerStyle={{backgroundColor: COLORS.red}}
          textStyle={{color: COLORS.white}}
          onPress={handleDeleteCard}
        />
      </View>
    </View>
  );
};

export default EditCardScreen;
