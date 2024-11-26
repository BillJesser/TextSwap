import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EditableProfileField from '@/components/EditableProfileField';
import ChangePasswordButton from '@/components/ChangePasswordButton';
import { useUser } from './UserContext';

const headers = {
  name: "Name",
  email: "Email",
  university: "University",
  phoneNumber: "Phone Number",
};

const ProfileScreen = () => {
  const { userEmail } = useUser();

  const [user, setUser] = useState({
    email: userEmail || "",
    name: "",
    university: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user?email=${user.email}`);
        const data = await response.json();
        console.log("Fetched data:", data);

        setUser((prevUser) => ({
          ...prevUser,
          name: data.name,
          university: data.university,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user.email) {
      fetchUserData();
    }
  }, [user.email]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.email}>
        <EditableProfileField user={user} header={headers.email} text={user.email} editable={false} />
      </View>
      <View style={styles.name}>
        <EditableProfileField user={user} header={headers.name} text={user.name} editable={true} />
      </View>
      <View style={styles.university}>  
        <EditableProfileField user={user} header={headers.university} text={user.university} editable={true} />
      </View>
      <ChangePasswordButton email={user.email} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#050a30',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  email: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: '15%',
    height: '10%',
    justifyContent: 'center',
  },
  name: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: '15%',
    height: '10%',
    justifyContent: 'center',
  },
  university: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: '15%',
    height: '10%',
    justifyContent: 'center',
    marginBottom: '15%',
  },
  ChangePasswordButton: {
    color: '#ffffff',
    backgroundColor: '#ca3e47',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProfileScreen;
