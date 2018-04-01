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
    TouchableOpacity,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    ImagePickerIOS,
    AsyncStorage,
    PushNotificationIOS,
    NativeModules,
    AppState,
    Platform,
    Linking,
} from 'react-native';

import {
    StackNavigator,
    TabNavigator,
} from 'react-navigation';
import RNPhotosFramework from 'react-native-photos-framework'
import PushNotification from 'react-native-push-notification'

import API from './API'


import NavigatorService from './router/service'

import {login, register, auth, loaded} from './actions/user'

import {refresh} from './actions/notifications'

import {Provider, connect} from 'react-redux';
import store from './store/configureStore';

import ReactNativeHaptic from 'react-native-haptic';
import Home from './pages/Home';
import User from './pages/User';
import Upload from './components/Upload';
import Likes from './pages/Likes';
import Comments from './pages/Comments';
import Post from './pages/Post';
import Event from './pages/Event';
import Trip from './pages/Trip'
import Login from './login/Login';
import Register from './login/Register';
import Loading from './pages/Loading';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import PhotoView from './pages/PhotoView'
import NotificationsBanner from "./components/NotificationsBanner";

import homePassive from './img/home_passive.png'
import homeActive from './img/home_active.png'
import busPassive from './img/bus_passive.png'
import busActive from './img/bus_active.png'
import uploadPassive from './img/upload_passive.png'
import notifsPassive from './img/notifs_passive.png'
import notifsActive from './img/notifs_active.png'
import profilePassive from './img/profile_passive.png'
import profileActive from './img/profile_active.png'
import Logo from './img/logo.png';
import ErrorLoading from "./pages/ErrorLoading";

const ICON_SIZE = 25

class App extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        loaded: false,
        currentTab: "Home",
        upload: false,
        notificationToken: false,
        photos: [],
    }

    mainScrollComponent = null

    _registerScrollComponent(component) {
        this.mainScrollComponent = component
    }

    componentWillMount() {
        AsyncStorage.getItem('loginInfo').then((r) => {
            this.setState({
                loaded: true,
            })
            if (r !== null) {

                const {id, token} = JSON.parse(r)
                this.props.auth(id, token)
            } else {
                this.props.loaded()
            }
        })

        global._registerScrollComponent = this._registerScrollComponent.bind(this)

        const InfoScreens = {
            Home: {screen: Home},
            Upload: {
                screen: Upload,
                headerMode: 'none',
                header: null,
                navigationOptions: {
                    header: null
                },

            },
            Notifications: {screen: Notifications},
            Profile: {screen: Profile},
            Trip: {screen: Trip},
            User: {screen: User},
            Likes: {screen: Likes},
            Event: {screen: Event},
            Post: {screen: Post},
            Comments: {screen: Comments},
            PhotoView: {screen: PhotoView}
        }
        const headerSettings = {
            headerMode: 'screen',
            tintColor: '#ffffff',
            cardStyle: {
                backgroundColor: "#fff"
            },
        }
        this.MainNav = StackNavigator(InfoScreens, headerSettings)


        AppState.addEventListener('change', (new_state) => {
            this.props.refreshNotifications()
            if (new_state === 'active') {
                AsyncStorage.getItem('loginInfo').then((r) => {
                    if (r !== null) {
                        const {id, token} = JSON.parse(r)
                        this.props.auth(id, token)
                    }
                })
            }
        });

    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            RNPhotosFramework.requestAuthorization().then((statusObj) => {
                if (statusObj.isAuthorized) {
                    RNPhotosFramework.onLibraryChange(() => {
                        RNPhotosFramework.getAssets({
                            endIndex: 350,
                            includeMetadata: true,
                            prepareForSizeDisplay: {width: 500, height: 500},
                            prepareScale: 1,
                            includeResourcesMetadata: true,
                            fetchOptions: {
                                mediaTypes: ["image"],
                                sortDescriptors: [
                                    {
                                        key: 'creationDate',
                                        ascending: false,
                                    }
                                ]
                            },
                            trackInsertsAndDeletes: true,
                            trackChanges: true
                        }).then((response) => {
                            const {assets} = response;
                            this.setState({
                                photos: assets
                            })
                        })
                    })
                    RNPhotosFramework.getAssets({
                        endIndex: 350,
                        includeMetadata: true,
                        prepareForSizeDisplay: {width: 500, height: 500},
                        prepareScale: 1,
                        includeResourcesMetadata: true,
                        fetchOptions: {
                            mediaTypes: ["image"],
                            sortDescriptors: [
                                {
                                    key: 'creationDate',
                                    ascending: false,
                                }
                            ]
                        },
                        trackInsertsAndDeletes: true,
                        trackChanges: true
                    }).then((response) => {
                        const {assets} = response;
                        this.setState({
                            photos: assets
                        })
                    })
                }
            });
        }

    }

    _toNewTab(newTab) {
        if (newTab !== this.state.currentTab && Platform.OS === "ios") {
            ReactNativeHaptic.generate('impact')
        }
        if (NavigatorService.getCurrentRoute().routeName === "Home" && newTab === "Home") {
            try {
                this.mainScrollComponent.scrollToOffset({offset: 0, animated: true});
            } catch (e) {

            }

        } else {
            NavigatorService.reset(newTab)
            this.setState({
                currentTab: newTab,
            })
        }
    }

    _openUpload() {
        this.setState({upload: true})
    }

    _closeUpload() {
        this.setState({upload: false})
    }

    firstHomeLoaded = false

    _toAppStore() {
        Linking.openURL("https://itunes.apple.com/us/app/granville-bands/id1294941674")
            .catch(err => console.error('An error occurred', err))
    }

    render() {
        if (this.props.error) {
            return (<ErrorLoading auth={this.props.auth.bind(this, this.props.id, this.props.token)}/>)
        }
        if (this.props.appStore && Platform.OS === 'ios') {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image source={Logo} style={{
                        width: 100,
                        height: 100,
                        borderColor: "#dfdfdf",
                        borderWidth: 1,
                        borderRadius: 50,
                        margin: 20,
                    }}/>
                    <Text>This app is officially on the app store!</Text>
                    <Text>Please install the app store version</Text>
                    <TouchableOpacity
                        style={{
                            margin: 20,
                            width: 100,
                            height: 50,
                            backgroundColor: "#3158ff",
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                        }}
                        onPress={this._toAppStore.bind(this)}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 18,
                                textAlign: 'center',
                            }}
                        >
                            App Store
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        if (this.state.loaded && this.props.loadedState) {
            if (this.props.loggedin) {
                const MainNav = this.MainNav


                return (
                    <View style={{flex: 1}}>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.upload}
                            onRequestClose={this._closeUpload.bind(this)}
                        >
                            <Upload closeModal={this._closeUpload.bind(this)} photos={this.state.photos}/>
                        </Modal>
                        <MainNav ref={navigatorRef => {
                            NavigatorService.setContainer(navigatorRef);
                        }}/>
                        <NotificationsBanner/>
                        <View style={{
                            height: 45,
                            flexDirection: 'row',
                            borderTopColor: '#ccc',
                            borderTopWidth: StyleSheet.hairlineWidth,
                        }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#fff'
                                }}
                                onPress={this._toNewTab.bind(this, 'Home')}>
                                <Image
                                    source={this.state.currentTab === "Home" ? homeActive : homePassive}
                                    style={{
                                        height: ICON_SIZE,
                                        width: ICON_SIZE,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#fff'
                                }}
                                onPress={this._toNewTab.bind(this, 'Trip')}>
                                <Image
                                    source={this.state.currentTab === "Trip" ? busActive : busPassive}
                                    style={{
                                        height: ICON_SIZE,
                                        width: ICON_SIZE,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#fff'
                                }}
                                onPress={this._openUpload.bind(this)}>
                                <Image
                                    source={uploadPassive}
                                    style={{
                                        height: ICON_SIZE,
                                        width: ICON_SIZE,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#fff'
                                }}
                                onPress={this._toNewTab.bind(this, 'Notifications')}>
                                <Image
                                    source={this.state.currentTab === "Notifications" ? notifsActive : notifsPassive}
                                    style={{
                                        height: ICON_SIZE,
                                        width: ICON_SIZE,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#fff'
                                }}
                                onPress={this._toNewTab.bind(this, 'Profile')}>
                                <Image
                                    source={this.state.currentTab === "Profile" ? profileActive : profilePassive}
                                    style={{
                                        height: ICON_SIZE,
                                        width: ICON_SIZE,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>)
            } else {
                this.firstHomeLoaded = false
                const LoginScreen = StackNavigator({
                    Login: {
                        screen: Login,
                    },
                    Register: {
                        screen: Register
                    },
                }, {
                    header: null,
                    cardStyle: {
                        backgroundColor: "#fff",
                    },
                    initialRouteParams: {
                        thisElement: this,
                    }
                });
                return (<LoginScreen/>);
            }

        } else {
            return (<Loading/>)
        }

    }
}

const mapStateToProps = (state) => {
    return {
        loadedState: state.user.loaded,
        loggedin: state.user.loggedin,
        id: state.user.id,
        token: state.user.token,
        appStore: state.user.app_store,
        error: state.user.error,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        auth: (id, token) => dispatch(auth(id, token)),
        login: (username, password) => dispatch(login(username, password)),
        register: (first_name, last_name, username, password) => dispatch(register(first_name, last_name, username, password)),
        loaded: () => dispatch(loaded()),
        refreshNotifications: () => dispatch(refresh())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App)