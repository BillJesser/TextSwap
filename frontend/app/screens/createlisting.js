import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useUser } from './UserContext';
import ip from './config';

const CreateListingScreen = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [condition, setCondition] = useState('');
    const [price, setPrice] = useState('');
    const [otherDesiredTitles, setOtherDesiredTitles] = useState('');
    const userEmail = useUser();

    const handleFinalizeListing = async () => {
        // Validate input
        if (!title || !author || !courseNumber || !condition || !price) {
            Alert.alert('Error', 'Please fill out all required fields.');
            return;
        }

        // Validate price input is a valid number
        const priceFloat = parseFloat(price);
        if (isNaN(priceFloat) || priceFloat <= 0) {
            Alert.alert('Error', 'Please enter a valid price.');
            return;
        }

        // Prepare the data
        const listingData = {
            title,
            author,
            course_number: courseNumber,
            condition,
            price: priceFloat, // Ensure price is sent as a float
            other_desired_titles: otherDesiredTitles,
            user_email: userEmail
        };

        try {
            // Send the POST request to the backend
            const response = await axios.post(`http://${ip}:5000/create_listing`, listingData);
            if (response.status === 201) {
                Alert.alert('Success', 'Listing created successfully!');
                // Clear fields after successful submission
                setTitle('');
                setAuthor('');
                setCourseNumber('');
                setCondition('');
                setPrice('');
                setOtherDesiredTitles('');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create listing. Please try again.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter textbook title"
            />

            <Text style={styles.label}>Author</Text>
            <TextInput
                style={styles.input}
                value={author}
                onChangeText={setAuthor}
                placeholder="Enter author name"
            />

            <Text style={styles.label}>Course Number</Text>
            <TextInput
                style={styles.input}
                value={courseNumber}
                onChangeText={setCourseNumber}
                placeholder="Enter course number (EX: CEN3031)"
            />

            <Text style={styles.label}>Condition (1-10)</Text>
            <TextInput
                style={styles.input}
                value={condition}
                onChangeText={setCondition}
                placeholder="Enter condition (1-10)"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Other Desired Titles</Text>
            <TextInput
                style={styles.input}
                value={otherDesiredTitles}
                onChangeText={setOtherDesiredTitles}
                placeholder="Enter other desired titles"
            />

            <Button title="Finalize Listing" onPress={handleFinalizeListing} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    }
});

export default CreateListingScreen;
