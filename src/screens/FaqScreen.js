import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import { SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const faqs = [
  {
    question: "What is the Cardinia Men's Shed?",
    answer: "It is a community space for men to connect, converse, and create. The activities are often similar to those of garden sheds, but for groups of men to enjoy together."
  },
  {
    question: "Who can join?",
    answer: "Membership is open to all men in the community who are interested in working on projects, learning skills, and socialising."
  },
  {
    question: "How much does it cost?",
    answer: "There is a small membership fee. Please contact us directly for the most up-to-date fee information."
  },
  {
    question: "Do I need any experience?",
    answer: "No experience is necessary. You’ll find a welcoming and inclusive environment for all skill levels."
  },
  {
    question: "When is the shed open?",
    answer: "Opening hours vary. Please visit the official website or contact the shed directly for current operating hours."
  },
];

const FaqScreen = () => {
      const navigation = useNavigation();
  
  return (
        <SafeAreaView style={styles.safeArea}>
    
    <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#4F6DF5" />
        </TouchableOpacity>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.question}>{faq.question}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};

export default FaqScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F7FF',
    padding: scale(20),
  },
  title: {
    marginTop: scale(20),
    fontSize: scale(22),
    fontWeight: 'bold',
    color: '#4F6DF5',
    // alignItems: 'center',
    textAlign: 'center',
    marginBottom: scale(20),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: scale(10),
    padding: scale(16),
    marginBottom: scale(12),
    elevation: 2,
  },
  question: {
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: scale(8),
    color: '#333',
  },
  answer: {
    fontSize: scale(14),
    color: '#555',
  },
  safeArea: {
  flex: 1,
  backgroundColor: '#fff',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
}
});
