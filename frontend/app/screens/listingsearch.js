import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import ip from './config';

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
            <Text>{item.title}</Text>
            <Text>{item.author}</Text>
            <Text>{item.course_number}</Text>
            <Text>${item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
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
            <Button title="Search" onPress={searchListings} />
            <FlatList
                data={listings}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text>No listings found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    listingItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
});

export default SearchPage;
