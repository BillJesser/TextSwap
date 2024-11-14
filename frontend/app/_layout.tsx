import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import RegisterScreen from './screens/register';
import DashboardScreen from './screens/dashboard';
import CreateListingScreen from './screens/createlisting';
import SearchListingScreen from './screens/listingsearch';
import UserListings from './screens/userlistings';
import EditListing from './screens/editlisting';
import ViewListing from './screens/viewlisting'
import { UserProvider } from './screens/UserContext';

const Stack = createStackNavigator();

export default function App() {
    return (
        <UserProvider>
            <NavigationContainer independent={true}>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Dashboard" component={DashboardScreen} />
                    <Stack.Screen name="Create Listing" component={CreateListingScreen} />
                    <Stack.Screen name="Search Listing" component={SearchListingScreen} />
                    <Stack.Screen name="Manage Listings" component={UserListings} />
                    <Stack.Screen name="Edit Listing" component={EditListing} />
                    <Stack.Screen name="Listing Details" component={ViewListing} />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
}
