import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootState} from '../../../redux/store';
import {updateUser} from '../../../redux/features/auth/authSlice';
import {
  api_getVendorStripeStatus,
  api_vendorStripeOnboarding,
} from '../../../api/user';
import {AppConfig} from '../../../config/env';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {MyText} from '../../../components/MyText';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';
import {EarningStackParams} from '../../../naviagtion/DrawerNavigator';
import {VendorHomeStackParams} from '../../../naviagtion/types';

const STRIPE_RETURN_URL = `${AppConfig.BASE_URL}/stripe-onboarding/complete`;
const STRIPE_REFRESH_URL = `${AppConfig.BASE_URL}/stripe-onboarding/refresh`;

const STEPS = [
  {
    label: '01',
    title: 'Start setup',
    description: 'Tap the button below to open the secure Stripe setup flow.',
  },
  {
    label: '02',
    title: 'Verify your business',
    description: 'Complete your identity and bank details on Stripe\'s secure page.',
  },
  {
    label: '03',
    title: 'Return to Reyleaf',
    description: 'Come back to this app. Your account will be verified automatically.',
  },
  {
    label: '04',
    title: 'Receive payouts',
    description: 'Earnings are deposited directly to your bank after each sale.',
  },
];

const StripeOnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EarningStackParams & VendorHomeStackParams>>();
  const dispatch = useDispatch<any>();
  const {token, user} = useSelector((s: RootState) => s.auth);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [hasCheckedManually, setHasCheckedManually] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(
    user?.stripeOnboardingComplete ?? false,
  );

  const appStateRef = useRef(AppState.currentState);
  const didOpenBrowserRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
      return () => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
      };
    }, [navigation]),
  );

  const checkStatus = useCallback(async () => {
    if (!token) return;
    try {
      setCheckingStatus(true);
      setError(null);
      const res: any = await api_getVendorStripeStatus(token);
      const complete = res?.data?.onboardingComplete === true;
      setIsComplete(complete);
      if (complete) {
        dispatch(updateUser({stripeOnboardingComplete: true} as any));
      }
    } catch {
    } finally {
      setCheckingStatus(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      const wasBackground = appStateRef.current.match(/inactive|background/);
      if (wasBackground && nextState === 'active' && didOpenBrowserRef.current) {
        didOpenBrowserRef.current = false;
        checkStatus();
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [checkStatus]);

  const onPullRefresh = useCallback(async () => {
    setRefreshing(true);
    await checkStatus();
    setRefreshing(false);
  }, [checkStatus]);

  const handleStartOnboarding = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res: any = await api_vendorStripeOnboarding(
        {refresh_url: STRIPE_REFRESH_URL, return_url: STRIPE_RETURN_URL},
        token,
      );
      const url: string | undefined = res?.data?.url;
      if (!url) {
        throw new Error('No onboarding URL received from server');
      }
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error('Unable to open Stripe onboarding link');
      }
      didOpenBrowserRef.current = true;
      await Linking.openURL(url);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to start Stripe onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <SecondaryHeader onBack={navigation.goBack} title="Payout Setup" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onPullRefresh}
            tintColor={COLORS.greenDark}
            colors={[COLORS.greenDark]}
          />
        }>

        {/* Status pill */}
        <View style={styles.pillRow}>
          <View
            style={[
              styles.dot,
              {backgroundColor: isComplete ? COLORS.greenDark : '#F59E0B'},
            ]}
          />
          <MyText
            size={FONT_SIZE.sm}
            bold={FONT_WEIGHT.semibold}
            color={isComplete ? COLORS.greenDark : '#F59E0B'}>
            {isComplete ? 'Connected' : 'Not connected'}
          </MyText>
        </View>

        {/* Header text */}
        <MyText
          bold={FONT_WEIGHT.bold}
          size={FONT_SIZE['2xl']}
          color={COLORS.darkBrown}
          style={styles.title}>
          {isComplete ? 'Payout account ready' : 'Connect your payout account'}
        </MyText>
        <MyText color={COLORS.grey} size={FONT_SIZE.base} style={styles.subtitle}>
          {isComplete
            ? 'Your Stripe account is active. Payouts are sent automatically after each completed sale.'
            : 'Link your bank account through Stripe to start receiving payments for your orders.'}
        </MyText>

        {/* Steps */}
        {!isComplete && (
          <View style={styles.steps}>
            {STEPS.map((step, i) => (
              <View key={step.label} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <MyText
                    bold={FONT_WEIGHT.bold}
                    size={FONT_SIZE.sm}
                    color={COLORS.greenDark}>
                    {step.label}
                  </MyText>
                  {i < STEPS.length - 1 && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepBody}>
                  <MyText
                    bold={FONT_WEIGHT.semibold}
                    size={FONT_SIZE.base}
                    color={COLORS.darkBrown}
                    style={styles.stepTitle}>
                    {step.title}
                  </MyText>
                  <MyText
                    size={FONT_SIZE.sm}
                    color={COLORS.grey}
                    style={styles.stepDesc}>
                    {step.description}
                  </MyText>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Success state */}
        {isComplete && (
          <View style={styles.successCard}>
            <View style={styles.successCircle}>
              <MyText bold={FONT_WEIGHT.bold} color={COLORS.white} size={FONT_SIZE['2xl']}>
                {'✓'}
              </MyText>
            </View>
            <MyText
              bold={FONT_WEIGHT.bold}
              size={FONT_SIZE.xl}
              color={COLORS.greenDark}
              center
              style={styles.successTitle}>
              All set
            </MyText>
            <MyText color={COLORS.grey} size={FONT_SIZE.sm} center style={styles.successBody}>
              Payouts will be automatically transferred to your connected bank account
              after each completed sale.
            </MyText>
          </View>
        )}

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <MyText color={COLORS.red} size={FONT_SIZE.sm}>
              {error}
            </MyText>
          </View>
        ) : null}
      </ScrollView>

      {/* Footer */}
      {!isComplete && (
        <View style={styles.footer}>
          <PrimaryBtn
            loading={loading}
            onPress={handleStartOnboarding}
            text={user?.stripeConnectedAccId ? 'Continue Stripe Setup' : 'Connect with Stripe'}
          />
          <TouchableOpacity
            style={[styles.outlineBtn, (loading || checkingStatus) && styles.disabled]}
            onPress={() => {
              setHasCheckedManually(true);
              checkStatus();
            }}
            disabled={loading || checkingStatus}
            activeOpacity={0.7}>
            {checkingStatus ? (
              <ActivityIndicator color={COLORS.greenDark} size="small" />
            ) : (
              <MyText color={COLORS.greenDark} bold={FONT_WEIGHT.semibold} size={FONT_SIZE.base}>
                Check Status
              </MyText>
            )}
          </TouchableOpacity>
          {hasCheckedManually && !isComplete && !checkingStatus && (
            <View style={styles.infoBox}>
              <MyText size={FONT_SIZE.sm} color={COLORS.darkBrown} bold={FONT_WEIGHT.semibold} style={styles.infoTitle}>
                Verification in progress
              </MyText>
              <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.infoBody}>
                Stripe verification typically completes within 5 minutes of finishing your setup. If your status hasn't updated, please wait a moment and tap "Check Status" again.
              </MyText>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default StripeOnboardingScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: pixelSizeHorizontal(24),
    paddingTop: pixelSizeVertical(20),
    paddingBottom: heightPixel(24),
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(6),
    marginBottom: pixelSizeVertical(14),
  },
  dot: {
    width: widthPixel(8),
    height: widthPixel(8),
    borderRadius: widthPixel(4),
  },
  title: {
    marginBottom: pixelSizeVertical(8),
  },
  subtitle: {
    lineHeight: 22,
    marginBottom: pixelSizeVertical(32),
  },
  steps: {
    marginBottom: pixelSizeVertical(8),
  },
  stepRow: {
    flexDirection: 'row',
  },
  stepLeft: {
    alignItems: 'center',
    width: widthPixel(32),
    marginRight: pixelSizeHorizontal(16),
  },
  stepLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: COLORS.lightgrey2,
    marginVertical: pixelSizeVertical(6),
    minHeight: pixelSizeVertical(24),
  },
  stepBody: {
    flex: 1,
    paddingBottom: pixelSizeVertical(28),
  },
  stepTitle: {
    marginBottom: pixelSizeVertical(4),
  },
  stepDesc: {
    lineHeight: 19,
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(40),
  },
  successCircle: {
    width: widthPixel(64),
    height: widthPixel(64),
    borderRadius: widthPixel(32),
    backgroundColor: COLORS.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pixelSizeVertical(16),
  },
  successTitle: {
    marginBottom: pixelSizeVertical(6),
  },
  successBody: {
    lineHeight: 20,
    paddingHorizontal: pixelSizeHorizontal(16),
  },
  errorBox: {
    borderRadius: BORDER_RADIUS.Medium,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: COLORS.red,
    padding: pixelSizeHorizontal(14),
    marginTop: pixelSizeVertical(8),
  },
  footer: {
    paddingHorizontal: pixelSizeHorizontal(24),
    paddingTop: pixelSizeVertical(12),
    paddingBottom: heightPixel(32),
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.greenDark,
    borderRadius: BORDER_RADIUS.Circle,
    paddingVertical: heightPixel(14),
    alignItems: 'center',
    marginTop: pixelSizeVertical(10),
  },
  disabled: {
    opacity: 0.5,
  },
  infoBox: {
    backgroundColor: '#FFF8E7',
    borderRadius: BORDER_RADIUS.Medium,
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: pixelSizeHorizontal(14),
    marginTop: pixelSizeVertical(12),
    gap: pixelSizeVertical(4),
  },
  infoTitle: {
    marginBottom: pixelSizeVertical(2),
  },
  infoBody: {
    lineHeight: 19,
  },
});
