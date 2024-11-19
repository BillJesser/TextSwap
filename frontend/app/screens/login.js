import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useUser } from './UserContext';
import ip from './config';
import { Image } from 'react-native';
import logo from '../../assets/images/logo.png';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUserEmail } = useUser();  // use setUserEmail instead of setUser

    const handleLogin = async () => {
        try {
            const response = await axios.post(`http://${ip}:5000/login`, {
                email: email,
                password: password,
            });
            // Set the user’s email in context after successful login
            setUserEmail(email);
            setError('');
            navigation.navigate('Dashboard'); // Navigate to the Dashboard
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
                Don't have an account? Register here
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#050a30', // Navy blue background
  },
  logo: {
      width: 250,
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // White text color
  },
  input: {
    width: '30%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000', // Black text color
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    color: '#00BFFF', // Light blue text color
    marginTop: 12,
    textAlign: 'center',
  },
});


export default LoginScreen;
