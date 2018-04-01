import React, {Component} from 'react'
import {
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text, Animated,
} from 'react-native'

import NotificationsPage from '../components/Notifications'
import MessagesPage from '../components/Messages'
import LeaderboardPage from "../components/LeaderboardPage";

export default class Notifications extends Component {
    static navigationOptions = {
        title: 'Notifications',
        headerBackTitle: null,
    }
    state = {
        scrollX: new Animated.Value(0)
    }

    render() {
        return (
            <View
                style={{flex: 1}}
            >
                <View
                    style={{
                        flexDirection: 'row',

                    }}
                >
                    <Animated.View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            // borderBottomWidth: 3,
                            // borderColor: "#000",
                            // borderStyle: 'solid',
                            width: Dimensions.get('window').width / 3,
                            height: 2,
                            backgroundColor: "#000",
                            zIndex: 100,
                            transform: [{
                                translateX: this.state.scrollX.interpolate({
                                    inputRange: [0, Dimensions.get('window').width],
                                    outputRange: [0, Dimensions.get('window').width / 3]
                                })
                            }]
                        }}
                    />
                    <TabButton title="Leaderboard" onPress={() => this.refs["NotificationTabs"].getNode().scrollTo({
                        x: 0,
                        y: 0,
                        animated: true
                    })}/>
                    <TabButton title="Messages" onPress={() => this.refs["NotificationTabs"].getNode().scrollTo({
                        x: Dimensions.get('window').width,
                        y: 0,
                        animated: true
                    })}/>
                    <TabButton title="Posts" onPress={() => this.refs["NotificationTabs"].getNode().scrollTo({
                        x: 2 * Dimensions.get('window').width,
                        y: 0,
                        animated: true
                    })}/>
                </View>
                <Animated.ScrollView
                    horizontal
                    pagingEnabled
                    style={{
                        flex: 1,
                        zIndex: 4,
                    }}
                    contentContainerStyle={{
                        flexDirection: 'row'
                    }}
                    ref="NotificationTabs"
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    x: this.state.scrollX
                                }
                            }
                        }],
                        {useNativeDriver: true}
                    )}
                >
                    <View
                        style={{width: Dimensions.get('window').width}}
                    >
                        <LeaderboardPage/>
                    </View>
                    <View
                        style={{width: Dimensions.get('window').width}}
                    >
                        <MessagesPage/>
                    </View>
                    <View
                        style={{width: Dimensions.get('window').width}}
                    >
                        <NotificationsPage/>
                    </View>

                </Animated.ScrollView>
            </View>
        )
    }
}

const TabButton = (props) =>
    <TouchableOpacity
        style={{
            width: "33.3%",
            height: 40,
            borderBottomWidth: 1,
            borderColor: "#333",
            borderStyle: 'solid',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        onPress={props.onPress}
    >
        <Text style={{textAlign: 'center'}}>{props.title}</Text>
    </TouchableOpacity>
