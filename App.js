import React, { useEffect, useState, useCallback } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, SafeAreaView, Text, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import AddCardScreen from './src/screens/AddCardScreen';

// Keep the splash screen visible while we fetch resources
// TODO: SplashScreen.preventAutoHideAsync();

// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

const PlusButton = (props) => { 
  const { navigation } = props;
  return (
    <TouchableOpacity
      style={{ marginRight: -8, }}
      onPress={() => navigation.navigate('AddCard')}
    >
      <Ionicons name="ios-add" size={32} color="black" />
    </TouchableOpacity>
  );
};

export default function App() {

  // TODO: Load custom fonts and show splash screen until finished loading.
  // const [fontsLoaded] = useFonts({
  //   'FCSubjectRoundedRegular': require('./assets/fonts/FCSubjectRoundedRegular.ttf'),
  // });

  // if( !fontsLoaded ) {
  //   return <AppLoading/>;
  // }

  // const [appIsReady, setAppIsReady] = useState(false);

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       // Pre-load fonts, make any API calls you need to do here
  //       // TODO: Load custom fonts
  //       // Artificially delay for two seconds to simulate a slow loading
  //       // experience. Please remove this if you copy and paste the code!
  //       await new Promise(resolve => setTimeout(resolve, 2000));
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       // Tell the application to render
  //       setAppIsReady(true);
  //     }
  //   }

  //   prepare();
  // }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
  //     await SplashScreen.hideAsync();
  //   }
  // }, [appIsReady]);

  // if (!appIsReady) {
  //   return null;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={() => ({
            gestureEnabled: true,
            headerTintColor: '#000000',
            headerStyle: {
              // fontFamily: 'FCSubjectRoundedRegular',
              fontWeight: '200',
              fontSize: 16,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
          })}
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
          options={({ navigation, route }) => ({
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      // fontFamily: 'FCSubjectRoundedRegular',
      fontWeight: '200',
      fontSize: 16,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: StatusBar.currentHeight || 0,
  },
});
