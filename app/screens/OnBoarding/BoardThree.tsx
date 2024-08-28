import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
// IMAGE
import StripeThree from '../../../assets/onbord/stripe/stripe3.svg';
import RenderBody from './components/RenderBody';

const {width} = Dimensions.get('screen');

const BoardThree = () => {
  return (
    <RenderBody
      heading="Reynette Deliveries Bringing Eco- Friendly Convenience to Doorstep"
      subHeading="At Reynette, we extend our commitment to sustainability beyond products and into the very essence of your delivery experience"
      stripeComp={
        <StripeThree width={width} style={{position: 'absolute', top: 0}} />
      }
    />
  );
};

export default BoardThree;

const styles = StyleSheet.create({});
