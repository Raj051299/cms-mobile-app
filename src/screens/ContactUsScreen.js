import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';
import { SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const ContactUsScreen = () => {
    const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
 
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
  <Icon name="arrow-left" size={24} color="#4F6DF5" />
</TouchableOpacity>

      <Text style={styles.heading}>Contact Us</Text>

      <View style={styles.infoRow}>
        <Icon name="email-outline" size={scale(20)} color="#4F6DF5" />
        <Text style={styles.infoText}>info@cardiniamensshed.org.au</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="phone-outline" size={scale(20)} color="#4F6DF5" />
        <Text style={styles.infoText}>(03) 5941 2389</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="map-marker-outline" size={scale(20)} color="#4F6DF5" />
        <Text style={styles.infoText}>6B Henry Street, Pakenham, VIC 3810</Text>
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => Linking.openURL('https://cardiniamensshed.org.au/')}
      >
        <Text style={styles.linkText}>Visit our website</Text>
      </TouchableOpacity>
    </ScrollView>
</SafeAreaView>

  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: '#4F6DF5',
    marginBottom: scale(20),
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15),
  },
  infoText: {
    marginLeft: scale(10),
    fontSize: scale(16),
    color: '#333',
  },
  linkButton: {
    marginTop: scale(30),
    padding: scale(12),
    backgroundColor: '#4F6DF5',
    borderRadius: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
  safeArea: {
  flex: 1,
  backgroundColor: '#fff',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
}

});
