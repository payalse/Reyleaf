import React, { useEffect, useState } from 'react';
import { useHideBottomBar } from '../../../hook/useHideBottomBar';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { MyText } from '../../../components/MyText';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParams } from '../../../naviagtion/types';
import { FlatList } from 'react-native';
import VisaSvg from '../../../../assets/svg/icons/Visa.svg';
import DeleteSvg from '../../../../assets/svg/icons/trash.svg';
import { api_deleteCard, api_getAllTransactions, api_getCard } from '../../../api/payment';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { ShowAlert } from '../../../utils/alert';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { pixelSizeHorizontal, pixelSizeVertical } from '../../../utils/sizeNormalization';

export const OptionBox = ({
  leftIcon,
  text,
  subText,
  onPress,
  onDelete,
  deleteLoading,
}: {
  leftIcon: React.ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  deleteLoading?: boolean;
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
      }}>
      <View
        style={{
          marginHorizontal: 8,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {leftIcon}
      </View>
      <View style={{ flex: 1, gap: 5 }}>
        <MyText size={FONT_SIZE.base} color={COLORS.grey}>
          {text}
        </MyText>
        <MyText
          numberOfLines={1}
          size={FONT_SIZE.base}
          bold={FONT_WEIGHT.semibold}>
          {subText}
        </MyText>
      </View>
      <View style={{ marginHorizontal: 18 }}>
        {onDelete && (
          <Pressable
            onPress={onDelete}
            disabled={deleteLoading}
            hitSlop={12}
            style={{ padding: 4 }}>
            {deleteLoading ? (
              <ActivityIndicator size="small" color={COLORS.red} />
            ) : (
              <DeleteSvg />
            )}
          </Pressable>
        )}
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
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const handleDeleteCard = (item: any) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => onDeleteCard(item),
        style: 'destructive',
      },
    ]);
  };

  const onDeleteCard = async (item: any) => {
    if (!user?.stripeCustomerId) {
      ShowAlert({ textBody: 'Customer ID missing', type: ALERT_TYPE.DANGER });
      return;
    }
    try {
      setDeletingCardId(item?.id);
      const res: any = await api_deleteCard(token!, { customerId: user?.stripeCustomerId, cardId: item?.id });
      // if (res?.Status === 200) {
        ShowAlert({
          textBody: 'Card deleted successfully',
          type: ALERT_TYPE.SUCCESS,
        });
        requestApi();
      // } else {
      //   ShowAlert({ textBody: res?.message || 'Failed to delete card', type: ALERT_TYPE.DANGER });
      // }
    } catch (error: any) {
      console.log(error, 'error');
      ShowAlert({ textBody: error?.message || 'Failed to delete card', type: ALERT_TYPE.DANGER });
    } finally {
      setDeletingCardId(null);
    }
  };

  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getCard(user?.stripeCustomerId || '', token!);
      const transactions: any = await api_getAllTransactions(token!);
      // console.log(transactions.data);
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

  return (
    <>
      {loading && <FullScreenLoader />}
      <FlatList
        contentContainerStyle={{
          paddingTop: 0,
          paddingVertical: pixelSizeVertical(20),
          paddingHorizontal: pixelSizeHorizontal(20),
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
                  marginTop: pixelSizeVertical(20),
                }}>
                <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
                  Payment Method
                </MyText>

                <Pressable
                  onPress={() => navigation.navigate('AddCard')}
                  style={{
                    paddingVertical: pixelSizeVertical(10),
                    paddingHorizontal: pixelSizeHorizontal(20),
                    backgroundColor: COLORS.darkBrown,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MyText size={FONT_SIZE.sm} color={COLORS.white}>
                    Add
                  </MyText>
                </Pressable>
              </View>
              <View style={{ gap: 20, marginVertical: pixelSizeVertical(20) }}>
                {data?.map((item: any) => {
                  return (
                    <OptionBox
                      key={item?.id}
                      text={'**** **** **** ' + item?.last4}
                      subText="Visa"
                      onDelete={() => handleDeleteCard(item)}
                      deleteLoading={deletingCardId === item?.id}
                      leftIcon={<VisaSvg />}
                    />
                  );
                })}
                {
                  loading &&
                  <ActivityIndicator
                    size="large"
                    color={COLORS.greenDark}
                  />
                }
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
              }}>
              <View style={{ gap: 5 }}>
                <MyText bold={FONT_WEIGHT.bold}>Transaction ID</MyText>
                <MyText
                  bold={FONT_WEIGHT.normal}
                  size={FONT_SIZE.sm}
                  color={COLORS.grey}>
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
