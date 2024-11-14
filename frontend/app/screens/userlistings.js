import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useUser } from './UserContext';
import ip from './config';

const MyListingsScreen = ({ navigation }) => {
    const [listings, setListings] = useState([]);
    const { userEmail } = useUser();

    const fetchUserListings = async () => {
        try {
            const response = await axios.get(`http://${ip}:5000/user_listings`, {
                params: { user_email: userEmail },
            });
            if (response.status === 200) {
                setListings(response.data.listings);
            }
        } catch (error) {
            console.error("Failed to fetch user listings:", error);
        }
    };

    useEffect(() => {
        fetchUserListings();
    }, [userEmail]);

    const handleDelete = async (listingId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this listing?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await axios.delete(`http://${ip}:5000/delete_listing/${listingId}`);
                            setListings((prevListings) =>
                                prevListings.filter((item) => item.id !== listingId)
                            );
                        } catch (error) {
                            console.error("Failed to delete listing:", error);
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    const handleEdit = (listing) => {
        navigation.navigate("Edit Listing", {
            listing,
            refreshListings: fetchUserListings, // Pass the refresh function
        });
    };

    const renderListing = ({ item }) => (
        <View style={styles.listingContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>Author: {item.author}</Text>
            <Text>Course Number: {item.course_number}</Text>
            <Text>Price: ${item.price.toFixed(2)}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Edit" onPress={() => handleEdit(item)} />
                <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Listings</Text>
            <FlatList
                data={listings}
                renderItem={renderListing}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text>No listings found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    listingContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
});

export default MyListingsScreen;
