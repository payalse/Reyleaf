import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LayoutBG from '../../components/layout/LayoutBG';
import BackBtn from '../../components/buttons/BackBtn';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../naviagtion/types';
import {AvatarDefaultType, DefaultAvatar} from '../../utils/defaultAvatar';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {updateDefaultAvatar} from '../../redux/features/app/appSlice';
import ImageCropPicker from 'react-native-image-crop-picker';
import {SelectedImage} from '../../types';
const {width} = Dimensions.get('window');

const ChooseProfileImageScreen = () => {
  const params =
    useRoute<RouteProp<RootStackParams, 'ChooseProfileImage'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const dispatch = useDispatch<AppDispatch>();
  const [activeID, setActiveID] = useState<null | number>(null);
  const [selectedImage, setSelectedImage] = useState<null | SelectedImage>(
    null,
  );

  const handlePickFormGallery = async () => {
    try {
      const result = (await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropperCircleOverlay: true,
        cropping: true,
      })) as SelectedImage;
      setSelectedImage(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemPress = (item: AvatarDefaultType) => {
    DefaultAvatar.saveToLocal(item);
    setActiveID(item.id);
    if (item.id === 0) {
      handlePickFormGallery();
    }
  };

  const onUploadClick = () => {
    if (activeID === null) return;
    if (activeID === 0) {
      params.setSelectedImage(selectedImage);
    } else {
      const item = DefaultAvatar.getImgById(activeID);
      if (item !== null) {
        params.setSelectedImage(item);
        dispatch(updateDefaultAvatar(item));
      }
    }
    navigation.goBack();
  };

  return (
    <LayoutBG type="bg-leaf">
      <ScrollView
        contentContainerStyle={{marginHorizontal: 20, paddingBottom: 50}}>
        <BackBtn onPress={navigation.goBack} />
        <View>
          <MyText
            bold={FONT_WEIGHT.bold}
            size={FONT_SIZE['2xl']}
            style={{marginTop: 80, marginBottom: 20}}>
            Choose Profile image
          </MyText>

          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            Select your avatar from a list or choose the option to upload your
            profile from a Phone
          </MyText>
        </View>

        <View
          style={{
            marginTop: 50,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          {DefaultAvatar.getList().map((item, index: number) => {
            const isImagePicker = item.id === 0;
            const isActive = activeID === item.id;
            return (
              <TouchableOpacity
                key={item.title}
                onPress={() => {
                  handleItemPress(item);
                }}>
                <View
                  style={{
                    width: width * 0.25,
                    height: width * 0.25,
                    backgroundColor: COLORS.white,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: isActive ? 1 : 0.5,
                  }}>
                  {isImagePicker ? (
                    selectedImage === null ? (
                      <Feather name="image" size={35} color={COLORS.grey} />
                    ) : (
                      <Image
                        source={{uri: selectedImage.path}}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 100,
                          resizeMode: 'cover',
                        }}
                      />
                    )
                  ) : (
                    <Image
                      source={item.img}
                      style={{width: '100%', height: '100%'}}
                    />
                  )}
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 20,
                      backgroundColor: COLORS.greenDark,
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      top: 0,
                      right: 0,
                      display: isActive ? 'flex' : 'none',
                    }}>
                    <AntDesign name="check" size={24} color={COLORS.white} />
                  </View>
                </View>
                <MyText center style={{marginTop: 10, marginBottom: 15}}>
                  {item.title}
                </MyText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <PrimaryBtn
        onPress={onUploadClick}
        text="Upload"
        conatinerStyle={{
          marginTop: 10,
          width: '90%',
          marginBottom: 30,
          marginHorizontal: 20,
        }}
      />
    </LayoutBG>
  );
};

export default ChooseProfileImageScreen;
