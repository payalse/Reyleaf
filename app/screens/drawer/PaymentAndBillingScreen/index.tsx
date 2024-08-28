import React, { useEffect, useState } from 'react';
import { useHideBottomBar } from '../../../hook/useHideBottomBar';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { MyText } from '../../../components/MyText';
import { Pressable, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParams } from '../../../naviagtion/types';
import { FlatList } from 'react-native';
import VisaSvg from '../../../../assets/svg/icons/Visa.svg';
import { api_getAllTransactions, api_getCard } from '../../../api/payment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
export const OptionBox = ({
  leftIcon,
  text,
  subText,
  onPress,
}: {
  leftIcon: React.ReactNode;
  onPress?: () => void;
  text: string;
  subText: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        opacity: 1,
        borderWidth: 1.5,
        borderColor: COLORS.lightgrey,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          marginHorizontal: 8,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {leftIcon}
      </View>
      <View style={{ flex: 1, gap: 5 }}>
        <MyText size={FONT_SIZE.base} color={COLORS.grey}>
          {text}
        </MyText>
        <MyText
          numberOfLines={1}
          size={FONT_SIZE.base}
          bold={FONT_WEIGHT.semibold}
        >
          {subText}
        </MyText>
      </View>
      <View style={{ marginHorizontal: 18 }}>
        {/* <EditSvg /> */}
        {/* <Entypo name="edit" size={FONT_SIZE['xl']} color={COLORS.greenDark} /> */}
      </View>
    </TouchableOpacity>
  );
};

const PaymentAndBillingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CartStackParams>>();
  useHideBottomBar({});
  const isFocused = useIsFocused();
  const { token, user } = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [transactions, setAllTransaction] = useState<any>([]);
  const requestApi = async () => {
    try {
      setLoading(false);
      const res: any = await api_getCard(user?.stripeCustomerId || '', token!);
      const transactions: any = await api_getAllTransactions(token!);
      console.log(transactions.data);
      setData(res?.data);
      setAllTransaction(transactions?.data);
    } catch (error) {
      console.log(error), 'api_getCard err';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, [isFocused]);

  console.log(data, 'data');

  return (
    <>
      {loading && <FullScreenLoader />}
      <FlatList
        contentContainerStyle={{
          paddingTop: 0,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
        data={transactions}
        ListHeaderComponent={() => {
          return (
            <View>
              <SafeAreaView />
              <SecondaryHeader
                onBack={navigation.goBack}
                backBtnContainerStyle={{ left: 0 }}
                title="Payment & Billing"
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
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
                {data?.map((item: any) => {
                  return (
                    <OptionBox
                      key={item?.id}
                      // onPress={() => navigation.navigate('EditCard')}
                      text={'**** **** **** ' + item?.last4}
                      subText="Visa"
                      leftIcon={
                        <VisaSvg />
                        // <FontAwesome
                        //   name="cc-visa"
                        //   size={FONT_SIZE['xl']}
                        //   color={COLORS.greenDark}
                        // />
                      }
                    />
                  );
                })}
                {/* <OptionBox
                  text={'************@gmail.com'}
                  subText="PayPal"
                  leftIcon={
                    // <FontAwesome
                    //   name="cc-visa"
                    //   size={FONT_SIZE['xl']}
                    //   color={COLORS.greenDark}
                    // />
                    <PayPal />
                  }
                /> */}
              </View>

              <MyText bold={FONT_WEIGHT.bold}>Transactions</MyText>
            </View>
          );
        }}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: COLORS.white,
                padding: 15,
                borderRadius: 20,
                marginVertical: 10,
              }}
            >
              <View style={{ gap: 5 }}>
                <MyText bold={FONT_WEIGHT.bold}>Transaction ID</MyText>
                <MyText
                  bold={FONT_WEIGHT.normal}
                  size={FONT_SIZE.sm}
                  color={COLORS.grey}
                >
                  {item.paymentIntentId}
                </MyText>
              </View>
              <MyText color={COLORS.greenDark} bold={FONT_WEIGHT.bold}>
                ${item.totalAmount}
              </MyText>
            </View>
          );
        }}
      />
    </>
  );
};
export default PaymentAndBillingScreen;
