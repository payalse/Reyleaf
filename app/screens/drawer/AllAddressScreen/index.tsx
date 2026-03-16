import { Image, ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MyText } from '../../../components/MyText';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { OptionBox } from '../../cart/CheckOutScreen';
import { ShippingAddressStackParams } from '../../../naviagtion/DrawerNavigator';
import { api_getAddress } from '../../../api/user';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { heightPixel, pixelSizeVertical, widthPixel } from '../../../utils/sizeNormalization';

// address
// city
// state
// country
const AllAddressScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ShippingAddressStackParams>>();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((s: RootState) => s.auth);
  const [addresses, setAddresses] = useState<any>([]);

  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getAddress(token!);
      setAddresses(res.data || []);
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
      contentContainerStyle={{ flex: 1 }}
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{ left: 0 }}
          title="All Address"
        />
      }>
      {loading && <FullScreenLoader />}
      <View style={{ marginTop: pixelSizeVertical(20), flex: 1 }}>
        <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>Shipping to</MyText>

        <ScrollView>
          <View style={{ gap: 20, marginTop: pixelSizeVertical(20) }}>
            {addresses?.map((item: any) => {
              return (
                <OptionBox
                  key={item?._id}
                  active
                  goToEdit={() =>
                    navigation.navigate('EditAddress', {
                      raw: item,
                      addressId: item?._id,
                    })
                  }
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
                    <Image
                      style={{ width: widthPixel(22), height: heightPixel(24), resizeMode: 'cover' }}
                      source={require('../../../../assets/img/icons/addresshome.png')}
                    />
                  }
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <PrimaryBtn
          onPress={() => navigation.navigate('AddAddress')}
          text="Add New Address"
          conatinerStyle={{ marginVertical: pixelSizeVertical(12) }}
        />
      </View>
    </MainLayout>
  );
};

export default AllAddressScreen;
