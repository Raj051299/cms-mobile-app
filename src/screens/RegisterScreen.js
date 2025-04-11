import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//signup firebase db initiation
import {db} from '../../firebase';
console.log('🔥 db value is:', db);

import {collection, addDoc, query, where, getDocs} from 'firebase/firestore';

//this is for hashed password
import CryptoJS from 'crypto-js';

const RegisterScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // this function called when u press signup button press
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
      // 🔍 Check if email already exists
      const q = query(collection(db, 'users'), where('email', '==', email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        alert('Email is already registered');
        return;
      }

      // 📝 Add user to Firestore
      const hashedPassword = CryptoJS.SHA256(password).toString();

      await addDoc(collection(db, 'users'), {
        fullName,
        email,
        password: hashedPassword, // ✅ safe hashed version
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.heading}>Sign up</Text>

      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Icon
          name="account-outline"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="abc@email.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#999"
          keyboardType="email-address"
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={!showPassword}
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

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon
            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
        <Text style={styles.signupText}>SIGN UP</Text>
        <Icon name="arrow-right" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Signin Link */}
      <TouchableOpacity style={styles.signinText}>
        <Text>
          Don’t have an account?{' '}
          <Text
            onPress={() => navigation.navigate('Login')}
            style={styles.signinLink}>
            Sign in
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // top:50,
    backgroundColor: '#fff',
  },
  heading: {
    marginTop: 120,
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginRight: 10,
  },
  signupBtn: {
    backgroundColor: '#4F6DF5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  or: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 10,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
  },
  socialText: {
    fontSize: 16,
    color: '#000',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  signinText: {
    marginTop: 10,
    color: '#888',
    textAlign: 'center',
    alignItems: 'center',
  },
  signinLink: {
    color: '#4F6DF5',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
