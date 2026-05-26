import {
  // Pressable,
  SafeAreaView,
  StyleSheet,
  // TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EarningStackParams} from '../../naviagtion/DrawerNavigator';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp} from '../../styles';
// import Entypo from 'react-native-vector-icons/Entypo';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import {MyText} from '../../components/MyText';
import EarningSvg from '../../../assets/svg/bg/earning-bg.svg';
// import {useSelector} from 'react-redux';
// import {RootState} from '../../redux/store';
import StripeOnboardingScreen from '../vendor/StripeOnboardingScreen';

// export const OptionBox = ({
//   leftIcon,
//   onPress,
// }: {
//   leftIcon: React.ReactNode;
//   onPress?: () => void;
// }) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         opacity: 1,
//         borderWidth: 1,
//         borderColor: COLORS.greenDark,
//         borderRadius: 15,
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginHorizontal: 20,
//       }}>
//       <View style={{marginHorizontal: 8}}>{leftIcon}</View>
//       <View style={{flex: 1, gap: 5, marginVertical: 10}}>
//         <MyText size={FONT_SIZE.base}>HDFC Bank</MyText>
//         <MyText
//           numberOfLines={1}
//           size={FONT_SIZE.base}
//           bold={FONT_WEIGHT.semibold}>
//           **************25
//         </MyText>
//         <MyText size={FONT_SIZE.base} color={COLORS.grey}>
//           Saving Account
//         </MyText>
//       </View>
//       <View style={{marginHorizontal: 20}}>
//         <Entypo name="edit" size={FONT_SIZE['xl']} color={COLORS.greenDark} />
//       </View>
//     </TouchableOpacity>
//   );
// };

const EarningScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EarningStackParams>>();
  // const {user} = useSelector((s: RootState) => s.auth);
  // const stripeConnected = user?.stripeOnboardingComplete ?? false;

  return <StripeOnboardingScreen />;

  // ── Old UI (commented out) ──────────────────────────────────────────────────
  // return (
  //   <ScrollView>
  //     <SafeAreaView />
  //     <SecondaryHeader onBack={navigation.goBack} title="My Earning" />
  //
  //     <View
  //       style={{
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         marginTop: 20,
  //         marginBottom: -30,
  //         height: hp(20),
  //       }}>
  //       <EarningSvg style={{position: 'absolute', zIndex: -1}} />
  //       <View>
  //         <MyText center color={COLORS.white} style={{opacity: 0.6}}>
  //           My Balance
  //         </MyText>
  //         <MyText
  //           center
  //           color={COLORS.white}
  //           bold={FONT_WEIGHT.bold}
  //           size={FONT_SIZE['1.5xl']}>
  //           $ {'250,452'}
  //         </MyText>
  //       </View>
  //     </View>
  //
  //     {/* Stripe Payouts card */}
  //     <TouchableOpacity
  //       style={[
  //         earningStyles.stripeCard,
  //         {borderColor: stripeConnected ? COLORS.greenDark : '#FFA500'},
  //       ]}
  //       onPress={() => navigation.navigate('StripeOnboarding')}
  //       activeOpacity={0.85}>
  //       <View style={earningStyles.stripeCardLeft}>
  //         <View
  //           style={[
  //             earningStyles.stripeDot,
  //             {backgroundColor: stripeConnected ? COLORS.greenDark : '#FFA500'},
  //           ]}
  //         />
  //         <View style={{flex: 1}}>
  //           <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base}>
  //             {stripeConnected ? 'Stripe Connected' : 'Connect Stripe Payouts'}
  //           </MyText>
  //           <MyText color={COLORS.grey} size={FONT_SIZE.sm} style={{marginTop: 2}}>
  //             {stripeConnected
  //               ? 'Your account is active — tap to view status'
  //               : 'Required to receive payments from orders'}
  //           </MyText>
  //         </View>
  //       </View>
  //       <AntDesign
  //         name={stripeConnected ? 'checkcircle' : 'arrowright'}
  //         size={20}
  //         color={stripeConnected ? COLORS.greenDark : COLORS.darkBrown}
  //       />
  //     </TouchableOpacity>
  //
  //     <View style={{paddingVertical: 20}}>
  //       <View
  //         style={{
  //           marginTop: 20,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //           marginHorizontal: 20,
  //           marginBottom: 10,
  //         }}>
  //         <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.semibold}>
  //           Saved Accounts
  //         </MyText>
  //
  //         <Pressable
  //           onPress={() => navigation.navigate('AddNewAccount')}
  //           style={{
  //             paddingVertical: 10,
  //             paddingHorizontal: 20,
  //             backgroundColor: COLORS.darkBrown,
  //             borderRadius: 20,
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>
  //           <MyText size={FONT_SIZE.sm} color={COLORS.white}>
  //             Add
  //           </MyText>
  //         </Pressable>
  //       </View>
  //       <OptionBox
  //         onPress={() => navigation.navigate('EditAccount')}
  //         leftIcon={
  //           <View
  //             style={{
  //               backgroundColor: COLORS.grey,
  //               width: 60,
  //               height: 60,
  //               borderRadius: 10,
  //             }}
  //           />
  //         }
  //       />
  //     </View>
  //
  //     <View style={{marginHorizontal: 20}}>
  //       <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.semibold}>
  //         Transcations
  //       </MyText>
  //
  //       <View style={{gap: 10, paddingVertical: 15}}>
  //         {new Array(10).fill(null).map(i => {
  //           return (
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 alignItems: 'center',
  //                 justifyContent: 'space-between',
  //                 backgroundColor: COLORS.white,
  //                 borderRadius: 20,
  //                 padding: 15,
  //               }}>
  //               <View style={{gap: 5}}>
  //                 <MyText bold={FONT_WEIGHT.bold}>Payment Withdrawal</MyText>
  //                 <MyText size={FONT_SIZE.sm}>UDF12312312312312312312</MyText>
  //               </View>
  //               <MyText bold={FONT_WEIGHT.bold} color={COLORS.greenDark}>
  //                 $160.00
  //               </MyText>
  //             </View>
  //           );
  //         })}
  //       </View>
  //     </View>
  //   </ScrollView>
  // );
};

export default EarningScreen;

const styles = StyleSheet.create({});

// const earningStyles = StyleSheet.create({
//   stripeCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 20,
//     marginTop: 10,
//     padding: 16,
//     borderWidth: 1.5,
//     borderRadius: BORDER_RADIUS['Semi-Large'],
//     backgroundColor: COLORS.white,
//   },
//   stripeCardLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     flex: 1,
//   },
//   stripeDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
// });
