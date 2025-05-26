import React from 'react';
import { View, Image,StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AppStack from './src/navigation/AppStack';
import AuthStack from './src/navigation/AuthStack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const RootNavigator = () => {
  const { isLoggedIn } = useAuth();
if (isLoggedIn === null) {
  return (
    <View style={styles.splashContainer}>
<Image source={require('../CardiniaMensApp/src/assets/Cardinia-Mens-Shed-logo-withoutbg.png')} style={styles.logoImageOnly} />
      </View>
  );
}

  // 👇 use key here
  return isLoggedIn ? <AppStack key="app" /> : <AuthStack key="auth" />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // pure white background
  },
  logoImageOnly: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  logoBox: {
    backgroundColor: '#4F6DF5',
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderRadius: 20,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  
  
  logoSub: {
    fontSize: 18,
    color: '#DCE2FF',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4F6DF5',
  },
});
