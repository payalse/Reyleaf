import {
  Modal,
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IPrivacyPolicy {
  open: boolean;
  handleClose: () => void;
}

const PrivacyPolicy = ({open, handleClose}: IPrivacyPolicy) => {
  return (
    <Modal visible={open} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.heading}>Privacy Policy</Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.content}>
            <Text style={styles.paragraph}>
              At Reynette, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy outlines how we collect, use, disclose, and safeguard your
              data when you use our mobile applications, websites, and related
              services (collectively referred to as the "Service").
            </Text>

            <Text style={styles.sectionTitle}>
              Information Collection and Use
            </Text>
            <Text style={styles.listItem}>
              - Personal Information: We may collect your name, email address,
              location (with permission), and other voluntary details.
            </Text>
            <Text style={styles.listItem}>
              - Usage Data: We collect information about how you interact with
              the Service.
            </Text>
            <Text style={styles.listItem}>
              - Payment Information: Payment details are securely handled by
              third-party processors.
            </Text>
            <Text style={styles.listItem}>
              - Device Information: Includes device type, OS, unique
              identifiers, IP address, and network data.
            </Text>

            <Text style={styles.sectionTitle}>Data Usage and Sharing</Text>
            <Text style={styles.listItem}>
              - Service Provision: To maintain, personalize, and improve the
              Service.
            </Text>
            <Text style={styles.listItem}>
              - Communication: We may send updates, newsletters, and promotions
              (opt-out anytime).
            </Text>
            <Text style={styles.listItem}>
              - Third-Party Service Providers: We share data with partners
              assisting in operations, bound by confidentiality.
            </Text>
            <Text style={styles.listItem}>
              - Legal Compliance: Information may be disclosed if required by
              law or authorities.
            </Text>

            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.paragraph}>
              We take reasonable measures to protect your information. However,
              no transmission method is 100% secure.
            </Text>

            <Text style={styles.sectionTitle}>Children's Privacy</Text>
            <Text style={styles.paragraph}>
              Reynette is not intended for children under 13, and we do not
              knowingly collect their data.
            </Text>

            <Text style={styles.sectionTitle}>
              Changes to this Privacy Policy
            </Text>
            <Text style={styles.paragraph}>
              We may update this policy occasionally. Check back for updates.
            </Text>

            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
              For any questions or concerns, contact us at{' '}
              <Text style={styles.link}>info@reyleaf.com</Text>.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444',
  },
  content: {
    flex: 1,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#056145',
    marginTop: 10,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#555',
  },
  listItem: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 5,
    color: '#444',
  },
  link: {
    color: '#056145',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default PrivacyPolicy;
