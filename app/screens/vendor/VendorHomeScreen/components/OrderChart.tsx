import { Text, View } from 'react-native';
import PieChart, { Slice } from 'react-native-pie-chart'
import { COLORS } from '../../../../styles';
import { widthPixel } from '../../../../utils/sizeNormalization';

type Props = {
  totalOrders: number;
  completedOrders: number;
};

const OrderChart = (props: Props) => {
  const totalOrders = Number(props.totalOrders) || 0;
  const completedOrders = Number(props.completedOrders) || 0;

  if (totalOrders === 0) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text>No orders to display</Text>
      </View>
    );
  }

  const SERIES: Slice[] = [
    { value: totalOrders, color: COLORS.lightgrey2 },
    { value: completedOrders, color: COLORS.greenDark },
  ];

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <PieChart
        widthAndHeight={widthPixel(120)}
        series={SERIES}
        cover={0.6}
        
      />
      <Text
        style={{
          position: 'absolute',
          top: widthPixel(120) / 2.5,
          fontWeight: 'bold',
        }}>
      </Text>
    </View>
  );
};

export default OrderChart;
