import React, {Component} from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native'

export default class AddedPhotos extends Component {
    render() {
        return (
            <View>
                <ScrollView
                    horizontal={true}
                    style={{
                        borderBottomColor: "#ccc",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        height: 150,
                    }}
                >
                    {this.props.children}
                </ScrollView>
            </View>
        )
    }
}