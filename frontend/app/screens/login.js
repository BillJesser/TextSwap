import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useUser } from './UserContext';
import ip from './config';

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
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
    link: {
        color: 'blue',
        marginTop: 12,
        textAlign: 'center',
    },
});

export default LoginScreen;
