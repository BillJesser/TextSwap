import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListingDetailsScreen = ({ route }) => {
    const { listing } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Listing Details</Text>
            <Text style={styles.label}>Title: {listing.title}</Text>
            <Text style={styles.label}>Author: {listing.author}</Text>
            <Text style={styles.label}>Course Number: {listing.course_number}</Text>
            <Text style={styles.label}>Condition: {listing.condition}</Text>
            <Text style={styles.label}>Price: ${listing.price}</Text>
            <Text style={styles.label}>Other Desired Titles: {listing.other_desired_titles}</Text>
            <Text style={styles.label}>User Email: {listing.user_email.userEmail}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16,
        backgroundColor: '#050a30' 

    },
    header: { fontSize: 24, 
        marginBottom: 16, 
        textAlign: 'center', 
        color: '#ffffff'

    },
    label: { 
        fontSize: 18, 
        marginBottom: 8,
        color: '#ffffff', 
       
    },
});

export default ListingDetailsScreen;
