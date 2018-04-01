import React, {Component} from 'react';
import {
    AppRegistry, Image, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    CameraRoll,
    View,
    Dimensions,
    StatusBar,
    TabBarIOS,
    Modal,
    TouchableHighlight,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    ImagePickerIOS,
    Platform,
} from 'react-native';
import ProfilePhoto from "../components/ProfilePhoto";

export default class Likes extends Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.post.likes.length + (navigation.state.params.post.likes.length === 1 ? " Like" : " Likes"),
        tabBarLabel: navigation.state.params.tab,
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
        headerBackTitle: null,
    });

    constructor(props) {
        super(props);
        this.state = {}

    }

    _toUserPage(user) {
        const actualUser = {
            id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            group_id: user.group_id,
        }
        this.props.navigation.navigate('User', {user: actualUser, tab: 'Home'})
    }

    render() {
        const navigationParams = this.props.navigation.state.params;
        const post = navigationParams.post;
        return (
            <View style={{flex: 1}}>
                {Platform.OS === "android" ?
                    null
                    :
                    <StatusBar
                        barStyle="dark-content"
                        translucent={true}
                        hidden={false}
                    />
                }
                <ScrollView>
                    <View style={{flex: 1}}>
                        {post.likes.map((like) => {
                            return (
                                <View key={like.id}
                                      style={{
                                          flexDirection: 'row',
                                          padding: 0,
                                          alignItems: 'center',
                                          margin: 2.5,
                                      }}
                                >
                                    <ProfilePhoto user={like} style={{marginRight: 5}}/>

                                    <Text
                                        onPress={() => this._toUserPage(like)}>{like.first_name + " " + like.last_name}</Text>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>

            </View>
        )

    }
}
