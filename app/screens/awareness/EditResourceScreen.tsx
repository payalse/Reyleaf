import {
  Image,
  Platform,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import InputWrapper from '../../components/inputs/InputWrapper';
import MyInput from '../../components/inputs/MyInput';
import TextArea from '../../components/inputs/TextArea';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {COLORS, FONT_SIZE} from '../../styles';
import {MyText} from '../../components/MyText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {AwarenessStackParams} from '../../naviagtion/types';
import {BUILD_IMAGE_URL} from '../../api';
import ImageCropPicker, {
  Image as ImageType,
} from 'react-native-image-crop-picker';
import FullScreenLoader from '../../components/FullScreenLoader';
import {api_updateResource} from '../../api/awareness';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {useAppAlert} from '../../context/AppAlertContext';

const EditResourceScreen = () => {
  useHideBottomBar({unSubDisable: true});
  const navigation = useNavigation();
  const params =
    useRoute<RouteProp<AwarenessStackParams, 'EditResource'>>().params;
  const [title, setTitle] = useState(params?.title || '');
  const [des, setDes] = useState(params?.description || '');
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const {showModal} = useAppAlert()!;
  const handleSelectImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
    })
      .then(res => {
        setSelectedImage(res);
      })
      .catch(er => console.log(er));
  };

  const submit = async () => {
    const formData = new FormData();
    if (selectedImage) {
      const imagePayload = {
        name: Date.now().toString() + '.png',
        type: selectedImage?.mime,
        uri:
          Platform.OS !== 'android'
            ? 'file://' + selectedImage?.path
            : selectedImage?.path,
      };
      formData.append('picture', imagePayload);
    }
    formData.append('description', des);
    formData.append('title', title);
    try {
      setLoading(true);
      const res = await api_updateResource(token!, params.id, formData);
      console.log(res);
      showModal({text: 'Resource Updated!'});
      // @ts-ignore
      navigation.pop(2);
    } catch (error: any) {
      console.log(error);
      showModal({text: error?.message, isError: true});
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      headerComp={
        <SecondaryHeader onBack={navigation.goBack} title="Edit Resource" />
      }>
      {loading && <FullScreenLoader />}
      <View style={{marginVertical: 30}}>
        <View style={{marginVertical: 20}}>
          <TouchableOpacity
            disabled
            style={{
              backgroundColor: COLORS.white,
              width: 100,
              height: 100,
              alignSelf: 'center',
              borderRadius: 100,
              marginBottom: 10,
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {selectedImage !== null ? (
              <Image
                source={{uri: selectedImage.path}}
                style={{...StyleSheet.absoluteFillObject, borderRadius: 100}}
              />
            ) : params?.picture ? (
              <Image
                source={{uri: BUILD_IMAGE_URL(params.picture)}}
                style={{...StyleSheet.absoluteFillObject, borderRadius: 100}}
              />
            ) : (
              <MaterialIcons name="image" size={40} color={COLORS.lightgrey} />
            )}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 28,
                backgroundColor: COLORS.greenDark,
                position: 'absolute',
                bottom: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                onPress={handleSelectImage}
                name="cloud-upload-sharp"
                size={15}
                color={COLORS.white}
              />
            </View>
          </TouchableOpacity>
          <MyText color={COLORS.grey} size={FONT_SIZE.sm} center>
            Upload Your Image
          </MyText>
        </View>
        <InputWrapper title="Resource Title">
          <MyInput
            placeholder="Type Here"
            onChangeText={(t: string) => setTitle(t)}
            value={title || ''}
          />
        </InputWrapper>
        <InputWrapper title="Description">
          <TextArea
            inputStyle={{height: 200}}
            value={des}
            onChangeText={(t: string) => setDes(t)}
            placeholder="Type Here"
          />
        </InputWrapper>
      </View>
      <PrimaryBtn text="Update" onPress={submit} />
    </MainLayout>
  );
};

export default EditResourceScreen;
