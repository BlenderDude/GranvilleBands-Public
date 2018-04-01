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
import store from "../store/configureStore"
import {logout} from "../actions/user"
import {connect} from "react-redux"
import UserPhotoList from "../components/UserPhotoList"


class Profile extends Component {
    static navigationOptions = {
        title: 'Profile',
        tabBarLabel: 'Profile',
        tintColor: 'blue',
        headerRight:
            <View
                style={{
                    paddingRight: 10,
                }}
            >
                <Button
                    style={{}}
                    title="Logout"
                    onPress={() => {
                        store.dispatch(logout())
                    }}
                />
            </View>,
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
        headerBackTitle: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            refreshing: false,
            startCursor: "",
            user: {id: global.id},
            loadingUser: true,
        }
        this._moveToPost.bind(this);

    }

    _moveToPost(id) {
        this.props.navigation.navigate("Post", {id})
    }


    render() {
        const {user} = this.props
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

mapStateToProps = (state) => {
    return {
        user: state.user,

    }
}

mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)