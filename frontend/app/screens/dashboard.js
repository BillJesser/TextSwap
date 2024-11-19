import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Menu, Provider, Appbar } from 'react-native-paper';
import Image from 'react-native';
import logo from '../../assets/images/logo.png';

const DashboardScreen = ({ navigation }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        
        <Provider>
            
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <Appbar.Action icon="dots-vertical" onPress={openMenu} />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('ManageProfile');
                        }}
                        title="Manage Profile"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('Manage Listings');
                        }}
                        title="Manage Listings"
                    />
                </Menu>
   
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to the Dashboard</Text>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Search Listings"
                        onPress={() => navigation.navigate('Search Listing')}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Create New Listing"
                        onPress={() => navigation.navigate('Create Listing')}
                    />
                </View>
            </View>
        </Provider>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#050a30',
    },
    logo: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
        textAlign: 'center',
        color: '#ffffff',
    },
    buttonContainer: {
        borderRadius: 5,
        width: '50%',
        marginVertical: 10,
        backgroundColor: '#ffffff',
        color: '#050a30',
    },
});

export default DashboardScreen;
