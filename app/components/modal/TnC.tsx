import {
  Modal,
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ITNC {
  open: boolean;
  handleClose: () => void;
}

const TnC = ({open, handleClose}: ITNC) => {
  return (
    <Modal visible={open} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.heading}>Terms & Conditions</Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.content}>
            <Text style={styles.paragraph}>
              These Terms & Conditions ("Terms") govern the use of the Reynette
              mobile applications, websites, and related services (collectively
              referred to as the "Service"), provided by Reynette Inc.
              ("Reynette," "we," "us," or "our"). By accessing or using the
              Service, you agree to be bound by these Terms. If you do not agree
              to these Terms, please do not use the Service.
            </Text>

            <Text style={styles.sectionTitle}>1. Account Registration</Text>
            <Text style={styles.paragraph}>
              1.1. <Text style={styles.bold}>Eligibility:</Text> You must be at
              least 18 years old and a resident of the United States to create
              an account with Reynette. By registering an account, you represent
              and warrant that you meet these eligibility criteria.
            </Text>
            <Text style={styles.paragraph}>
              1.2. <Text style={styles.bold}>Account Information:</Text> You
              agree to provide accurate, current, and complete information
              during the registration process and to update this information
              promptly if there are any changes.
            </Text>

            <Text style={styles.sectionTitle}>2. User Conduct</Text>
            <Text style={styles.paragraph}>
              2.1. <Text style={styles.bold}>Compliance with Laws:</Text> You
              agree to use the Service in compliance with all applicable laws,
              regulations, and guidelines.
            </Text>
            <Text style={styles.paragraph}>
              2.2. <Text style={styles.bold}>Prohibited Activities:</Text> You
              must not engage in any prohibited activities while using the
              Service:
            </Text>
            <Text style={styles.listItem}>
              - Violating any federal, state, or local laws.
            </Text>
            <Text style={styles.listItem}>
              - Infringing upon the intellectual property rights of others.
            </Text>
            <Text style={styles.listItem}>
              - Engaging in fraudulent practices.
            </Text>

            <Text style={styles.sectionTitle}>3. Privacy</Text>
            <Text style={styles.paragraph}>
              3.1. <Text style={styles.bold}>Data Collection:</Text> Your use of
              the Service is subject to our Privacy Policy.
            </Text>

            <Text style={styles.sectionTitle}>4. Contact Us</Text>
            <Text style={styles.paragraph}>
              4.1. <Text style={styles.bold}>Questions:</Text> For any questions
              or concerns, contact us at{' '}
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
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  link: {
    color: '#056145',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default TnC;
