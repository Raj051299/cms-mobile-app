import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { scale, verticalScale } from "react-native-size-matters";
import { storage,db } from "../../firebase"; // adjust the path

const AddMemberScreen = () => {
  const navigation = useNavigation();

  // All fields
  const [member_name, setMemberName] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const [c_tee, setcTee] = useState("");
  const [wwc, setWwc] = useState("");
  const [first_aid, setFirstaid] = useState("");
  const [food_handler, setFoodhandler] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [dob, setDOB] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("");
  const [financial, setFinancial] = useState("");
  const [address, setAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [post_code, setPostcode] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [ice_contact, setIceContact] = useState("");
  const [member_relationship, setMemberRelatioship] = useState("");
  const [ice_telephone, setIceTelephone] = useState("");
  const [interest_group_1, setInterestGroup1] = useState("");
  const [interest_group_2, setInterestGroup2] = useState("");
  const [interest_group_3, setInterestGroup3] = useState("");

  const [errors, setErrors] = useState({});

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    if (!uri) return null;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const ext = uri.split(".").pop();
      const filename = `member_${Date.now()}.${ext}`;
      const storageRef = ref(storage, `member_pictures/${filename}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleAddMember = async () => {
    const newErrors = {};
    if (!member_name.trim()) newErrors.member_name = true;
    if (!mobile.trim()) newErrors.mobile = true;
    if (!age.trim()) newErrors.age = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.show({
        type: "error",
        text1: "Please fill all required fields",
        position: "bottom",
      });
      return;
    }

    setErrors({});

    let imageUrl = null;

    if (coverImage) {
      imageUrl = await uploadImageToFirebase(coverImage);
    }
    try {
      const memberData = {
        member_name,
        c_tee: c_tee === false, // 🛡️ Save radio boolean (true/false)
        wwc: wwc === false,
        first_aid: first_aid === false,
        food_handler: food_handler === false,
        joinedDate,
        dob,
        age: parseInt(age),
        status,
        financial,
        address,
        suburb,
        post_code,
        telephone,
        mobile,
        email,
        ice_contact,
        member_relationship,
        ice_telephone,
        interest_group_1,
        interest_group_2,
        interest_group_3,
        createdAt: serverTimestamp(),
        isActive: true,
      };

      await addDoc(collection(db, "members"), memberData);

      alert("Member Added Successfully!!");

      setTimeout(() => {
        navigation.goBack(); // go back after 1 second
      }, 1000);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const calculateAgeFromDOB = (dobString) => {
    const today = new Date();
    const birthDate = new Date(dobString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If birth month hasn't arrived yet this year, or it's the same month but birth day hasn't arrived
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#4F6DF5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Member</Text>
        </View>

        {/* Form */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.form}>
            <TextInput
              placeholder="Full Name"
              value={member_name}
              onChangeText={(text) => {
                setMemberName(text);
                if (errors.member_name)
                  setErrors((prev) => ({ ...prev, member_name: false }));
              }}
              style={[styles.input, errors.member_name && styles.inputError]}
            />

            <TouchableOpacity
              style={styles.pickImageButton}
              onPress={pickImage}
            >
              <Icon name="image-outline" size={24} color="#555" />
              <Text style={styles.datePickerText}>
                {coverImage ? "Change Member Image" : "Select Member Image"}
              </Text>
            </TouchableOpacity>

            {coverImage && (
              <Image source={{ uri: coverImage }} style={styles.imagePreview} />
            )}
            {/* <Input placeholder="Committee (C-Tee)" value={c_tee} onChangeText={setcTee} /> */}
            <View style={styles.radioGroup}>
              <View style={styles.radioRow}>
                <Text style={styles.radioLabel}>Committee (C-Tee) </Text>
                <TouchableOpacity
                  style={styles.radioCircle}
                  onPress={() => setcTee(true)}
                >
                  {c_tee === true && <View style={styles.selectedRb} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>Yes</Text>

                <TouchableOpacity
                  style={styles.radioCircle}
                  onPress={() => setcTee(false)}
                >
                  {c_tee === false && <View style={styles.selectedRb} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>No</Text>
              </View>
            </View>

            <View style={styles.radioGroup}>
              <View style={styles.radioRow}>
                <Text style={styles.radioLabel}>Working With Children</Text>
                <TouchableOpacity
                  style={styles.radioCircle}
                  onPress={() => setWwc(true)}
                >
                  {wwc === true && <View style={styles.selectedRb} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>Yes</Text>

                <TouchableOpacity
                  style={styles.radioCircle}
                  onPress={() => setWwc(false)}
                >
                  {wwc === false && <View style={styles.selectedRb} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>No</Text>
              </View>
            </View>

            {/* First Aid Certificate */}
            <View style={styles.radioGroup}>
              <View style={styles.radioRow}>
                <Text style={styles.radioLabel}>First Aid Certificate</Text>
                <TouchableOpacity
                  style={styles.radioCircle}
                  onPress={() => setFirstaid(true)}
                >
                  {first_aid === true && <View style={styles.selectedRb} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>Yes</Text>

                <TouchableOpacity
                  style={styles.radioCircle}
                  onPress={() => setFirstaid(false)}
                >
                  {first_aid === false && <View style={styles.selectedRb} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>No</Text>
              </View>
            </View>

            {/* Food Handler Certificate */}
            <View style={styles.radioGroup}>
              <View style={styles.radioRow}>
                <Text style={styles.radioLabel}>Food Handler Certificate</Text>
                <TouchableOpacity
                  style={styles.radioCircle}
                  onPress={() => setFoodhandler(true)}
                >
                  {food_handler === true && <View style={styles.selectedRb} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>Yes</Text>

                <TouchableOpacity
                  style={styles.radioCircle}
                  onPress={() => setFoodhandler(false)}
                >
                  {food_handler === false && <View style={styles.selectedRb} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>No</Text>
              </View>
            </View>
            <TextInput
              placeholder="Joined Date (DD/MM/YYYY)"
              value={joinedDate}
              onChangeText={(text) => {
                setJoinedDate(text);
                if (errors.member_name)
                  setErrors((prev) => ({ ...prev, member_name: false }));
              }}
              style={[styles.input, errors.member_name && styles.inputError]}
            />

            <TextInput
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={dob}
              onChangeText={(text) => {
                setDOB(text);
                if (errors.member_name)
                  setErrors((prev) => ({ ...prev, member_name: false }));

                // Try calculating age automatically
                if (text.length === 10) {
                  // Quick check if user entered full date
                  const calculatedAge = calculateAgeFromDOB(text);
                  setAge(calculatedAge.toString());
                }
              }}
              style={[styles.input, errors.member_name && styles.inputError]}
            />

            <Input
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />
            <Input
              placeholder="Status"
              value={status}
              onChangeText={setStatus}
            />
            <Input
              placeholder="Financial Member"
              value={financial}
              onChangeText={setFinancial}
            />
            <Input
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <Input
              placeholder="Suburb"
              value={suburb}
              onChangeText={setSuburb}
            />
            <Input
              placeholder="Post Code"
              value={post_code}
              onChangeText={setPostcode}
              keyboardType="number-pad"
            />
            <Input
              placeholder="Telephone"
              value={telephone}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
            />
            <Input
              placeholder="Mobile"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
              placeholder="ICE Contact Name"
              value={ice_contact}
              onChangeText={setIceContact}
            />
            <Input
              placeholder="ICE Relationship"
              value={member_relationship}
              onChangeText={setMemberRelatioship}
            />
            <Input
              placeholder="ICE Telephone"
              value={ice_telephone}
              onChangeText={setIceTelephone}
              keyboardType="phone-pad"
            />
            <Input
              placeholder="Interest Group 1"
              value={interest_group_1}
              onChangeText={setInterestGroup1}
            />
            <Input
              placeholder="Interest Group 2"
              value={interest_group_2}
              onChangeText={setInterestGroup2}
            />
            <Input
              placeholder="Interest Group 3"
              value={interest_group_3}
              onChangeText={setInterestGroup3}
            />

            {/* Add Member Button */}
            <TouchableOpacity style={styles.button} onPress={handleAddMember}>
              <Text style={styles.buttonText}>Add Member</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

// Reusable Input component
const Input = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    placeholderTextColor="#999"
    style={styles.input}
  />
);

export default AddMemberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1.5,
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
  form: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  input: {
    backgroundColor: "#fff",
    padding: scale(14),
    borderRadius: scale(10),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#000",
  },
  button: {
    backgroundColor: "#4F6DF5",
    paddingVertical: verticalScale(15),
    borderRadius: scale(10),
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  buttonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "bold",
  },
  radioGroup: {
    marginBottom: verticalScale(16),
  },
  radioLabel: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: "#333",
    marginBottom: verticalScale(8),
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(5),
  },
  radioCircle: {
    height: scale(20),
    width: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: "#4F6DF5",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(6),
  },
  selectedRb: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: "#4F6DF5",
  },
  radioText: {
    fontSize: scale(14),
    color: "#333",
    marginRight: scale(10),
  },
  pickImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: scale(12),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: verticalScale(20),
  },
  imagePreview: {
    width: "100%",
    height: verticalScale(200),
    borderRadius: scale(10),
    marginBottom: verticalScale(20),
    marginTop: verticalScale(-10),
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
