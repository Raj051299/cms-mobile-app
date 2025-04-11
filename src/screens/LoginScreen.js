import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
} from 'react-native';

//this is for icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//this is for db initilize and hashing the password
import CryptoJS from 'crypto-js';
import { db } from '../../firebase';
console.log(db);
import { collection, query, where, getDocs } from 'firebase/firestore';

//this line is to save user session 
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //this function run when you press signin button
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
  
    try {
      // Step 1: Hash the entered password
      const hashedPassword = CryptoJS.SHA256(password).toString();
  
      // Step 2: Query Firestore for matching email + hashed password
      const q = query(
        collection(db, 'users'),
        where('email', '==', email),
        where('password', '==', hashedPassword)
      );
  
      const snapshot = await getDocs(q);
  
      if (!snapshot.empty) {
        alert('Login successful!');
        //this saves user session
        // if (rememberMe) {
        //   const userDoc = snapshot.docs[0].data();
        //   await AsyncStorage.setItem('user', JSON.stringify(userDoc));
        // }
        navigation.navigate('Home');
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong during login.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={{
            uri: 'https://cardiniamensshed.org.au/wp-content/uploads/2019/03/Cardinia-Mens-Shed-logo.jpg',
          }}
          style={styles.logo}
        />
      </View>
      <Text style={styles.label}>Sign in</Text>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="envelope"
          size={20}
          color="#aaa"
          style={styles.icon}
        />
        <TextInput
          placeholder="abc@email.com"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          placeholder="Your password"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.rememberMeContainer}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{false: '#ccc', true: '#5D5FEF'}}
            thumbColor={rememberMe ? '#fff' : '#999'} // or any color that fits your theme
          />

          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>SIGN IN</Text>
        <MaterialIcons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* <Text style={styles.orText}>OR</Text>

        <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={20} color="#DB4437" style={styles.socialIcon} />
            <Text>Login with Google</Text>
        </TouchableOpacity> */}
    <TouchableOpacity style={styles.signupText}>
    <Text >Don’t have an account? <Text onPress={() => navigation.navigate('Register')} style={styles.signupLink}>Sign up</Text>
      </Text>  
    </TouchableOpacity>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // important for ScrollView
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 160, // pushes content from top
    alignItems: 'center',
    justifyContent: 'flex-start', // makes everything stick to top
  },

  topContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 32,
    width: '100%',
  },
  logo: {
    width: 280, // increased width
    height: 100, // increased height
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color:'#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
  },
  forgotPassword: {
    color: '#888',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D5FEF',
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    marginBottom: 16,
  },
  signInText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  orText: {
    color: '#888',
    marginVertical: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
  },
  signupText: {
    marginTop: 10,
    color: '#888',
  },
  signupLink: {
    color: '#5D5FEF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
