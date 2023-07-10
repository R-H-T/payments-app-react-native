import React, { useEffect, useState, useCallback } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, SafeAreaView, Text, ActivityIndicator, TouchableOpacity, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import AddCardScreen from './src/screens/AddCardScreen';
import AppContextProvider from './src/contexts/AppContextProvider';

const Stack = createNativeStackNavigator();

const PlusButton = ({ navigation }: { navigation: any }) => (
  <TouchableOpacity
    style={{ marginRight: -8 }}
    onPress={() => navigation.navigate('AddCard')}
  >
    <Ionicons name="ios-add" size={32} color="black" />
  </TouchableOpacity>
);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // TODO: Load custom fonts
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AppContextProvider>
      <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            gestureEnabled: true,
            headerTintColor: '#000000',
            headerStyle: {
              fontWeight: 200,
              fontSize: 16,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            } as StyleProp<any>,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'Cards',
              headerRight: () => <PlusButton navigation={navigation} />,
            })}
          />
          <Stack.Screen
            name="AddCard"
            component={AddCardScreen}
            options={() => ({})}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
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
