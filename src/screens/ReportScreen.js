import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { doc, getDocs, collection } from "firebase/firestore";

import { db } from "../../firebase"; // ✅ correct path to your firebase.ts file

import { getDoc } from 'firebase/firestore';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackHeader from "../components/Backheader";
const { width, height } = Dimensions.get("window");

const ReportScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const passedMember = route.params?.member;

  const [searchText, setSearchText] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [reportData, setReportData] = useState(null);
  const [hourlyRate, setHourlyRate] = useState("");

  useEffect(() => {
    if (passedMember) {
      setSelectedMember(passedMember);
      setSearchText(passedMember.member_name);
    }
  }, [passedMember]);

  const handleSearch = async (text) => {
    setSearchText(text);

    if (text.trim().length < 2) {
      setFilteredMembers([]);
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, "members"));
      const allMembers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = allMembers.filter((member) =>
        member.member_name?.toLowerCase().includes(text.toLowerCase())
      );

      setFilteredMembers(filtered);
    } catch (error) {
      console.error("Error searching members:", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedMember) return;

    try {
      const allEventsSnap = await getDocs(collection(db, "events"));
      let totalHours = 0;

      for (const eventDoc of allEventsSnap.docs) {
        const eventId = eventDoc.id;
        const attendeeRef = doc(
          db,
          "events",
          eventId,
          "attendees",
          selectedMember.id
        );
        const attendeeSnap = await getDoc(attendeeRef);

        if (attendeeSnap.exists()) {
          const data = attendeeSnap.data();
          const clockIn = data.clockIn?.toDate?.();
          const clockOut = data.clockOut?.toDate?.();

          if (
            clockIn &&
            clockOut &&
            clockIn >= startDate &&
            clockIn <= endDate
          ) {
            const hours = (clockOut - clockIn) / (1000 * 60 * 60);
            totalHours += hours;
          }
        }
      }

      setReportData({
        name: selectedMember.member_name,
        range: `${startDate.toDateString()} to ${endDate.toDateString()}`,
        totalHours: totalHours.toFixed(2),
        totalPay: (totalHours * parseFloat(hourlyRate || "0")).toFixed(2),
      });
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonHeader}
        >
          <Icon name="arrow-left" size={23} color="#4F6DF5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>

      {/* Search Member */}
      <TextInput
        placeholder="Search member..."
        value={searchText}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      {filteredMembers.map((member) => (
        <TouchableOpacity
          key={member.id}
          style={styles.memberItem}
          onPress={() => {
            setSelectedMember(member);
            setSearchText(member.member_name);
            setFilteredMembers([]);
          }}
        >
          <Text>{member.member_name}</Text>
        </TouchableOpacity>
      ))}

      {selectedMember && (
        <Text style={styles.selectedInfo}>
          Selected: {selectedMember.member_name}
        </Text>
      )}

      <TextInput
        placeholder="Enter hourly rate (e.g. 25)"
        value={hourlyRate}
        onChangeText={setHourlyRate}
        keyboardType="numeric"
        style={styles.inputRate}
      />

      {/* Start Date Picker */}
      <TouchableOpacity
        onPress={() => setShowStartPicker(true)}
        style={styles.monthPickerButton}
      >
        <Icon name="calendar-start" size={20} color="#4F6DF5" />
        <Text style={styles.monthPickerText}>
          Start Date: {startDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {/* End Date Picker */}
      <TouchableOpacity
        onPress={() => setShowEndPicker(true)}
        style={styles.monthPickerButton}
      >
        <Icon name="calendar-end" size={20} color="#4F6DF5" />
        <Text style={styles.monthPickerText}>
          End Date: {endDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Buttons */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateReport}
      >
        <Text style={styles.generateButtonText}>Generate Report</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.generateButton, { backgroundColor: "#ccc" }]}
        onPress={() => {
          setSearchText("");
          setFilteredMembers([]);
          setSelectedMember(null);
          setStartDate(new Date());
          setEndDate(new Date());
          setHourlyRate("");
          setReportData(null);
        }}
      >
        <Text style={[styles.generateButtonText, { color: "#333" }]}>
          Reset
        </Text>
      </TouchableOpacity>

      {/* Result */}
      {reportData && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>👤 {reportData.name}</Text>
          <Text style={styles.resultText}>📅 {reportData.range}</Text>
          <Text style={styles.resultText}>
            ⏱ Total Hours: {reportData.totalHours}
          </Text>
          <Text style={styles.resultText}>
            💰 Total Pay: ${reportData.totalPay}
          </Text>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    padding: 16,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    // paddingTop: height * 0.05,
    paddingBottom: 20,
    backgroundColor: "#F5F7FF",
  },
  backButtonHeader: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#4F6DF5",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  memberItem: {
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedInfo: {
    marginVertical: 10,
    fontSize: 16,
    color: "#4F6DF5",
    fontWeight: "600",
  },
  inputRate: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  monthPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
  },
  monthPickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#4F6DF5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: "#eaf0ff",
    padding: 16,
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  safeArea: {
      flex: 1,
      backgroundColor: "#F5F7FF",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});
