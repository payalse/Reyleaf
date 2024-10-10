import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyText } from '../../../components/MyText';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { COLORS } from '../../../styles';
import LayoutBG from '../../../components/layout/LayoutBG';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AboutUsStackParams } from '../../../naviagtion/DrawerNavigator';

const PrivacyPolicyScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AboutUsStackParams>>();
  return (
    <LayoutBG type="bg-tr">
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Privacy policy" />
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          gap: 50,
        }}
      >
        <Text style={styles.text}>
          At Reynette, we are committed to protecting your privacy and ensuring
          the security of your personal information. This Privacy Policy
          outlines how we collect, use, disclose, and safeguard your data when
          you use our mobile applications, websites, and related services
          (collectively referred to as the "Service").
        </Text>

        <Text style={styles.heading}>Information Collection and Use</Text>
        <Text style={styles.listItem}>
          - Personal Information: When you register an account with Reynette, we
          may collect certain personal information, such as your name, email
          address, location (with your permission), and other details provided
          voluntarily.
        </Text>
        <Text style={styles.listItem}>
          - Usage Data: We may also collect information about how you interact
          with the Service, including your browsing activities, preferences, and
          interactions with other users or content.
        </Text>
        <Text style={styles.listItem}>
          - Payment Information: If you make purchases through Reynette, we may
          collect payment information such as credit card details or other
          payment method details. However, we do not store this information on
          our servers. It is securely processed by our third-party payment
          processors.
        </Text>
        <Text style={styles.listItem}>
          - Device Information: We may automatically collect certain information
          about your device, including your device type, operating system,
          unique device identifiers, IP address, and mobile network information.
        </Text>

        <Text style={styles.heading}>Data Usage and Sharing</Text>
        <Text style={styles.listItem}>
          - Service Provision: We use the information we collect to provide,
          maintain, and improve the Service, including personalizing your
          experience, processing transactions, and providing customer support.
        </Text>
        <Text style={styles.listItem}>
          - Communication: We may use your email address to send you important
          updates, newsletters, promotional materials, and other communications
          related to Reynette. You can opt out of receiving promotional emails
          at any time.
        </Text>
        <Text style={styles.listItem}>
          - Third-Party Service Providers: We may share your information with
          third-party service providers who assist us in operating our Service,
          conducting our business, or servicing you. These third parties have
          access to your personal information only to perform these tasks on our
          behalf and are obligated not to disclose or use it for any other
          purpose.
        </Text>
        <Text style={styles.listItem}>
          - Legal Compliance: We may disclose your information if required to do
          so by law or in response to valid requests by public authorities
          (e.g., law enforcement agencies).
        </Text>

        <Text style={styles.heading}>Data Security</Text>
        <Text style={styles.text}>
          We take reasonable measures to protect the security and integrity of
          your personal information. However, please note that no method of
          transmission over the internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </Text>

        <Text style={styles.heading}>Children's Privacy</Text>
        <Text style={styles.text}>
          Reynette is not intended for use by individuals under the age of 13.
          We do not knowingly collect personal information from children under
          13. If you are a parent or guardian and believe that your child has
          provided us with personal information, please contact us so that we
          can take appropriate action.
        </Text>

        <Text style={styles.heading}>Changes to this Privacy Policy</Text>
        <Text style={styles.text}>
          We may update our Privacy Policy from time to time. Any changes will
          be posted on this page, and the "Last Updated" date at the top of the
          policy will be revised accordingly. We encourage you to review this
          Privacy Policy periodically for any changes.
        </Text>

        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions or concerns about our Privacy Policy, please
          contact us at <Text style={styles.link}>contact@reynette.com</Text>.
        </Text>
      </ScrollView>
    </LayoutBG>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  text: {
    fontSize: 12,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8
  },
  link: {
    color: 'blue',
  },
});

export default PrivacyPolicyScreen;
