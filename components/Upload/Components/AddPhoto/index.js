import React, {Component} from 'react'
import {
    View,
    TouchableOpacity,
    Text,
} from 'react-native'


export default class AddPhoto extends Component {
    render() {
        return (
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: "#6a96ff",
                    height: 50,
                }}
                onPress={this.props.pickPhoto}
            >
                <Text
                    style={{
                        fontSize: 28,
                    }}
                >
                    Add Photo
                </Text>
            </TouchableOpacity>
        )
    }
}