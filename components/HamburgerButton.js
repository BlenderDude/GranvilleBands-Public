import React, {Component} from "react"
import {TouchableOpacity, View, Animated, Platform} from 'react-native'
import ReactNativeHaptic from 'react-native-haptic'

export default class HamburgerButton extends Component {
    state = {
        cancelAnim: new Animated.Value(0),
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.cancelButton !== this.props.cancelButton) {
            if (Platform.OS === "ios") {
                ReactNativeHaptic.generate('impact')
            }
            Animated.timing(
                this.state.cancelAnim,
                {
                    toValue: nextProps.cancelButton ? 1 : 0,
                    duration: 250,
                    useNativeDriver: true,
                }
            ).start()
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                hitslop={{
                    top: 55,
                    left: 55,
                    bottom: 55,
                    right: 55,
                }}
            >
                <View
                    style={{
                        width: 40,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Animated.View
                        style={{
                            opacity: this.state.cancelAnim.interpolate({inputRange: [0, 1], outputRange: [1, 0]}),
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 35,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: [{
                                rotate: this.state.cancelAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "315deg"],
                                })
                            }],
                        }}
                    >
                        <View
                            style={{
                                width: 5,
                                height: 5,
                                backgroundColor: "#333",
                                borderRadius: 2.5,
                                marginVertical: 1,
                            }}
                        />
                        <View
                            style={{
                                width: 5,
                                height: 5,
                                backgroundColor: "#333",
                                borderRadius: 2.5,
                                marginVertical: 1,
                            }}
                        />
                        <View
                            style={{
                                width: 5,
                                height: 5,
                                backgroundColor: "#333",
                                borderRadius: 2.5,
                                marginVertical: 1,

                            }}
                        />
                    </Animated.View>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Animated.View
                            style={{
                                height: 20,
                                width: 3,
                                position: 'absolute',
                                transform: [{
                                    rotate: this.state.cancelAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0deg", "405deg"],
                                    })
                                }],
                                opacity: this.state.cancelAnim,
                                backgroundColor: "#333",
                                borderRadius: 2,
                            }}
                        />
                        <Animated.View
                            style={{
                                height: 20,
                                width: 3,
                                position: 'absolute',
                                transform: [{
                                    rotate: this.state.cancelAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0deg", "315deg"],
                                    })
                                }],
                                opacity: this.state.cancelAnim,
                                backgroundColor: "#333",
                                borderRadius: 2,
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}