import {FlatList, StyleSheet, SafeAreaView, View} from 'react-native';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../../styles';
import {MyText} from '../../../components/MyText';
import Feather from 'react-native-vector-icons/Feather';
import AcceptSvg from '../../../../assets/svg/icons/reqAccept.svg';
import RejectSvg from '../../../../assets/svg/icons/reqReject.svg';
const AllRequestScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="All Requests" />
      <FlatList
        data={[1, 2, 4]}
        contentContainerStyle={{marginVertical: 20, marginHorizontal: 20}}
        renderItem={() => {
          return (
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 6,
                borderRadius: 15,
                marginVertical: 10,
                flexDirection: 'row',
                gap: 5,
              }}>
              <View
                style={{
                  backgroundColor: COLORS.grey,
                  width: wp(15),
                  height: wp(15),
                  borderRadius: 10,
                }}></View>

              <View style={{justifyContent: 'space-evenly', flex: 1}}>
                <MyText bold={FONT_WEIGHT.semibold}>Erfan Amade</MyText>
                <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                  abcd15@gmail.com
                </MyText>
              </View>
              <View style={{justifyContent: 'space-evenly', gap: 5}}>
                <View style={styles.actionBtn}>
                  {/* <Feather
                    name="user-check"
                    size={FONT_SIZE.base}
                    color={COLORS.white}
                  /> */}
                  <AcceptSvg />
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    Accept
                  </MyText>
                </View>
                <View style={[styles.actionBtn, {backgroundColor: COLORS.red}]}>
                  {/* <Feather
                    name="user-x"
                    size={FONT_SIZE.base}
                    color={COLORS.white}
                  /> */}
                  <RejectSvg />
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    Reject
                  </MyText>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default AllRequestScreen;

const styles = StyleSheet.create({
  actionBtn: {
    backgroundColor: COLORS.greenDark,
    width: wp(20),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 8,
  },
});
