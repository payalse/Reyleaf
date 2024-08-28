import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyText } from '../../../components/MyText';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { COLORS } from '../../../styles';
import LayoutBG from '../../../components/layout/LayoutBG';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AboutUsStackParams } from '../../../naviagtion/DrawerNavigator';

const des =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic type setting, that can remaining on that also so push on people can do that. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic type setting, that can remaining on that also so push on people can Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic type setting, that can remaining on that also so push on people can do that.";
const TermAndConditionScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AboutUsStackParams>>();
  return (
    <LayoutBG type="bg-tr">
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Terms & Condition" />
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          gap: 50,
        }}
      >
          <Text style={styles.text}>
            These Terms & Conditions ("Terms") govern the use of the Reynette
            mobile applications, websites, and related services (collectively
            referred to as the "Service"), provided by Reynette Inc.
            ("Reynette," "we," "us," or "our"). By accessing or using the
            Service, you agree to be bound by these Terms. If you do not agree
            to these Terms, please do not use the Service.
          </Text>

          <Text style={styles.heading}>1. Account Registration</Text>
          <Text style={styles.text}>
            1.1. Eligibility: You must be at least 18 years old and a resident
            of the United States to create an account with Reynette. By
            registering an account, you represent and warrant that you meet
            these eligibility criteria.
          </Text>
          <Text style={styles.text}>
            1.2. Account Information: You agree to provide accurate, current,
            and complete information during the registration process and to
            update this information promptly if there are any changes.
          </Text>
          <Text style={styles.text}>
            1.3. Account Security: You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account. You agree to notify Reynette
            immediately of any unauthorized use of your account or any other
            breach of security.
          </Text>

          <Text style={styles.heading}>2. User Conduct</Text>
          <Text style={styles.text}>
            2.1. Compliance with Laws: You agree to use the Service in
            compliance with all applicable laws, regulations, and guidelines,
            including but not limited to those related to privacy, data
            protection, and intellectual property rights.
          </Text>
          <Text style={styles.text}>
            2.2. Prohibited Activities: You must not engage in any of the
            following prohibited activities while using the Service:
          </Text>
          <Text style={styles.listItem}>
            - Violating any federal, state, or local laws or regulations.
          </Text>
          <Text style={styles.listItem}>
            - Infringing upon the intellectual property rights of others.
          </Text>
          <Text style={styles.listItem}>
            - Uploading, transmitting, or distributing any content that is
            unlawful, harmful, threatening, abusive, defamatory, obscene, or
            otherwise objectionable.
          </Text>
          <Text style={styles.listItem}>
            - Engaging in any fraudulent or deceptive practices.
          </Text>

          <Text style={styles.heading}>3. Intellectual Property</Text>
          <Text style={styles.text}>
            3.1. Ownership: The Service, including all content, features, and
            functionality, is owned by Reynette and is protected by United
            States and international copyright, trademark, and other
            intellectual property laws.
          </Text>
          <Text style={styles.text}>
            3.2. License: Subject to your compliance with these Terms, Reynette
            grants you a limited, non-exclusive, non-transferable, revocable
            license to access and use the Service for personal, non-commercial
            purposes.
          </Text>
          <Text style={styles.text}>
            3.3. User Content: By submitting any content to the Service, you
            grant Reynette a worldwide, royalty-free, sublicensable, and
            transferable license to use, reproduce, distribute, prepare
            derivative works of, display, and perform the content in connection
            with the Service.
          </Text>

          <Text style={styles.heading}>4. Privacy</Text>
          <Text style={styles.text}>
            4.1. Data Collection: Your use of the Service is subject to our
            Privacy Policy, which governs the collection, use, and disclosure of
            your personal information. By using the Service, you consent to the
            collection and use of your data as described in the Privacy Policy.
          </Text>

          <Text style={styles.heading}>5. Termination</Text>
          <Text style={styles.text}>
            5.1. Termination by Reynette: Reynette reserves the right to suspend
            or terminate your access to the Service at any time for any reason,
            including if you violate these Terms or engage in conduct that
            Reynette determines to be harmful or disruptive.
          </Text>
          <Text style={styles.text}>
            5.2. Termination by User: You may terminate your account at any time
            by contacting Reynette customer support or using the account
            deletion option within the Service.
          </Text>

          <Text style={styles.heading}>6. Disclaimer of Warranties</Text>
          <Text style={styles.text}>
            6.1. No Warranty: The Service is provided on an "as is" and "as
            available" basis, without any warranties of any kind, either express
            or implied. Reynette disclaims all warranties, including, but not
            limited to, the implied warranties of merchantability, fitness for a
            particular purpose, and non-infringement.
          </Text>

          <Text style={styles.heading}>7. Limitation of Liability</Text>
          <Text style={styles.text}>
            7.1. No Liability: In no event shall Reynette be liable for any
            indirect, incidental, special, consequential, or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, arising out of or in connection with
            your use of the Service.
          </Text>

          <Text style={styles.heading}>8. Governing Law and Jurisdiction</Text>
          <Text style={styles.text}>
            8.1. Jurisdiction: These Terms shall be governed by and construed in
            accordance with the laws of the State of California, United States,
            without regard to its conflict of law provisions.
          </Text>
          <Text style={styles.text}>
            8.2. Venue: Any dispute arising out of or relating to these Terms or
            your use of the Service shall be brought exclusively in the state or
            federal courts located in San Francisco County, California.
          </Text>

          <Text style={styles.heading}>9. Changes to Terms</Text>
          <Text style={styles.text}>
            9.1. Modification: Reynette reserves the right to modify or update
            these Terms at any time without prior notice. Any changes will be
            effective immediately upon posting the revised Terms on the Service.
          </Text>

          <Text style={styles.heading}>10. Contact Us</Text>
          <Text style={styles.text}>
            10.1. Questions: If you have any questions or concerns about these
            Terms, please contact us at{' '}
            <Text style={styles.link}>contact@reynette.com</Text>.
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

export default TermAndConditionScreen;
