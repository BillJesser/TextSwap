import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import ip from './config';
import { Image } from 'react-native';
import logo from '../../assets/images/logo.png';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [university, setUniversity] = useState('');
    const [verificationLink, setVerificationLink] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post(`http://${ip}:5000/register`, {
                email,
                password,
                name,
                university
            });
            setVerificationLink(response.data.message);
            setError('');
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
            setVerificationLink('');
        }
    };

    const handleOkClick = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="University"
                value={university}
                onChangeText={setUniversity}
            />
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
            <Button title="Register" onPress={handleRegister} />
            {verificationLink ? (
                <View>
                    <Text style={styles.success}>
                        Registration successful! Please check your email inbox for a verification link in order to sign in.
                    </Text>
                    <Button title="OK" onPress={handleOkClick} />
                </View>
            ) : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
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
        marginBottom: 15,
        color: '#ffffff', // Change this to your desired color (e.g., Tomato)
    },
    input: {
        width: '30%', // Smaller width
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
        width: '30%', // Match button width to input width
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
    success: {
        color: 'green',
        marginBottom: 12,
        textAlign: 'center',
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


export default RegisterScreen;
