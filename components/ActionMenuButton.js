import React, {Component} from 'react'
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native'
import ReactNativeHaptic from 'react-native-haptic'

export default class ActionMenuButton extends Component {
    _onPress() {
        if (Platform.OS === 'ios') {
            ReactNativeHaptic.generate('impact');
        }
        if (!this.props.active) {
            this.props.onPress();
        }
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    height: 50,
                    width: 200,
                    backgroundColor: "#fff",
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: '#ccc',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
                onPress={this._onPress.bind(this)}
                disabled={this.props.disabled || false}
            >
                <Text
                    style={{
                        fontSize: 20,
                    }}
                >{this.props.title}</Text>
                <ActivityIndicator
                    style={{
                        position: 'absolute',
                        right: 15,
                    }}
                    animating={this.props.active}
                />
            </TouchableOpacity>
        )
    }
}