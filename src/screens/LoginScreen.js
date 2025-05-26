import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Toast from "react-native-toast-message";

//this is for icons
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

//this is for db initilize and hashing the password
import CryptoJS from "crypto-js";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

//this line is to save user session
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //this function run when you press signin button
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Please enter your email and password",
        text2: "Both fields are required",
        position: "bottom",
      });
      return;
    }

    try {
      // Step 1: Hash the entered password
      const hashedPassword = CryptoJS.SHA256(password).toString();

      // Step 2: Query Firestore for matching email + hashed password
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("password", "==", hashedPassword)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // this saves user session
        const userDoc = snapshot.docs[0].data();
        await AsyncStorage.setItem("user", JSON.stringify(userDoc));
        setIsLoggedIn(true);

        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back!",
          position: "bottom",
        });
        // app automatically switches to <AppStack />
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          position: "bottom",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: "An error occurred while logging in",
        position: "bottom",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <Text style={styles.title}>Sign in</Text>

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
              <FontAwesome
                name="lock"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
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
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
              <Text style={styles.signInText}>SIGN IN</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupText}>
              <Text>
                Don’t have an account?{" "}
                <Text
                  onPress={() => navigation.navigate("Register")}
                  style={styles.signupLink}
                >
                  Sign up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: "#fff",
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(70),
    alignItems: "center",
    justifyContent: "flex-start",
  },
  topContainer: {
    alignItems: "center",
    marginTop: verticalScale(5),
    marginBottom: verticalScale(32),
    width: "100%",
  },
  logo: {
    width: scale(280),
    height: verticalScale(100),
    resizeMode: "contain",
    marginBottom: verticalScale(5),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: verticalScale(24),
    textAlign: "center",
    color: "#000",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(12),
    width: "100%",
  },
  icon: {
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: verticalScale(20),
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    marginLeft: scale(8),
    fontSize: moderateScale(14),
    color: "#555",
  },
  forgotPassword: {
    color: "#888",
    fontSize: moderateScale(14),
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D5FEF",
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    width: "100%",
    marginBottom: verticalScale(16),
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(16),
    marginRight: scale(8),
  },
  orText: {
    color: "#888",
    marginVertical: verticalScale(10),
    fontSize: moderateScale(14),
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    width: "100%",
    marginBottom: verticalScale(12),
  },
  socialIcon: {
    marginRight: scale(10),
  },
  signupText: {
    marginTop: verticalScale(10),
    color: "#888",
    fontSize: moderateScale(14),
  },
  signupLink: {
    color: "#5D5FEF",
    fontWeight: "bold",
    fontSize: moderateScale(13),
  },
});

export default LoginScreen;
