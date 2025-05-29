import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed
import { useAuth } from "../context/AuthContext";
import { useDrawerStatus } from "@react-navigation/drawer";
import Toast from "react-native-toast-message";
import { scale, verticalScale } from "react-native-size-matters";

const categories = [
  { id: "1", title: "Members" },
  { id: "2", title: "Events" },
  { id: "3", title: "Reports" },
];

const HomeScreen = () => {
  const drawerStatus = useDrawerStatus();

  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState("Events");
  const [user, setUser] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [events, setEvents] = useState([]);
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) setUser(JSON.parse(data));
    };

    fetchUser();

    const unsubscribe = onSnapshot(collection(db, "members"), (snapshot) => {
      const updatedMembers = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.member_name.localeCompare(b.member_name)); // Sort by name
      //
      setMembersData(updatedMembers);
    });

    const unsubscribeEvents = onSnapshot(
      collection(db, "events"),
      (snapshot) => {
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        const updatedEvents = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((event) => {
            const eventDate = event.date?.toDate?.(); // Convert Timestamp to JS Date
            if (!eventDate) return false;

            return (
              eventDate.getFullYear() > todayYear ||
              (eventDate.getFullYear() === todayYear &&
                eventDate.getMonth() > todayMonth) ||
              (eventDate.getFullYear() === todayYear &&
                eventDate.getMonth() === todayMonth &&
                eventDate.getDate() >= todayDate)
            );
          })

          .sort((a, b) => a.date.toDate() - b.date.toDate());

        setEvents(updatedEvents);
      }
    );

    return () => {
      unsubscribe(); // for members
      unsubscribeEvents(); // for events
    };
    // Clean up listener on unmount
  }, []);

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[styles.chip, item.title === activeCategory && styles.activeChip]}
      onPress={() => setActiveCategory(item.title)}
    >
      <Text
        style={[
          styles.chipText,
          item.title === activeCategory && styles.activeChipText,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate("EventDetail", { event: item })}
    >
      <Image source={{ uri: item.coverImage }} style={styles.cardImage} />
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>
          {item.date?.toDate?.()?.getDate() || ""}
        </Text>
        <Text style={styles.monthText}>
          {item.date
            ?.toDate?.()
            ?.toLocaleString("default", { month: "short" }) || ""}
        </Text>
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardLocation}>{item.location}</Text>
      <Text style={styles.attendees}>
        Event on{" "}
        {item.date?.toDate?.().toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        at{" "}
        {item.date?.toDate?.().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </Text>
    </TouchableOpacity>
  );

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => navigation.navigate("MemberDetail", { member: item })}
    >
      <Text style={styles.memberName}>{item.member_name}</Text>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setIsLoggedIn(false);
      Toast.show({
        type: "success",
        text1: "Logout Successful",
        text2: "Please login again!",
        position: "bottom",
      }); // ✅ Switches to AuthStack
    } catch (error) {
      console.error("Logout failed:", error);
      Toast.show({
        type: "error",
        text1: "Cannot Logout",
        position: "bottom",
      }); // ✅ Switches to AuthStack
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (drawerStatus !== "open") {
              navigation.dispatch(DrawerActions.openDrawer());
            }
          }}
        >
          <Icon name="menu" size={scale(23)} color="#fff" />
        </TouchableOpacity>

        {/* Center logo */}
        <Image
          source={require("../assets/Cardinia-Mens-Shed-logo-withoutbg.png")}
          style={styles.headerLogo}
        />

        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logout" size={scale(22)} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <View style={styles.categoryWrapper}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Section Title */}
      <View style={styles.eventsHeader}>
        <Text style={styles.sectionTitle}>
          {activeCategory === "Events"
            ? "Upcoming Events"
            : activeCategory === "Members"
            ? "Our Members"
            : "All Reports"}
        </Text>
      </View>

      {activeCategory === "Reports" ? (
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => navigation.navigate("ReportScreen")}
        >
          <Text style={styles.generateButtonText}>Open Report Generator</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={activeCategory === "Events" ? events : membersData}
          keyExtractor={(item) => item.id}
          renderItem={
            activeCategory === "Events" ? renderEventCard : renderMemberItem
          }
          horizontal={false}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 80,
          }}
        />
      )}

      {user && (
        <>
          {user.isAdmin && activeCategory === "Events" ? (
            <TouchableOpacity
              style={styles.fab}
              onPress={() => navigation.navigate("CreateEvent")}
            >
              <Icon name="plus" size={scale(20)} color="#fff" />
            </TouchableOpacity>
          ) : (
            user.isAdmin &&
            activeCategory === "Members" && (
              <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("AddMember")}
              >
                <Icon name="plus" size={scale(20)} color="#fff" />
              </TouchableOpacity>
            )
          )}
        </>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },
  header: {
    backgroundColor: "#4F6DF5",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(47),
    paddingBottom: verticalScale(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLogo: {
    width: scale(100),
    height: verticalScale(40),
    resizeMode: "contain",
  },
  categoryWrapper: {
    marginTop: verticalScale(16),
    paddingHorizontal: scale(10),
  },
  chip: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(14),
    backgroundColor: "#e0e7ff",
    borderRadius: scale(20),
    marginRight: scale(8),
  },
  activeChip: {
    backgroundColor: "#4F6DF5",
  },
  chipText: {
    color: "#4F6DF5",
    fontWeight: "600",
    fontSize: scale(14),
  },
  activeChipText: {
    color: "#fff",
  },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: "#000",
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: scale(12),
    marginBottom: verticalScale(14),
    padding: scale(12),
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: verticalScale(120),
    borderRadius: scale(8),
    marginBottom: verticalScale(8),
  },
  dateBadge: {
    position: "absolute",
    top: verticalScale(8),
    left: scale(10),
    backgroundColor: "#fff",
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(8),
    borderRadius: scale(6),
    elevation: 2,
  },
  dateText: {
    fontSize: scale(14),
    fontWeight: "bold",
    color: "#4F6DF5",
  },
  monthText: {
    fontSize: scale(12),
    color: "#4F6DF5",
  },
  cardTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#333",
  },
  cardLocation: {
    fontSize: scale(12),
    color: "#666",
    marginTop: verticalScale(2),
  },
  attendees: {
    fontSize: scale(12),
    color: "#888",
    marginTop: verticalScale(2),
  },
  memberCard: {
    backgroundColor: "#fff",
    padding: scale(14),
    borderRadius: scale(10),
    marginBottom: verticalScale(10),
    elevation: 2,
  },
  memberName: {
    fontSize: scale(16),
    fontWeight: "500",
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#4F6DF5",
    marginHorizontal: scale(20),
    marginTop: verticalScale(30),
    padding: verticalScale(14),
    borderRadius: scale(10),
    alignItems: "center",
  },
  generateButtonText: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: "#fff",
  },
  fab: {
    position: "absolute",
    bottom: verticalScale(30),
    right: scale(10),
    width: scale(40),
    height: scale(40),
    borderRadius: scale(28),
    backgroundColor: "#4F6DF5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    zIndex: 10,
  },
});
