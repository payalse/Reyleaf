import React, { useEffect, useState } from 'react';
import { useHideBottomBar } from '../../../hook/useHideBottomBar';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { MyText } from '../../../components/MyText';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParams } from '../../../naviagtion/types';
import HomeSvg from '../../../../assets/svg/icons/HomeAddress.svg';
import PayPalSvg from '../../../../assets/svg/icons/PayPal.svg';
import VisaSvg from '../../../../assets/svg/icons/Visa.svg';
import EditSvg from '../../../../assets/svg/icons/edit.svg';
import { api_getAddress } from '../../../api/user';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { api_orderPlace } from '../../../api/order';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { api_chargePayment, api_getCard } from '../../../api/payment';
import { CardType } from '../../../types';
import { ShippingAddressStackParams } from '../../../naviagtion/DrawerNavigator';

export const OptionBox = ({
  active,
  leftIcon,
  onPress,
  goToEdit,
  text,
  subText,
  textBold,
}: {
  active?: boolean;
  leftIcon: React.ReactNode;
  onPress?: () => void;
  goToEdit?: () => void;
  text: string;
  subText: string;
  textBold?: boolean;
}) => {
  return (
    <View
      style={{
        display: 'flex',
        opacity: active ? 1 : 0.5,
        borderWidth: active ? 1.5 : 1.5,
        borderColor: COLORS.greenDark,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
      }}
    >
      <TouchableOpacity onPress={onPress} style={{  borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5, width: '88%'}}>
        <View
          style={{
            marginHorizontal: 8,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {leftIcon}
        </View>
        <View style={{ flex: 1, gap: 5, paddingLeft: 5 }}>
          <MyText size={FONT_SIZE.base} color={COLORS.grey}>
            {text}
          </MyText>
          <MyText
            numberOfLines={1}
            size={FONT_SIZE.base}
            bold={textBold ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal}
          >
            {subText}
          </MyText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToEdit}>
        <View style={{ marginHorizontal: 8, marginRight: 18 }}>
          <EditSvg />
        </View>
      </TouchableOpacity>
    </View>
  );
};

type AddressType = {
  address: string;
  city: string;
  country: string;
  state: string;
  updated_at: string;
  zipcode: string;
  title: string;
  _id: string;
};

const CheckOutScreen = () => {
  const params = useRoute<RouteProp<CartStackParams, 'CheckOut'>>().params;
  const navigation1 =
    useNavigation<NativeStackNavigationProp<ShippingAddressStackParams>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<CartStackParams>>();
  useHideBottomBar({});
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectetCardIndex, setSelectetCardIndex] = useState<number>(0);
  const { token, user: auth } = useSelector((s: RootState) => s.auth);

  const [address, setAddress] = useState<AddressType[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);

  const handlePlaceOrder = async () => {
    if (!address) {
      return;
    }
    const addressId = address[selectedAddressIndex]?._id;
    console.log(addressId);
    if (!addressId) {
    }
    try {
      setLoading2(true);
      const res = (await api_orderPlace(token!, addressId)) as any;
      // ToastAndroid.show('Order placed successfully!', ToastAndroid.SHORT);
      navigation.navigate('OrderSuccess');
    } catch (error: any) {
      console.log(error);
      ShowAlert({
        textBody: error.message,
        title: 'Alert',
        type: ALERT_TYPE.WARNING,
      });
    } finally {
      setLoading2(false);
    }
  };

  const chargePayment = async () => {
    console.log(cards);
    if (!cards.length) {
      ShowAlert({
        title: 'Alert',
        textBody: 'Please Add Card!',
        type: ALERT_TYPE.INFO,
      });
      return;
    }
    try {
      const payload = {
        email: auth?.email!,
        amount: params.total || 0,
        currency: 'USD',
        source: cards[selectetCardIndex].id,
        description: 'payment of ' + auth?.fullname!,
      };
      console.log(payload, 'payload');
      const res: any = await api_chargePayment(payload, token!);
      console.log(res);
      ShowAlert({
        textBody: res.message || 'success',
        type: ALERT_TYPE.SUCCESS,
      });
      handlePlaceOrder();
    } catch (error: any) {
      console.log(error, 'api_chargePayment');
      ShowAlert({ textBody: error.message, type: ALERT_TYPE.DANGER });
    } finally {
      setLoading(false);
    }
  };

  const handleGetAddress = async () => {
    try {
      setLoading(true);
      const res = (await api_getAddress(token!)) as { data: AddressType[] };
      console.log(res);
      setAddress(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleGetCards = async () => {
    try {
      setCardLoading(true);
      console.log(auth, 'auth');
      const res: any = await api_getCard(auth?.stripeCustomerId!, token!);
      console.log(res, 'api_getCard res');
      setCards(res.data);
    } catch (error) {
      console.log(error, 'api_getCard err');
    } finally {
      setCardLoading(false);
    }
  };

  const requestApi = () => {
    handleGetAddress();
    handleGetCards();
  };

  useEffect(() => {
    requestApi();
  }, [isFocused]);
  if (loading || cardLoading || loading2) {
    return <FullScreenLoader />;
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <SafeAreaView />
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{ left: 0 }}
          title="Check out"
        />
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            Shipping to
          </MyText>

          <Pressable
            onPress={() => navigation.navigate('AddAddress')}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: COLORS.darkBrown,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MyText size={FONT_SIZE.sm} color={COLORS.white}>
              Add
            </MyText>
          </Pressable>
        </View>
        <View style={{ gap: 20, marginVertical: 20 }}>
          {loading ? <MyText>Loading...</MyText> : null}
          {address?.map((item, index) => {
            return (
              <OptionBox
                key={item._id}
                text={item?.title ? item.title : 'Home'}
                subText={`${item.address}, ${item.city}, ${item.state}, ${item.country}`}
                active={selectedAddressIndex === index}
                onPress={() => {
                  setSelectedAddressIndex(index);
                  // navigation.navigate('EditAddress');
                }}
                goToEdit={() =>
                  navigation1.navigate('EditAddress', {
                    raw: item,
                    addressId: item?._id,
                  })
                }
                textBold
                leftIcon={
                  <HomeSvg />
                  // <Entypo
                  //   name="home"
                  //   size={FONT_SIZE['xl']}
                  //   color={COLORS.greenDark}
                  // />
                }
              />
            );
          })}
          {/* <OptionBox
            text="Home"
            subText="112 Willson street, apt isolnt, Ny"
            active
            onPress={() => navigation.navigate('EditAddress')}
            textBold
            leftIcon={
              <HomeSvg />
              // <Entypo
              //   name="home"
              //   size={FONT_SIZE['xl']}
              //   color={COLORS.greenDark}
              // />
            }
          />
          <OptionBox
            text="Office"
            subText="20 restor street, Opp isolnt, Ny"
            textBold
            leftIcon={
              <HomeSvg />
              // <Entypo
              //   name="home"
              //   size={FONT_SIZE['xl']}
              //   color={COLORS.greenDark}
              // />
            }
          /> */}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            Payment Method
          </MyText>

          <Pressable
            onPress={() => navigation.navigate('AddCard')}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: COLORS.darkBrown,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MyText size={FONT_SIZE.sm} color={COLORS.white}>
              Add
            </MyText>
          </Pressable>
        </View>
        <View style={{ gap: 20, marginVertical: 20 }}>
          {cards?.map((item, index) => {
            return (
              <OptionBox
                key={item.id}
                text={`**** **** **** ${item.last4}`}
                subText={item.name}
                onPress={() => {
                  setSelectetCardIndex(index);
                  // () => navigation.navigate('EditCard')
                }}
                active={selectetCardIndex === index}
                leftIcon={<VisaSvg />}
              />
            );
          })}
          {/* <OptionBox
            text="**** **** **** **54"
            subText="Visa"
            onPress={() => navigation.navigate('EditCard')}
            // active
            leftIcon={
              <VisaSvg />
              // <FontAwesome
              //   name="cc-visa"
              //   size={FONT_SIZE['xl']}
              //   color={COLORS.greenDark}
              // />
            }
          />
          <OptionBox
            text="**** **** **** **54"
            subText="Paypal"
            leftIcon={
              <PayPalSvg />
              // <FontAwesome
              //   name="cc-visa"
              //   size={FONT_SIZE['xl']}
              //   color={COLORS.greenDark}
              // />
            }
          /> */}
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
          paddingVertical: 30,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <MyText color={COLORS.grey}>Sub total</MyText>
          <MyText color={COLORS.grey}>${params?.total}</MyText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <MyText color={COLORS.grey}>Shipping fee</MyText>
          <MyText color={COLORS.grey}>${0}.00</MyText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <MyText size={FONT_SIZE['xl']} bold={FONT_WEIGHT.bold}>
            Total
          </MyText>
          <MyText size={FONT_SIZE['xl']}>${params?.total}</MyText>
        </View>
        <PrimaryBtn
          loading={loading2}
          onPress={chargePayment}
          // text="Make Payment"
          text="Place Order"
        />
      </View>
    </View>
  );
};

export default CheckOutScreen;
