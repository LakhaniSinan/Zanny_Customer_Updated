import {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {icons} from '../../assets';
import CustomInput from '../../components/customInput';
import CustomModal from '../../components/customModal';
import OverLayLoader from '../../components/loader';
import PrimaryButton from '../../components/primaryButton';
import {Colors} from '../../constants';
import {sendCode} from '../../services/auth';

const SignUpScreen = ({navigation}) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPass: '',
    phone: '',
    type: 'register',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    Icon: '',
    title: '',
    detail: '',
    buttonName: 'Okay',
    onPress: () => setModalVisible(false),
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const showError = message => {
    setModalData({
      Icon: icons.cross,
      title: 'Validation Error',
      detail: message,
      buttonName: 'Okay',
      onPress: () => setModalVisible(false),
    });
    setModalVisible(true);
  };

  const validateFields = () => {
    const {firstName, lastName, email, password, confirmPass, phone} = form;

    if (!firstName.trim()) return showError('Please enter your First Name.');

    if (!lastName.trim()) return showError('Please enter your Last Name.');

    if (!email.trim()) return showError('Please enter your Email.');

    if (!email.includes('@'))
      return showError('Please enter a valid Email address.');

    if (!password.trim()) return showError('Please enter your Password.');

    if (password.length < 6)
      return showError('Password must be at least 6 characters.');

    if (password !== confirmPass) return showError('Passwords do not match.');

    if (!phone.trim()) return showError('Please enter your Phone Number.');

    if (phone.length < 10) return showError('Invalid phone number.');

    return true;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;
    try {
      setIsLoading(true);
      const response = await sendCode({email: form.email});
      if (response.status == 200 || response.status == 201) {
        setModalData({
          Icon: icons.check,
          title: 'Check your email',
          detail:
            'We’ve sent an OTP to your email! If you don’t see it in your inbox, check spam/promotions.',
          buttonName: 'Okay',
          onPress: () => {
            setModalVisible(false);
            navigation.navigate('CodeVerification', form);
          },
        });
        setModalVisible(true);
      }
    } catch (error) {
      console.log(error, 'errorerrorerrorerrorerror123132');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.main}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Image source={icons.ArrowLeft} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.headerWrapper}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>
          Sign up to have access to our Services
        </Text>
      </View>

      <View style={styles.formWrapper}>
        <CustomInput
          title="First Name"
          placeholder="Type Your First Name"
          value={form.firstName}
          onChangeText={t => handleChange('firstName', t)}
        />

        <CustomInput
          title="Last Name"
          placeholder="Type Your Last Name"
          value={form.lastName}
          onChangeText={t => handleChange('lastName', t)}
        />

        <CustomInput
          title="Email"
          placeholder="Type your email"
          value={form.email}
          onChangeText={t => handleChange('email', t)}
        />

        <CustomInput
          title="Password"
          placeholder="Type your password"
          Icon={icons.Hide}
          secureTextEntry
          value={form.password}
          onChangeText={t => handleChange('password', t)}
        />

        <CustomInput
          title="Confirm Password"
          placeholder="Confirm your password"
          Icon={icons.Hide}
          secureTextEntry
          value={form.confirmPass}
          onChangeText={t => handleChange('confirmPass', t)}
        />

        <CustomInput
          title="Phone Number"
          placeholder="Phone Number"
          keyboardType="numeric"
          maxLength={11}
          value={form.phone}
          onChangeText={t => handleChange('phone', t)}
        />

        <View style={styles.btnWrapper}>
          <PrimaryButton name="Create Account" onPress={handleSignUp} />
        </View>
      </View>

      <View style={{height: width(15)}} />

      <CustomModal
        visible={modalVisible}
        Icon={modalData.Icon}
        name={modalData.title}
        detail={modalData.detail}
        buttonName={modalData.buttonName}
        onPress={modalData.onPress}
        close={() => setModalVisible(false)}
      />
      <OverLayLoader isloading={isLoading} />
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backBtn: {
    marginHorizontal: 10,
    marginTop: 10,
    height: width(10),
    width: width(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    height: 20,
    width: 20,
  },
  headerWrapper: {
    paddingHorizontal: width(4),
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.black,
  },
  subheading: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.black,
  },
  formWrapper: {
    gap: 10,
    paddingHorizontal: width(4),
    marginTop: 10,
  },
  btnWrapper: {
    height: width(15),
    marginTop: width(4),
  },
});
