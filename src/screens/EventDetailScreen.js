import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BackHeader from "../components/Backheader";
import Toast from "react-native-toast-message";
import { useUser } from "../utils/useUser";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

import { scale, verticalScale } from "react-native-size-matters";

const EventDetailScreen = () => {
  const { isAdmin } = useUser();

  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params;

  const [user, setUser] = useState(null);

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      Toast.show({
        type: "success",
        text1: "Event deleted successfully",
        position: "bottom", // or 'bottom'
      });
      navigation.goBack(); // or to event list
    } catch (error) {
      console.error("Error deleting event:", error);
      Toast.show({ type: "error", text1: "Failed to delete event" });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  const formatDateTime = (isoDate) => {
    if (!isoDate) return { formattedDate: "", formattedTime: "" };

    const dateObj = new Date(isoDate);
    const optionsDate = { day: "numeric", month: "long", year: "numeric" };
    const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };

    const formattedDate = dateObj.toLocaleDateString("en-US", optionsDate);
    const formattedTime = dateObj.toLocaleTimeString("en-US", optionsTime);

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatDateTime(
    event.date?.toDate?.()
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Bar */}
        <BackHeader label="Events" />

        {/* Event Image */}
        <View style={styles.imageWrapper}>
          {event.coverImage ? (
            <Image
              source={{ uri: event.coverImage }}
              style={styles.eventImage}
            />
          ) : (
            <View style={styles.noImageBox}>
              <Text style={styles.noImageText}>No image provided</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.contentWrapper}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={wp("5.5%")} color="#4F6DF5" />
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoMain}>{formattedDate}</Text>
              <Text style={styles.infoSub}>{formattedTime}</Text>
            </View>
          </View>

          <Text style={styles.aboutTitle}>Description</Text>
          <Text style={styles.aboutText}>{event.description}</Text>

          <Text style={styles.aboutTitle}>Location</Text>
          <Text style={styles.aboutText}>{event.location}</Text>

          {user && (
            <TouchableOpacity
              style={styles.clockInButton}
              onPress={() =>
                navigation.navigate("ClockInScreen", {
                  eventId: event.id,
                  eventTitle: event.title,
                  eventDate: event.date,
                })
              }
            >
              <Text style={styles.clockInButtonText}>Clock In / Out</Text>
            </TouchableOpacity>
          )}

           {isAdmin && (
            <TouchableOpacity
              style={styles.attendeeBtn}
              onPress={() =>
                navigation.navigate("EventAttendance", { eventId: event.id,event })
              }
            >
              <Text style={styles.attendeeBtnText}>View Attendees</Text>
            </TouchableOpacity>
          )}

          {isAdmin && (
            <View style={styles.adminButtons}>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => navigation.navigate("EditEvent", { event })}
              >
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteEvent(event.id)}
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

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    paddingBottom: hp("4%"),
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: hp("3%"),
    paddingBottom: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    marginBottom: hp("1.5%"),
  },
  backButtonHeader: {
    marginRight: wp("2%"),
  },
  headerTitle: {
    fontSize: wp("5.5%"),
    fontWeight: "600",
    color: "#4F6DF5",
  },
  imageWrapper: {
    paddingHorizontal: wp("5%"),
    marginBottom: hp("2%"),
  },
  eventImage: {
    width: "100%",
    height: hp("25%"),
    resizeMode: "cover",
    borderRadius: wp("4%"),
  },
  contentWrapper: {
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
  },
  eventTitle: {
    fontSize: wp("6.5%"),
    fontWeight: "bold",
    color: "#000",
    marginBottom: hp("2%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  infoTextWrapper: {
    marginLeft: wp("3%"),
  },
  infoMain: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "#333",
  },
  infoSub: {
    fontSize: wp("3.5%"),
    color: "#666",
  },
  aboutTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#000",
    marginTop: hp("1%"),
    marginBottom: hp("1.5%"),
  },
  aboutText: {
    fontSize: wp("4%"),
    color: "#555",
    lineHeight: hp("2.8%"),
    marginBottom: hp("1.5%"),
  },
  clockInButton: {
    backgroundColor: "#4F6DF5",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("3%"),
    marginTop: hp("2.5%"),
    alignItems: "center",
  },
  clockInButtonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: hp("4%"),
  },
  noImageBox: {
    width: "100%",
    height: hp("25%"),
    borderRadius: wp("4%"),
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#888",
    fontSize: wp("4%"),
    fontStyle: "italic",
  },
  adminButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  updateBtn: {
    backgroundColor: "#4F6DF5",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  updateText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: scale(14),
  },
  deleteBtn: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: scale(14),
  },
  attendeeBtn: {
  backgroundColor: '#4F6DF5',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 20,
},
attendeeBtnText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

});
