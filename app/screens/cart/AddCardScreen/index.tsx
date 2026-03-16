import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { api_createCard } from '../../../api/payment';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { MyText } from '../../../components/MyText';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical } from '../../../utils/sizeNormalization';

const AddCardScreen = () => {
  const { user: auth, token: authToken } = useSelector((s: RootState) => s.auth);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const { createToken } = useStripe();

  const handleSave = async () => {
    if (!cardDetails?.complete) {
      ShowAlert({ textBody: 'Please complete card details.', type: ALERT_TYPE.DANGER });
      return;
    }
    try {
      setLoading(true);

      const { token, error } = await createToken({
        type: 'Card',
      });

      if (error) {
        throw new Error(error.message || 'Invalid card details');
      }
      if (!token) {
        throw new Error('Unable to create token');
      }

      const stripeCustomerId = auth?.stripeCustomerId;
      if (!stripeCustomerId) throw new Error('Customer not found');

      const res: any = await api_createCard(
        { customerId: stripeCustomerId, source: token.id },
        authToken!,
      );

      if (res?.success === 200) {
        ShowAlert({ textBody: res?.message || 'Card added successfully', type: ALERT_TYPE.SUCCESS });
        navigation.goBack();
      } else {
        ShowAlert({ textBody: res?.message || 'Unable to add card', type: ALERT_TYPE.DANGER });
      }
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      ShowAlert({ textBody: error.message || 'Unable to add card', type: ALERT_TYPE.DANGER });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Add New Card" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.cardFieldWrapper}>
          <MyText style={styles.label}>Card Details</MyText>
          <View style={{ width: '100%', height: 50 }}>
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: '**** **** **** ****',
                cvc: 'CVV',
                expiration: 'MM/YY',
              }}
              cardStyle={{
                textColor: '#1E1E1E',
                placeholderColor: '#A0A0A0',
              }}
              style={{ width: '100%', height: 50 }}
              onCardChange={details => {
                setCardDetails(details);
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryBtn text="Save Card" loading={loading} onPress={handleSave} disabled={loading || !cardDetails?.complete} />
      </View>
    </View>
  );
};

export default AddCardScreen;

const styles = StyleSheet.create({
  scroll: {
    padding: heightPixel(20),
    marginTop: pixelSizeVertical(10),
  },
  label: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.black,
    marginBottom: pixelSizeVertical(6),
  },
  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
    borderRadius: BORDER_RADIUS.Small,
    backgroundColor: COLORS.white,
    paddingHorizontal: pixelSizeHorizontal(4),
  },
  cardFieldWrapper: {
    marginTop: pixelSizeVertical(16),
  },
  footer: {
    marginBottom: pixelSizeVertical(30),
    gap: 10,
    marginHorizontal: pixelSizeHorizontal(20),
  },
});