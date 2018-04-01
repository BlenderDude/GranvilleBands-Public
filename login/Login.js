import React, {Component} from 'react';
import {
    Text,
    View,
    StatusBar,
    TextInput,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    ActivityIndicator,
    Platform, Image,
    Animated, KeyboardAvoidingView,
    Keyboard, Modal,
} from 'react-native';
import {connect} from 'react-redux';
import Logo from '../img/logo.png';

import {login, register, auth, clearErrors} from '../actions/user'
import EULA from "../components/EULA";

class Login extends Component {
    static navigationOptions = {
        title: 'Login',
        tintColor: 'blue',
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
    };

    errorShown = false

    state = {
        error: "",
        username: "",
        password: "",
        loading: false,
        loginHeight: new Animated.Value(0),
        errorHeight: new Animated.Value(0),
        scrolling: false,
        EULA: false,
    }

    componentWillMount() {
        Animated.timing(this.state.loginHeight, {
            toValue: 210,
            duration: 1000,
        }).start();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({keyboard: true}));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({keyboard: false}));
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    _login() {
        this.props.login(this.state.username, this.state.password)
        this.errorShown = false
    }

    render() {
        if (this.props.user.loaded && !this.props.user.loading && this.props.user.errors.length > 0 && !this.errorShown) {
            Animated.sequence([
                Animated.timing(this.state.errorHeight, {
                    toValue: 45,
                    duration: 500,
                }),
                Animated.timing(this.state.errorHeight, {
                    toValue: 0,
                    duration: 500,
                    delay: 3000,
                })
            ]).start();
            this.errorShown = true
        }
        return (
            <View style={{flex: 1, backgroundColor: "#fff",}}>
                {Platform.OS === "android" ?
                    null
                    :
                    <StatusBar
                        barStyle="dark-content"
                        translucent={true}
                        hidden={false}
                        animated={true}
                    />
                }
                <Animated.View
                    style={{
                        backgroundColor: "#ffaca5",
                        width: Dimensions.get('window').width,
                        height: this.state.errorHeight,
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}

                >
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                        }}
                    >{this.props.user.errors[0]}</Text>
                </Animated.View>

                <View
                    style={{flex: 1}}
                    contentContainerStyle={{flex: 1}}
                    //keyboardDismissMode={Platform.OS === "ios" ? 'interactive' : 'on-drag'}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={this.state.scrolling}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <LogoItem/>
                    </View>
                    <PlatformSpecificKeyboardAvoidingView
                        behavior="padding"
                        keyboardVerticalOffset={60}
                    >
                        <View
                            style={{
                                marginBottom: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                By using this app you agree to the&nbsp;
                                <Text style={{color: 'blue', marginLeft: 5}}
                                      onPress={() => this.setState({EULA: true})}>
                                    EULA
                                </Text>

                            </Text>
                            <EULA
                                visible={this.state.EULA}
                                close={() => this.setState({EULA: false})}
                            />
                        </View>
                        <Animated.View style={{
                            alignItems: "center",
                            height: 210,
                        }}>
                            <View
                                style={{
                                    height: 45,
                                }}
                            >
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    //autoFocus={true}
                                    blurOnSubmit={true}
                                    multiline={false}
                                    style={{
                                        borderBottomColor: "#ccc",
                                        borderBottomWidth: Platform.OS === 'ios' ? 2 : 0,
                                        width: Dimensions.get('window').width - 30,
                                        fontSize: 22,

                                    }}
                                    placeholder="Username"
                                    onChangeText={(text) => {
                                        this.setState({username: text});
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    height: 45,
                                }}
                            >
                                <TextInput
                                    autoCorrect={false}
                                    blurOnSubmit={true}
                                    secureTextEntry={true}
                                    multiline={false}
                                    style={{
                                        borderBottomColor: "#ccc",
                                        borderBottomWidth: Platform.OS === 'ios' ? 2 : 0,
                                        width: Dimensions.get('window').width - 30,
                                        fontSize: 22,
                                    }}
                                    placeholder="Password"
                                    onChangeText={(text) => {
                                        this.setState({password: text});
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this._login.bind(this);
                                    this._login();
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        height: 60,
                                        backgroundColor: "#3631f2",
                                    }}
                                >
                                    <Text
                                        style={{
                                            width: Dimensions.get('window').width,
                                            textAlign: 'center',
                                            fontSize: 24,
                                            fontWeight: 'bold',
                                            color: 'white',
                                        }}
                                    >Login</Text>
                                    {this.props.user.loading ?
                                        <ActivityIndicator animating={this.props.user.loading}
                                                           color="white"
                                                           style={{
                                                               position: 'absolute',
                                                               top: 10,
                                                               right: 5,
                                                               height: 35,
                                                               width: 35,
                                                           }}/>
                                        : null}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.clearErrors()
                                    this.props.navigation.navigate('Register', this.props.navigation.state.params);
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        height: 60,
                                        backgroundColor: "#3ba1f2",
                                    }}
                                >
                                    <Text
                                        style={{
                                            width: Dimensions.get('window').width,
                                            textAlign: 'center',
                                            fontSize: 24,
                                            fontWeight: 'bold',
                                        }}
                                    >Register</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </PlatformSpecificKeyboardAvoidingView>
                </View>

            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        auth: (id, token) => dispatch(auth(id, token)),
        login: (username, password) => dispatch(login(username, password)),
        register: (first_name, last_name, username, password) => dispatch(register(first_name, last_name, username, password)),
        clearErrors: () => dispatch(clearErrors()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)


class LogoItem extends Component {
    render() {
        return (
            <Image source={Logo} style={{
                width: 100,
                height: 100,
                borderColor: "#dfdfdf",
                borderWidth: 1,
                borderRadius: 50,
                marginBottom: 60,
            }}/>
        )
    }
}

const PlatformSpecificKeyboardAvoidingView = (props) => {
    if (Platform.OS === 'ios') {
        return (
            <KeyboardAvoidingView {...props}>
                {props.children}
            </KeyboardAvoidingView>
        )
    }
    return (
        <View>
            {props.children}
        </View>
    )
}