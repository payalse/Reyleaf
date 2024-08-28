import {SafeAreaView, StyleProp, View, ViewStyle} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native';

type Props = {
  children: React.ReactNode;
  headerComp?: React.ReactNode;
  scrollEnabled?: boolean;
  bgColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const MainLayout = ({
  children,
  headerComp,
  scrollEnabled = true,
  bgColor,
  contentContainerStyle,
}: Props) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: bgColor || '#F5F5F5'}}
      scrollEnabled={scrollEnabled}
      contentContainerStyle={[{marginHorizontal: 20}, contentContainerStyle]}>
      <SafeAreaView />
      {headerComp}
      <View style={{flex: 1}}>{children}</View>
    </ScrollView>
  );
};

export default MainLayout;
