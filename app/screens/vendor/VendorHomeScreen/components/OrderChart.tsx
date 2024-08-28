import {Text, View} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {COLORS, wp} from '../../../../styles';
type Props = {
  totalOrders: number;
  completedOrders: number;
};

const OrderChart = (props: Props) => {
  const pieData = [
    {
      value: props.totalOrders,
      color: COLORS.lightgrey2
    },
    {
      value: props.completedOrders,
      color: COLORS.greenDark
    },
  ];

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <PieChart
        data={pieData}
        donut
        showGradient
        sectionAutoFocus
        radius={60}
        innerRadius={40}
        innerCircleColor={COLORS.white}
        centerLabelComponent={() => {
          return (
            <View
              style={{justifyContent: 'center', alignItems: 'center'}}></View>
          );
        }}
      />
    </View>
  );
};

export default OrderChart;
