import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useUser } from "../utils/useUser";
import BackHeader from "../components/Backheader";
import { scale, verticalScale } from "react-native-size-matters";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // or correct path
import Toast from "react-native-toast-message";




const MemberDetailsScreen = ({ route, navigation }) => {
  const { isAdmin } = useUser();
  const { member } = route.params;

  const memberData = {
    id: member.id,
    member_name: member.member_name,
  };

  const formatTimestamp = (dobInput) => {
  // Case 1: Firestore Timestamp
  if (dobInput?.seconds) {
    const date = new Date(dobInput.seconds * 1000);
    return date.toDateString(); // e.g., "Mon May 27 2024"
  }

  // Case 2: DD/MM/YYYY string
  if (typeof dobInput === "string") {
    const [day, month, year] = dobInput.split("/");
    if (!day || !month || !year) return "Invalid DOB";

    const date = new Date(`${year}-${month}-${day}`);
    return date.toDateString();
  }

  // Fallback
  return "No DOB Provided.";
};




  const fromAge = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A";
    const birthDate = new Date(timestamp.seconds * 1000);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    //console.log(age);

    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If birth month hasn't arrived yet this year, or it's the same month but birth day hasn't arrived
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    //console.log(age);
    return age;
  };

  const interests = [
    member?.interest_group_1,
    member?.interest_group_2,
    member?.interest_group_3,
  ].filter(Boolean); // filters out null, undefined, or empty string

  const chipColors = [
    { backgroundColor: "#6C63FF" }, // Purple
    { backgroundColor: "#FF6B6B" }, // Red
    { backgroundColor: "#00CFFF" }, // Aqua Blue
  ];

  const handleDeleteMember = async (memberId) => {
    try {
      await deleteDoc(doc(db, "members", memberId));
      Toast.show({
        type: "success",
        text1: "Member deleted",
      });

      // Refresh list
      const snapshot = await getDocs(collection(db, "members"));
      const updatedList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTimeout(() => {
        navigation.goBack(); // go back after 1 second
      }, 1000);
    } catch (error) {
      console.error("Error deleting member:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete member",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <BackHeader label="Members" />

        <Image
  source={
    member?.member_image?.startsWith("http")
      ? { uri: member.member_image }
      : {
          uri: "https://firebasestorage.googleapis.com/v0/b/cardinia-mens-shed-app.firebasestorage.app/o/member_pictures%2Fdefault-member-image.png?alt=media&token=50c3001e-5b29-4f83-b526-9e3e49b5ac6a"
        }}
  style={styles.avatar}
/>

        <Text style={styles.name}>{member?.member_name || "No Name"}</Text>

        <Text style={styles.name}>{member?.age || ""} years</Text>

        

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Date of Birth</Text>
          <Text style={styles.aboutText}>
  {formatTimestamp(member?.dob)}
</Text>


          <Text style={styles.sectionTitle}>Phone Number</Text>
          <Text style={styles.aboutText}>
            {member?.mobile || member?.telephone || "N/A"}
          </Text>

          <Text style={styles.sectionTitle}>Email Id</Text>
          <Text style={styles.aboutText}>{member?.email || "N/A"}</Text>

          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.aboutText}>
            {member?.address || "N/A"}, {member?.suburb || "N/A"},{" "}
            {member?.post_code || "N/A"}.
          </Text>

          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <Text style={styles.aboutText}>
            {member?.ice_contact || "N/A"}, {member?.member_relation || "N/A"},{" "}
            {member?.ice_telephone || "N/A"}.
          </Text>

          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestContainer}>
            {interests.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.interestChip,
                  chipColors[index % chipColors.length],
                ]}
              >
                <Text style={styles.interestText}>{item}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={() =>
              navigation.navigate("ReportScreen", { member: memberData })
            }
          >
            <Text style={styles.generateButtonText}>Generate Report</Text>
          </TouchableOpacity>

          {isAdmin && (
          <View style={styles.adminButtons}>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() =>
                navigation.navigate("EditMember", {
                  member: member,
                  memberId: member.id,
                })
              }
            >
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteMember(member?.id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MemberDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    backgroundColor: "#fff",
    paddingHorizontal: scale(20),
    flex: 1,
  },
  generateButton: {
    backgroundColor: "#4F6DF5",
    alignSelf: "flex-start",
    width: scale(160),
    paddingVertical: scale(8),
    paddingHorizontal: scale(20),
    borderRadius: scale(6),
    alignItems: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  generateButtonText: {
    fontSize: scale(14),
    fontWeight: "bold",
    color: "#fff",
  },
  avatar: {
    width: scale(120),
    height: scale(120),
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: scale(60),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  name: {
    marginTop: verticalScale(10),
    fontSize: scale(22),
    fontWeight: "bold",
    textAlign: "center",
  },
  followInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: verticalScale(20),
  },
  followStat: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: scale(16),
  },
  label: {
    fontSize: scale(12),
    color: "#888",
  },
  editBtn: {
    alignSelf: "center",
    borderWidth: 1,
    marginTop: verticalScale(20),
    borderColor: "#4F6DF5",
    paddingVertical: scale(8),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  editText: {
    color: "#4F6DF5",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: "600",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
    color: "#4F6DF5",
  },
  aboutText: {
    fontSize: scale(14),
    color: "#000",
    marginBottom: verticalScale(10),
  },
  interestContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(10),
    marginTop: verticalScale(10),
  },
  interestChip: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(16),
    borderRadius: scale(18),
  },
  interestText: {
    color: "#fff",
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(15),
    marginBottom: verticalScale(10),
    paddingHorizontal: scale(15),
  },
  touchArea: {
    marginRight: scale(8), // Optional spacing between elements
  },
  headerText: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#4F6DF5",
  },

  infoSection: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
  },
  
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  adminButtons: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: scale(20),
  marginTop: verticalScale(20),
  marginBottom: verticalScale(10),
},

updateBtn: {
  backgroundColor: '#4F6DF5',
  paddingVertical: 14,
  paddingHorizontal: 30,
  borderRadius: 8,
  alignItems: 'center',
},

deleteBtn: {
  backgroundColor: '#FF4C4C',
  paddingVertical: 14,       // changed from 16 to match updateBtn
  paddingHorizontal: 30,     // changed from 20 to match updateBtn
  borderRadius: 8,
  alignItems: 'center',      // added to center text like updateBtn
},


updateText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: scale(14),
},

});
