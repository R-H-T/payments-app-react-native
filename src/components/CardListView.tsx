import React, { useContext, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { View, Text, RefreshControl, Image } from 'react-native';
import AppContext from '../contexts/AppContext';

// TODO: Add CardsListView
const CardListView: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const { cards, fetchCards } = useContext(AppContext);

    const onRefresh = async () => {
        console.log('onRefresh');
        setRefreshing(true);
        await fetchCards();
        setRefreshing(false);
    };

    const cardImageSource = {
        Visa: require('../../assets/images/visa_color.png'),
        Mastercard: require('../../assets/images/mastercard_color.png'),
        JCB: require('../../assets/images/jcb_color.png'),
    };

    return (
        <FlatList
            data={cards}
            style={{
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                flexWrap: 'wrap',
                alignSelf: 'flex-start',
            }}
            contentContainerStyle={{
                flexGrow: 1,
                height: '100%',
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                margin: 0,
             }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                (<View style={{
                    backgroundColor: 'white',
                    height: 220,
                    minWidth: 340,
                    maxWidth: 380,
                    borderRadius: 15,
                    elevation: 3,
                    shadowRadius: 10,
                    shadowOpacity: 0.20,
                    marginTop: 16,
                    marginLeft: 16,
                    marginRight: 16,
                    marginBottom: 0,
                    paddingTop: 26,
                    paddingLeft: 26,
                    paddingRight: 26,
                    paddingBottom: 26,
                }}>
                    <View style={{
                        marginTop: 0,
                        marginLeft: -16,
                        width: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Image style={{
                            height: 48,
                            resizeMode: 'contain',
                        }} source={cardImageSource[item.brand]} />
                    </View>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                            textAlign: 'left',
                            letterSpacing: 1.2,
                            color: '#888',
                            paddingTop: 20,
                            paddingBottom: 20,
                        }}>••••     ••••     ••••     {item.last_digits}</Text>
                    <View
                        style={{
                            flex: 1,
                            paddingTop: 10,
                            paddingLeft: 0,
                            paddingRight: 20,
                        }}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                        }}>
                            <Text style={{
                                marginTop: 0,
                                fontSize: 12,
                                fontWeight: "500",
                                color: '#ccc',
                            }}>Name on Card</Text>
                            <Text style={{
                                marginTop: 0,
                                fontSize: 12,
                                textAlign: 'left',
                                width: 100,
                                fontWeight: "500",
                                color: '#ccc',
                            }}>Expires</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                        }}>
                            <Text style={{
                                marginTop: 0,
                                fontSize: 16,
                                fontWeight: "500",
                            }}>{item.name}</Text>
                            <Text style={{
                                marginTop: 0,
                                fontSize: 16,
                                textAlign: 'left',
                                width: 100,
                                fontWeight: "500",
                            }}>{`${item.expiration_month}`.padStart(2, '0')}/{item.expiration_year.toString().split('').splice(2, 2)}</Text>
                        </View>
                    </View>
                </View>)
            )}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => { onRefresh(); }} />
            }
        />
    );
};

export default CardListView;
