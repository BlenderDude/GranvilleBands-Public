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
    Modal,
    TouchableHighlight,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    Platform,
    TouchableOpacity,
} from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import PhotoList from '../components/PhotoList';
import NavigatorService from '../router/service'
import Search from "../components/Search";

export default class Home extends Component {
    static navigationOptions = {
        title: 'Home',
        headerBackTitle: null,
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
        headerRight: <Search/>
    }


    constructor(props) {
        super(props);
        this.state = {
            photo: "",
            photos: [],
            selectedTab: "home",
            percentDone: 0,
            height: 0,
            loading: false,
            cursor: "",
            refreshing: false,
            isAdmin: false,
        }

        if (Platform.OS === "ios") {
            ReactNativeHaptic.prepare();
        }

    }

    componentWillMount() {

    }

    _toCommentsPage(post, startComment) {
        this.props.navigation.navigate('Comments', {post, startComment, tab: 'Home'})
    }

    _toUserPage(user) {
        this.props.navigation.navigate('User', {user, tab: 'Home'})
    }

    _toLikesPage(post) {
        this.props.navigation.navigate('Likes', {post, tab: "Home"})
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#fff"}}>
                {Platform.OS === "android" ?
                    null
                    :
                    <StatusBar
                        barStyle="dark-content"
                        translucent={true}
                        hidden={false}
                    />
                }
                <View
                    style={{
                        flex: 1
                    }}
                >

                    <PhotoList registerScroll={global._registerScrollComponent} toUserPage={this._toUserPage.bind(this)}
                               toLikesPage={this._toLikesPage.bind(this)}
                               toCommentsPage={this._toCommentsPage.bind(this)}/>
                </View>

            </View>
        )

    }
}