import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, StatusBar } from "react-native";
import { scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const EventAttendanceScreen = ({ route, navigation }) => {
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { eventId, event } = route.params;
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
  const attendeesRef = collection(db, 'events', eventId, 'attendees');

  const unsubscribe = onSnapshot(attendeesRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    setAttendees(data);
  });

  return () => unsubscribe(); // cleanup listener on unmount
}, [eventId]);


  const getTotalHours = (clockIn, clockOut) => {
    const diff = clockOut - clockIn;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EventDetail", { event })}
          >
            <Icon name="arrow-left" size={scale(18)} color="#4F6DF5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Detail</Text>
        </View>
        <Text style={styles.screenTitle}>Attendees</Text>

        <FlatList
          data={attendees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.attendeeCard}
              onPress={() => {
                setSelectedAttendee(item);
                setShowModal(true);
              }}
            >
              <Text style={styles.name}>{item.name || "No name"}</Text>
            </TouchableOpacity>
          )}
        />
        {selectedAttendee && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedAttendee.name}</Text>

                <Text style={styles.label}>Clock In:</Text>
                <Text style={styles.time}>
                  {selectedAttendee.clockIn?.toDate
                    ? selectedAttendee.clockIn.toDate().toLocaleString()
                    : "N/A"}
                </Text>

                <Text style={styles.label}>Clock Out:</Text>
                <Text style={styles.time}>
                  {selectedAttendee.clockOut?.toDate
                    ? selectedAttendee.clockOut.toDate().toLocaleString()
                    : "N/A"}
                </Text>

                <Text style={styles.label}>Total Hours:</Text>
                <Text style={styles.time}>
                  {selectedAttendee.clockIn?.toDate &&
                  selectedAttendee.clockOut?.toDate
                    ? getTotalHours(
                        selectedAttendee.clockIn.toDate(),
                        selectedAttendee.clockOut.toDate()
                      )
                    : "N/A"}
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventAttendanceScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  attendee: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
  },
  name: { fontSize: 16, fontWeight: "500" },
  time: { fontSize: 14, color: "#888" },
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(20),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#4F6DF5",
    marginLeft: scale(10),
  },
  attendeeCard: {
    backgroundColor: "#fff",
    padding: scale(16),
    marginBottom: scale(10),
    marginHorizontal: scale(20),
    borderRadius: scale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#333",
  },
  time: {
    fontSize: scale(13),
    color: "#777",
    marginTop: 4,
  },
  screenTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    marginHorizontal: scale(20),
    marginBottom: scale(10),
    color: "#4F6DF5",
  },
  label: {
    fontSize: scale(13),
    fontWeight: "bold",
    color: "#4F6DF5",
    marginTop: scale(8),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4F6DF5",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4F6DF5",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
