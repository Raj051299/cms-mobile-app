import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import LoadingScreen from "../components/LoadingScreen"; // adjust path
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { storage } from "../../firebase"; // adjust the path
import Toast from "react-native-toast-message";

const CreateEvent = ({ navigation }) => {
  
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    location: false,
  });

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
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
    try {
      console.log("Uploading from URI:", uri);

      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `event_covers/${filename}`);

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("Uploaded image URL:", downloadURL);
      return downloadURL;
    } catch (err) {
      console.error("🔥 Upload failed:", err);
      throw err;
    }
  };

  const handleCreateEvent = async () => {
    const newErrors = {
      title: !title.trim(),
      description: !description.trim(),
      location: !location.trim(),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      Toast.show({
        type: "error",
        text1: "Mandatory fields are required",
        position: "bottom", // 👈 optional here if already set globally
        visibilityTime: 2000,
      });
      return;
    }
    setLoading(true);
    try {
      let imageUrl = null;
      if (coverImage) {
        imageUrl = await uploadImageToFirebase(coverImage);
      }

      const eventData = {
        title,
        description,
        coverImage: imageUrl,
        location,
        date: Timestamp.fromDate(date),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "events"), eventData);
      Toast.show({ type: "success", text1: "Event Created successfully!" });
      // Reset the form
setTitle("");
setDescription("");
setLocation("");
setCoverImage(null);
setDate(new Date());
setErrors({
  title: false,
  description: false,
  location: false,
});

      navigation.goBack();
    } catch (error) {
      console.error("Error creating event:", error);
      Toast.show({ type: "error", text1: "Error in event creation" });
      
    }finally {
      setLoading(false);
    }
  };

  if (loading) {
  return <LoadingScreen message="Processing..." />;
}


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={20} color="#4F6DF5" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Event</Text>
          </View>

          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Event Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title)
                setErrors((prev) => ({ ...prev, title: false }));
            }}
            placeholderTextColor="#000"
          />

          <TextInput
            style={[
              styles.input,
              { height: 100 },
              errors.description && styles.inputError,
            ]}
            placeholder="Event Description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description)
                setErrors((prev) => ({ ...prev, description: false }));
            }}
            multiline
            placeholderTextColor="#000"
          />
          <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
            <Icon name="image-outline" size={24} color="#555" />
            <Text style={styles.datePickerText}>
              {coverImage ? "Change Cover Image" : "Select Cover Image"}
            </Text>
          </TouchableOpacity>

          {coverImage && (
            <Image source={{ uri: coverImage }} style={styles.imagePreview} />
          )}

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Icon name="calendar-outline" size={24} color="#555" />
            <Text style={styles.datePickerText}>{date.toDateString()}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            themeVariant="light"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onConfirm={(selectedDate) => {
              setDatePickerVisibility(false);
              if (selectedDate) setDate(selectedDate);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setTimePickerVisibility(true)}
          >
            <Icon name="clock-outline" size={24} color="#555" />
            <Text style={styles.datePickerText}>
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            themeVariant="light"
            onConfirm={(selectedTime) => {
              setTimePickerVisibility(false);
              if (selectedTime) {
                // preserve original date, just update time
                const updatedDate = new Date(date);
                updatedDate.setHours(selectedTime.getHours());
                updatedDate.setMinutes(selectedTime.getMinutes());
                setDate(updatedDate);
              }
            }}
            onCancel={() => setTimePickerVisibility(false)}
          />

          <TextInput
            style={[styles.input, errors.location && styles.inputError]}
            placeholder="Location"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (errors.location)
                setErrors((prev) => ({ ...prev, location: false }));
            }}
            placeholderTextColor="#000"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateEvent}
          >
           
              <Text style={styles.submitButtonText}>Create Event</Text>
          
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F6DF5",
    marginLeft: 10,
  },
  inputError: {
    borderColor: "red",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  datePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#4F6DF5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  pickImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: -10,
  },
});
