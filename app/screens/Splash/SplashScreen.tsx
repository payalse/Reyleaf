import React, {useEffect} from 'react';
import {View} from 'react-native';
import LayoutBG from '../../components/layout/LayoutBG';
import Animated, {
  Easing,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// IMAGES
import APP_ICON from '../../../assets/svg/icons/icon.svg';
import LeafOneImg from '../../../assets/splash/leafOne.png';
import LeafTwoImg from '../../../assets/splash/leafTwo.png';
import LeafThreeImg from '../../../assets/splash/leafThree.png';
import LeafFourImg from '../../../assets/splash/leafFour.png';
import {hp, wp} from '../../styles';

const Animated_APP_ICON = Animated.createAnimatedComponent(
  //@ts-ignore
  React.forwardRef((props, ref) => <APP_ICON {...props} forwardedRef={ref} />),
);

const SplashScreen = ({onEnd}: {onEnd: () => void}) => {
  const iconScaleValue = useSharedValue(0.2);
  const leafTwoTranslate = useSharedValue(100);
  const leafThreeTranslate = useSharedValue(-wp(90));

  const handleStart = () => {
    iconScaleValue.value = withSpring(1, {
      duration: 500,
    });
    setTimeout(() => {
      leafTwoTranslate.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      });
      leafThreeTranslate.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      });

      setTimeout(() => {
        onEnd();
      }, 900);
    }, 500);
  };
  // const handleEnd = () => {
  //   iconScaleValue.value = withSpring(0.2);
  //   leafTwoTranslate.value = withTiming(100);
  //   leafThreeTranslate.value = withTiming(-wp(90));
  // };

  useEffect(() => {
    handleStart();
  }, []);
  return (
    <LayoutBG type="bg-tr-bl" hideSafeArea>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* @ts-ignore */}
        <Animated_APP_ICON style={{transform: [{scale: iconScaleValue}]}} />

        {/* ------- BOTTOM_RIGHT_LEAF ------ */}
        <Animated.Image
          source={LeafTwoImg}
          style={{
            width: wp(70),
            height: hp(20),
            position: 'absolute',
            bottom: hp(0),
            right: wp(0),
            transform: [
              {translateX: leafTwoTranslate},
              {
                translateY: leafTwoTranslate,
              },
            ],
          }}
        />
        {/* ------- TOP_RIGHT_LEAF ------ */}
        <Animated.Image
          source={LeafOneImg}
          style={{
            width: wp(30),
            height: hp(20),
            position: 'absolute',
            top: hp(15),
            right: wp(0),
            transform: [
              {translateX: leafTwoTranslate},
              {translateY: leafTwoTranslate},
            ],
          }}
        />
        {/* -------- TOP_LEFT_LEAF ------- */}
        <Animated.Image
          source={LeafThreeImg}
          style={{
            width: wp(90),
            height: hp(93),
            position: 'absolute',
            top: hp(0),
            left: wp(0),
            transform: [
              {translateX: leafThreeTranslate},
              {translateY: leafThreeTranslate},
            ],
          }}
        />
        {/* -------- BOTTOM_LEFT_LEAF ------- */}
        <Animated.Image
          source={LeafFourImg}
          style={{
            width: wp(90),
            height: hp(93),
            position: 'absolute',
            bottom: hp(0),
            left: wp(0),
            transform: [{translateX: leafThreeTranslate}],
          }}
        />
      </View>
    </LayoutBG>
  );
};

export default SplashScreen;
