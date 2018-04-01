import React, {Component} from "react"
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

export default class ProgressiveImage extends Component {

    constructor(props, context) {
        super(props, context)
        this.state = {
            scaleFactor: 1,
        }
    }

    render() {
        const {width, height, style} = this.props
        if (false) {
            return (
                <ScrollView
                    minimumZoomScale={1}
                    maximumZoomScale={3}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onScroll={(e) => {
                        this.setState({scaleFactor: e.nativeEvent.zoomScale})
                    }}
                    onScaleChange={(e) => {
                        this.setState({scaleFactor: e.nativeEvent.scaleFactor})
                    }}
                    scrollEventThrottle={100}
                    scrollEnabled={this.state.scaleFactor !== 1}
                >
                    <View
                        width={width}
                        height={height}
                        backgroundColor='#fff'
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: width / 2.5,
                                height: width / 2.5,
                                borderRadius: width / 5,
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: '#ccc',
                            }}
                        />
                        <Image
                            style={[
                                style,
                                {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width,
                                    height,
                                }
                            ]}
                            source={{
                                uri: `https://gbands.danielabdelsamed.com/img/thumb_${this.props.filename}.jpg`,
                            }}
                        />
                    </View>
                </ScrollView>
            )
        }
        return (
            <View
                width={width}
                height={height}
                backgroundColor='#fff'
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        width: width / 2.5,
                        height: width / 2.5,
                        borderRadius: width / 5,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#ccc',
                    }}
                />
                <Image
                    style={[
                        style,
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width,
                            height,
                        }
                    ]}
                    source={{
                        uri: `https://gbands.danielabdelsamed.com/img/thumb_${this.props.filename}.jpg`,
                    }}
                />
            </View>
        )

    }
}