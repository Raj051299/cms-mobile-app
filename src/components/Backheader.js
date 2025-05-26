import React from 'react';
import {  Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const BackHeader = ({ label }) => {
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();

  return (
    <TouchableOpacity style={styles.headerBar} onPress={goBack}>
      <Icon name="arrow-left" size={24} color="#4F6DF5" style={styles.backIcon} />
      <Text style={styles.headerText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    // backgroundColor: '#fff',
  },
  backIcon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F6DF5',
  },
});
