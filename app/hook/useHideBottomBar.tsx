import {useNavigation} from '@react-navigation/native';
import {useLayoutEffect} from 'react';
import {styles as UserTabStyle} from '../naviagtion/MainTab';
import {styles as VendorTabStyle} from '../naviagtion/vendor/VendorTab';
import {COLORS, wp} from '../styles';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

type Props = {
  unSubDisable?: boolean;
};
export function useHideBottomBar({unSubDisable = false}: Props) {
  const {mode} = useSelector((s: RootState) => s.app);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none', height: 0},
      tabBarVisible: false,
    });

    return () => {
      if (!unSubDisable) {
        navigation.getParent()?.setOptions({
          tabBarStyle:
            mode === 'VENDOR'
              ? VendorTabStyle.tabBarStyle
              : UserTabStyle.tabBarStyle,
          tabBarVisible: undefined,
        });
      }
    };
  }, [navigation]);
}
