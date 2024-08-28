import React, {useCallback, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import BoardOne from './BoardOne';
import BoardTwo from './BoardTwo';
import BoardThree from './BoardThree';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {COLORS, hp, wp} from '../../styles';
import {MyText} from '../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
// IMAGES
import ImgOne from '../../../assets/onbord/img/img1.png';
import ImgTwo from '../../../assets/onbord/img/img2.png';
import ImgThree from '../../../assets/onbord/img/img3.png';
import Dot from './components/Dot';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../naviagtion/types';

// LEAF
import Leave1Svg from '../../../assets/onbord/leaf/leaf1.svg';
import Leave2Svg from '../../../assets/onbord/leaf/leaf2.svg';
import Leave2Png from '../../../assets/onbord/leaf/leaf2.png';
import Leave3Svg from '../../../assets/onbord/leaf/leaf3.svg';
import Leave3Png from '../../../assets/onbord/leaf/leaf3.png';
import Leave4Svg from '../../../assets/onbord/leaf/leaf4.svg';
import {Touchable} from 'react-native';

const CONTENT_HEIGHT = hp(65);
export const MARGIN_TOP = CONTENT_HEIGHT;

const IMAGES = [ImgThree, ImgOne, ImgTwo];
const OnBoarding = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<any>();
  const CENTER_IMAGE = IMAGES[activeIndex];

  const handleScollToIndex = (index: number) => {
    if (flatListRef.current != null) {
      flatListRef?.current?.scrollToIndex({animated: true, index});
    }
  };

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.abs(Math.round(index));
      setActiveIndex(roundIndex);
    },
    [],
  );

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, position: 'relative'}}>
        <View
          style={{
            width: '100%',
            height: CONTENT_HEIGHT,
            position: 'absolute',
            zIndex: 10,
            marginTop: hp(4),
            alignItems: 'center',
            gap: 10,
            // opacity: 0.3,
          }}>
          <View
            style={{
              width: 100,
              alignSelf: 'flex-end',
              justifyContent: 'center',
              alignItems: 'center',

              opacity: activeIndex === 2 ? 0 : 1,
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <MyText>Skip</MyText>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: 100,
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {[0, 1, 2].map((_, index) => (
              <Dot key={index} active={index === activeIndex} />
            ))}
          </View>
          <View
            style={{
              marginTop: hp(5),
              width: wp(80),
              height: wp(80),
            }}>
            {/*  1 */}
            {activeIndex === 0 && (
              <React.Fragment>
                <Leave4Svg style={{position: 'absolute', top: -25, right: 0}} />
                <Image
                  source={Leave3Png}
                  style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -20,
                    width: 120,
                    height: 120,
                    resizeMode: 'contain',
                  }}
                />
              </React.Fragment>
            )}

            {/* 2 */}
            {activeIndex === 1 && (
              <React.Fragment>
                <Leave4Svg
                  style={{
                    position: 'absolute',
                    top: -25,
                    left: 20,
                    transform: [{rotate: '-50deg'}],
                  }}
                />
                <Image
                  source={Leave2Png}
                  style={{
                    position: 'absolute',
                    bottom: -30,
                    right: -20,
                    width: 150,
                    height: 150,
                    resizeMode: 'contain',
                  }}
                />
              </React.Fragment>
            )}
            {/* 3 */}
            {activeIndex === 2 && (
              <React.Fragment>
                <Leave4Svg style={{position: 'absolute', top: -25, right: 0}} />
                <Leave1Svg
                  style={{
                    position: 'absolute',
                    bottom: -25,
                    left: 0,

                    transform: [{rotate: '0deg'}],
                  }}
                />
              </React.Fragment>
            )}

            <Image
              source={CENTER_IMAGE}
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            />
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          // style={{backgroundColor: 'blue'}}
          // scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3]}
          pagingEnabled
          horizontal
          onScroll={onScroll}
          renderItem={({item}) => {
            if (item === 1) {
              return <BoardOne />;
            }
            if (item === 2) {
              return <BoardTwo />;
            }
            if (item === 3) {
              return <BoardThree />;
            }
            return <View />;
          }}
        />
      </View>
      {/* ACTION BTN */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 15,
        }}>
        {activeIndex === 2 ? (
          <PrimaryBtn
            text="Let's Get Started"
            onPress={() => navigation.navigate('Welcome')}
          />
        ) : (
          <PrimaryBtn
            text="Next"
            onPress={() => {
              if (activeIndex <= 2) {
                handleScollToIndex(activeIndex + 1);
              }
            }}
            rightComp={() => (
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: COLORS.white,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign
                  name="arrowright"
                  size={15}
                  color={COLORS.greenDark}
                />
              </View>
            )}
          />
        )}
      </View>
      <SafeAreaView />
    </View>
  );
};

export default OnBoarding;
