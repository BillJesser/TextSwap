import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Menu, Provider, Appbar } from 'react-native-paper';

const DashboardScreen = ({ navigation }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <Provider>
            <Appbar.Header>
                <Appbar.Content title="Dashboard" />
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
            </Appbar.Header>
            <View style={styles.container}>
                <Text style={styles.title}>Dashboard</Text>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Search Listings"
                        onPress={() => navigation.navigate('Search Listing')}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Create New Listing"
                        onPress={() => navigation.navigate('Edit Listing')}
                    />
                </View>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '80%',
        marginVertical: 10,
    },
});

export default DashboardScreen;
