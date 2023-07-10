import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, StatusBar, ScrollView, RefreshControl } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import OmiseClient from '../utils/omise-client';

type RootStackParamList = {
  Home: undefined;
  AddCard: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const content = {
  cardIconText: '💳',
  mainTitle: 'No cards found',
  mainMessage: 'We recommend adding a card\nfor easy payment',
  addCardButtonTitle: 'Add New Card',
}

const NoCardView: React.FC<{ navigation: HomeScreenNavigationProp }> = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.cardIcon}>{content.cardIconText}</Text>
    <Text style={styles.mainTitle}>{content.mainTitle}</Text>
    <Text style={styles.mainMessage}>{content.mainMessage}</Text>
    <Button title={content.addCardButtonTitle} onPress={() => navigation.navigate('AddCard')} />
  </View>
);

const HomeScreen: React.FC<{ navigation: HomeScreenNavigationProp }> = ({ navigation }) => {
  const [omiseCli, setOmiseCli] = useState(new OmiseClient());
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = (): void => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // TODO: Fetch cards
  };

  const onRefresh = (): void => {
    fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1, height: '100%', width: '100%' }}
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <NoCardView navigation={navigation} />
        {/* TODO: Write tests for checking <Button title="Get Capabilities" onPress={ () => omiseCli.getCapabilities()} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  cardIcon: {
    fontSize: 48,
    backgroundColor: 'transparent',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 18,
    // fontWeight: 900,
    lineHeight: 26,
    backgroundColor: 'transparent',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainMessage: {
    fontSize: 18,
    backgroundColor: 'transparent',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
  },
});

export default HomeScreen;
