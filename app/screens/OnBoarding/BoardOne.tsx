import React from 'react';

// IMAGES
import StripeOne from '../../../assets/onbord/stripe/stripe1.svg';
import RenderBody from './components/RenderBody';

const BoardOne = () => {
  return (
    <RenderBody
      heading={
        'Shop with Reynette, Elevate Your Lifestyle with Earth-Friendly Finds'
      }
      subHeading={
        'Welcome to Reynette, your exclusive gateway to a conscious and sustainable shopping experience'
      }
      stripeComp={
        <StripeOne
          style={{position: 'absolute', right: 0, top: 5, zIndex: -10}}
        />
      }
    />
  );
};

export default BoardOne;
