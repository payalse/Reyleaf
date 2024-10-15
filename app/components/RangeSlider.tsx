import {useCallback, useState, useEffect} from 'react';
import {View} from 'react-native';
import RnRangeSlider from 'rn-range-slider';
import {COLORS} from '../styles';
import ThumbSvg from '../../assets/svg/icons/filterThumb.svg';

interface SliderData {
  min: number;
  max: number;
  onValueChange: (low: number, high: number) => void;
}

const RangeSlider = ({min, max, onValueChange}: SliderData) => {
  const [low, setLow] = useState(min);
  const [high, setHigh] = useState(max);

  useEffect(() => {
    setLow(min);
    setHigh(max);
  }, [min, max]);

  const renderThumb = useCallback(
    () => (
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 30 / 2,
          borderWidth: 1.5,
          borderColor: COLORS.white,
          backgroundColor: COLORS.greenDark,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ThumbSvg />
      </View>
    ),
    [],
  );

  const renderRail = useCallback(
    () => (
      <View
        style={{
          flex: 1,
          height: 4.5,
          borderRadius: 2,
          backgroundColor: COLORS.lightgrey,
        }}
      />
    ),
    [],
  );

  const renderRailSelected = useCallback(
    () => (
      <View
        style={{
          height: 5,
          backgroundColor: COLORS.greenDark,
          borderRadius: 2,
        }}
      />
    ),
    [],
  );

  const handleValueChange = useCallback(
    (low: number, high: number) => {
      setLow(low);
      setHigh(high);
      onValueChange(low, high);
    },
    [onValueChange],
  );

  return (
    <RnRangeSlider
      min={0} // Set these to fixed values or the required range
      max={500}
      low={low}
      high={high}
      step={1}
      floatingLabel
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      onValueChanged={handleValueChange}
    />
  );
};

export default RangeSlider;
