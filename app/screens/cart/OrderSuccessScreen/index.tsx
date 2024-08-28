import {View} from 'react-native';
import LayoutBG from '../../../components/layout/LayoutBG';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import MyButton from '../../../components/buttons/MyButton';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import OrderSuccessSvg from '../../../../assets/svg/illustrations/OrderSuccess.svg';
import {useNavigation} from '@react-navigation/native';
const OrderSuccessScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <LayoutBG type="bg-leaf">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <OrderSuccessSvg />
        </View>
        <View style={{gap: 10}}>
          <MyText bold={FONT_WEIGHT.bold} center size={FONT_SIZE['3xl']}>
            Your Order Has been Placed Successfully
          </MyText>
          <MyText style={{marginHorizontal: 20}} center color={COLORS.grey}>
            Lorem ipsom is simple dummy Text that simply dummy text of the that
            on all is simply dummy text of the printing
          </MyText>
        </View>
      </View>

      <View style={{padding: 20, marginBottom: 20, gap: 10}}>
        <MyButton
          onPress={() => navigation.navigate('HomeTab')}
          text="Continue Shopping"
          containerStyle={{
            borderWidth: 2,
            borderColor: COLORS.greenDark,
            backgroundColor: COLORS.transparent,
          }}
          textStyle={{color: COLORS.greenDark, fontWeight: FONT_WEIGHT.bold}}
        />
        <PrimaryBtn
          onPress={() => navigation.navigate('OrderStack')}
          text="Track My Order"
        />
      </View>
    </LayoutBG>
  );
};

export default OrderSuccessScreen;
