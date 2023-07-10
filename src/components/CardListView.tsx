import React, { useContext } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';
import AppContext from '../contexts/AppContext';

// TODO: Add CardsListView
const CardListView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cards } = useContext(AppContext);

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        (<View><Text>item</Text></View>)
      )}
    />
  );
};

export default CardListView;
