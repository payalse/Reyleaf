import {ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {OptionBox} from '../../cart/CheckOutScreen';
import {ShippingAddressStackParams} from '../../../naviagtion/DrawerNavigator';
import {api_getAddress} from '../../../api/user';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';

// address
// city
// state
// country
const AllAddressScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ShippingAddressStackParams>>();
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const isFocused = useIsFocused();
  const [data, setData] = useState<any>([]);
  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getAddress(token!);
      console.log(res, 'api_getAddress');
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    requestApi();
  }, [isFocused, navigation]);
  return (
    <MainLayout
      contentContainerStyle={{flex: 1}}
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{left: 0}}
          title="All Address"
        />
      }>
      {loading && <FullScreenLoader />}
      <View style={{marginTop: 20, flex: 1}}>
        <MyText bold={FONT_WEIGHT.bold}>Shipping to</MyText>

        <ScrollView>
          <View style={{gap: 20, marginTop: 20}}>
            {data?.map((item: any) => {
              return (
                <OptionBox
                  key={item?._id}
                  active
                  onPress={() =>
                    navigation.navigate('EditAddress', {
                      raw: item,
                      addressId: item?._id,
                    })
                  }
                  text={item?.title ? item.title : 'Home'}
                  textBold
                  subText={`${item?.address}, ${item?.city}, ${item?.state}, ${item?.country}`}
                  leftIcon={
                    <Entypo
                      name="home"
                      size={FONT_SIZE['xl']}
                      color={COLORS.greenDark}
                    />
                  }
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <PrimaryBtn
          onPress={() => navigation.navigate('AddAddress')}
          text="Add New Address"
          conatinerStyle={{marginTop: 10, marginBottom: 20}}
        />
      </View>
    </MainLayout>
  );
};

export default AllAddressScreen;
