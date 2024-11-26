import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import ip from './config';

const EditListingScreen = ({ route, navigation }) => {
    const { listing, refreshListings } = route.params;
    const [title, setTitle] = useState(listing.title);
    const [author, setAuthor] = useState(listing.author);
    const [courseNumber, setCourseNumber] = useState(listing.course_number);
    const [price, setPrice] = useState(listing.price.toString());
    const [condition, setCondition] = useState(listing.condition);
    const [otherDesiredTitles, setOtherDesiredTitles] = useState(listing.other_desired_titles || "");

    const handleSave = async () => {
        const updatedListing = {
            title,
            author,
            course_number: courseNumber,
            price: parseFloat(price),
            condition,
            other_desired_titles: otherDesiredTitles,
        };

        try {
            await axios.post(`http://${ip}:5000/update_listing/${listing.id}`, updatedListing);
            refreshListings();
            navigation.goBack();
        } catch (error) {
            console.error("Failed to update listing:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit Listing</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Author"
                value={author}
                onChangeText={setAuthor}
            />
            <TextInput
                style={styles.input}
                placeholder="Course Number"
                value={courseNumber}
                onChangeText={setCourseNumber}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                keyboardType="numeric"
                onChangeText={setPrice}
            />
            <TextInput
                style={styles.input}
                placeholder="Condition"
                value={condition}
                onChangeText={setCondition}
            />
            <TextInput
                style={styles.input}
                placeholder="Other Desired Titles"
                value={otherDesiredTitles}
                onChangeText={setOtherDesiredTitles}
            />
            <Button title="Save Changes" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16, 
        backgroundColor: '#050a30'
    },
    header: { 
        fontSize: 24, 
        marginBottom: 16, 
        textAlign: 'center', 
        color: '#ffffff'  
    },
    input: { height: 40, 
        borderColor: 'gray', 
        borderWidth: 1, 
        marginBottom: 10, 
        paddingLeft: 8,
        backgroundColor: '#ffffff', 
        borderRadius: 5
    },
});

export default EditListingScreen;
