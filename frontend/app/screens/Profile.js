import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        console.log("Updated user state:", user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user.email) {
      fetchUserData();
    }
  }, [user.email]);

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  console.log("Rendering ProfileScreen with user:", user);

  return (
    <View style={styles.container}>
      <EditableProfileField user={user} header={headers.email} text={user.email} editable={false} />
      <EditableProfileField user={user} header={headers.name} text={user.name} editable={true} />
      <EditableProfileField user={user} header={headers.university} text={user.university} editable={true} />
      <ChangePasswordButton email={user.email} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 24,
    marginLeft: 32,
  },
});

export default ProfileScreen;
