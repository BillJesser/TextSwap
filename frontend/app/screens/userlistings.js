import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useUser } from './UserContext';

const MyListingsScreen = () => {
    const [listings, setListings] = useState([]);
    const { userEmail } = useUser();  // Get userEmail from context

    useEffect(() => {
        const fetchUserListings = async () => {
            try {
                if (userEmail) {
                    const response = await axios.get(`http://localhost:5000/user_listings`, {
                        params: { user_email: userEmail }
                    });
                    if (response.status === 200) {
                        setListings(response.data.listings);
                    }
                } else {
                    console.log("userEmail is null or undefined");
                }
            } catch (error) {
                console.error("Failed to fetch user listings:", error);
            }
        };

        fetchUserListings();
    }, [userEmail]);

    const renderListing = ({ item }) => (
        <View style={styles.listingContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>Author: {item.author}</Text>
            <Text>Course Number: {item.course_number}</Text>
            <Text>Price: ${item.price.toFixed(2)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Listings</Text>
            <FlatList
                data={listings}
                renderItem={renderListing}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text>No listings found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    listingContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyListingsScreen;
