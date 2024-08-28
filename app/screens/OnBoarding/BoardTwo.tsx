import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';

// IMAGE
import StripeTwo from '../../../assets/onbord/stripe/stripe2.svg';
import RenderBody from './components/RenderBody';

const {width} = Dimensions.get('screen');

const BoardTwo = () => {
  return (
    <RenderBody
      heading={
        'Reynette, Honest Choices, Upholding Our Commitment to Purely Eco-Friendly Offerings'
      }
      subHeading={
        "our commitment to sustainability goes beyond mere words; it's the cornerstone of our ethos"
      }
      stripeComp={
        <StripeTwo width={width} style={{position: 'absolute', top: 10}} />
      }
    />
  );
};

export default BoardTwo;

const styles = StyleSheet.create({});
