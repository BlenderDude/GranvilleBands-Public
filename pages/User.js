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
    TouchableOpacity,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    ImagePickerIOS,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import UserPhotoList from '../components/UserPhotoList'
import UserActionModal from "../components/UserActionModal";

export default class User extends Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.user.first_name + " " + navigation.state.params.user.last_name,
        tabBarLabel: "Home",
        headerTintColor: "#000",

        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
        headerBackTitle: null,
        headerRight: (
            <UserActionModal
                id={navigation.state.params.user.user_id}
                name={navigation.state.params.user.first_name + " " + navigation.state.params.user.last_name}
            />
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            refreshing: false,
            startCursor: "",
            user: {},
            loadingUser: true,
        }
        this._moveToPost.bind(this);

    }

    _moveToPost(id) {
        this.props.navigation.navigate("Post", {id})
    }


    render() {
        const navigationParams = this.props.navigation.state.params;
        const user = navigationParams.user;
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
                <UserPhotoList user={user} moveToPost={this._moveToPost.bind(this)}/>
            </View>
        )

    }
}



