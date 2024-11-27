import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UserSettingsPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileDetails}>
          <TouchableOpacity>
            <View style={styles.profileIcon}>
              <Text style={styles.profileInitials}>A</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.profileText}>
            <Text style={styles.userName}>Aditi Narayan</Text>
            <TouchableOpacity onPress={() => alert("View Profile")}>
              <Text style={styles.viewProfile}>View profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <ScrollView style={styles.menuSection}>
        <MenuItem
          icon="person-add"
          label="Add account"
          onPress={() => alert("Add account")}
        />
        <MenuItem
          icon="flash"
          label="What's new"
          onPress={() => alert("What's new")}
        />
        <MenuItem
          icon="time-outline"
          label="Recents"
          onPress={() => alert("Recents")}
        />
        <MenuItem
          icon="settings-outline"
          label="Settings and privacy"
          onPress={() => alert("Settings and privacy")}
        />
      </ScrollView>
    </View>
  );
};

const MenuItem = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#FFF" style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#000",
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#B5651D",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileText: {
    marginLeft: 15,
  },
  userName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  viewProfile: {
    color: "#1E90FF",
    fontSize: 14,
    marginTop: 5,
  },
  menuSection: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuIcon: {
    marginRight: 20,
  },
  menuLabel: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default UserSettingsPage;
