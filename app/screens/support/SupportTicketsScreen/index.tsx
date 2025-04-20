import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { BORDER_RADIUS, COLORS, FONT_SIZE } from '../../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SupportStackParams } from '../../../naviagtion/DrawerNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { api_getAllSupportTickets } from '../../../api/support';
import { setSupportTicket } from '../../../redux/features/support/supportSlice';
import FullScreenLoader from '../../../components/FullScreenLoader';
import TicketCard from '../../../components/TicketCard';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../../../utils/sizeNormalization';

const SupportTicketsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SupportStackParams>>();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((s: RootState) => s.auth);
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { supportTicket } = useSelector((s: RootState) => s.support);

  const fetchSupportTickets = async () => {
    try {
      setLoading(true);
      const res: any = await api_getAllSupportTickets(token!);
      dispatch(setSupportTicket(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    !supportTicket?.length && setLoading(true);
    fetchSupportTickets();
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      {loading && <FullScreenLoader />}
      <SecondaryHeader onBack={navigation.goBack} title="Support Ticket" />
      <FlatList
        style={{ marginVertical: pixelSizeVertical(20) }}
        data={supportTicket}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: COLORS.grey, fontSize: FONT_SIZE.lg }}>
              No Support Ticket Found
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <TicketCard item={item} />
          );
        }}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateNewTicket')}
        style={{
          backgroundColor: COLORS.greenDark,
          width: widthPixel(72),
          height: heightPixel(74),
          borderRadius: BORDER_RADIUS.Circle,
          position: 'absolute',
          bottom: pixelSizeVertical(26),
          right: pixelSizeHorizontal(28),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Entypo name="plus" size={FONT_SIZE['4xl']} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

export default SupportTicketsScreen;

const styles = StyleSheet.create({});
