import React, {Component} from 'react'
import {
    View,
    Image,
} from 'react-native'

export default class AddedPhoto extends Component {
    render() {
        return (
            <View>
                <Image
                    style={{
                        width: 130,
                        height: 130,
                        marginVertical: 10,
                        marginHorizontal: 5,
                        borderRadius: 15,
                    }}
                    source={{uri: this.props.uri, isStatic: true,}}
                />
            </View>
        )
    }
}