import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const user = {
    "firstName" : "Max",
    "lastName" : "Martin",
    "university" : "University of Florida",
    "phoneNumber" : "561-777-3698"
}

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>First Name: {user.firstName}</Text>
      <Text style={styles.header}>Last Name: {user.lastName}</Text>
      <Text style={styles.header}>University: {user.university}</Text>
      <Text style={styles.header}>Phone Number: {user.phoneNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
});
export default ProfileScreen;
