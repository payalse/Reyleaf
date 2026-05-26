import {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RouteProp,
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {MyText} from '../../../components/MyText';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import BackBtn from '../../../components/buttons/BackBtn';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {RootStackParams} from '../../../naviagtion/types';
import {AppConfig} from '../../../config/env';
import {
  api_getVendorStripeStatus,
  api_vendorStripeOnboarding,
} from '../../../api/user';
import {updateUser} from '../../../redux/features/auth/authSlice';
import {AppDispatch, RootState} from '../../../redux/store';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';

const STRIPE_RETURN_URL = `${AppConfig.BASE_URL}/stripe-onboarding/complete`;
const STRIPE_REFRESH_URL = `${AppConfig.BASE_URL}/stripe-onboarding/refresh`;

const STORAGE_KEY = '@reyleaf/vendor_stripe_onboarding';
const URL_EXPIRY_MS = 60 * 60 * 1000;
const ONBOARDING_TIMEOUT_MS = 15 * 60 * 1000;

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

type ValidateResult = {isComplete: boolean; message: string};

const STEPS = [
  {
    label: '01',
    title: 'Start setup',
    description: 'Tap the button below to open the secure Stripe setup flow.',
  },
  {
    label: '02',
    title: 'Verify your business',
    description: 'Fill in your business details and banking information in the browser.',
  },
  {
    label: '03',
    title: 'Receive payouts',
    description: 'Once approved, earnings are deposited directly to your bank.',
  },
];

const VendorOnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const {authToken} =
    useRoute<RouteProp<RootStackParams, 'VendorOnboarding'>>().params;
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const reduxToken = useSelector((s: RootState) => s.auth.token);
  const token = authToken || reduxToken || '';

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isWaitingForBrowser, setIsWaitingForBrowser] = useState(false);
  const [validationFailed, setValidationFailed] = useState(false);

  const appStateRef = useRef(AppState.currentState);
  const browserOpenRef = useRef(false);
  const isProcessingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true, 'fade');
      return () => {
        StatusBar.setHidden(false, 'fade');
      };
    }, []),
  );

  const clearOnboardingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const persistOnboardingUrl = useCallback(async (url: string) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({url, timestamp: Date.now()}),
      );
    } catch {}
  }, []);

  const retrieveOnboardingUrl = useCallback(async (): Promise<string | null> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const data = JSON.parse(stored) as {url: string; timestamp: number};
      if (Date.now() - data.timestamp > URL_EXPIRY_MS) {
        await AsyncStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data.url;
    } catch {
      return null;
    }
  }, []);

  const removeOnboardingUrl = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const goToSuccess = useCallback(() => {
    navigation.navigate('AccountCreatedSuccess');
  }, [navigation]);

  const checkStripeComplete = useCallback(
    async (warmupMs: number): Promise<ValidateResult> => {
      try {
        if (warmupMs > 0) {
          await delay(warmupMs);
        }
        const res: any = await api_getVendorStripeStatus(token);
        const complete = res?.data?.onboardingComplete === true;
        if (complete) {
          setValidationFailed(false);
          dispatch(updateUser({stripeOnboardingComplete: true} as any));
          return {isComplete: true, message: 'Setup complete.'};
        }
        setValidationFailed(true);
        return {
          isComplete: false,
          message: 'Stripe onboarding is incomplete. Finish in the browser or tap Refresh.',
        };
      } catch {
        setValidationFailed(true);
        return {
          isComplete: false,
          message: 'Could not verify Stripe status. Check your connection.',
        };
      }
    },
    [token, dispatch],
  );

  const finishIfComplete = useCallback(
    async (status: ValidateResult) => {
      if (!status.isComplete) return false;
      browserOpenRef.current = false;
      setIsWaitingForBrowser(false);
      clearOnboardingTimeout();
      await removeOnboardingUrl();
      isProcessingRef.current = false;
      setLoading(false);
      setIsComplete(true);
      return true;
    },
    [removeOnboardingUrl, clearOnboardingTimeout],
  );

  const checkStatusQuiet = useCallback(async () => {
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
      setIsComplete(false);
    } finally {
      setCheckingStatus(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    checkStatusQuiet();
  }, [checkStatusQuiet]);

  const startTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (browserOpenRef.current && !isProcessingRef.current) {
        browserOpenRef.current = false;
        setIsWaitingForBrowser(false);
        await removeOnboardingUrl();
        setLoading(false);
        ShowAlert({
          type: ALERT_TYPE.WARNING,
          title: 'Onboarding timeout',
          textBody: 'The onboarding step took too long. You can try again or skip for now.',
        });
      }
      timeoutRef.current = null;
    }, ONBOARDING_TIMEOUT_MS);
  }, [removeOnboardingUrl]);

  useEffect(() => {
    const restore = async () => {
      const saved = await retrieveOnboardingUrl();
      if (saved) {
        browserOpenRef.current = true;
        setIsWaitingForBrowser(true);
      }
    };
    void restore();
  }, [retrieveOnboardingUrl]);

  useEffect(() => {
    const onChange = async (next: AppStateStatus) => {
      const wasBg = appStateRef.current.match(/inactive|background/);
      const nowActive = next === 'active';
      if (wasBg && nowActive) {
        const savedUrl = await retrieveOnboardingUrl();
        if ((browserOpenRef.current || savedUrl) && !isProcessingRef.current) {
          if (savedUrl) {
            setIsWaitingForBrowser(true);
          }
          const warmup = Platform.OS === 'ios' ? 2000 : 1500;
          try {
            const status = await checkStripeComplete(warmup);
            if (await finishIfComplete(status)) {
              goToSuccess();
            }
          } catch {
          } finally {
            setLoading(false);
          }
        }
      }
      appStateRef.current = next;
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => {
      sub.remove();
      clearOnboardingTimeout();
    };
  }, [retrieveOnboardingUrl, checkStripeComplete, finishIfComplete, goToSuccess, clearOnboardingTimeout]);

  useEffect(() => {
    if (!isFocused) return;
    const run = async () => {
      const saved = await retrieveOnboardingUrl();
      if (saved && !isProcessingRef.current) {
        browserOpenRef.current = true;
        setIsWaitingForBrowser(true);
      }
      try {
        const warmup = saved ? (Platform.OS === 'ios' ? 2000 : 1500) : 0;
        const status = await checkStripeComplete(warmup);
        if (await finishIfComplete(status)) {
          goToSuccess();
        }
      } catch {
      } finally {
        if (!browserOpenRef.current) {
          isProcessingRef.current = false;
        }
        setLoading(false);
      }
    };
    void run();
    return () => {
      if (!browserOpenRef.current) {
        isProcessingRef.current = false;
      }
    };
  }, [isFocused, retrieveOnboardingUrl, checkStripeComplete, finishIfComplete, goToSuccess]);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', e => {
      if (!isWaitingForBrowser && !isProcessingRef.current) return;
      e.preventDefault();
      ShowAlert({
        type: ALERT_TYPE.WARNING,
        title: 'Stripe onboarding',
        textBody: 'Finish or cancel Stripe onboarding before leaving this screen.',
      });
    });
    return unsub;
  }, [navigation, isWaitingForBrowser]);

  const openStripeOnboarding = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      setValidationFailed(false);
      const res: any = await api_vendorStripeOnboarding(
        {refresh_url: STRIPE_REFRESH_URL, return_url: STRIPE_RETURN_URL},
        token,
      );
      const url: string | undefined = res?.data?.url;
      if (!url) {
        throw new Error('No onboarding URL received from server');
      }
      isProcessingRef.current = false;
      browserOpenRef.current = true;
      setIsWaitingForBrowser(true);
      await persistOnboardingUrl(url);
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error('Unable to open Stripe onboarding link');
      }
      await Linking.openURL(url);
      startTimeout();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to open Stripe onboarding');
      browserOpenRef.current = false;
      setIsWaitingForBrowser(false);
      await removeOnboardingUrl();
      isProcessingRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [token, persistOnboardingUrl, removeOnboardingUrl, startTimeout]);

  const handleRefreshValidation = useCallback(async () => {
    try {
      setLoading(true);
      setValidationFailed(false);
      const status = await checkStripeComplete(2000);
      if (await finishIfComplete(status)) {
        goToSuccess();
      } else {
        ShowAlert({type: ALERT_TYPE.DANGER, textBody: status.message});
      }
    } catch {
      setValidationFailed(true);
    } finally {
      setLoading(false);
    }
  }, [checkStripeComplete, finishIfComplete, goToSuccess]);

  const onPullRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const status = await checkStripeComplete(0);
      if (await finishIfComplete(status)) {
        goToSuccess();
      }
    } catch {
    } finally {
      setRefreshing(false);
    }
  }, [checkStripeComplete, finishIfComplete, goToSuccess]);

  const cancelWaiting = useCallback(async () => {
    browserOpenRef.current = false;
    setIsWaitingForBrowser(false);
    clearOnboardingTimeout();
    await removeOnboardingUrl();
    setLoading(false);
    isProcessingRef.current = false;
    setValidationFailed(false);
  }, [removeOnboardingUrl, clearOnboardingTimeout]);

  return (
    <View style={styles.root}>
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

        <BackBtn onPress={() => navigation.goBack()} />

        {/* Header */}
        <View style={styles.header}>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE['3xl']} style={styles.title}>
            Payout Setup
          </MyText>
          {!isWaitingForBrowser && (
            <MyText color={COLORS.grey} size={FONT_SIZE.base} style={styles.subtitle}>
              {isComplete
                ? 'Your payout account is connected and ready.'
                : 'Connect your bank account to start receiving payments from customers.'}
            </MyText>
          )}
        </View>

        {/* Checking state */}
        {checkingStatus && !isWaitingForBrowser && !isComplete && (
          <View style={styles.centerBlock}>
            <ActivityIndicator size="large" color={COLORS.greenDark} />
            <MyText color={COLORS.grey} size={FONT_SIZE.sm} style={styles.centerText}>
              Checking status...
            </MyText>
          </View>
        )}

        {/* Steps */}
        {!isComplete && !isWaitingForBrowser && !checkingStatus && (
          <View style={styles.steps}>
            {STEPS.map((step, i) => (
              <View key={i} style={styles.stepRow}>
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

        {/* Waiting state */}
        {isWaitingForBrowser && (
          <View style={[styles.statusCard, validationFailed ? styles.cardFailed : styles.cardWaiting]}>
            <View style={styles.statusRow}>
              {!validationFailed && (
                <ActivityIndicator
                  size="small"
                  color={COLORS.greenDark}
                  style={styles.statusSpinner}
                />
              )}
              <MyText
                size={FONT_SIZE.sm}
                bold={FONT_WEIGHT.semibold}
                color={validationFailed ? COLORS.red : COLORS.greenDark}>
                {validationFailed ? 'Verification failed' : 'In progress'}
              </MyText>
            </View>
            <MyText
              bold={FONT_WEIGHT.semibold}
              color={COLORS.darkBrown}
              size={FONT_SIZE.lg}
              style={styles.statusTitle}>
              {validationFailed ? 'Setup incomplete' : 'Complete Stripe setup'}
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.statusBody}>
              {validationFailed
                ? 'Your Stripe onboarding is not finished. Reopen the browser to complete it, then tap Refresh below.'
                : 'Finish the setup in your browser, then return to this app. Your account will be verified automatically.'}
            </MyText>
          </View>
        )}

        {/* Complete state */}
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
              Account connected
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey} center style={styles.successBody}>
              Your Stripe account is linked. Earnings will be deposited directly to your bank.
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
      <View style={styles.footer}>
        {!isComplete && !isWaitingForBrowser && (
          <>
            <PrimaryBtn
              loading={loading}
              onPress={openStripeOnboarding}
              text="Connect to Stripe"
            />
            <TouchableOpacity
              style={[styles.outlineBtn, (loading || checkingStatus) && styles.disabled]}
              onPress={checkStatusQuiet}
              disabled={loading || checkingStatus}
              activeOpacity={0.7}>
              {checkingStatus ? (
                <ActivityIndicator color={COLORS.greenDark} size="small" />
              ) : (
                <MyText color={COLORS.greenDark} bold={FONT_WEIGHT.semibold} size={FONT_SIZE.base}>
                  Check status
                </MyText>
              )}
            </TouchableOpacity>
          </>
        )}

        {isWaitingForBrowser && !validationFailed && (
          <PrimaryBtn loading={false} onPress={cancelWaiting} text="Cancel" />
        )}

        {isWaitingForBrowser && validationFailed && (
          <>
            <PrimaryBtn loading={loading} onPress={handleRefreshValidation} text="Refresh" />
            <TouchableOpacity
              onPress={cancelWaiting}
              style={styles.textBtn}
              activeOpacity={0.7}>
              <MyText center color={COLORS.grey} size={FONT_SIZE.base}>
                Cancel
              </MyText>
            </TouchableOpacity>
          </>
        )}

        {isComplete && (
          <PrimaryBtn onPress={goToSuccess} text="Continue" />
        )}

        {!isComplete && !isWaitingForBrowser && (
          <TouchableOpacity
            onPress={goToSuccess}
            style={styles.textBtn}
            activeOpacity={0.7}>
            <MyText center color={COLORS.grey} size={FONT_SIZE.base}>
              Skip for now
            </MyText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default VendorOnboardingScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: pixelSizeHorizontal(24),
    paddingTop: pixelSizeVertical(52),
  },
  header: {
    marginTop: pixelSizeVertical(24),
    marginBottom: pixelSizeVertical(32),
  },
  title: {
    marginBottom: pixelSizeVertical(8),
    color: COLORS.darkBrown,
  },
  subtitle: {
    lineHeight: 22,
  },
  centerBlock: {
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(48),
    gap: pixelSizeVertical(12),
  },
  centerText: {
    marginTop: pixelSizeVertical(4),
  },
  steps: {
    marginBottom: pixelSizeVertical(16),
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
  statusCard: {
    borderRadius: BORDER_RADIUS.Medium,
    padding: pixelSizeHorizontal(18),
    borderWidth: 1,
    marginBottom: pixelSizeVertical(8),
  },
  cardWaiting: {
    backgroundColor: '#F2FAF6',
    borderColor: COLORS.greenDark,
  },
  cardFailed: {
    backgroundColor: '#FFF5F5',
    borderColor: COLORS.red,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(8),
  },
  statusSpinner: {
    marginRight: pixelSizeHorizontal(6),
  },
  statusTitle: {
    marginBottom: pixelSizeVertical(4),
  },
  statusBody: {
    lineHeight: 19,
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(32),
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
    paddingHorizontal: pixelSizeHorizontal(12),
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
    paddingBottom: heightPixel(48),
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
  textBtn: {
    marginTop: pixelSizeVertical(16),
    paddingVertical: heightPixel(8),
    alignItems: 'center',
  },
});
