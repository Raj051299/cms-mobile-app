import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';


import { getFirestore, collection, getDocs } from 'firebase/firestore';

import { getApp } from 'firebase/app';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');


const AttendanceScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const app = getApp();
        const firestore = getFirestore(app);
        const ref = collection(firestore, 'events', eventId, 'attendees');
        const snapshot = await getDocs(ref);

        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(person => person.clockIn); // Only show users who clocked in

        setAttendees(data);
      } catch (error) {
        console.error('Error fetching attendees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F6DF5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}

      <View style={styles.headerBar}>
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
    <View style={styles.backRow}>
      <Icon name="arrow-left" size={24} color="#4F6DF5" style={{ marginRight: 8 }} />
      <Text style={styles.headerTitle}>Back to Event</Text>
    </View>
  </TouchableOpacity>
</View>

      <Text style={styles.heading}>Attendees Who Clocked In</Text>

      <FlatList
        data={attendees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.timestamp}>
              🕒 Clock In: {new Date(item.clockIn.toDate()).toLocaleString()}
            </Text>
            {item.clockOut && (
              <Text style={styles.timestamp}>
                🚪 Clock Out: {new Date(item.clockOut.toDate()).toLocaleString()}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#777' }}>
            No attendees have clocked in yet.
          </Text>
        }
      />
    </View>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  backButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#4F6DF5',
  },
  backText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 25,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});
