import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import Toast from "react-native-toast-message";

import { db } from "../../firebase"; // or correct path

const { width, height } = Dimensions.get("window");

const ClockInScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId, eventTitle, eventDate } = route.params;
  const event = {
    id: eventId,
    title: eventTitle,
    date: eventDate,
  };

  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);

  const [selectedMember, setSelectedMember] = useState(null);
  const [actionType, setActionType] = useState(""); // 'clockIn' or 'clockOut'
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleSearch = async (text) => {
    setSearchText(text);

    if (text.length >= 2) {
      try {
        const membersSnapshot = await getDocs(collection(db, "members"));
        const membersList = membersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = membersList.filter((member) =>
          member.member_name?.toLowerCase().includes(text.toLowerCase())
        );

        setFilteredMembers(filtered);
      } catch (error) {
        console.error("Search failed:", error);
      }
    } else {
      setFilteredMembers([]); // Clear results when text is short
    }
  };

  const handleMemberSelect = async (member) => {
    try {
      const attendeeRef = doc(db, "events", event.id, "attendees", member.id);
      const attendeeSnap = await getDoc(attendeeRef);

      const now = new Date();
      setCurrentTime(now);

      if (!attendeeSnap.exists()) {
        setActionType("clockIn");
      } else {
        const data = attendeeSnap.data();
        if (data.clockIn && !data.clockOut) {
          setActionType("clockOut");
        } else if (data.clockIn && data.clockOut) {
          setActionType("done");
        } else {
          setActionType("clockIn");
        }
      }

      setSelectedMember(member);
      setShowModal(true); // ✅ Modal should open here
    } catch (error) {
      console.error("Error in handleMemberSelect:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load member status",
        text2: error.message,
        position: "bottom",
      });
    }
  };

  const handleClockAction = async () => {

    if (!selectedMember) return;

    try {
      const attendeeRef = doc(
        db,
        "events",
        event.id,
        "attendees",
        selectedMember.id
      );
      const now = new Date();

      if (actionType === "clockIn") {

        await setDoc(attendeeRef, {
          name: selectedMember.member_name,
          clockIn: now,
        });
        Toast.show({
          type: "success",
          text1: "Clocked In Successfully",
          position: "bottom",
        });
      } else if (actionType === "clockOut") {
        await updateDoc(attendeeRef, {
          clockOut: now,
        });
        Toast.show({
          type: "success",
          text1: "✅ Clocked Out Successfully",
          position: "bottom",
        });
      }

      setShowModal(false);
      setSelectedMember(null);
      setSearchText("");
      setFilteredMembers([]);
    } catch (error) {
      console.error("Clock action failed:", error);
      Toast.show({
        type: "error",
        text1: "Action Failed",
        text2: error.message,
        position: "bottom",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonHeader}
        >
          <Icon name="arrow-left" size={28} color="#4F6DF5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>
      <TextInput
        placeholder="Search member..."
        value={searchText}
        onChangeText={(text) => handleSearch(text)}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberItem}
            onPress={() => handleMemberSelect(item)}
          >
            <Text style={styles.memberName}>{item.member_name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searchText.length >= 2 ? (
            <Text style={styles.noResults}>No members found</Text>
          ) : null
        }
      />

      <Modal
        transparent
        visible={showModal}
        animationType="slide"
        onRequestClose={() => {
          setShowModal(false);
          setSelectedMember(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Event: {event.title}</Text>
            <Text style={styles.modalText}>
              Member: {selectedMember?.member_name}
            </Text>
            <Text style={styles.modalText}>
              Time: {currentTime.toLocaleString()}
            </Text>

            {actionType === "done" ? (
              <Text style={styles.modalText}>
                ⏱ Already clocked in and out.
              </Text>
            ) : (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleClockAction}
              >
                <Text style={styles.modalButtonText}>
                  {actionType === "clockIn" ? "Clock In" : "Clock Out"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.modalButton,
                { marginTop: 10, backgroundColor: "#ccc" },
              ]}
              onPress={() => {
                setShowModal(false);
                setSelectedMember(null);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClockInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  memberItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  memberName: {
    fontSize: 18,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: height * 0.05,
    paddingBottom: height * 0.015,
    paddingHorizontal: width * 0.0,
    marginBottom: 10,
  },
  backButtonHeader: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: width * 0.07,
    fontWeight: "600",
    color: "#4F6DF5",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4F6DF5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
