import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Icone da Expo
import { GestureHandlerRootView } from "react-native-gesture-handler";
//components
import { ProfileScreen } from './src/tabs/ProfileScreen';
import MapsScreen from './src/tabs/MapsScreen';
import { BookingsScreen } from './src/tabs/BookingScreen';
import { FavoritesScreen } from './src/tabs/FavoritesScreen';
import loadFonts from './src/styles/font';

// === Configurazione del Navigatore a Schede ===
const Tab = createBottomTabNavigator();

export type User = {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone_number: string;
};

//dao
import { getRestaurants } from "./src/dao/restaurantsDAO";
import { getUsers } from "./src/dao/usersDAO";

const App = () => {
  const [fontsLoaded] = loadFonts();

  const [restaurants, setRestaurants] = useState<any[]>([]);

  const [users, setUsers] = useState<User[]>([]); // users è un array di utenti
  const [user, setUser] = useState<User | undefined>({username: "giacomo_gugu", name: "Giacomo", surname: "Ponzuoli", email: "ponzuoligiacomo@studenti.polito.it", phone_number: '+39 3665293460'}); //prende il primo utente presente nel db


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const allRestaurants = await getRestaurants();
        if (allRestaurants && Array.isArray(allRestaurants)) {
          setRestaurants(allRestaurants);
        } else {
          console.error("Error in the response format of the getRestaurants");
        }
      } catch (error) {
        console.error("Error in the getRestaurants: ", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const allUsers = await getUsers();
        if (allUsers && Array.isArray(allUsers)) {
          setUsers(allUsers);
          setUser(allUsers[0]); // Imposta il primo utente come quello corrente
        } else {
          console.error("Error in the response format of the getUsers");
        }
      } catch (error) {
        console.error("Error in the getUsers: ", error);
      }
    };

    fetchRestaurants();
    fetchUsers();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            // Aggiunta delle icone
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "person";

              if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline";
              } else if (route.name === "Maps") {
                iconName = focused ? "map" : "map-outline";
              } else if (route.name === "Bookings") {
                iconName = focused ? "calendar" : "calendar-outline";
              } else if (route.name === "Favorites") {
                iconName = focused ? "star" : "star-outline";
              }

            // Restituiamo l'icona
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#000', // Colore quando è selezionato
          tabBarInactiveTintColor: 'gray', // Colore quando non è selezionato
          headerTitle: 'Eating The World', // Titolo impostato per tutti i tab
          
        })}
      >
        <Tab.Screen name="Profile">
            {() => <ProfileScreen user={user} users={users} setUser={setUser} />}
          </Tab.Screen>
        <Tab.Screen name="Maps">
            {() => <MapsScreen restaurants={restaurants}/>}
        </Tab.Screen>
        <Tab.Screen name="Bookings" component={BookingsScreen} />
        <Tab.Screen name="Favorites">
          {() => <FavoritesScreen user={user}/>}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;