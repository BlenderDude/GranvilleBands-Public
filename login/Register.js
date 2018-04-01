import React, {Component} from 'react';
import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator,
    AsyncStorage,
    Animated,
    Platform, KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux'
import {auth, clearErrors, login, register} from "../actions/user"
import EULA from '../components/EULA'

import Logo from '../img/logo.png';

class Register extends Component {
    static navigationOptions = {
        title: 'Register',
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
        loading: false,
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        error: "",
        errorHeight: new Animated.Value(0),
        EULA: false,
    }

    _register() {
        this.props.register(
            this.state.firstName,
            this.state.lastName,
            this.state.username,
            this.state.password);
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
            <View style={{flex: 1, backgroundColor: "#fcfcfc",}}>
                {Platform.OS === "android" ?
                    null
                    :
                    <StatusBar
                        barStyle="dark-content"
                        translucent={true}
                        hidden={false}
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
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                >
                </View>
                <PlatformSpecificKeyboardAvoidingView behavior="position" keyboardVerticalOffset={64}>
                    <View style={{
                        alignItems: "center",
                    }}>
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
                        <View
                            style={{
                                height: 45,
                            }}
                        >
                            <TextInput
                                autoCorrect={false}
                                autoFocus={true}
                                blurOnSubit={true}
                                style={{
                                    borderBottomColor: "#ccc",
                                    borderBottomWidth: Platform.OS === 'ios' ? 2 : 0,
                                    width: Dimensions.get('window').width - 30,
                                    fontSize: 22,
                                }}
                                placeholder="First name"
                                onChangeText={(text) => {
                                    this.setState({firstName: text});
                                }}
                                autoCapitalize="sentences"
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                            }}
                        >
                            <TextInput
                                autoCorrect={false}
                                blurOnSubit={true}
                                style={{
                                    borderBottomColor: "#ccc",
                                    borderBottomWidth: Platform.OS === 'ios' ? 2 : 0,
                                    width: Dimensions.get('window').width - 30,
                                    fontSize: 22,
                                }}
                                placeholder="Last name"
                                onChangeText={(text) => {
                                    this.setState({lastName: text});
                                }}
                                autoCapitalize="sentences"
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                            }}
                        >
                            <TextInput
                                autoCorrect={false}
                                autoCapitalize="none"
                                blurOnSubit={true}
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
                                blurOnSubit={true}
                                secureTextEntry={true}
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
                                this._register.bind(this);
                                this._register();
                            }}
                        >
                            <View
                                style={{
                                    marginTop: 5,
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
                    </View>
                </PlatformSpecificKeyboardAvoidingView>
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
        clearErrors: () => dispatch(clearErrors())

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)

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
    } else {
        return (
            <View>
                {props.children}
            </View>
        )
    }
}