import {StyleSheet, TextInput, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SuggestedList from './SuggestedList';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../../styles';
import {MyText} from '../../../components/MyText';
import BlockedList from './BlockedList';
import RequestedList from './RequestedList';
import MyFriendList from './MyFriendList';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Tab = createMaterialTopTabNavigator();
const topTabConfig = [
  {
    id: 1,
    name: 'Suggested',
    comp: SuggestedList,
  },
  {
    id: 2,
    name: 'My Friend',
    comp: MyFriendList,
  },
  {
    id: 3,
    name: 'Requested',
    comp: RequestedList,
  },
  {
    id: 4,
    name: 'Blocked',
    comp: BlockedList,
  },
];

export const FriendSearch = ({
  value,
  onChangeText,
  onFocus,
}: {
  onChangeText?: (s: string) => void;
  value?: string;
  onFocus?: (s: any) => void;
}) => {
  return (
    <View style={styles.searchInputWrapper}>
      <AntDesign name="search1" color={COLORS.grey} size={FONT_SIZE.xl} />
      <TextInput
        onChangeText={onChangeText}
        value={value}
        style={{paddingVertical: 15, color: 'black'}}
        placeholder="Search here"
        placeholderTextColor={'grey'}
        onFocus={() => onFocus}
      />
    </View>
  );
};

const FriendsTab = () => {
  return (
    <View style={{height: '100%'}}>
      <View style={styles.searchContainer}></View>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: false,
          tabBarAllowFontScaling: true,
          tabBarScrollEnabled: true,
          tabBarIndicator: () => null,
          tabBarStyle: {
            backgroundColor: COLORS.transparent,
          },
          tabBarItemStyle: {
            width: 'auto',
          },
          tabBarLabel({children, focused}) {
            const color = focused ? COLORS.black : COLORS.grey;
            const bold = focused ? FONT_WEIGHT.bold : FONT_WEIGHT.normal;
            return (
              <View
                style={{
                  marginVertical: 5,
                  width: FONT_SIZE.xl * children.length * 0.6,
                }}>
                <MyText size={FONT_SIZE.xl} color={color} bold={bold}>
                  {children}
                </MyText>
              </View>
            );
          },
        }}>
        {topTabConfig.map(item => {
          return (
            <Tab.Screen key={item.id} name={item.name} component={item.comp} />
          );
        })}
      </Tab.Navigator>
    </View>
  );
};

export default FriendsTab;

const styles = StyleSheet.create({
  seprator: {
    height: 0.3,
    width: '90%',
    backgroundColor: COLORS.lightgrey,
    alignSelf: 'center',
  },
  headerWrapper: {
    marginHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  searchInputWrapper: {
    height: 45,
    backgroundColor: COLORS.lightgrey2,
    marginVertical: 10,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  locationBtn: {
    backgroundColor: COLORS.darkBrown,
    width: wp(12),
    height: wp(12),
    borderRadius: wp(12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
