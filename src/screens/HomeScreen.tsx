import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, StatusBar, ScrollView, RefreshControl } from 'react-native';
import NoCardView from '../components/NoCardView';
import AppContext from '../contexts/AppContext';
import CardListView from '../components/CardListView';

// TODO: Make NoCardView and CardsListView swap depending on the number of cards

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { cards, fetchCards, submitCard } = useContext(AppContext);

  const fetchData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // TODO: Fetch cards
  };

  const onRefresh = async () => {
    console.log('onRefresh');
    await fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1, height: '100%', width: '100%' }}
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { onRefresh(); }} />
        }
      >
        {cards.length === 0 ? <NoCardView navigation={navigation} /> : <CardListView navigation={navigation} />}
        <Button
          title="Create Card"
          onPress={() =>
            submitCard({
              city: 'Bangkok',
              expMonth: 2,
              expYear: 2024,
              name: 'John Doe',
              number: '4242424242424242',
              zip: '10320',
              cvv: '123',
            })
          }
        />

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
});

export default HomeScreen;
