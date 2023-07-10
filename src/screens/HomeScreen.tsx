import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, StatusBar, ScrollView, RefreshControl, StyleProp, Pressable } from 'react-native';
import NoCardView from '../components/NoCardView';
import AppContext from '../contexts/AppContext';
import CardListView from '../components/CardListView';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const { cards, fetchCards, submitCard } = useContext(AppContext);

    const onRefresh = async () => {
        console.log('onRefresh');
        setRefreshing(true);
        await fetchCards();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {cards.length > 0 ? <CardListView navigation={navigation} /> : (
                <ScrollView
                    style={{ flex: 1, height: '100%', width: '100%' }}
                    contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => { onRefresh(); }} />
                    }
                >
                    <NoCardView navigation={navigation} />
                    {/* <Pressable
                        style={styles.button}
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
                    >
                        <Text style={styles.text}>Create Card</Text>
                    </Pressable> */}

                </ScrollView>)
            }
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        margin: 20,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default HomeScreen;
