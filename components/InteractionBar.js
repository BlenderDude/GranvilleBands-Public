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

export default class InteractionBar extends Component {

    render() {
        const fontSize = 16;
        return (
            <View style={{
                flexDirection: 'row',
                width: 140,
            }}>
                {(!this.props.liked) ?
                    <TouchableOpacity
                        onPress={this.props.like}
                        style={{
                            width: 60,
                            paddingVertical: 2.5,
                        }}>
                        <Text style={{
                            fontSize: fontSize,
                            textAlign: 'left'
                        }}>Like</Text>
                    </TouchableOpacity>

                    :
                    <TouchableOpacity
                        onPress={this.props.unlike}
                        style={{
                            width: 60,
                            paddingVertical: 2.5,
                        }}>
                        <Text style={{
                            fontSize: fontSize,
                            textAlign: 'left'
                        }}>Unlike</Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity
                    onPress={this.props.comment}
                    style={{
                        width: 80,
                        paddingVertical: 2.5,
                    }}>
                    <Text style={{
                        fontSize: fontSize,
                        textAlign: 'center'
                    }}>Comment</Text>
                </TouchableOpacity>
            </View>
        )
    }
}