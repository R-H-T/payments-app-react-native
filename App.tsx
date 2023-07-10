import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, SafeAreaView, Text, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import AddCardScreen from './src/screens/AddCardScreen';

const Stack = createNativeStackNavigator();

const PlusButton: React.FC<{ navigation: any }> = (props) => {
  const { navigation } = props;
  return (
    <TouchableOpacity
      style={{ marginRight: -8 }}
      onPress={() => navigation.navigate('AddCard')}
    >
      <Ionicons name="ios-add" size={32} color="black" />
    </TouchableOpacity>
  );
};

export default function App() {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          // Specify your custom font
        });
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          gestureEnabled: true,
          headerTintColor: '#000000',
          headerStyle: {
            backgroundColor: 'transparent', // Add this line
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={({ navigation, route }) => ({
            title: 'Cards',
            headerRight: () => (<PlusButton navigation={navigation} />),
          })}
        />
        <Stack.Screen
          name='AddCard'
          component={AddCardScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontWeight: '200',
    fontSize: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
});
