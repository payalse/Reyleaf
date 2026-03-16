import { FlatList, TouchableOpacity, View } from 'react-native';
import { MyText } from './MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { Rating } from 'react-native-ratings';
import IconOrderSvg from '../../assets/svg/icons/orderCompleted.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrderStackParams } from '../naviagtion/DrawerNavigator';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../styles';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical } from '../utils/sizeNormalization';

type Props = {
  orders: any[];
  type: 'pending' | 'completed';
  downloadInvoice?: (id: string) => void;
};

const OrderCardList = ({ orders, type, downloadInvoice }: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.orderId}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 20,
        marginTop: pixelSizeVertical(30),
        paddingBottom: pixelSizeVertical(50),
      }}
      renderItem={({ item }) => {
        const hasReview = item?.rating;
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrderDetail', { orderId: item?.orderId })
            }
            style={{
              backgroundColor: COLORS.white,
              padding: heightPixel(20),
              borderRadius: BORDER_RADIUS['Semi-Large'],
              gap: 10,
            }}>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <MyText bold={FONT_WEIGHT.semibold}>
                Order ID - {item?.orderId}
              </MyText>
              <View
                style={{
                  backgroundColor: COLORS.darkBrown,
                  paddingHorizontal: pixelSizeHorizontal(10),
                  paddingVertical: pixelSizeVertical(6),
                  borderRadius: BORDER_RADIUS['Semi-Large'],
                }}>
                <MyText
                  size={FONT_SIZE.sm}
                  bold={FONT_WEIGHT.semibold}
                  color={COLORS.white}>
                  {item?.items.length} Order Items
                </MyText>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 5 }}>
              <AntDesign
                name="clockcircle"
                size={FONT_SIZE.base}
                color={COLORS.grey}
              />
              <MyText size={FONT_SIZE.base} color={COLORS.grey}>
                {moment(item?.createdAt).format('MMMM Do, YYYY h:mm A')}
              </MyText>
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <MyText size={FONT_SIZE.base}>Order total</MyText>
              <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.semibold}>
                ${item?.totalAmount}
              </MyText>
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <MyText size={FONT_SIZE.base}>Status</MyText>
              <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.semibold}>
                {item?.status}
              </MyText>
            </View>

            {type === 'completed' && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {hasReview ? (
                  <View>
                    <MyText size={FONT_SIZE.sm}>Order Review & Rating</MyText>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        marginTop: 5,
                      }}>
                      <Rating
                        type="star"
                        ratingCount={item?.rating}
                        imageSize={20}
                        readonly
                      />
                      <MyText size={FONT_SIZE.sm}>{item?.rating}</MyText>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('OrderReview', { orderId: item?._id })
                    }
                    style={{
                      backgroundColor: 'rgba(6, 95, 70, 0.15)',
                      height: 40,
                      flex: 1,
                      marginRight: 20,
                      borderRadius: BORDER_RADIUS.XMedium,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 10,
                      borderWidth: 2,
                      borderColor: COLORS.greenDark,
                    }}>
                    <AntDesign
                      name="star"
                      size={FONT_SIZE.base}
                      color={COLORS.greenDark}
                    />
                    <MyText size={FONT_SIZE.base} color={COLORS.greenDark}>
                      Write your Review
                    </MyText>
                  </TouchableOpacity>
                )}

                {/* Download Invoice */}
                <TouchableOpacity
                  onPress={() => downloadInvoice && downloadInvoice(item?._id)}
                  style={{
                    backgroundColor: COLORS.darkBrown,
                    width: 40,
                    height: 40,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IconOrderSvg />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default OrderCardList;
