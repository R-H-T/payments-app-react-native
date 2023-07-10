import React from 'react';
import { StyleSheet, Text, View, Button, StatusBar } from 'react-native';

interface NoCardViewProps {
  navigation: any;
}

const content = {
  cardIconText: '💳',
  mainTitle: 'No cards found',
  mainMessage: 'We recommend adding a card\nfor easy payment',
  addCardButtonTitle: 'Add New Card',
};

const NoCardView: React.FC<NoCardViewProps> = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.cardIcon}>{content.cardIconText}</Text>
    <Text style={styles.mainTitle}>{content.mainTitle}</Text>
    <Text style={styles.mainMessage}>{content.mainMessage}</Text>
    <Button title={content.addCardButtonTitle} onPress={() => navigation.navigate('AddCard')} />
  </View>
);

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

export default NoCardView;
