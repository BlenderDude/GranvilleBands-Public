import React, {Component} from 'react'
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
    TouchableWithoutFeedback,
    Animated,
    TouchableOpacity,
    PanResponder,
    Platform,
    Easing,
} from 'react-native';
import StreamPost from "./StreamPost";

export default class AnimatedStreamPost extends Component {

    render() {
        const HEIGHT = 600
        let close = Animated.add(Animated.divide(this.props.scrollPosition, new Animated.Value(HEIGHT)), new Animated.Value(-this.props.index))
        return (
            <Animated.View
                style={{
                    opacity: close.interpolate({
                        inputRange: [-0.6, 0, 0.3, 1],
                        outputRange: [1, 1, 1, 0],
                    }),
                    transform: [
                        // {
                        //     translateY: close.interpolate({
                        //         inputRange: [-2,-1, 0, 1],
                        //         outputRange: [HEIGHT,-HEIGHT+350, 0, HEIGHT-150],
                        //     })
                        // },
                        // {
                        //     scaleY: close.interpolate({
                        //         inputRange:[-1,0,1],
                        //         outputRange: [0,1,1]
                        //     })
                        // }
                        {
                            rotate: close.interpolate({
                                inputRange: [-100, -1, -0.7, 0, 0.7],
                                outputRange: ["45deg", "45deg", "0deg", "0deg", "0deg"],
                            })
                        },
                        {
                            translateX: close.interpolate({
                                inputRange: [-1, -0.7, 0, 0.7, 1],
                                outputRange: [-200, 0, 0, 0, 500],
                            })
                        }

                    ],

                    height: HEIGHT,
                    overflow: 'visible',
                    borderTopColor: '#777',
                    borderTopWidth: StyleSheet.hairlineWidth,

                }}
            >
                <StreamPost {...this.props}/>

            </Animated.View>
        )

    }
}