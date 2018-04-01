import React, {Component} from 'react'
import {
    Image,
    View,
    StyleSheet,
    Text,
    Animated,
} from 'react-native'

export default class AnimatedProfilePhoto extends Component {
    render() {
        const size = this.props.size
        const {user} = this.props
        if (user.profile_pic) {
            return (
                <Animated.View
                    style={{
                        ...this.props.style,
                        width: size,
                        height: size,
                        borderRadius: size.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.5]
                        }),
                        borderColor: "#333",
                        borderWidth: StyleSheet.hairlineWidth,
                        backgroundColor: "#fff",
                        overflow: 'hidden',
                    }}
                >
                    <Animated.Image
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: size.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 0.5]
                            }),
                        }}
                        source={{
                            uri: "https://gbands.danielabdelsamed.com/img/" + user.profile_pic + ".jpg"
                        }}
                    />
                </Animated.View>
            )
        }
        return (
            <Animated.View
                style={{
                    ...this.props.style,
                    width: size,
                    height: size,
                    backgroundColor: '#fff',
                    borderColor: "#333",
                    borderWidth: StyleSheet.hairlineWidth,
                    borderRadius: size.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.5]
                    }),
                    justifyContent: 'center',
                    alignContent: 'center',
                    overflow: 'hidden',
                    padding: size.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.25]
                    }),
                }}
            >
                <Animated.Text
                    style={{
                        fontSize: size.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.7]
                        }),
                        textAlign: 'center',
                        borderRadius: size.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.5]
                        }),
                    }}
                >
                    {(user.first_name || "").charAt(0).toUpperCase()}
                </Animated.Text>
            </Animated.View>
        )
    }
}