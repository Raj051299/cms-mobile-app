import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = ({ navigation }) => {

    const handleLogout = async () => {
        try {
          await AsyncStorage.removeItem('user');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };
      


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Cardinia Men's Shed</Text>

      <View style={styles.boxContainer}>
        <TouchableOpacity style={styles.card}>
          <Icon name="account-multiple-outline" size={30} color="#4F6DF5" />
          <Text style={styles.cardText}>Members</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Icon name="calendar-month-outline" size={30} color="#4F6DF5" />
          <Text style={styles.cardText}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Icon name="account-cog-outline" size={30} color="#4F6DF5" />
          <Text style={styles.cardText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleLogout}>
        <Icon name="logout" size={30} color="#f44336" />
        <Text style={[styles.cardText, { color: '#f44336' }]}>Logout</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 30,
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  card: {
    width: '47%',
    backgroundColor: '#F2F4FF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#4F6DF5',
  },
});
