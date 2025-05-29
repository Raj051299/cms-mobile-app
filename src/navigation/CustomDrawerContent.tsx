import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { StackNavigationProp } from "@react-navigation/stack";

type DrawerItemProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Icon name={icon} size={22} color="#333" />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const CustomDrawerContent: React.FC = () => {
  const [member, setMember] = useState(null);

  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    const fetchMemberInfo = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      console.log(user)
      const userIdentifier = user.username;

const emailQuery = query(collection(db, "members"), where("email", "==", userIdentifier));
const mobileQuery = query(collection(db, "members"), where("mobile", "==", userIdentifier));

const emailSnap = await getDocs(emailQuery);
const mobileSnap = await getDocs(mobileQuery);

const snapshot = !emailSnap.empty ? emailSnap : mobileSnap;

if (!snapshot.empty) {
  const data = snapshot.docs[0].data();
  setMember(data);
}

    };

    fetchMemberInfo();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={
            member?.member_image
              ? { uri: member.member_image }
              : {
          uri: "https://firebasestorage.googleapis.com/v0/b/cardinia-mens-shed-app.firebasestorage.app/o/member_pictures%2Fdefault-member-image.png?alt=media&token=50c3001e-5b29-4f83-b526-9e3e49b5ac6a"
        } }
          style={styles.avatar}
        />

        <Text style={styles.name}>{member?.member_name || "Guest User"}</Text>
      </View>

      <DrawerItem
        icon="calendar-month-outline"
        label="Events"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
      <DrawerItem
        icon="email-outline"
        label="Contact Us"
        onPress={() => navigation.navigate("ContactUs")}
      />
      <DrawerItem
  icon="help-circle-outline"
  label="FAQs"
  onPress={() => navigation.navigate('Faq')}
/>


      
      {/* <DrawerItem icon="logout" label="Sign Out" onPress={handleLogout} /> */}
    </ScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 90,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
});
