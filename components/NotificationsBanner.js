import React, {Component} from 'react'
import {
    View,
    Text,
    Animated,
    PushNotificationIOS,
    AppState,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native'
import PushNotification from 'react-native-push-notification'
import {connect} from 'react-redux'
import {refresh} from "../actions/notifications"
import ReactNativeHaptic from 'react-native-haptic'
import NavigatorService from '../router/service'
import API from "../API";
import ProfilePhoto from "./ProfilePhoto";

const NOTIFICATIONS_HEIGHT = 50

class NotificationsBanner extends Component {
    state = {
        notifications: []
    }

    componentDidMount() {
        const component = this
        PushNotification.configure({

            // (optional) Called when Token is generated (iOS and Android)
            onRegister(token) {
                API.user.setToken(token.token, token.os).then(() => {
                }).catch((err) => console.log(err))
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification(notification) {
                if (notification.userInteraction) {
                    if (notification.data.postData) {
                        const id = notification.data.postData.postID
                        NavigatorService.navigate("Post", {id})
                    } else {
                        NavigatorService.reset("Notifications", {})
                    }

                } else {
                    component.props.refresh()
                }


            },

            // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "174546781934",

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true,
        });
    }

    animationDone() {
        this.setState({
            notifications: this.state.notifications.slice(1)
        })
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        refresh: () => dispatch(refresh())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsBanner)

class NotificationItem extends Component {
    state = {
        height: new Animated.Value(0),
    }

    componentDidMount() {
        Animated.sequence([
            Animated.timing(this.state.height, {
                duration: 500,
                toValue: 1,
            }),
            Animated.timing(this.state.height, {
                duration: 500,
                delay: 2000,
                toValue: 0,
            })
        ]).start(this.props.animationDone)
        if (Platform.OS === 'ios') {
            ReactNativeHaptic.generate('notification')
        }

    }

    _onPress() {
        const post = this.props.notification.data.postData
        NavigatorService.navigate("Post", {id: post.postID})
        Animated.timing(this.state.height, {
            duration: 500,
            toValue: 0,
        }).start(this.props.animationDone)
    }

    render() {
        if (!this.props.notification.data.postData) {
            return null;
        }
        const post = this.props.notification.data.postData

        return (
            <Animated.View
                style={{
                    height: this.state.height.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, NOTIFICATIONS_HEIGHT]
                    }),
                    width: "100%",
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: "#ccc",
                    // borderBottomWidth: StyleSheet.hairlineWidth,
                    // borderBottomColor: "#ccc",
                }}
            >
                <TouchableOpacity
                    onPress={this._onPress.bind(this)}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            padding: 5,
                            zIndex: 50,
                        }}
                    >
                        <ProfilePhoto user={post}/>
                        <Text
                            style={{
                                flex: 1,
                                paddingHorizontal: 10,
                            }}
                        >{this.props.notification.message}</Text>
                        <Image
                            source={{uri: "https://gbands.danielabdelsamed.com/img/thumb_" + post.thumb_url + ".jpg"}}
                            style={{
                                width: 40,
                                height: 40,
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
}