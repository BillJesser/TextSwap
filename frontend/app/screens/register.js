import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import ip from './config';

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
    success: {
        color: 'green',
        marginBottom: 12,
        textAlign: 'center',
    },
});

export default RegisterScreen;
