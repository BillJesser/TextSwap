import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import ip from './config';
import logo from '../../assets/images/logo.png';

const SearchPage = ({ navigation }) => {  // Destructure navigation here
    const [courseNumber, setCourseNumber] = useState('');
    const [title, setTitle] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [listings, setListings] = useState([]);

    // Fetch all listings when the component mounts
    useEffect(() => {
        const fetchAllListings = async () => {
            try {
                const response = await axios.get(`http://${ip}:5000/search_listings`);
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchAllListings();
    }, []);

    const searchListings = async () => {
        try {
            const response = await axios.get(`http://${ip}:5000/search_listings`, {
                params: {
                    course_number: courseNumber,
                    title: title,
                    min_price: minPrice,
                    max_price: maxPrice,
                },
            });
            setListings(response.data);
        } catch (error) {
            console.error('Error searching listings:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.listingItem} onPress={() => navigation.navigate('Listing Details', { listing: item })}>
            <Text style={{ color: '#fff' }}>{item.title}</Text>
            <Text style={{ color: '#fff' }}>{item.author}</Text>
            <Text style={{ color: '#fff' }}>{item.course_number}</Text>
            <Text style={{ color: '#fff' }}>${item.price}</Text>
        </TouchableOpacity>
    );

    return (
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.title}>Search Listings</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Course Number"
                    value={courseNumber}
                    onChangeText={setCourseNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Min Price"
                    value={minPrice}
                    keyboardType="numeric"
                    onChangeText={setMinPrice}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Max Price"
                    value={maxPrice}
                    keyboardType="numeric"
                    onChangeText={setMaxPrice}
                />
                <View style={styles.buttonContainer}>
                    <Button title="Search" onPress={searchListings} backgroundColor="blue" />
                </View>
                <View style={styles.flatListContainer}>
                    <FlatList
                        data={listings}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={<Text>No listings found.</Text>}
                        horizontal={true} // Display items horizontally
                        showsHorizontalScrollIndicator={true} // Show horizontal scroll indicator
                        scrollEnabled={true} // Enable scrolling
                        contentContainerStyle={{ paddingHorizontal: 10 }} // Add padding if needed
                    />
                </View>
            </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 2,
        padding: 15,
        backgroundColor: '#050a30',
        justifyContent: 'flex-start', // Align items to the top
        alignItems: 'center',
    },
    flatListContainer: {
        marginTop: 30,
        backgroundColor: '#cae8ff', 
        padding: 10,
        height: 140, 
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20, // Space between title and inputs
    },
    input: {
        width: '40%', // Smaller width
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000', // Black text color

    },
    buttonContainer: {
        width: '20%', // Adjusted width for the button
        marginTop: 15,
        backgroundColor: '#050a30',
        color: '#050a30',
        borderRadius: 5,
    },
    listingItem: {
        width: 190, // Adjusted width for horizontal appearance
        height: 100, // Minimum height to fit text
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        marginRight: 12, // Add margin to the right for spacing
        marginTop: 10,
        paddingHorizontal: 8,
        paddingVertical: 10, // Vertical padding to fit text
        borderRadius: 5,
        backgroundColor: '#050a30',
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
    },
    logo: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchPage;
