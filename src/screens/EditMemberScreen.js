import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { scale, verticalScale } from "react-native-size-matters";
import LoadingScreen from "../components/LoadingScreen"; // adjust path

const EditMemberScreen = () => {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { member, memberId } = route.params;

  const [member_name, setMemberName] = useState(member?.member_name || "");
  const [coverImage, setCoverImage] = useState(member?.coverImage || "");
  const [dob, setDOB] = useState(member?.dob || "");
  const [age, setAge] = useState(member?.age?.toString() || "");
  const [status, setStatus] = useState(member?.status || "");
  const [financial, setFinancial] = useState(member?.financial || "");
  const [address, setAddress] = useState(member?.address || "");
  const [suburb, setSuburb] = useState(member?.suburb || "");
  const [post_code, setPostcode] = useState(member?.post_code || "");
  const [telephone, setTelephone] = useState(member?.telephone || "");
  const [mobile, setMobile] = useState(member?.mobile || "");
  const [email, setEmail] = useState(member?.email || "");
  const [ice_contact, setIceContact] = useState(member?.ice_contact || "");
  const [member_relationship, setMemberRelatioship] = useState(
    member?.member_relationship || ""
  );
  const [ice_telephone, setIceTelephone] = useState(
    member?.ice_telephone || ""
  );
  const [interest_group_1, setInterestGroup1] = useState(
    member?.interest_group_1 || ""
  );
  const [interest_group_2, setInterestGroup2] = useState(
    member?.interest_group_2 || ""
  );
  const [interest_group_3, setInterestGroup3] = useState(
    member?.interest_group_3 || ""
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow permission to access media."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    if (!uri || uri.startsWith("https")) return uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `member_${Date.now()}.jpg`;
    const storageRef = ref(storage, `member_pictures/${filename}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleUpdateMember = async () => {
    try {
      const updatedData = {};

      if (member_name !== member.member_name)
        updatedData.member_name = member_name;
      if (dob !== member.dob) updatedData.dob = dob;
      if (age !== member.age?.toString()) updatedData.age = parseInt(age) || 0;
      if (status !== member.status) updatedData.status = status;
      if (financial !== member.financial) updatedData.financial = financial;
      if (address !== member.address) updatedData.address = address;
      if (suburb !== member.suburb) updatedData.suburb = suburb;
      if (post_code !== member.post_code) updatedData.post_code = post_code;
      if (telephone !== member.telephone) updatedData.telephone = telephone;
      if (mobile !== member.mobile) updatedData.mobile = mobile;
      if (email !== member.email) updatedData.email = email;
      if (ice_contact !== member.ice_contact)
        updatedData.ice_contact = ice_contact;
      if (member_relationship !== member.member_relationship)
        updatedData.member_relationship = member_relationship;
      if (ice_telephone !== member.ice_telephone)
        updatedData.ice_telephone = ice_telephone;
      if (interest_group_1 !== member.interest_group_1)
        updatedData.interest_group_1 = interest_group_1;
      if (interest_group_2 !== member.interest_group_2)
        updatedData.interest_group_2 = interest_group_2;
      if (interest_group_3 !== member.interest_group_3)
        updatedData.interest_group_3 = interest_group_3;

      setLoading(true);


      // Check if image changed
      if (
        !coverImage.startsWith("https") ||
        coverImage !== member.member_image
      ) {
        const updatedImage = await uploadImageToFirebase(coverImage);
        updatedData.member_image = updatedImage;
      }

      if (Object.keys(updatedData).length === 0) {
        Toast.show({ type: "info", text1: "No changes detected." });
        return;
      }

      await updateDoc(doc(db, "members", memberId), updatedData);


      await updateDoc(doc(db, "members", memberId), updatedData);
      Toast.show({ type: "success", text1: "Member updated successfully!" });
      navigation.goBack();
    } catch (error) {
      console.error("Update failed:", error);
      Toast.show({ type: "error", text1: "Update failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const renderLabeledInput = (
    label,
    value,
    setValue,
    placeholder,
    keyboardType = "default"
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </>
  );

  if (loading) {
    return <LoadingScreen message="Processing..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#4F6DF5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Member</Text>
        </View>

        {renderLabeledInput(
          "Full Name",
          member_name,
          setMemberName,
          "Full Name"
        )}
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text>{coverImage ? "Change Image" : "Pick Image"}</Text>
        </TouchableOpacity>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.imagePreview} />
        ) : null}

        {renderLabeledInput("Date of Birth", dob, setDOB, "Date of Birth")}
        {renderLabeledInput("Age", age, setAge, "Age", "numeric")}
        {renderLabeledInput("Status", status, setStatus, "Status")}
        {renderLabeledInput(
          "Financial",
          financial,
          setFinancial,
          "Financial Status"
        )}
        {renderLabeledInput("Address", address, setAddress, "Address")}
        {renderLabeledInput("Suburb", suburb, setSuburb, "Suburb")}
        {renderLabeledInput("Post Code", post_code, setPostcode, "Post Code")}
        {renderLabeledInput(
          "Telephone",
          telephone,
          setTelephone,
          "Telephone",
          "phone-pad"
        )}
        {renderLabeledInput("Mobile", mobile, setMobile, "Mobile", "phone-pad")}
        {renderLabeledInput("Email", email, setEmail, "Email", "email-address")}
        {renderLabeledInput(
          "Emergency Contact Name",
          ice_contact,
          setIceContact,
          "ICE Name"
        )}
        {renderLabeledInput(
          "Relationship",
          member_relationship,
          setMemberRelatioship,
          "Relationship"
        )}
        {renderLabeledInput(
          "Emergency Contact Phone",
          ice_telephone,
          setIceTelephone,
          "ICE Phone",
          "phone-pad"
        )}
        {renderLabeledInput(
          "Interest Group 1",
          interest_group_1,
          setInterestGroup1,
          "Interest Group 1"
        )}
        {renderLabeledInput(
          "Interest Group 2",
          interest_group_2,
          setInterestGroup2,
          "Interest Group 2"
        )}
        {renderLabeledInput(
          "Interest Group 3",
          interest_group_3,
          setInterestGroup3,
          "Interest Group 3"
        )}

        <TouchableOpacity style={styles.button} onPress={handleUpdateMember}>
          <Text style={styles.buttonText}>Update Member</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: scale(20), backgroundColor: "#F5F7FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#4F6DF5",
    marginLeft: scale(10),
  },
  label: {
    fontSize: scale(14),
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: scale(12),
    borderRadius: scale(8),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: "#ccc",
  },
  imageButton: {
    backgroundColor: "#fff",
    padding: scale(10),
    borderRadius: scale(8),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    marginBottom: verticalScale(10),
  },
  imagePreview: {
    width: "100%",
    height: verticalScale(200),
    borderRadius: scale(8),
    marginBottom: verticalScale(20),
  },
  button: {
    backgroundColor: "#4F6DF5",
    padding: scale(14),
    borderRadius: scale(10),
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  buttonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default EditMemberScreen;
