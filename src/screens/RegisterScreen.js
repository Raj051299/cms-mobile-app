import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CryptoJS from 'crypto-js';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import {
  moderateScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        alert('Email is already registered');
        return;
      }

      const hashedPassword = CryptoJS.SHA256(password).toString();
      await addDoc(collection(db, 'users'), {
        fullName,
        email,
        isAdmin: false,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      alert('Registration successful!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Image
                source={require('../assets/Cardinia-Mens-Shed-logo-withoutbg.png')}
                style={styles.logo}
              />
            </View>

            <Text style={styles.title}>Sign up</Text>

            <View style={styles.inputContainer}>
              <Icon name="account-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                placeholder="Full name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                placeholder="abc@email.com"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                placeholder="Your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>
              <Text style={styles.signInText}>SIGN UP</Text>
              <Icon name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupText}>
              <Text>
                Already have an account?{' '}
                <Text
                  onPress={() => navigation.navigate('Login')}
                  style={styles.signupLink}
                >
                  Sign in
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: '#fff',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(70),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topContainer: {
    alignItems: 'center',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(32),
    width: '100%',
  },
  logo: {
    width: scale(280),
    height: verticalScale(100),
    resizeMode: 'contain',
    marginBottom: verticalScale(5),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(24),
    textAlign: 'center',
    color: '#000',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(12),
    width: '100%',
  },
  icon: {
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#000',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D5FEF',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    width: '100%',
    marginBottom: verticalScale(16),
  },
  signInText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    marginRight: scale(8),
  },
  signupText: {
    marginTop: verticalScale(10),
    color: '#888',
    fontSize: moderateScale(14),
  },
  signupLink: {
    color: '#5D5FEF',
    fontWeight: 'bold',
    fontSize: moderateScale(13),
  },
});

